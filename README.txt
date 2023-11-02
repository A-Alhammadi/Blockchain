Ethelect Voting System

To run you will need:

Node.js and npm: make sure these are both installed.

MetaMask: You will use this browser extention to interact with Ethereum blockchain.

Ganache: To tun a local Ethereum blockchain

STEPS:
1. Download repository from: https://github.com/A-Alhammadi/Blockchain
(or in command type: "git clone https://github.com/A-Alhammadi/Blockchain")

2. Navigate to the project directory

3. Install dependencies (type: "npm install")

4. Run Ganache

5. Compile and migrate (type: "truffle compile" then "truffle migrate")

6. Copy contract address from console (will be given by truffle after migration) and paste it in frontend/js/app.js (line 3 replace whatever is in quotations)

7. Navigate to frontend and start a local http server (e.g. with npm http-server)

8. Open web browser and got to http://localhost:8080 (or whatever port you chose).

9. Start MetaMask. Connect to Ganache network. Log in to a Ganache account using private key. 

10. Use your web application's interface to interact with the smart contract.
Actions performed on the web application should be shown on the Ganache blockchain 







