Ethelect Voting System

This guide will assist you in setting up and running the Ethelect Voting System on a local Ethereum blockchain using Ganache for testing and development purposes.

Prerequisites:

1. Node.js and npm: Ensure both are installed on your system. You can verify by running node -v and npm -v in the command line, which should display the installed versions.
2. MetaMask: A browser extension acting as your Ethereum wallet, enabling interactions with Ethereum blockchains.
3. Ganache: A personal blockchain for Ethereum development that you can use to deploy contracts, develop applications, and run tests.

Detailed Steps:

1. Obtain the code by downloading the repository from GitHub: https://github.com/A-Alhammadi/Blockchain. Alternatively, use Git to clone the repository with the command git clone https://github.com/A-Alhammadi/Blockchain.

2. Open a terminal or command prompt and change your current directory to the project's root directory using the cd command.

3. Install all required npm dependencies by running npm install in the project directory.

4. Launch Ganache to create a local Ethereum blockchain instance. You may use the Ganache UI or the command line version.

5. Compile the smart contract code and deploy it to your local blockchain with Truffle. Execute "truffle compile" to compile the contracts, then "truffle migrate" to deploy them to the blockchain.

6. After migration, Truffle will display the contract address in the console. Locate the app.js file in the frontend/js/ directory, and on line 3, replace the existing contract address with the new one provided by Truffle.

7. With the smart contract deployed, go to the frontend directory and initiate a local HTTP server. If you don't have a server set up, you can install one via npm, such as http-server, by running npm install -g http-server.

8. Open your web browser and navigate to http://localhost:8080 or to the specific port number provided when you started the local HTTP server.

9. Open the MetaMask extension in your browser and connect it to your local Ganache network. Import an account from Ganache using the provided private key to interact with the blockchain.

10. You can now interact with the smart contract through the web application interface. The operations you perform here will be reflected on the Ganache blockchain, allowing you to see the results of your interactions in real-time.
