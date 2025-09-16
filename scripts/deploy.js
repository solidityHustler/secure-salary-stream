const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Secure Salary Stream contract...");

  // Get the contract factory
  const SecureSalaryStream = await ethers.getContractFactory("SecureSalaryStream");

  // Deploy the contract
  // You'll need to provide actual addresses for HR manager and verifier
  const hrManager = "0x742d35Cc6634C0532925a3b8D6Ac0C6663025Cb3"; // Replace with actual HR manager address
  const verifier = "0x742d35Cc6634C0532925a3b8D6Ac0C6663025Cb3"; // Replace with actual verifier address

  const salaryStream = await SecureSalaryStream.deploy(hrManager, verifier);

  await salaryStream.waitForDeployment();

  const contractAddress = await salaryStream.getAddress();
  
  console.log("Secure Salary Stream deployed to:", contractAddress);
  console.log("HR Manager:", hrManager);
  console.log("Verifier:", verifier);
  
  // Update config file with deployed address
  console.log("\nPlease update your config.ts file with the following contract address:");
  console.log(`NEXT_PUBLIC_SALARY_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
