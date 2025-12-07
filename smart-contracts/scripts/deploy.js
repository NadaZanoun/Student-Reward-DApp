const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString(), "\n");

  // Deploy RewardToken
  console.log("📝 Deploying RewardToken...");
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.waitForDeployment();
  console.log("✅ RewardToken deployed to:", rewardToken.target);

  // Deploy CredentialNFT
  console.log("\n📝 Deploying CredentialNFT...");
  const CredentialNFT = await hre.ethers.getContractFactory("CredentialNFT");
  const credentialNFT = await CredentialNFT.deploy();
  await credentialNFT.waitForDeployment();
  console.log("✅ CredentialNFT deployed to:", credentialNFT.target);

  // Deploy RewardSystem
  console.log("\n📝 Deploying RewardSystem...");
  const RewardSystem = await hre.ethers.getContractFactory("RewardSystem");
  const rewardSystem = await RewardSystem.deploy(
    rewardToken.target,
    credentialNFT.target
  );
  await rewardSystem.waitForDeployment();
  console.log("✅ RewardSystem deployed to:", rewardSystem.target);

  // Grant roles
  console.log("\n🔐 Setting up permissions...");

  const MINTER_ROLE = await rewardToken.MINTER_ROLE();
  const ISSUER_ROLE = await credentialNFT.ISSUER_ROLE();

  await rewardToken.grantRole(MINTER_ROLE, rewardSystem.target);
  console.log("✅ Granted MINTER_ROLE to RewardSystem");

  await credentialNFT.grantRole(ISSUER_ROLE, rewardSystem.target);
  console.log("✅ Granted ISSUER_ROLE to RewardSystem");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    contracts: {
      RewardToken: rewardToken.target,
      CredentialNFT: credentialNFT.target,
      RewardSystem: rewardSystem.target,
    },
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const fileName = `deployment-${hre.network.name}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, fileName),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📄 Deployment info saved to:", fileName);
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\nContract Addresses:");
  console.log("  RewardToken:", rewardToken.target);
  console.log("  CredentialNFT:", credentialNFT.target);
  console.log("  RewardSystem:", rewardSystem.target);
  console.log("\n📋 Next Steps:");
  console.log("  1. Copy these addresses to your frontend .env file");
  console.log("  2. Verify contracts on Etherscan (if on testnet/mainnet)");
  console.log("  3. Update frontend to use these addresses");

  if (hre.network.name === "sepolia") {
    console.log("\n🔍 Verify on Etherscan:");
    console.log(`  npx hardhat verify --network sepolia ${rewardToken.target}`);
    console.log(
      `  npx hardhat verify --network sepolia ${credentialNFT.target}`
    );
    console.log(
      `  npx hardhat verify --network sepolia ${rewardSystem.target} ${rewardToken.target} ${credentialNFT.target}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
