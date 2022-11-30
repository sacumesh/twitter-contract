# **Twitter Solidity Contract**

This repository aims to create smart contract for a twitter clone using Solidity and Hardhat. The contract supports basic create, update, delete and read CRUD operations.

One smart contract deployed address on goerli: `0xDEb71e8D8D816844b67F658306B94CbdDEe70d7E`

Front-end intergration repository: [https://github.com/sacumesh/twitter-front](https://github.com/sacumesh/twitter-front)

## **Setup**

To setup, go to the project folder and run

```shell
npm install
```

## **Compiling the Twitter contract**

To compile the contract, run

```bash
npm run compile
```

## **Deploying to remote networks**

We're using [Infura](https://www.infura.io/), but pointing url to any Ethereum node or gateway would work.

## Step 1

Create a `.env `file in the root of the project folder which stores the network url and private key of the network account.

```env
GOERLI_RPC_URL=https://goerli.infura.io/v3/{INFURA_PRIVATE_KEY}
GOERLI_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 2

Then, to deploy to a remote network such as mainnet or any testnet, you need to add a network entry to your hardhat.config.js file. We’ll use Goerli for this example, but you can add any network similarly.

```javascript
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
    },
  },
};
```

- _You can also add multiple network entires at the same time._

## Step 3,

To deploy use one of the following two methods.

### _Method 1_

If one or multiple network entries are defined in your hardhat.config.js, to interactivly deploy to a network, run

```shell
  run npm start
```

Then you will be promoted with network entries defined in your `hardhat.config.js`. Next select the network to deploy to.

```bash
Select a network to deploy to:
(x) goerli
```

### _Method 2_

To deploy to a network entry defined in your `hardhat.config.js,` run the `npm run deploy --` with option `--network` followed by the the network name to speficy the network to deploy to

```shell
 npm run deploy -- --network goerli
```

If everything went well, you should see the deployed contract address.

```bash
Contract deployed to: 0xDEb71e8D8D816844b67F658306B94CbdDEe70d7E
```

## **Testing the contract**

To run tests, run

```bash
npm run test
```
