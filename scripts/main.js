const hre = require("hardhat");
const cliSelect = require("cli-select");
const chalk = require("chalk");
const hardhatConfig = require("../hardhat.config");
const DEPLOY_SCRIPT_PATH = "./scripts/deploy.js";

async function main() {
  // get the network names from the hardhat.config.js file
  const networkNames = Object.keys(hardhatConfig.networks);
  // get the network name from the user
  console.log(chalk.blue("Select a network to deploy to:"));
  const network = await cliSelect({
    values: networkNames,
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.underline(chalk.green(value));
      }

      return value;
    },
  });
  // run the deploy script on the network specified by the user
  await hre.run("deploy", {
    net: network.value,
    script: DEPLOY_SCRIPT_PATH,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
