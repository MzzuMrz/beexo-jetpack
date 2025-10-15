import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import Phaser from 'phaser'
import { CONTRACT_ADDRESS, ENTRY_FEE } from '../config/contract'
import BeexoRunnerABI from '../contracts/BeexoRunnerABI.json'
import './Game.css'

function Game({ walletAddress, provider, sessionId, onGameEnd }) {
  const gameRef = useRef(null)
  const phaserGameRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [claimError, setClaimError] = useState('')

  useEffect(() => {
    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: gameRef.current,
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 800 },
          debug: false
        }
      },
      scene: {
        create: createGame,
        update: updateGame
      }
    }

    let player
    let obstacles
    let scoreValue = 0
    let gameOverFlag = false
    let ground
    let cursors

    function createGame() {
      const scene = this

      // Create ground
      ground = scene.add.rectangle(400, 380, 800, 40, 0x8B4513)
      scene.physics.add.existing(ground, true)

      // Create player (simple jetpack character)
      player = scene.add.circle(100, 300, 20, 0xFF6B6B)
      scene.physics.add.existing(player)
      player.body.setCollideWorldBounds(true)

      // Create obstacle group
      obstacles = scene.physics.add.group()

      // Score text
      const scoreText = scene.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
      })

      // Instructions
      scene.add.text(400, 50, 'SPACE or CLICK to FLY', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3
      }).setOrigin(0.5)

      // Add collision
      scene.physics.add.collider(player, ground)
      scene.physics.add.overlap(player, obstacles, hitObstacle, null, scene)

      // Controls
      cursors = scene.input.keyboard.createCursorKeys()
      scene.input.on('pointerdown', () => {
        if (!gameOverFlag && player.body) {
          player.body.setVelocityY(-400)
        }
      })

      // Spawn obstacles periodically
      scene.time.addEvent({
        delay: 1500,
        callback: spawnObstacle,
        callbackScope: scene,
        loop: true
      })

      // Update score
      scene.time.addEvent({
        delay: 100,
        callback: () => {
          if (!gameOverFlag) {
            scoreValue += 10
            scoreText.setText('Score: ' + scoreValue)
            setScore(scoreValue)
          }
        },
        loop: true
      })

      function spawnObstacle() {
        if (gameOverFlag) return

        const height = Phaser.Math.Between(50, 150)
        const obstacle = scene.add.rectangle(850, 350 - height/2, 30, height, 0x8B0000)
        scene.physics.add.existing(obstacle)
        obstacles.add(obstacle)
        obstacle.body.setVelocityX(-250)
        obstacle.body.setAllowGravity(false)
      }

      function hitObstacle() {
        if (gameOverFlag) return

        gameOverFlag = true

        // Visual feedback - change player color
        if (player.setFillStyle) {
          player.setFillStyle(0xff0000)
        }

        scene.physics.pause()

        setFinalScore(scoreValue)
        setGameOver(true)
      }
    }

    function updateGame() {
      if (gameOverFlag) return

      // Fly up when space is pressed
      if (cursors.space.isDown && player.body) {
        player.body.setVelocityY(-400)
      }

      // Remove obstacles that go off screen
      obstacles.children.entries.forEach(obstacle => {
        if (obstacle.x < -50) {
          obstacle.destroy()
        }
      })
    }

    // Initialize Phaser game
    phaserGameRef.current = new Phaser.Game(config)

    // Cleanup
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
      }
    }
  }, [])

  const handleClaimReward = async () => {
    if (!provider || !sessionId) {
      console.log("No provider or session ID - simulating reward")
      setRewardClaimed(true)
      return
    }

    setClaiming(true)
    setClaimError('')

    try {
      // Check if contract is deployed
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // For MVP: Just simulate claiming
        console.log("Contract not deployed - simulating claim")
        setTimeout(() => {
          setRewardClaimed(true)
          setClaiming(false)
        }, 1000)
        return
      }

      // Real contract interaction
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BeexoRunnerABI, signer)

      // Claim rewards
      const tx = await contract.endGame(sessionId, finalScore)
      console.log("Claim transaction sent:", tx.hash)

      const receipt = await tx.wait()
      console.log("Claim confirmed:", receipt)

      setRewardClaimed(true)

      // Check for payout event
      const event = receipt.logs?.find(log => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'GameEnded'
        } catch {
          return false
        }
      })
      if (event) {
        const parsed = contract.interface.parseLog(event)
        const payout = parsed.args?.payout
        console.log("Payout received:", ethers.formatEther(payout), "ETH")
      }

    } catch (error) {
      console.error("Claim failed:", error)
      setClaimError(error.message || "Failed to claim rewards")
    } finally {
      setClaiming(false)
    }
  }

  const handlePlayAgain = () => {
    onGameEnd()
  }

  const getRewardTier = (score) => {
    if (score >= 5000) return { tier: '💎 Diamond', multiplier: '10x', amount: '0.01 ETH' }
    if (score >= 2000) return { tier: '🥇 Gold', multiplier: '5x', amount: '0.005 ETH' }
    if (score >= 1000) return { tier: '🥈 Silver', multiplier: '2x', amount: '0.002 ETH' }
    if (score >= 500) return { tier: '🥉 Bronze', multiplier: '1x', amount: '0.001 ETH' }
    return { tier: '❌ No Reward', multiplier: '0x', amount: '0 ETH' }
  }

  return (
    <div className="game-container">
      {!gameOver ? (
        <>
          <div className="game-header">
            <div className="score-display">
              Score: <span>{score}</span>
            </div>
          </div>
          <div ref={gameRef} className="game-canvas" />
        </>
      ) : (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <div className="final-score">
            <p>Final Score</p>
            <h1>{finalScore}</h1>
          </div>

          <div className="reward-info">
            {(() => {
              const reward = getRewardTier(finalScore)
              return (
                <>
                  <h3>Reward Tier: {reward.tier}</h3>
                  <p className="multiplier">{reward.multiplier}</p>
                  <p className="amount">{reward.amount}</p>
                </>
              )
            })()}
          </div>

          {claimError && (
            <div className="error" style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {claimError}
            </div>
          )}

          {rewardClaimed && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              ✅ Reward claimed successfully!
            </div>
          )}

          <div className="action-buttons">
            {/* Show Claim button only if score >= 500 and not claimed yet */}
            {!rewardClaimed && finalScore >= 500 && (
              <button
                className="play-again-button"
                onClick={handleClaimReward}
                disabled={claiming}
              >
                {claiming ? 'Claiming...' : 'Claim Reward'}
              </button>
            )}

            {/* Always show a button to continue */}
            <button
              className={finalScore < 500 || rewardClaimed ? "play-again-button" : "exit-button"}
              onClick={handlePlayAgain}
            >
              {finalScore < 500 ? 'Try Again' : rewardClaimed ? 'Play Again' : 'Back to Menu'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
