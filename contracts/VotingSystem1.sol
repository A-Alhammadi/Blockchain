// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract VotingSystem {

    event CandidateRegistered(uint256 candidateId, string name);

    bool public isVotingStarted = false;
    bool public isVotingEnded = false;
    address private owner;

// Set the owner to the message sender (account that deploys the contract)
constructor() {
    owner = msg.sender;
}
function getOwner() public view returns (address) {
    return owner;
}

// Modifier that only allows the owner to call the function
modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function.");
    _;
}

function startVoting() public onlyOwner {
    require(!isVotingStarted, "Voting has already started.");
    isVotingStarted = true;
}
function endVoting() public onlyOwner {
    require(isVotingStarted && !isVotingEnded, "Voting hasn't started or already ended.");
    isVotingEnded = true;
}

    // Struct for a single voter
    struct Voter {
        bool hasVoted;
        uint votedCandidateId;
    }

    // Struct for a single candidate
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Map address to voter's details
    mapping(address => Voter) public voters;
    
    //array of candidates
    Candidate[] public candidates;
    
    // Register new candidate
   function registerCandidate(string memory _name) public onlyOwner returns (uint) {
    candidates.push(Candidate({
        name: _name,
        voteCount: 0
    }));
    uint id = candidates.length - 1;
    emit CandidateRegistered(id, _name);
    return id;
}


    // Register  voter (should have more controls to prevent double registration, etc)
    function registerVoter() public {
        require(!voters[msg.sender].hasVoted, "Voter has already registered");
        voters[msg.sender].hasVoted = false;
    }

    // Vote for candidate
    function vote(uint _candidateId) public {
        require(isVotingStarted && !isVotingEnded, "Voting not allowed at this time.");
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "You have already voted.");
        require(_candidateId < candidates.length, "Invalid candidate.");

        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;

        candidates[_candidateId].voteCount += 1;
    }

    // Get count of candidates
    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }
    
    function getAllCandidates() public view returns (Candidate[] memory) {
    return candidates;
}

    // Get specific candidate's vote count
    function getCandidateVoteCount(uint _candidateId) public view returns (uint) {
        require(_candidateId < candidates.length, "Invalid candidate.");
        return candidates[_candidateId].voteCount;
    }
}
