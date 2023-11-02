let web3;
let votingSystem;
const contractAddress = "0xa590bebd3B3F429304438107b5E97198b2CA9D28"; //build/contracts/json file, networks section
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "CandidateRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVotingEnded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVotingStarted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "hasVoted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "votedCandidateId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "registerCandidate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "getCandidateVoteCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; // ABI of your contract copied from same json file as address

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request access to user's Ethereum wallet
    } else {
        console.error("No Ethereum provider found. Install MetaMask!");
        return;
    }

    votingSystem = new web3.eth.Contract(contractABI, contractAddress);
});
async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}

async function checkRegisteredVoter() {
  const addressToCheck = document.getElementById('addressToCheck').value;
  const voterDetails = await votingSystem.methods.voters(addressToCheck).call();
  const isVoter = voterDetails.hasVoted;
  console.log(`Is registered voter: ${isVoter}`);
  // You can update some DOM element with this info
}

async function registerCandidate() {
  try {
      const candidateName = document.getElementById('candidateName').value;
      const accounts = await web3.eth.getAccounts();
      await votingSystem.methods.registerCandidate(candidateName).send({ from: accounts[0] });
      console.log("Candidate registered successfully!");
      // add inform the user about successful registration
  } catch (error) {
      console.error("Error registering candidate:", error);
      // add inform the user about the error
  }
}

async function registerVoter() {
  try {
      const accounts = await web3.eth.getAccounts();
      await votingSystem.methods.registerVoter().send({ from: accounts[0] });
      console.log("Voter registered successfully!");
      // add inform the user about successful registration
  } catch (error) {
      console.error("Error registering voter:", error);
      // add inform the user about the error
  }
}

async function voteForCandidate() {
  try {
      const candidateId = document.getElementById('candidateId').value;
      const accounts = await web3.eth.getAccounts();
      await votingSystem.methods.vote(candidateId).send({ from: accounts[0] });
      console.log("Voted successfully!");
      // add inform the user about successful voting
  } catch (error) {
      console.error("Error voting for candidate:", error);
      // add inform the user about the error
  }
}

async function startVoting() {
  const accounts = await web3.eth.getAccounts();
  await votingSystem.methods.startVoting().send({ from: accounts[0] });
}

async function endVoting() {
  const accounts = await web3.eth.getAccounts();
  await votingSystem.methods.endVoting().send({ from: accounts[0] });
}
/*async function displayCandidatesAndVotes() {
  try {
      const totalCandidates = await votingSystem.methods.getCandidatesCount().call();
      let candidatesList = [];
      
      for (let i = 0; i < totalCandidates; i++) {
          const candidate = await votingSystem.methods.candidates(i).call();
          candidatesList.push({
              name: candidate.name,
              voteCount: candidate.voteCount
          });
      }
      
      // Update the UI with candidatesList
      // Example: display in a table or list format on your results page
  } catch (error) {
      console.error("Error fetching candidates and their votes:", error);
      // Optionally, inform the user about the error
  }
}*/
