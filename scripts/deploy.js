const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying CertificateVerification contract...");

  const CertificateVerification = await hre.ethers.getContractFactory("CertificateVerification");
  const certificate = await CertificateVerification.deploy();

  await certificate.waitForDeployment();

  const address = await certificate.getAddress();
  console.log("CertificateVerification deployed to:", address);

  // Save contract address and ABI to file for backend
  const contractData = {
    address: address,
    abi: JSON.parse(certificate.interface.formatJson())
  };

  // Save to backend folder
  const backendDir = "./backend";
  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }

  fs.writeFileSync(
    `${backendDir}/contractData.json`,
    JSON.stringify(contractData, null, 2)
  );

  // Save to frontend folder (for later)
  const frontendDir = "./client/src";
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(
    `${frontendDir}/contractData.json`,
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract data saved to backend and frontend folders");
  console.log("\n⚠️  IMPORTANT NEXT STEPS:");
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${address}`);
  console.log("\n2. Add yourself as an authorized issuer (run this script):");
  console.log("   node backend/addIssuer.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });