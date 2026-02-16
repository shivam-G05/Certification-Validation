require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pinataSDK = require('@pinata/sdk');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// ✅ FIXED CORS CONFIGURATION
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://certification-validation-frontend-n2it.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS to all routes
app.use(cors(corsOptions));

app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Setup file upload
const upload = multer({ 
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Pinata
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

// Load contract data
const contractData = require('./contractData.json');
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const privateKey = process.env.PRIVATE_KEY.trim();
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractData.address, contractData.abi, wallet);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "CertiChain Backend API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      upload: "POST /upload-certificate",
      issue: "POST /issue-certificate",
      verify: "GET /verify-certificate/:certId",
      revoke: "POST /revoke-certificate/:certId"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    contract: contractData.address
  });
});

// Upload certificate to IPFS
app.post('/upload-certificate', upload.single('certificate'), async (req, res) => {
  try {
    console.log('📤 Upload request from:', req.headers.origin);
    console.log('📄 File:', req.file?.filename);
    console.log('👤 Student:', req.body.studentName);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const readableStream = fs.createReadStream(req.file.path);
    const options = {
      pinataMetadata: {
        name: `Certificate-${req.body.studentName}-${Date.now()}`,
      },
    };

    const result = await pinata.pinFileToIPFS(readableStream, options);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    console.log('✅ IPFS Upload success:', result.IpfsHash);

    res.json({
      success: true,
      ipfsHash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    });
  } catch (error) {
    console.error('❌ IPFS upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
});

// Issue certificate on blockchain
app.post('/issue-certificate', async (req, res) => {
  try {
    console.log('📝 Issue certificate request:', req.body);

    const { studentName, course, ipfsHash } = req.body;
    
    if (!studentName || !course || !ipfsHash) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const tx = await contract.issueCertificate(studentName, course, ipfsHash);
    console.log('⏳ Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed');
    
    // Extract certId from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === 'CertificateIssued';
      } catch (e) {
        return false;
      }
    });
    
    const certId = contract.interface.parseLog(event).args.certId;

    res.json({
      success: true,
      certId: certId,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('❌ Blockchain error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify certificate
app.get('/verify-certificate/:certId', async (req, res) => {
  try {
    console.log('🔍 Verify request for:', req.params.certId);

    const result = await contract.verifyCertificate(req.params.certId);
    
    res.json({
      success: true,
      certificate: {
        studentName: result.studentName,
        course: result.course,
        ipfsHash: result.ipfsHash,
        issueDate: new Date(Number(result.issueDate) * 1000).toISOString(),
        issuer: result.issuer,
        isValid: result.isValid
      }
    });
  } catch (error) {
    console.error('❌ Verify error:', error);
    res.status(404).json({ success: false, error: 'Certificate not found' });
  }
});

// Revoke certificate
app.post('/revoke-certificate/:certId', async (req, res) => {
  try {
    console.log('🚫 Revoke request for:', req.params.certId);

    const tx = await contract.revokeCertificate(req.params.certId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('❌ Revoke error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🚀 CertiChain Backend Server Started');
  console.log('═══════════════════════════════════════');
  console.log('📍 Port:', PORT);
  console.log('📍 Contract:', contractData.address);
  console.log('🌐 CORS enabled for:', corsOptions.origin);
  console.log('═══════════════════════════════════════');
});