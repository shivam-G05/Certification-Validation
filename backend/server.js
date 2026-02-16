require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pinataSDK = require('@pinata/sdk');
const { ethers } = require('ethers');
const fs = require('fs');
const cors = require('cors');


const app = express();
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://certification-validation-frontend-n2it.onrender.com'  // ✅ YOUR ACTUAL URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Initialize Pinata
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

// Setup file upload
const upload = multer({ dest: 'uploads/' });

// Load contract data
const contractData = require('./contractData.json');
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const privateKey = process.env.PRIVATE_KEY.trim();
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractData.address, contractData.abi, wallet);


app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Upload certificate to IPFS
app.post('/upload-certificate', upload.single('certificate'), async (req, res) => {
  try {
    const readableStream = fs.createReadStream(req.file.path);
    const options = {
      pinataMetadata: {
        name: `Certificate-${req.body.studentName}-${Date.now()}`,
      },
    };

    const result = await pinata.pinFileToIPFS(readableStream, options);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      ipfsHash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    });
  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Issue certificate on blockchain
app.post('/issue-certificate', async (req, res) => {
  try {
    const { studentName, course, ipfsHash } = req.body;
    
    const tx = await contract.issueCertificate(studentName, course, ipfsHash);
    const receipt = await tx.wait();
    
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
    console.error('Blockchain error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify certificate
app.get('/verify-certificate/:certId', async (req, res) => {
  try {
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
    res.status(404).json({ success: false, error: 'Certificate not found' });
  }
});

// Revoke certificate
app.post('/revoke-certificate/:certId', async (req, res) => {
  try {
    const tx = await contract.revokeCertificate(req.params.certId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));