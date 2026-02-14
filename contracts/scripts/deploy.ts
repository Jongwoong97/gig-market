import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  try {
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "MON");
  } catch (e) {
    console.log("(Could not fetch balance — continuing with deployment)");
  }

  // 1. Deploy MockGIG token
  console.log("\n--- Deploying MockGIG (ERC20) ---");
  const MockGIG = await ethers.getContractFactory("MockGIG");
  const token = await MockGIG.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("MockGIG deployed to:", tokenAddress);

  // 2. Deploy GigMarketplace
  console.log("\n--- Deploying GigMarketplace ---");
  const GigMarketplace = await ethers.getContractFactory("GigMarketplace");
  const marketplace = await GigMarketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("GigMarketplace deployed to:", marketplaceAddress);

  // 3. Summary
  console.log("\n========================================");
  console.log("Deployment complete!");
  console.log("========================================");
  console.log(`MockGIG (GIG Token):  ${tokenAddress}`);
  console.log(`GigMarketplace:       ${marketplaceAddress}`);
  console.log("========================================");
  console.log("\nUpdate your frontend .env.local with:");
  console.log(`NEXT_PUBLIC_GIG_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
