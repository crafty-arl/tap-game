'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Create a separate component for the content that uses useSearchParams
function LeaderboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([])
  const [playerName, setPlayerName] = useState('')
  const score = searchParams.get('score')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const scoresPerPage = 5

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      setLeaderboard(data.scores)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  }

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!score || !playerName.trim()) return

    setIsSubmitting(true)
    try {
      const newScore = { name: playerName.trim(), score: parseInt(score) }
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      const updatedScores = [...data.scores, newScore].sort((a, b) => b.score - a.score)

      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: updatedScores }),
      })

      await loadLeaderboard()
      setPlayerName('')
      router.push('/leaderboard')
    } catch (error) {
      console.error('Error submitting score:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const indexOfLastScore = currentPage * scoresPerPage
  const indexOfFirstScore = indexOfLastScore - scoresPerPage
  const currentScores = leaderboard.slice(indexOfFirstScore, indexOfLastScore)
  const totalPages = Math.ceil(leaderboard.length / scoresPerPage)

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Leaderboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Last Entered Score */}
          {score && (
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Score</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.form 
                  onSubmit={handleSubmitScore}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-xl font-semibold">Score: {score}</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      maxLength={15}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-arcade-pink hover:bg-arcade-pink/90"
                    >
                      Submit
                    </Button>
                  </div>
                </motion.form>
              </CardContent>
            </Card>
          )}

          {/* Top Players */}
          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentScores.map((entry, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-white/80">
                        #{indexOfFirstScore + index + 1}
                      </span>
                      <span className="text-white">{entry.name}</span>
                    </div>
                    <span className="text-xl font-bold text-arcade-orange">
                      {entry.score}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button className="bg-arcade-orange hover:bg-arcade-orange/90">
              Play Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  )
}