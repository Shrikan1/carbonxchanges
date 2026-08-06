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
    // Etherscan V2: ONE api key now works across 60+ chains (Polygon
    // included) — get it from etherscan.io/myapikey, NOT polygonscan.com
    // (that separate-key system was deprecated August 2025).
    apiKey: process.env.ETHERSCAN_API_KEY || '',
    customChains: [
      {
        network: 'amoy', // must match the network name below
        chainId: 80002,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api?chainid=80002',
          browserURL: 'https://amoy.polygonscan.com',
        },
      },
    ],
  },
  sourcify: {
    enabled: false, // avoids the "Sourcify verification skipped" notice
  },
};