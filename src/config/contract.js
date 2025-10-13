/**
 * Contract configuration
 *
 * IMPORTANT: Update CONTRACT_ADDRESS after deploying the contract
 */

// Deployed on Polygon Amoy Testnet
export const CONTRACT_ADDRESS = "0x5cc10d3a5a50199db218f64bd3f6d71b1e6e87b9"

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
  amoy: {
    chainId: "0x13882",
    name: "Polygon Amoy Testnet",
    rpc: "https://rpc-amoy.polygon.technology/",
    explorer: "https://amoy.polygonscan.com"
  },
  sepolia: {
    chainId: "0xaa36a7",
    name: "Sepolia Testnet",
    rpc: "https://rpc.sepolia.org/",
    explorer: "https://sepolia.etherscan.io"
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
