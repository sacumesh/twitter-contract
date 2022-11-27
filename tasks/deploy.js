const { task } = require("hardhat/config");

// This task is used to deploy the contract
// network is a used keyword in hardhat, so we use net
task(
  "deploy",
  "Runs a user-defined defined deploy script after compiling the project",
)
  .addPositionalParam(
    "net",
    "A network specified in the hardhat.config. js to run the Deployment script on",
  )
  .addPositionalParam("script", "Deployment script to run")
  .addFlag("noCompile", "Don't compile before running this task")
  .setAction(async ({ net, script, noCompile }, { run, hardhatArguments }) => {
    // change hardhat network to the one specified by the user
    hardhatArguments.network = net;
    run("run", { script, noCompile });
  });

module.exports = {};
