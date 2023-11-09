module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache GUI default port. Change to 8545 if you're using Ganache CLI
      network_id: "*"        // Match any network
    }
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
