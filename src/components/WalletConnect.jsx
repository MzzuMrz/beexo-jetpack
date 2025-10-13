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
      // Try XO Connect first (for Beexo Wallet)
      try {
        console.log('Attempting XO Connect...')
        const xoProvider = new ethers.BrowserProvider(
          new XOConnectProvider(),
          'any'
        )
        setIsBeexoWallet(true)

        await xoProvider.send('eth_requestAccounts', [])
        const signer = await xoProvider.getSigner()
        const address = await signer.getAddress()

        // Get client info from Beexo Wallet
        try {
          const client = await XOConnect.getClient()
          console.log('Connected to Beexo Wallet:', client.alias)
          console.log('Available currencies:', client.currencies)
        } catch (e) {
          console.log('Could not fetch client info:', e)
        }

        onConnect(address, xoProvider)
        return
      } catch (xoError) {
        console.log('XO Connect not available, trying MetaMask...', xoError)

        // Fallback to MetaMask
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

        setError('Please use Beexo Wallet or install MetaMask')
      }
    } catch (err) {
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
