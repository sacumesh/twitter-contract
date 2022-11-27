const hre = require("hardhat");
const Spinner = require("cli-spinner").Spinner;

async function main() {
  // use the spinner to show the user that the script is running
  const spinner = new Spinner("Deploying contract.. %s");
  spinner.setSpinnerString("|/-\\");
  // start the spinner
  spinner.start();

  const Twitter = await hre.ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy();
  await twitter.deployed();
  // stop the spinner and clear the cli
  spinner.stop(true);
  // print the address of the deployed contract
  console.log("Contract deployed to:", twitter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
