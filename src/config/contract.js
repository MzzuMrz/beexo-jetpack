/**
 * Contract configuration
 *
 * IMPORTANT: Update CONTRACT_ADDRESS after deploying the contract
 */

// Update this after deploying the contract!
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

// Entry fee in ETH
export const ENTRY_FEE = "0.001"

// Supported networks
export const SUPPORTED_NETWORKS = {
  polygon: {
    chainId: "0x89",
    name: "Polygon Mainnet",
    rpc: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com"
  },
  mumbai: {
    chainId: "0x13881",
    name: "Mumbai Testnet",
    rpc: "https://rpc-mumbai.maticvigil.com/",
    explorer: "https://mumbai.polygonscan.com"
  },
  arbitrum: {
    chainId: "0xa4b1",
    name: "Arbitrum One",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io"
  },
  bsc: {
    chainId: "0x38",
    name: "BNB Smart Chain",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com"
  }
}

// Reward tiers
export const REWARD_TIERS = {
  BRONZE: { score: 500, multiplier: 1, emoji: "🥉" },
  SILVER: { score: 1000, multiplier: 2, emoji: "🥈" },
  GOLD: { score: 2000, multiplier: 5, emoji: "🥇" },
  DIAMOND: { score: 5000, multiplier: 10, emoji: "💎" }
}
