const VotingSystem = artifacts.require("VotingSystem");
const assert = require("chai").assert;

contract("VotingSystem", (accounts) => {
    let votingSystem;

    beforeEach(async () => {
        votingSystem = await VotingSystem.new();
    });

    it("should register a candidate", async () => {
        const instance = await VotingSystem.deployed();
        const result = await instance.registerCandidate("Alice");
        
        // get candidateId from the event logs
        const candidateId = result.logs[0].args.candidateId.toNumber();
        
        const candidate = await instance.candidates(candidateId);
        assert.equal(candidate.name, "Alice");
    });
    

    it("should register a voter", async () => {
        await votingSystem.registerVoter({from: accounts[1]});
        const voter = await votingSystem.voters(accounts[1]);
        assert.equal(voter.hasVoted, false, "Newly registered voter has voted status set incorrectly");
    });

    it("should allow a voter to vote and update the vote count", async () => {
        const candidateName = "John Doe";
        await votingSystem.registerCandidate(candidateName);
        
        await votingSystem.registerVoter({from: accounts[2]});
        await votingSystem.vote(0, {from: accounts[2]});

        const candidate = await votingSystem.candidates(0);
        assert.equal(candidate.voteCount.toNumber(), 1, "Vote count did not increase");
    });

    it("should not allow double voting", async () => {
        const candidateName = "Jane Smith";
        await votingSystem.registerCandidate(candidateName);
        
        await votingSystem.registerVoter({from: accounts[3]});
        await votingSystem.vote(0, {from: accounts[3]});

        try {
            await votingSystem.vote(0, {from: accounts[3]});
            assert.fail("Expected revert not received");
        } catch (error) {
            assert.isTrue(error.message.includes("You have already voted."), "Expected 'You have already voted.' but got " + error.message);
        }
    });
});
