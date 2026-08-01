require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun', // required for OpenZeppelin's use of the MCOPY opcode
    },
  },
  networks: {
    // Hardhat's built-in local network — instant, free, fake accounts.
    // Used for `npm test` and local development.
    hardhat: {},

    // Polygon Amoy testnet — real network, fake (free) MATIC from a faucet.
    amoy: {
      url: process.env.RPC_URL || 'https://rpc-amoy.polygon.technology',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
  etherscan: {
    // hardhat-toolbox's verify plugin also understands PolygonScan via this key
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || '',
    },
  },
};