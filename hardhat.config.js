require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "867804f6d4ba85f2883a0a5d3bf514270c772f2c1be05a88b9a4f11f2f391355",
      ],
      chainId: 1337,
    },
  },
};
