require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const CHAIN_IDS = {
  hardhat: 31337,
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: CHAIN_IDS.hardhat,
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_TOKEN}`,
      },
    },
  },
  solidity: "0.8.17",
};
