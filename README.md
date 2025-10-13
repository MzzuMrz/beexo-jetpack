# 🚀 Beexo Runner - Endless Crypto Adventure

An endless runner game built for the **XO Connect Challenge** hackathon by Beexo Wallet. Players pay to play with crypto and earn rewards based on their score!

[![XO Connect](https://img.shields.io/badge/XO_Connect-Integrated-success)](https://www.npmjs.com/package/xo-connect)
[![Beexo Wallet](https://img.shields.io/badge/Beexo_Wallet-Compatible-blue)]()

## 🎮 Game Concept

Inspired by **Jetpack Joyride**, players control a flying character that must dodge obstacles while surviving as long as possible. The longer you survive, the higher your score and crypto rewards!

**Controls**:
- **SPACE** or **CLICK/TAP** to fly up
- Avoid red obstacles
- Don't hit the ground!

## 💰 How It Works

1. **Connect Wallet**: Use Beexo Wallet (XO Connect) or MetaMask
2. **Pay Entry Fee**: 0.001 ETH to start game (on-chain transaction)
3. **Play & Survive**: Dodge obstacles and rack up points
4. **Claim Rewards**: Get crypto payout based on final score

### 🏆 Reward Tiers

| Score | Tier | Multiplier | Payout |
|-------|------|------------|--------|
| 500+ | 🥉 Bronze | 1x | 0.001 ETH (break even) |
| 1000+ | 🥈 Silver | 2x | 0.002 ETH |
| 2000+ | 🥇 Gold | 5x | 0.005 ETH |
| 5000+ | 💎 Diamond | 10x | 0.01 ETH |

### 🏦 House Edge Model
- Entry fees fund the reward pool
- House keeps % from losing games (score < 500)
- Players can earn up to 10x their entry fee
- All transactions are on-chain and transparent

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Game Engine**: Phaser.js 3.80
- **Wallet Integration**: XO Connect 2.1.3 + ethers.js 6
- **Smart Contract**: Solidity 0.8.20
- **Supported Networks**: Polygon, Arbitrum, BNB Chain, Rootstock

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or Beexo Wallet
- Testnet ETH (for testing)

### Installation

1. **Clone and install**:
```bash
cd beexo-game
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open in browser**:
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm run preview
```

## 📦 Deployment Guide

### Step 1: Deploy Smart Contract

See detailed instructions in [`contracts/README.md`](contracts/README.md)

**Quick deploy** (using Hardhat):
```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to Mumbai testnet
npx hardhat run contracts/deploy.js --network mumbai

# Save the contract address!
```

### Step 2: Update Contract Address

Edit `src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"
```

### Step 3: Deploy Frontend

**Option A: Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

**Option B: Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Option C: IPFS** (Decentralized)
```bash
npm run build
ipfs add -r dist/
```

### Step 4: Test in Beexo Wallet

1. Open Beexo Wallet app
2. Navigate to your deployed URL
3. Connect wallet using XO Connect
4. Test full game flow:
   - Pay entry fee
   - Play game
   - Claim rewards

## 🎯 Hackathon Compliance

### XO Connect Challenge Requirements

✅ **XO Connect Integration**
- Wallet connection via XOConnectProvider
- Works with Beexo Wallet and MetaMask fallback
- Accesses client info and currencies

✅ **On-Chain Transactions**
- Entry fee payment (startGame)
- Reward claiming (endGame)
- All transactions verifiable on explorer

✅ **Beexo Wallet Compatible**
- Responsive design for mobile
- Touch controls (tap to fly)
- Works in WebView/iframe context

✅ **Great UX** (30 pts potential)
- Instant wallet connection
- Smooth gameplay (Phaser.js)
- Clear reward tiers
- One-click payments

✅ **Creative Incentives** (25 pts potential)
- Score-based multipliers
- House edge model
- Progressive difficulty
- Transparent payouts

✅ **Scalability** (15 pts potential)
- Deploy on any EVM chain
- Gas-optimized contracts
- Client-side game logic

## 📝 Project Structure

```
beexo-game/
├── contracts/
│   ├── BeexoRunner.sol       # Main game contract
│   ├── deploy.js              # Deployment script
│   └── README.md              # Contract docs
├── src/
│   ├── components/
│   │   ├── WalletConnect.jsx  # XO Connect integration
│   │   ├── Game.jsx           # Phaser game + blockchain
│   │   └── *.css              # Styles
│   ├── contracts/
│   │   └── BeexoRunnerABI.json # Contract ABI
│   ├── config/
│   │   └── contract.js        # Contract address & config
│   ├── App.jsx                # Main app
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎮 Game Features

### Current (MVP)
- ✅ Endless runner gameplay
- ✅ Obstacle spawning
- ✅ Score tracking
- ✅ XO Connect wallet integration
- ✅ On-chain payments
- ✅ Reward claiming
- ✅ Responsive design

### Future Enhancements
- [ ] Better graphics (sprites, animations)
- [ ] Sound effects and music
- [ ] Particle effects
- [ ] Leaderboards (on-chain)
- [ ] NFT rewards for high scores
- [ ] Multiplayer races
- [ ] Power-ups and collectibles
- [ ] Daily challenges

## 🔧 Development

### Testing Locally

```bash
# Start local Hardhat node
npx hardhat node

# Deploy contract locally
npx hardhat run contracts/deploy.js --network localhost

# Update CONTRACT_ADDRESS in src/config/contract.js

# Run frontend
npm run dev
```

### Debugging

Check browser console for:
- Wallet connection logs
- Transaction hashes
- Game events
- Errors

## 🌐 Supported Networks

Update `src/config/contract.js` to switch networks:

| Network | Chain ID | Testnet |
|---------|----------|---------|
| Polygon | 0x89 | Mumbai (0x13881) |
| Arbitrum | 0xa4b1 | Goerli (0x66eed) |
| BNB Chain | 0x38 | Testnet (0x61) |
| Rootstock | 0x1e | Testnet (0x1f) |

## 🐛 Troubleshooting

**Wallet won't connect**
- Make sure you're using Beexo Wallet or have MetaMask installed
- Check that you're on a supported network

**Transaction fails**
- Ensure you have enough ETH for gas + entry fee
- Check that contract is deployed and funded
- Verify network matches contract deployment

**Game doesn't load**
- Clear browser cache
- Check console for errors
- Ensure all dependencies installed

## 📄 License

MIT License - Open source for the community

## 🙏 Credits

- Built for **XO Connect Challenge** by Beexo Wallet
- Game engine: Phaser.js
- Wallet integration: XO Connect SDK
- Inspired by: Jetpack Joyride, Flappy Bird

## 📞 Support

- Telegram: [@beexowallet](https://t.me/beexowallet)
- Telegram Builders: [@buidlerstech](https://t.me/buidlerstech)

---

**Built with 🚀 for the XO Connect Challenge - October 2025**
# beexo-jetpack
