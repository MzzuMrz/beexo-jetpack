import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Game from './components/Game'
import WalletConnect from './components/WalletConnect'
import { CONTRACT_ADDRESS, ENTRY_FEE } from './config/contract'
import BeexoRunnerABI from './contracts/BeexoRunnerABI.json'
import './App.css'

function App() {
  const [walletAddress, setWalletAddress] = useState(null)
  const [provider, setProvider] = useState(null)
  const [gameActive, setGameActive] = useState(false)
  const [balance, setBalance] = useState(0)
  const [sessionId, setSessionId] = useState(null)
  const [paying, setPaying] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const handleConnect = (address, ethProvider) => {
    setWalletAddress(address)
    setProvider(ethProvider)

    // Fetch balance
    ethProvider.getBalance(address).then(bal => {
      const ethBalance = parseFloat(ethers.formatEther(bal))
      setBalance(ethBalance)
    })
  }

  const handlePayAndPlay = async () => {
    if (!provider) return

    setPaying(true)
    setPaymentError('')

    try {
      // Check if contract is deployed
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // For MVP: Just simulate payment without contract
        console.log("Contract not deployed yet - simulating payment")
        setTimeout(() => {
          setSessionId("demo-session-" + Date.now())
          setGameActive(true)
          setPaying(false)
        }, 1000)
        return
      }

      // Real contract interaction
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BeexoRunnerABI, signer)

      // Start game and pay entry fee
      const tx = await contract.startGame({
        value: ethers.parseEther(ENTRY_FEE)
      })

      console.log("Transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Get session ID from event
      const event = receipt.logs?.find(log => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'GameStarted'
        } catch {
          return false
        }
      })
      const gameSessionId = event ? contract.interface.parseLog(event).args.sessionId : null

      setSessionId(gameSessionId)
      setGameActive(true)

      // Update balance
      const newBalance = await provider.getBalance(walletAddress)
      setBalance(parseFloat(ethers.formatEther(newBalance)))

    } catch (error) {
      console.error("Payment failed:", error)
      setPaymentError(error.message || "Failed to process payment")
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🚀 Beexo Runner</h1>
        <p className="tagline">Fly, Dodge, Earn!</p>
      </header>

      {!walletAddress ? (
        <WalletConnect onConnect={handleConnect} />
      ) : (
        <>
          <div className="wallet-info">
            <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            <p>Balance: {balance.toFixed(4)} ETH</p>
          </div>

          {!gameActive ? (
            <div className="game-menu">
              <h2>Ready to Play?</h2>
              <div className="entry-fee">
                <p>Entry Fee: <strong>{ENTRY_FEE} ETH</strong></p>
              </div>
              <div className="rewards">
                <h3>Reward Tiers:</h3>
                <ul>
                  <li>🥉 Score 500+: Get entry back</li>
                  <li>🥈 Score 1000+: 2x payout</li>
                  <li>🥇 Score 2000+: 5x payout</li>
                  <li>💎 Score 5000+: 10x payout</li>
                </ul>
              </div>

              {paymentError && (
                <div className="error" style={{
                  background: '#fee',
                  color: '#c33',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  fontSize: '0.9rem'
                }}>
                  {paymentError}
                </div>
              )}

              <button
                className="play-button"
                onClick={handlePayAndPlay}
                disabled={paying}
              >
                {paying ? 'Processing...' : 'Pay & Play'}
              </button>
            </div>
          ) : (
            <Game
              walletAddress={walletAddress}
              provider={provider}
              sessionId={sessionId}
              onGameEnd={() => {
                setGameActive(false)
                setSessionId(null)
              }}
            />
          )}
        </>
      )}

      <footer className="footer">
        <p>Built for XO Connect Challenge</p>
      </footer>
    </div>
  )
}

export default App
