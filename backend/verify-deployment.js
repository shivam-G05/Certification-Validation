const { ethers } = require('ethers');
const contractData = require('./contractData.json');
require('dotenv').config();

async function verify() {
  console.log('🔍 Verifying Deployment...\n');
  
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractData.address, contractData.abi, wallet);

  // Check owner
  const owner = await contract.owner();
  console.log('Contract Owner:', owner);
  console.log('Your Address:', wallet.address);
  console.log('Are you owner?', owner.toLowerCase() === wallet.address.toLowerCase() ? '✅ YES' : '❌ NO');
  
  // Check if authorized issuer
  const isIssuer = await contract.authorizedIssuers(wallet.address);
  console.log('Are you authorized issuer?', isIssuer ? '✅ YES' : '❌ NO');
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log('Your balance:', ethers.formatEther(balance), 'Sepolia ETH');
  
  console.log('\n📋 Contract Info:');
  console.log('Address:', contractData.address);
  console.log('Etherscan:', `https://sepolia.etherscan.io/address/${contractData.address}`);
  
  if (isIssuer) {
    console.log('\n✅ Everything is ready! You can now issue certificates.');
  } else {
    console.log('\n⚠️  Run: node backend/addIssuer.js');
  }
}

verify().catch(console.error);