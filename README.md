# DeTwitter Blockhain-based Twitter app

## Setup

1.Clone the repository. 2.Run following scripts inside the project folder.

```shell
  npm install
```

## Instructions for use

### 1.Deploying the smart contract

The network where the smart contract is going to be deployed needs to be added to Hardhat. For example, to connect the **Goerli** network, in the file _hardhat.config.js_ the parameters for `GOERLI_RPC_URL` and `GOERLI_PRIVATE_KEY`need to be edited - they are situated in the `.env` file.

![screenshot_hardhat_config](TargetUrl)

Use one of the following methods to deploy the contract to the specified network.

#### 1.1. Interactive way

Run

```shell
  npm start
```

It will prompt a menu, allowing to choose the network to deploy the contract to:

![screenshot_select_network](TargetUrl)

Select a network and press **Enter**.

#### 1.2. Using command scripts

Run

```shell
  npm deploy --network <<NETWORK>>
```

Example for `NETWORK` parameter: `goerli`

After waiting for some time in any of these cases, the terminal will be prompted with a line like `Contract deployed to: <<Hash address of the contract>>`

### 2.Performing the test of the smart contract

Run

```shell
  npm run test
```
