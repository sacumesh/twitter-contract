const hre = require("hardhat");

async function main() {
  console.log("Deploying contract...");
  const Twitter = await hre.ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy();
  await twitter.deployed();
  console.log(`Deployed to ${twitter.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
