'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Dot from './Dot'
import StartScreen from './StartScreen'
import EndScreen from './EndScreen'
import NameEntry from './NameEntry'
import Leaderboard from './Leaderboard'
import { useRouter } from 'next/navigation'

type GameState = 'start' | 'playing' | 'end' | 'name_entry' | 'leaderboard'
type DotType = 'good' | 'bad' | 'bonus'

interface DotInfo {
  id: number
  type: DotType
  gridPosition: number
  isBouncing: boolean
}

const ROUND_DURATION = 30 // seconds
const ROUNDS = 3
const GRID_SIZE = 16 // 4x4 grid

export default function Game() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION)
  const [round, setRound] = useState(1)
  const [dots, setDots] = useState<DotInfo[]>([])
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number}[]>([])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      setLeaderboard(data || [])
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      setLeaderboard([])
    }
  }

  const handleNameSubmit = async (name: string) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      })
      const data = await response.json()
      setLeaderboard(data || [])
      setGameState('leaderboard')
    } catch (error) {
      console.error('Failed to submit score:', error)
      setGameState('leaderboard')
    }
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(ROUND_DURATION)
    setRound(1)
  }

  const endGame = useCallback(() => {
    setGameState('name_entry')
  }, [])

  const nextRound = useCallback(() => {
    if (round < ROUNDS) {
      setRound(round + 1)
      setTimeLeft(ROUND_DURATION)
    } else {
      endGame()
    }
  }, [round, endGame])

  const handleDotClick = useCallback((type: DotType) => {
    switch (type) {
      case 'good':
        setScore((prevScore) => prevScore + 10)
        break
      case 'bonus':
        setScore((prevScore) => prevScore + 20)
        break
      case 'bad':
        setScore((prevScore) => Math.max(0, prevScore - 15))
        break
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            nextRound()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState, nextRound])

  useEffect(() => {
    if (gameState === 'playing') {
      const createDot = () => {
        const newDot: DotInfo = {
          id: Date.now(),
          type: Math.random() < 0.1 ? 'bonus' : Math.random() < 0.2 ? 'bad' : 'good',
          gridPosition: Math.floor(Math.random() * GRID_SIZE),
          isBouncing: round > 1 && Math.random() < 0.3, // 30% chance of bouncing in rounds 2 and 3
        }
        setDots((prevDots) => [...prevDots, newDot])
        setTimeout(() => {
          setDots((prevDots) => prevDots.filter((dot) => dot.id !== newDot.id))
        }, 2000 - round * 300) // Dots disappear faster in later rounds
      }

      const dotInterval = setInterval(createDot, 1000 - round * 100) // Dots appear more frequently in later rounds
      return () => clearInterval(dotInterval)
    }
  }, [gameState, round])

  useEffect(() => {
    if (gameState === 'leaderboard') {
      fetchLeaderboard()
    }
  }, [gameState])

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center gap-4 sm:gap-8 py-4 sm:py-8">
      {/* Instructions Panel - Always visible when not playing */}
      {gameState !== 'playing' && gameState !== 'leaderboard' && (
        <div className="w-full max-w-sm sm:max-w-md bg-white/80 dark:bg-black/80 p-4 sm:p-6 rounded-2xl backdrop-blur-sm border-2 border-black dark:border-white">
          <h2 className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-black dark:text-white neon-text">
            How to Play
          </h2>
          <div className="space-y-2 sm:space-y-4 text-xs sm:text-sm md:text-base text-black dark:text-white font-sans">
            <p className="leading-relaxed">
              🎮 Click on dots as they appear
            </p>
            <p className="leading-relaxed">
              🎯 Green dots: +10 points
            </p>
            <p className="leading-relaxed">
              ⭐ Gold dots: +20 points (bonus!)
            </p>
            <p className="leading-relaxed">
              ❌ Red dots: -15 points (avoid these!)
            </p>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black/10 dark:bg-white/10 rounded-lg">
              <p className="text-2xs sm:text-xs md:text-sm font-bold">
                Pro Tip: Dots disappear faster in later rounds!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-arcade-orange/20 to-arcade-pink/20 dark:from-arcade-orange/10 dark:to-arcade-pink/10 blur-xl rounded-3xl" />
        <div className="relative bg-white/40 dark:bg-black/40 p-3 sm:p-4 md:p-8 rounded-3xl border-4 border-black dark:border-white backdrop-blur-sm">
          {gameState === 'start' && (
            <StartScreen 
              onStart={startGame} 
              onViewLeaderboard={() => {
                router.push('/leaderboard')
              }} 
            />
          )}
          
          {gameState === 'playing' && (
            <>
              {/* Updated Stats Bar */}
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-black/10 dark:bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/20 dark:bg-black/20 border border-black/10 dark:border-white/10">
                    <span className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60">Time</span>
                    <span className="text-lg sm:text-xl font-bold text-black dark:text-white" role="timer" aria-label={`${timeLeft} seconds remaining`}>
                      {timeLeft}s
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/20 dark:bg-black/20 border border-black/10 dark:border-white/10">
                    <span className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60">Score</span>
                    <span className="text-lg sm:text-xl font-bold text-black dark:text-white" role="status" aria-label={`Current score: ${score}`}>
                      {score}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/20 dark:bg-black/20 border border-black/10 dark:border-white/10">
                    <span className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60">Round</span>
                    <span className="text-lg sm:text-xl font-bold text-black dark:text-white" role="status" aria-label={`Round ${round} of ${ROUNDS}`}>
                      {round}/{ROUNDS}
                    </span>
                  </div>
                </div>
              </div>

              {/* Game Grid */}
              <div className="aspect-square bg-secondary rounded-lg shadow-lg grid grid-cols-4 gap-0.5 sm:gap-1 p-0.5 sm:p-1 relative">
                {Array.from({ length: GRID_SIZE }).map((_, index) => (
                  <div key={index} className="aspect-square relative">
                    <AnimatePresence>
                      {dots.find((dot) => dot.gridPosition === index) && (
                        <Dot
                          key={dots.find((dot) => dot.gridPosition === index)?.id}
                          type={dots.find((dot) => dot.gridPosition === index)?.type || 'good'}
                          onClick={handleDotClick}
                          isBouncing={dots.find((dot) => dot.gridPosition === index)?.isBouncing || false}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </>
          )}

          {gameState === 'name_entry' && (
            <NameEntry onNameSubmit={handleNameSubmit} />
          )}

          {gameState === 'leaderboard' && (
            <Leaderboard
              scores={leaderboard}
              onClose={() => setGameState('start')}
              currentScore={score}
            />
          )}

          {gameState === 'end' && (
            <div className="w-full">
              <EndScreen
                score={score}
                onPlayAgain={() => {
                  setGameState('start')
                  startGame()
                }}
                onSubmitScore={() => setGameState('name_entry')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
