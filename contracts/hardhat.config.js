require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

//const fauxPrivKey = "";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers:[
      {
        version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true
    },
      },
      {
        version: "0.8.20"
      }
    ]
  },
  networks: {
    mumbai: {
      url: "https://polygon-mumbai-pokt.nodies.app",
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
    },
    holesky: {
      chainId: 17000,
      url: "https://ethereum-holesky.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
    },

    //base is actually base goerli for this project right now
    base: {
      chainId: 84531,
      url: "https://goerli.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
    base_mainnet: {
      chainId: 8453,
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      accounts: ["ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
    },
  },
  etherscan: {

    apiKey: {
      polygonMumbai: process.env.MUMBAI_APIKEY,
      base: process.env.BASESCAN_APIKEY
    }

  },
};
