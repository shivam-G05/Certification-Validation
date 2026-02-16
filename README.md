# 🔐 CertiChain - Blockchain Certificate Verification System

A full-stack decentralized application (dApp) for issuing, verifying, and revoking academic certificates using Ethereum blockchain and IPFS.

<img width="1864" height="858" alt="Screenshot 2026-01-31 103543" src="https://github.com/user-attachments/assets/6ec1747b-f5ec-45f0-89b9-9b90f3e19b48" />


---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Smart Contract Details](#smart-contract-details)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 Overview

CertiChain is a blockchain-powered certificate verification system that solves the problem of certificate fraud and slow verification processes. Certificates are stored on IPFS (InterPlanetary File System) for decentralized file storage, and their metadata is recorded on the Ethereum blockchain to ensure **immutability**, **transparency**, and **trustless verification**.

Anyone in the world can verify a certificate's authenticity in seconds without contacting the issuing institution — even if that institution no longer exists.

---

## ✨ Features

- **🎓 Issue Certificates** — Authorized issuers can upload certificate files and record them on the blockchain
- **🔍 Verify Certificates** — Anyone can verify a certificate's authenticity using its Certificate ID
- **🚫 Revoke Certificates** — Issuers can revoke certificates that are no longer valid
- **👥 Role-Based Access Control** — Only the contract owner can authorize issuers; only authorized issuers can issue certificates
- **📦 IPFS Storage** — Certificate files are stored on IPFS via Pinata for decentralized, permanent storage
- **🦊 MetaMask Integration** — Wallet connection, authorization checks, and balance monitoring
- **📱 Responsive Design** — Fully responsive dark-themed UI with hamburger menu on mobile
- **🎨 Animated UI** — Smooth animations powered by GSAP
- **🔔 Custom Alert System** — Real-time toast notifications for all user actions and errors
- **🔗 Etherscan Integration** — View transactions and contract directly on Etherscan

---

## 🛠️ Tech Stack

### Blockchain & Smart Contracts
| Technology | Purpose |
|---|---|
| **Solidity 0.8.19** | Smart contract language |
| **Hardhat** | Ethereum development environment |
| **Ethers.js v6** | Blockchain interaction library |
| **OpenZeppelin** | Smart contract security standards |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | HTTP server and API framework |
| **Multer** | File upload handling |
| **Pinata SDK** | IPFS file pinning |
| **CORS** | Cross-origin request handling |
| **Dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP requests to backend |
| **GSAP** | Animations |
| **CSS3** | Styling with glassmorphism effects |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Ethereum Sepolia Testnet** | Test blockchain network |
| **Alchemy** | Ethereum node provider (RPC) |
| **Pinata** | IPFS pinning service |
| **Etherscan** | Blockchain explorer and contract verification |

---

## 📁 Project Structure

```
certificate-validation/
│
├── contracts/
│   └── CertificateVerification.sol       # Solidity smart contract
│
├── scripts/
│   └── deploy.js                          # Hardhat deployment script
│
├── backend/
│   ├── server.js                          # Express API server
│   ├── addIssuer.js                       # Script to authorize issuers
│   ├── contractData.json                  # Auto-generated contract ABI & address
│   ├── uploads/                           # Temporary file upload storage
│   ├── package.json
│   └── .env                               # Backend environment variables
│
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                 # Navigation bar with wallet connection
│   │   │   ├── Hero.jsx                   # Landing page hero section
│   │   │   ├── IssueCertificate.jsx       # Issue certificate form & logic
│   │   │   ├── VerifyCertificate.jsx      # Verify certificate by ID
│   │   │   ├── AuthorizationBanner.jsx    # Auth status banner
│   │   │   ├── Dashboard.jsx              # Project dashboard & info
│   │   │   └── Footer.jsx                 # Footer component
│   │   ├── styles/
│   │   │   ├── App.css                    # Global styles & background
│   │   │   ├── Navbar.css                 # Navbar & modal styles
│   │   │   ├── Hero.css                   # Hero section styles
│   │   │   ├── IssueCertificate.css       # Issue form & alert styles
│   │   │   ├── VerifyCertificate.css      # Verify section styles
│   │   │   ├── AuthorizationBanner.css    # Banner styles
│   │   │   ├── Dashboard.css             # Dashboard styles
│   │   │   └── Footer.css                # Footer styles
│   │   ├── utils/
│   │   │   └── api.js                     # API utility & blockchain helpers
│   │   ├── App.jsx                        # Main app component & routes
│   │   ├── App.css                        # App-level styles
│   │   └── index.js                       # React entry point
│   ├── package.json
│   └── .env                               # Frontend environment variables
│
├── test/
│   └── CertificateVerification.test.js    # Smart contract tests
│
├── hardhat.config.js                      # Hardhat configuration
├── package.json                           # Root package.json
├── .env                                   # Root environment variables
├── .gitignore                             # Git ignore rules
└── README.md                              # This file
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MetaMask** browser extension — [Download](https://metamask.io/download/)
- **Git** — [Download](https://git-scm.com/)

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/certificate-validation.git
cd certificate-validation
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

---

## 🔧 Environment Setup

### Step 1: Get Required API Keys

You need the following accounts and API keys:

| Service | Where to Sign Up | What You Need |
|---|---|---|
| **Alchemy** | [alchemy.com](https://www.alchemy.com/) | Sepolia RPC URL |
| **Etherscan** | [etherscan.io](https://etherscan.io/) | API Key |
| **Pinata** | [pinata.cloud](https://app.pinata.cloud/) | API Key + Secret Key |
| **MetaMask** | Browser Extension | Private Key (from Account Details) |

### Step 2: Create Root `.env`

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### Step 3: Create `backend/.env`

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
PINATA_API_KEY=YOUR_PINATA_API_KEY
PINATA_SECRET_KEY=YOUR_PINATA_SECRET_KEY
PORT=5000
```

### Step 4: Create `client/.env`

```env
REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
```

### Step 5: Get Sepolia Test ETH

Visit one of these faucets and paste your MetaMask wallet address:

- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

---

## 🚀 Deployment

### Step 1: Compile Smart Contract

```bash
npx hardhat compile
```

### Step 2: Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

This will:
- Deploy the contract to Sepolia
- Save `contractData.json` to both `backend/` and `client/src/`

### Step 3: Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### Step 4: Add Yourself as Authorized Issuer

```bash
cd backend
node addIssuer.js
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
node server.js
```

Backend runs on: `http://localhost:5000`

### Terminal 2: Start Frontend

```bash
cd client
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload-certificate` | Upload certificate file to IPFS |
| `POST` | `/issue-certificate` | Issue a certificate on the blockchain |
| `GET` | `/verify-certificate/:certId` | Verify a certificate by ID |
| `POST` | `/revoke-certificate/:certId` | Revoke a certificate |

### Upload Certificate

```
POST /upload-certificate
Content-Type: multipart/form-data

Fields:
  - certificate (file)     → PDF or Image file
  - studentName (text)     → Name of the student
```

**Response:**
```json
{
  "success": true,
  "ipfsHash": "QmXxxx...",
  "url": "https://gateway.pinata.cloud/ipfs/QmXxxx..."
}
```

### Issue Certificate

```
POST /issue-certificate
Content-Type: application/json

Body:
{
  "studentName": "John Doe",
  "course": "Blockchain Development",
  "ipfsHash": "QmXxxx..."
}
```

**Response:**
```json
{
  "success": true,
  "certId": "0x7a3f8c...",
  "transactionHash": "0xabc123..."
}
```

### Verify Certificate

```
GET /verify-certificate/0x7a3f8c...
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "studentName": "John Doe",
    "course": "Blockchain Development",
    "ipfsHash": "QmXxxx...",
    "issueDate": "2025-01-28T10:30:45.000Z",
    "issuer": "0x3516...",
    "isValid": true
  }
}
```

### Revoke Certificate

```
POST /revoke-certificate/0x7a3f8c...
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0xdef456..."
}
```

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    CERTIFICATE ISSUANCE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Issuer uploads certificate PDF/Image                     │
│         ↓                                                    │
│  2. File uploaded to IPFS via Pinata                         │
│         ↓                                                    │
│  3. IPFS returns unique hash (QmXxxx...)                     │
│         ↓                                                    │
│  4. Backend calls smart contract issueCertificate()          │
│         ↓                                                    │
│  5. Contract generates unique certId using keccak256         │
│         ↓                                                    │
│  6. Certificate data stored permanently on blockchain        │
│         ↓                                                    │
│  7. CertificateIssued event emitted                          │
│         ↓                                                    │
│  8. CertId returned to issuer                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  CERTIFICATE VERIFICATION                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Verifier enters Certificate ID                           │
│         ↓                                                    │
│  2. Backend calls smart contract verifyCertificate()         │
│         ↓                                                    │
│  3. Contract returns all certificate data from blockchain    │
│         ↓                                                    │
│  4. Returns: Name, Course, IPFS Hash, Date, Issuer, Valid   │
│         ↓                                                    │
│  5. Verifier can download certificate from IPFS              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Smart Contract Details

**Contract Name:** `CertificateVerification`  
**Language:** Solidity 0.8.19  
**Deployed Network:** Ethereum Sepolia Testnet  
**Contract Address:** `0x8760AF3b2B409458b2BC2b7d1a4128C980f11a11`  
**Etherscan:** [View on Etherscan](https://sepolia.etherscan.io/address/0x8760AF3b2B409458b2BC2b7d1a4128C980f11a11)

### Functions

| Function | Access | Description |
|---|---|---|
| `addIssuer(address)` | Owner Only | Authorize a new issuer |
| `removeIssuer(address)` | Owner Only | Remove an issuer |
| `issueCertificate(name, course, ipfsHash)` | Authorized Issuer | Issue a new certificate |
| `verifyCertificate(certId)` | Public (View) | Verify certificate authenticity |
| `revokeCertificate(certId)` | Issuer Only | Revoke an issued certificate |

### Events

| Event | Parameters | When Emitted |
|---|---|---|
| `CertificateIssued` | certId, issuer | When a new certificate is issued |
| `CertificateRevoked` | certId | When a certificate is revoked |

### Gas Optimization Techniques Used

- `external` functions instead of `public` where applicable
- `calldata` for string parameters in external functions
- Events for logging instead of extra storage
- Compiler optimizer enabled (200 runs)
- `viaIR` enabled for better code generation

---

## 📸 Screenshots

> Add your screenshots here after running the application

<img width="1864" height="858" alt="Screenshot 2026-01-31 103543" src="https://github.com/user-attachments/assets/14a74e48-9c6f-4080-8ef1-3aeffd7ef307" />
<img width="926" height="738" alt="Screenshot 2026-01-31 103602" src="https://github.com/user-attachments/assets/19e352ca-e592-42dc-8974-31ddb1c6196a" />
<img width="1777" height="858" alt="Screenshot 2026-01-31 103621" src="https://github.com/user-attachments/assets/779d87d1-7799-43ff-b0af-8b65abffa63b" />
<img width="687" height="720" alt="Screenshot 2026-01-31 103635" src="https://github.com/user-attachments/assets/89fafd38-5193-4fe0-a63d-fe44145d636d" />


---

## 🌍 Live Demo

> Add your deployed frontend URL here after deploying

- **Frontend:** https://certification-validation-frontend.onrender.com/
- **Contract:** [Etherscan](https://sepolia.etherscan.io/address/0x8760AF3b2B409458b2BC2b7d1a4128C980f11a11)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```
4. Push to the branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

---

## 🔒 Security Notes

- **Never commit `.env` files** to version control
- **Never share** your private key or mnemonic phrase
- This project uses **Sepolia testnet** for development — do not use mainnet private keys
- All sensitive keys are stored in environment variables

---

## 📌 .gitignore

Make sure your `.gitignore` includes:

```gitignore
# Environment
.env
.env.local

# Dependencies
node_modules/

# Hardhat
cache/
artifacts/

# Build
build/
dist/

# Uploads
backend/uploads/

# OS
.DS_Store
Thumbs.db
```

---

## 📚 Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/hardhat-runner/docs/getting-started)
- [Ethers.js v6 Documentation](https://docs.ethers.org/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [React Documentation](https://react.dev/)
- [GSAP Documentation](https://greensock.com/gsap/)

---

## 👨‍💻 Author

**Shivam**  
- GitHub: https://github.com/shivam-G05
- LinkedIn: https://www.linkedin.com/in/shivam-goel-6236432a8/
- Email: shivamkgjj2005@gmail.com
LIVE URL:https://certification-validation-frontend-n2it.onrender.com/
---


> ⭐ If you found this project helpful, please give it a star on GitHub!
