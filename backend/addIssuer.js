const { ethers } = require('ethers');
const contractData = require('./contractData.json');
require('dotenv').config();

async function addIssuer() {
  console.log('Adding yourself as authorized issuer...\n');
  
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractData.address, contractData.abi, wallet);

  console.log('Your Address:', wallet.address);
  console.log('Contract Address:', contractData.address);
  
  // Check if already authorized
  const isAuthorized = await contract.authorizedIssuers(wallet.address);
  
  if (isAuthorized) {
    console.log('\n✅ You are already an authorized issuer!');
    return;
  }
  
  console.log('\nAdding issuer...');
  const tx = await contract.addIssuer(wallet.address);
  console.log('Transaction sent:', tx.hash);
  console.log('Waiting for confirmation...');
  
  await tx.wait();
  console.log('\n✅ Success! You are now an authorized issuer!');
  console.log('View transaction:', `https://sepolia.etherscan.io/tx/${tx.hash}`);
}

addIssuer().catch(console.error);