/**
 * Simple deployment script for BeexoRunner contract
 *
 * To deploy:
 * 1. Install hardhat: npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
 * 2. Initialize hardhat: npx hardhat init
 * 3. Update hardhat.config.js with your network settings
 * 4. Run: npx hardhat run contracts/deploy.js --network polygon
 */

const hre = require("hardhat");

async function main() {
  console.log("Deploying BeexoRunner contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const BeexoRunner = await hre.ethers.getContractFactory("BeexoRunner");
  const game = await BeexoRunner.deploy();

  await game.waitForDeployment();

  const contractAddress = await game.getAddress();
  console.log("BeexoRunner deployed to:", contractAddress);

  // Verify entry fee
  const entryFee = await game.entryFee();
  console.log("Entry fee:", hre.ethers.formatEther(entryFee), "ETH");

  // Fund contract with initial balance for payouts
  console.log("\nFunding contract with 0.1 ETH for initial payouts...");
  const fundTx = await deployer.sendTransaction({
    to: contractAddress,
    value: hre.ethers.parseEther("0.1")
  });
  await fundTx.wait();

  const contractBalance = await hre.ethers.provider.getBalance(contractAddress);
  console.log("Contract balance:", hre.ethers.formatEther(contractBalance), "ETH");

  console.log("\n✅ Deployment complete!");
  console.log("Save this contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
