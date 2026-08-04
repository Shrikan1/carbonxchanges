const hre = require('hardhat');

async function main() {
  // The deployer wallet (from PRIVATE_KEY in .env) becomes the contract's
  // owner — this is the same admin wallet that backend/blockchainService.js
  // will use to sign mintCredits() calls later.
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying CarbonToken with account:', deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'MATIC');

  const CarbonToken = await hre.ethers.getContractFactory('CarbonToken');
  const carbonToken = await CarbonToken.deploy(deployer.address);
  await carbonToken.waitForDeployment();

  const address = await carbonToken.getAddress();
  console.log('\nCarbonToken deployed to:', address);
  console.log('\nNext steps:');
  console.log('1. Add this to backend/.env as CARBON_TOKEN_ADDRESS=' + address);
  console.log('2. Verify on PolygonScan:');
  console.log(`   npx hardhat verify --network amoy ${address} "${deployer.address}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});