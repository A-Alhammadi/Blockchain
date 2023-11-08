let web3;
let votingSystem;
const contractAddress = "0xAAd2c38fb5A61eA8b30e49E03E852263f94Aa568"; // Replace with your contract's address
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
    "inputs": [],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
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
        "internalType": "struct VotingSystem.Candidate[]",
        "name": "",
        "type": "tuple[]"
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
]; // Replace with your contract's ABI from JSON file anytime you edit contract

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            votingSystem = new web3.eth.Contract(contractABI, contractAddress);
            subscribeToEvents();
            await updateCandidateList();
        } catch (error) {
            console.error("Access to Ethereum account was denied.", error);
            // Update the UI to inform the user access was denied
        }
    } else {
        console.error("No Ethereum provider found. Install MetaMask!");
        // Update the UI to inform the user to install MetaMask
    }
});

function subscribeToEvents() {
    votingSystem.events.CandidateRegistered()
        .on('data', async (event) => {
            console.log('Candidate registered:', event.returnValues);
            await updateCandidateList();
        })
        .on('error', console.error);
}

async function updateCandidateList() {
    try {
        const candidates = await votingSystem.methods.getAllCandidates().call();
        const candidatesListElement = document.getElementById('candidates-list');

        if (!candidatesListElement) return; // Exit if the element is not on the current page

        candidatesListElement.innerHTML = '';

        candidates.forEach((candidate, index) => {
            const candidateElement = document.createElement('div');
            candidateElement.textContent = `ID: ${index}, Name: ${candidate.name}, Votes: ${candidate.voteCount}`;
            candidatesListElement.appendChild(candidateElement);
        });
    } catch (error) {
        console.error("Error updating candidate list:", error);
        // Update the UI to inform the user about the error
    }
}

async function registerCandidate() {
  try {
    const candidateNameInput = document.getElementById('new-candidate-name');
    if (!candidateNameInput) {
      console.error("Can't find the new candidate name input field.");
      return;
    }
    const candidateName = candidateNameInput.value;
    const accounts = await web3.eth.getAccounts();
    await votingSystem.methods.registerCandidate(candidateName).send({ from: accounts[0] });
    console.log("Candidate registered successfully!");
    // add inform the user about successful registration
  } catch (error) {
    console.error("Error registering candidate:", error);
    // add inform the user about the error
  }
}


async function voteForCandidate() {
    try {
        const candidateId = document.getElementById('candidateId').value;
        if (isNaN(candidateId)) {
            // Update the UI to prompt the user to input a valid ID
            return;
        }
        const accounts = await web3.eth.getAccounts();
        await votingSystem.methods.vote(candidateId).send({ from: accounts[0] });
        console.log("Voted successfully!");
        // Update the UI to inform the user about successful voting
    } catch (error) {
        console.error("Error voting for candidate:", error);
        // Update the UI to inform the user about the error
    }
}

async function startVoting() {
    try {
        const accounts = await web3.eth.getAccounts();
        await votingSystem.methods.startVoting().send({ from: accounts[0] });
        console.log("Voting started successfully!");
        // Update the UI to inform the user
    } catch (error) {
        console.error("Error starting the voting:", error);
        // Update the UI to inform the user about the error
    }
}

async function endVoting() {
    try {
        const accounts = await web3.eth.getAccounts();
        await votingSystem.methods.endVoting().send({ from: accounts[0] });
        console.log("Voting ended successfully!");
        // Update the UI to inform the user
    } catch (error) {
        console.error("Error ending the voting:", error);
        // Update the UI to inform the user about the error
    }
}

// Listen for account changes in MetaMask and reload the page to reset state
window.ethereum.on('accountsChanged', (accounts) => {
    window.location.reload();
});

// Listen for chain changes in MetaMask and reload the page to reset state
window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
});
