import { useState } from 'react'
import { XOConnectProvider, XOConnect } from 'xo-connect'
import { ethers } from 'ethers'
import './WalletConnect.css'

function WalletConnect({ onConnect }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isBeexoWallet, setIsBeexoWallet] = useState(false)

  const connectWallet = async () => {
    setLoading(true)
    setError('')

    try {
      // Check if we're in Beexo Wallet environment
      // XO Connect only works inside Beexo Wallet app
      let isInBeexoWallet = false

      try {
        // Try to get client info - this only works in Beexo Wallet
        const client = await XOConnect.getClient()
        isInBeexoWallet = true
        console.log('Running in Beexo Wallet:', client.alias)
      } catch (e) {
        console.log('Not in Beexo Wallet, using MetaMask')
      }

      if (isInBeexoWallet) {
        // Use XO Connect (only works in Beexo Wallet)
        try {
          const xoProvider = new ethers.BrowserProvider(
            new XOConnectProvider(),
            'any'
          )
          setIsBeexoWallet(true)

          await xoProvider.send('eth_requestAccounts', [])
          const signer = await xoProvider.getSigner()
          const address = await signer.getAddress()

          const client = await XOConnect.getClient()
          console.log('Connected to Beexo Wallet:', client.alias)
          console.log('Available currencies:', client.currencies)

          onConnect(address, xoProvider)
          return
        } catch (xoError) {
          console.error('XO Connect error:', xoError)
          setError('Failed to connect with Beexo Wallet')
          setLoading(false)
          return
        }
      }

      // Use MetaMask (for regular browsers)
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })

        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          onConnect(accounts[0], provider)
          return
        }
      }

      setError('Please install MetaMask or use Beexo Wallet')
    } catch (err) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wallet-connect">
      <div className="connect-card">
        <div className="icon">🎮</div>
        <h2>Connect Your Wallet</h2>
        <p>Connect with Beexo Wallet or MetaMask to start playing</p>

        {!isBeexoWallet && (
          <div style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            <strong>ℹ️ Testing locally?</strong><br/>
            XO Connect only works inside Beexo Wallet app.
            Use MetaMask for local testing, or deploy and open in Beexo Wallet.
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <button
          className="connect-button"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>

        <div className="info">
          <p>Make sure you're on a supported network:</p>
          <div className="networks">
            <span>Polygon</span>
            <span>Arbitrum</span>
            <span>BNB Chain</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletConnect
