//This commented out first part is for Ganache
/*module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      //host: "192.168.1.88",        //My local IP
      port: 7545,            // Ganache GUI default port. Change to 8545 if you're using Ganache CLI
      network_id: "*"        // Match any network
    }
  },
*/
//This is for Sepolia test network
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = 'path country excite decline combine lounge eyebrow sound join stomach blouse system'; // Replace with your wallet's mnemonic

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, 'https://sepolia.infura.io/v3/4c85e04d62c94a649eaf52c81748d626'),
      network_id: 11155111, // Sepolia's network id
      gas: 5500000,        // Gas limit
      confirmations: 2,    // Number of confirmations to wait between deployments
      timeoutBlocks: 200,  // Number of blocks before a deployment times out
      skipDryRun: true     // Skip dry run before migrations
    },
  },

  compilers: {
    solc: {
      version: "0.8.0"  // solidity version
      // settings: {
      //   optimizer: {
      //     enabled: true,   // Enable if you want the contract to be optimized
      //     runs: 200
      //   }
      // }
    }
  }
};
