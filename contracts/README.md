# BeexoRunner Smart Contract

Solidity contract for the Beexo Runner game with on-chain betting and payouts.

## Features

- Entry fee: 0.001 ETH per game
- Score-based rewards:
  - 500+ score: 1x (get entry back)
  - 1000+ score: 2x payout
  - 2000+ score: 5x payout
  - 5000+ score: 10x payout
- House keeps fees from losing games
- Owner can withdraw house profits
- Player statistics tracking

## Deployment

### Option 1: Using Hardhat (Recommended)

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Initialize Hardhat:
```bash
npx hardhat init
```

3. Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [process.env.PRIVATE_KEY]
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

4. Deploy:
```bash
npx hardhat run contracts/deploy.js --network polygon
```

### Option 2: Using Remix

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file: `BeexoRunner.sol`
3. Paste contract code
4. Compile with Solidity 0.8.20
5. Deploy using Injected Provider (MetaMask/Beexo Wallet)
6. Fund contract with initial balance for payouts

## Contract ABI

The contract ABI will be generated after compilation and saved to `artifacts/contracts/BeexoRunner.sol/BeexoRunner.json`

## Key Functions

### For Players

- `startGame()` - Pay entry fee and start game session (returns sessionId)
- `endGame(sessionId, score)` - Submit score and claim rewards
- `getPlayerStats(address)` - View player statistics

### For Owner

- `withdrawHouseBalance()` - Withdraw house profits
- `setEntryFee(uint256)` - Update entry fee
- `emergencyWithdraw()` - Emergency withdrawal

## Testing Locally

1. Start local Hardhat node:
```bash
npx hardhat node
```

2. Deploy to local network:
```bash
npx hardhat run contracts/deploy.js --network localhost
```

3. Update frontend with contract address

## Security Considerations

- Contract uses `block.prevrandao` for session ID generation
- 1-hour timeout for game sessions
- Reentrancy protection via checks-effects-interactions pattern
- Owner-only functions for admin operations

## Next Steps

1. Deploy to testnet (Mumbai/Goerli) for testing
2. Test all game flows with Beexo Wallet
3. Audit contract before mainnet deployment
4. Deploy to mainnet (Polygon recommended for low fees)
5. Verify contract on Polygonscan
