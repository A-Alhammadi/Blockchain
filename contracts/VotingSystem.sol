// this line says that the code is allowed to be used by anyone as long as they follow the mit license rules
// SPDX-License-Identifier: MIT

// this tells us that the code is written in solidity version 0.8.0
pragma solidity ^0.8.0;

// we're starting a new contract called votingsystem
contract votingsystem {

    // this is a notice that something has happened, specifically a candidate has been registered with a number and a name
    event candidateregistered(uint256 candidateid, string name);

    // these two lines are switches to tell us if voting has started or ended
    bool public isvotingstarted = false;
    bool public isvotingended = false;
    // this is a secret place to store who owns the contract
    address private owner;

    // when the contract is first made, it sets the owner to be the person who made the contract
    constructor() {
        owner = msg.sender;
    }
    // this function lets us see who the owner is
    function getowner() public view returns (address) {
        return owner;
    }

    // this is a special rule that only lets the owner use some functions
    modifier onlyowner() {
        require(msg.sender == owner, "only the owner can call this function.");
        _;
    }

    // these functions let the owner start and end the voting
    function startvoting() public onlyowner {
        require(!isvotingstarted, "voting has already started.");
        isvotingstarted = true;
    }
    function endvoting() public onlyowner {
        require(isvotingstarted && !isvotingended, "voting hasn't started or already ended.");
        isvotingended = true;
    }

    // this is a way to keep track of a voter with a switch if they voted and who they voted for
    struct voter {
        bool hasvoted;
        uint votedcandidateid;
    }

    // this is a way to keep track of a candidate with their name and how many votes they have
    struct candidate {
        string name;
        uint votecount;
    }

    // this connects a person's address to their voter details
    mapping(address => voter) public voters;
    
    // this is a list of all the candidates
    candidate[] public candidates;
    
    // this function lets the owner add a new candidate
    function registercandidate(string memory _name) public onlyowner returns (uint) {
        candidates.push(candidate({
            name: _name,
            votecount: 0
        }));
        uint id = candidates.length - 1;
        emit candidateregistered(id, _name);
        return id;
    }

    // this function lets someone register to vote (but it should have more checks to make sure people don't register more than once)
    function registervoter() public {
        require(!voters[msg.sender].hasvoted, "voter has already registered");
        voters[msg.sender].hasvoted = false;
    }

    // this function lets you vote for a candidate
    function vote(uint _candidateid) public {
        require(isvotingstarted && !isvotingended, "voting not allowed at this time.");
        voter storage sender = voters[msg.sender];
        require(!sender.hasvoted, "you have already voted.");
        require(_candidateid < candidates.length, "invalid candidate.");

        sender.hasvoted = true;
        sender.votedcandidateid = _candidateid;

        candidates[_candidateid].votecount += 1;
    }

    // this function tells us how many candidates there are
    function getcandidatescount() public view returns (uint) {
        return candidates.length;
    }
    
    // this function shows us all the candidates
    function getallcandidates() public view returns (candidate[] memory) {
        return candidates;
    }

    // this function tells us how many votes a specific candidate has
    function getcandidatevotecount(uint _candidateid) public view returns (uint) {
        require(_candidateid < candidates.length, "invalid candidate.");
        return candidates[_candidateid].votecount;
    }
}
