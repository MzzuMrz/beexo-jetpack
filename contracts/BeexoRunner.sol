// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BeexoRunner
 * @dev Simple game contract for Beexo Runner endless game
 * Players pay entry fee and receive rewards based on their score
 */
contract BeexoRunner {
    address public owner;
    uint256 public entryFee = 0.001 ether;
    uint256 public houseBalance;

    // Reward multipliers based on score (in basis points, 100 = 1x)
    uint256 constant BRONZE_SCORE = 500;
    uint256 constant SILVER_SCORE = 1000;
    uint256 constant GOLD_SCORE = 2000;
    uint256 constant DIAMOND_SCORE = 5000;

    uint256 constant BRONZE_MULTIPLIER = 100;  // 1x
    uint256 constant SILVER_MULTIPLIER = 200;  // 2x
    uint256 constant GOLD_MULTIPLIER = 500;    // 5x
    uint256 constant DIAMOND_MULTIPLIER = 1000; // 10x

    struct GameSession {
        address player;
        uint256 entryAmount;
        uint256 timestamp;
        bool claimed;
    }

    mapping(bytes32 => GameSession) public gameSessions;
    mapping(address => uint256) public totalEarnings;
    mapping(address => uint256) public gamesPlayed;

    event GameStarted(address indexed player, bytes32 sessionId, uint256 entryFee);
    event GameEnded(address indexed player, bytes32 sessionId, uint256 score, uint256 payout);
    event OwnerWithdraw(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Start a new game session
     * @return sessionId Unique identifier for this game session
     */
    function startGame() external payable returns (bytes32) {
        require(msg.value == entryFee, "Incorrect entry fee");

        bytes32 sessionId = keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            block.prevrandao
        ));

        require(gameSessions[sessionId].player == address(0), "Session already exists");

        gameSessions[sessionId] = GameSession({
            player: msg.sender,
            entryAmount: msg.value,
            timestamp: block.timestamp,
            claimed: false
        });

        gamesPlayed[msg.sender]++;

        emit GameStarted(msg.sender, sessionId, msg.value);

        return sessionId;
    }

    /**
     * @dev End game and claim rewards based on score
     * @param sessionId The game session ID
     * @param score Final score achieved by player
     */
    function endGame(bytes32 sessionId, uint256 score) external {
        GameSession storage session = gameSessions[sessionId];

        require(session.player == msg.sender, "Not your game session");
        require(!session.claimed, "Rewards already claimed");
        require(block.timestamp <= session.timestamp + 1 hours, "Session expired");

        session.claimed = true;

        uint256 payout = calculatePayout(session.entryAmount, score);

        if (payout > 0 && address(this).balance >= payout) {
            totalEarnings[msg.sender] += payout;
            payable(msg.sender).transfer(payout);
        } else {
            // House keeps the entry fee if no payout
            houseBalance += session.entryAmount;
        }

        emit GameEnded(msg.sender, sessionId, score, payout);
    }

    /**
     * @dev Calculate payout based on score
     * @param entryAmount Original entry fee
     * @param score Final game score
     * @return payout amount in wei
     */
    function calculatePayout(uint256 entryAmount, uint256 score) public pure returns (uint256) {
        if (score >= DIAMOND_SCORE) {
            return (entryAmount * DIAMOND_MULTIPLIER) / 100;
        } else if (score >= GOLD_SCORE) {
            return (entryAmount * GOLD_MULTIPLIER) / 100;
        } else if (score >= SILVER_SCORE) {
            return (entryAmount * SILVER_MULTIPLIER) / 100;
        } else if (score >= BRONZE_SCORE) {
            return (entryAmount * BRONZE_MULTIPLIER) / 100;
        } else {
            return 0; // No payout
        }
    }

    /**
     * @dev Get player statistics
     * @param player Address of the player
     */
    function getPlayerStats(address player) external view returns (
        uint256 games,
        uint256 earnings
    ) {
        return (gamesPlayed[player], totalEarnings[player]);
    }

    /**
     * @dev Owner can withdraw house profits
     */
    function withdrawHouseBalance() external onlyOwner {
        uint256 amount = houseBalance;
        require(amount > 0, "No balance to withdraw");

        houseBalance = 0;
        payable(owner).transfer(amount);

        emit OwnerWithdraw(owner, amount);
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Update entry fee (only owner)
     */
    function setEntryFee(uint256 newFee) external onlyOwner {
        entryFee = newFee;
    }

    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
