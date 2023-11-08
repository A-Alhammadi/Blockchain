let web3;
let votingSystem;
const contractAddress = "0xD248702c87D8d48ffc128e2AF03989bB0431d925"; // Replace with your contract's address
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
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
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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

// Function to check if the connected account is the owner of the contract
async function isOwner() {
  const accounts = await web3.eth.getAccounts();
  const contractOwner = await votingSystem.methods.getOwner().call();
  return accounts[0].toLowerCase() === contractOwner.toLowerCase();
}


async function refreshUI() {
  try {
    const userIsOwner = await isOwner();
    if (userIsOwner) {
      // Show admin controls
      document.getElementById('admin-controls').style.display = 'block';
    } else {
      // Hide admin controls
      document.getElementById('admin-controls').style.display = 'none';
    }
    if (document.getElementById('candidates-list')) {
      await updateCandidateList();
    } else if (document.getElementById('resultsTable')) {
      await displayCandidatesAndVotes();
    }
  } catch (error) {
    console.error('Error refreshing UI:', error);
    // Optionally handle the error, like displaying an error message to the user
  }
}


async function requestAccount() {
  // Check if MetaMask was connected before
  if (localStorage.getItem('metaMaskConnected') === 'true') {
    return (await web3.eth.getAccounts())[0];
  }
  
  // Otherwise, request account access
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  localStorage.setItem('metaMaskConnected', 'true');
  return accounts[0];
}


window.addEventListener('load', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const alreadyConnected = localStorage.getItem('metaMaskConnected') === 'true';
      if (!alreadyConnected) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        localStorage.setItem('metaMaskConnected', 'true');
      }
      votingSystem = new web3.eth.Contract(contractABI, contractAddress);
      
      subscribeToEvents();
      await refreshUI();

      // Now that votingSystem should be set up, update the candidate list.
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
    if (!(await isOwner())) {
        alert("You are not the owner.");
        return;
    }
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
      
      if (candidateId === '' || isNaN(candidateId) || parseInt(candidateId) < 0) {
          alert('Please enter a valid candidate ID');
          return;
      }
      
      if (!window.ethereum)
          throw new Error("No crypto wallet found. Please install it.");

      await requestAccount(); // Request account access if not already available
      const accounts = await web3.eth.getAccounts();

      await votingSystem.methods.vote(candidateId).send({ from: accounts[0] });
      alert('Vote cast successfully!');
      // Optionally, update the UI to reflect the new vote
  } catch (error) {
      console.error("Error voting for candidate:", error);
      alert(`Error voting for candidate: ${error.message}`);
  }
}


async function startVoting() {
  try {
      if (!(await isOwner())) {
          alert("You are not the owner.");
          return;
      }
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
      if (!(await isOwner())) {
          alert("You are not the owner.");
          return;
      }
      const accounts = await web3.eth.getAccounts();
      await votingSystem.methods.endVoting().send({ from: accounts[0] });
      console.log("Voting ended successfully!");
      // Update the UI to inform the user
  } catch (error) {
      console.error("Error ending the voting:", error);
      // Update the UI to inform the user about the error
  }
}

async function displayCandidatesAndVotes() {
  try {
      const candidates = await votingSystem.methods.getAllCandidates().call();
      const candidateNames = candidates.map(candidate => candidate.name);
      const voteCounts = candidates.map(candidate => parseInt(candidate.voteCount));

      const ctx = document.getElementById('votesChart').getContext('2d');
      const votesChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: candidateNames,
              datasets: [{
                  label: 'Votes',
                  data: voteCounts,
                  backgroundColor: [
                      // Define colors for each slice here
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      // ... add more colors for more candidates
                  ],
                  borderColor: [
                      // Define border colors for each slice here
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      // ... add more border colors for more candidates
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      display: true
                  }
              }
          }
      });

  } catch (error) {
      console.error("Error displaying candidates and votes:", error);
      // Update the UI to inform the user about the error
  }
}


// Listen for account changes in MetaMask and reload the page to reset state
//window.ethereum.on('accountsChanged', (accounts) => {
 //   window.location.reload();
//});

// Listen for chain changes in MetaMask and reload the page to reset state
//window.ethereum.on('chainChanged', (chainId) => {
 //   window.location.reload();
//});
window.ethereum.on('accountsChanged', () => {
  refreshUI().catch(console.error);
});
window.ethereum.on('chainChanged', () => {
  refreshUI().catch(console.error);
});
