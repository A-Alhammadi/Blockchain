const VotingSystem = artifacts.require("VotingSystem");
const assert = require("chai").assert;

contract("VotingSystem", (accounts) => {
    let votingSystem;

    beforeEach(async () => {
        votingSystem = await VotingSystem.new();
    });

    it("should register a candidate by the owner", async () => {
        // Ensure that only the owner (deployer) can register a candidate
        const candidateName = "Alice";
        await votingSystem.registerCandidate(candidateName, { from: accounts[0] });

        const candidateId = (await votingSystem.getCandidatesCount()).toNumber() - 1;
        const candidate = await votingSystem.candidates(candidateId);

        assert.equal(candidate.name, candidateName, "Candidate name should match the registered name");
    });

    it("should start and end voting", async () => {
        await votingSystem.startVoting({ from: accounts[0] });
        assert.isTrue(await votingSystem.isVotingStarted(), "Voting should be started");

        await votingSystem.endVoting({ from: accounts[0] });
        assert.isTrue(await votingSystem.isVotingEnded(), "Voting should be ended");
    });

    it("should register a voter", async () => {
        await votingSystem.registerVoter({ from: accounts[1] });
        const voter = await votingSystem.voters(accounts[1]);

        assert.isFalse(voter.hasVoted, "Newly registered voter should not have voted yet");
    });

    it("should allow a voter to vote when voting is active", async () => {
        // Register a candidate and start voting
        await votingSystem.registerCandidate("John Doe", { from: accounts[0] });
        await votingSystem.startVoting({ from: accounts[0] });

        // Register a voter and cast a vote
        await votingSystem.registerVoter({ from: accounts[2] });
        await votingSystem.vote(0, { from: accounts[2] });

        const candidate = await votingSystem.candidates(0);
        assert.equal(candidate.voteCount.toNumber(), 1, "Vote count should increase after voting");
    });

    it("should not allow voting before start or after end", async () => {
        await votingSystem.registerCandidate("Jane Smith", { from: accounts[0] });

        try {
            // Attempt to vote before voting has started
            await votingSystem.vote(0, { from: accounts[3] });
            assert.fail("Expected error for voting before start");
        } catch (error) {
            assert.isTrue(error.message.includes("Voting not allowed at this time."), "Should not allow voting before start");
        }

        // Start and end voting
        await votingSystem.startVoting({ from: accounts[0] });
        await votingSystem.endVoting({ from: accounts[0] });

        try {
            // Attempt to vote after voting has ended
            await votingSystem.vote(0, { from: accounts[4] });
            assert.fail("Expected error for voting after end");
        } catch (error) {
            assert.isTrue(error.message.includes("Voting not allowed at this time."), "Should not allow voting after end");
        }
    });

    it("should not allow double voting", async () => {
        await votingSystem.registerCandidate("Emily Johnson", { from: accounts[0] });
        await votingSystem.startVoting({ from: accounts[0] });

        await votingSystem.registerVoter({ from: accounts[5] });
        await votingSystem.vote(0, { from: accounts[5] });

        try {
            await votingSystem.vote(0, { from: accounts[5] });
            assert.fail("Expected revert for double voting");
        } catch (error) {
            assert.isTrue(error.message.includes("You have already voted."), "Double voting should not be allowed");
        }
    });
});
