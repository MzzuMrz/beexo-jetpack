# 🚀 Deployment Checklist for XO Connect Challenge

## Pre-Deployment

### ✅ Local Testing
- [ ] Fix npm permissions: `sudo chown -R $(whoami) /Users/maruzza/Desktop/beexo-game`
- [ ] Install dependencies: `npm install`
- [ ] Run dev server: `npm run dev`
- [ ] Test game locally at http://localhost:3000
- [ ] Verify wallet connection works (MetaMask)
- [ ] Test full game flow without contract (demo mode)

### ✅ Smart Contract Deployment

**Recommended: Mumbai Testnet (Polygon) for testing**

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

2. Create `.env` file:
```
PRIVATE_KEY=your_private_key_here
MUMBAI_RPC=https://rpc-mumbai.maticvigil.com/
```

3. Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

4. Get testnet MATIC:
   - Visit https://faucet.polygon.technology/
   - Enter your wallet address
   - Get free Mumbai MATIC

5. Deploy contract:
```bash
npx hardhat run contracts/deploy.js --network mumbai
```

6. **SAVE THE CONTRACT ADDRESS!**

7. Fund contract with test MATIC (for payouts):
```bash
# Send 0.5 MATIC to contract address
```

8. Verify on PolygonScan:
```bash
npx hardhat verify --network mumbai CONTRACT_ADDRESS
```

### ✅ Frontend Configuration

1. Update `src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"
```

2. Test with real contract:
```bash
npm run dev
```

3. Verify transactions on Mumbai PolygonScan

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Deploy (automatic)
5. Get URL: `https://beexo-runner.vercel.app`

**Or CLI:**
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

1. Build project:
```bash
npm run build
```

2. Go to https://netlify.com
3. Drag & drop `dist/` folder
4. Get URL: `https://beexo-runner.netlify.app`

**Or CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: IPFS (Decentralized)

```bash
npm run build
npx ipfs-deploy dist/
```

## Testing in Beexo Wallet

### 📱 Mobile Testing

1. Deploy to public URL
2. Open Beexo Wallet app
3. Navigate to your URL
4. Test full flow:
   - [ ] Wallet connects via XO Connect
   - [ ] Entry fee transaction works
   - [ ] Game plays smoothly
   - [ ] Rewards claim works
   - [ ] Multiple games work

### 🖥️ Desktop Testing

1. Open Chrome DevTools mobile view (F12 → Toggle device toolbar)
2. Test responsive design
3. Test touch controls

## Hackathon Submission

### Required Information

**Form: https://forms.gle/9ptsknR5Zk1DHiiG9**

Prepare:
- [ ] Project name: "Beexo Runner"
- [ ] Team members & contacts
- [ ] Demo URL (Vercel/Netlify)
- [ ] GitHub repository URL
- [ ] Contract address (Mumbai)
- [ ] Video demo (optional but recommended)
- [ ] Brief description

### Demo Video (Recommended)

Record 2-3 minute video showing:
1. Opening game in Beexo Wallet
2. Connecting wallet
3. Paying entry fee
4. Playing game
5. Earning score
6. Claiming rewards
7. Viewing transaction on explorer

Tools: Loom, OBS, or phone screen recording

## Final Checklist

### Code Quality
- [ ] README.md is complete
- [ ] Code is commented
- [ ] No console errors
- [ ] Responsive design works
- [ ] Loading states work
- [ ] Error handling works

### Blockchain
- [ ] Contract deployed to testnet
- [ ] Contract verified on explorer
- [ ] Contract funded with test tokens
- [ ] Transactions are working
- [ ] Frontend connects to contract

### UX/UI
- [ ] Beautiful gradient design
- [ ] Smooth animations
- [ ] Clear instructions
- [ ] Reward tiers visible
- [ ] Mobile-friendly

### XO Connect Integration
- [ ] XO Connect SDK installed
- [ ] Wallet connection works
- [ ] Falls back to MetaMask
- [ ] Client info logged
- [ ] Transactions use XO provider

### Documentation
- [ ] README with setup instructions
- [ ] Contract documentation
- [ ] Deployment guide
- [ ] Architecture explained
- [ ] License included

## Submission Timeline

- **Start**: Friday, September 26
- **Registration Deadline**: Tuesday, September 30 at 23:59
- **Submission Deadline**: Friday, October 3 at 19:30
- **Current Time**: Check calendar!

## Quick Commands Reference

```bash
# Development
npm install
npm run dev

# Build
npm run build
npm run preview

# Deploy Contract
npx hardhat run contracts/deploy.js --network mumbai

# Deploy Frontend
vercel
# or
netlify deploy --prod

# Test Transactions
# Use Mumbai PolygonScan to view transactions
https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

## Support

If you get stuck:
- Telegram: [@beexowallet](https://t.me/beexowallet)
- Telegram Builders: [@buidlerstech](https://t.me/buidlerstech)

## Scoring Criteria Optimization

**1. Integration (30 pts)**
- ✅ XO Connect working
- ✅ Beexo Wallet compatible
- ✅ On-chain transactions
- ✅ Stable & secure

**2. UX (30 pts)**
- ✅ Simple & beautiful
- ✅ Fast loading
- ✅ Clear instructions
- ✅ Fun to play

**3. Innovation (25 pts)**
- ✅ Score-based rewards
- ✅ House edge model
- ✅ Multiple tiers
- ✅ Game + DeFi fusion

**4. Scalability (15 pts)**
- ✅ Multi-chain ready
- ✅ Clean architecture
- ✅ Good documentation
- ✅ Easy to deploy

**Target Score: 90+ / 100**

---

Good luck! 🚀 You've got this!
