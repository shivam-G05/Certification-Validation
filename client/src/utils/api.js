import axios from 'axios';
import { ethers } from 'ethers';
import contractData from '../contractData.json';

const API_URL = 'https://certification-validation-backend-60s3.onrender.com';

// Use a public RPC or environment variable



const SEPOLIA_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/2XvtkoUxDW0M01efSkWmF`

export const uploadCertificate = async (file, studentName) => {
  const formData = new FormData();
  formData.append("certificate", file);
  formData.append("studentName", studentName);
  const response = await axios.post(`${API_URL}/upload-certificate`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const issueCertificate = async (studentName, course, ipfsHash) => {
  const response = await axios.post(`${API_URL}/issue-certificate`, {
    studentName,
    course,
    ipfsHash
  });
  return response.data;
};

export const verifyCertificate = async (certId) => {
  const response = await axios.get(`${API_URL}/verify-certificate/${certId}`);
  return response.data;
};

export const revokeCertificate = async (certId) => {
  const response = await axios.post(`${API_URL}/revoke-certificate/${certId}`);
  return response.data;
};

// Check if address is authorized issuer
export const checkAuthorization = async (address) => {
  try {
    console.log('Checking authorization for:', address);
    console.log('Contract address:', contractData.address);
    console.log('RPC URL:', SEPOLIA_RPC_URL);
    
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
    
    const isAuthorized = await contract.authorizedIssuers(address);
    const owner = await contract.owner();
    
    console.log('Is authorized:', isAuthorized);
    console.log('Owner:', owner);
    
    return {
      isAuthorized,
      owner,
      contractAddress: contractData.address
    };
  } catch (error) {
    console.error('Authorization check error:', error);
    throw error;
  }
};
// Get balance
export const getBalance = async (address) => {
  try {
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid wallet address");
    }

    // Use Sepolia RPC directly (no MetaMask dependency)
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    console.log(`Balance for ${address}: ${balanceInEth} ETH`);

    return balanceInEth;
  } catch (error) {
    console.error("Get balance error:", error);
    throw error;
  }
};


// Connect to MetaMask
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0];
  } catch (error) {
    throw error;
  }
};

// Get current connected account
export const getCurrentAccount = async () => {
  if (!window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    return accounts[0] || null;
  } catch (error) {
    console.error('Get account error:', error);
    return null;
  }
};