import { motion } from 'framer-motion'

interface Score {
  name: string;
  score: number;
}

interface LeaderboardProps {
  scores?: Score[];
  onClose: () => void;
  currentScore?: number;
}

export default function Leaderboard({ scores = [], onClose, currentScore }: LeaderboardProps) {
  const sortedScores = Array.isArray(scores) ? [...scores].sort((a, b) => b.score - a.score) : [];

  const currentScoreIndex = currentScore 
    ? sortedScores.findIndex(score => score.score <= currentScore)
    : -1

  let startIndex = 0
  if (currentScoreIndex !== -1) {
    startIndex = Math.max(0, Math.min(
      currentScoreIndex - 4,
      sortedScores.length - 8
    ))
  }
  
  const displayScores = sortedScores.slice(startIndex, startIndex + 8)

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-background border-2 border-primary p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">High Scores</h2>
        <div className="max-h-[60vh] overflow-y-auto">
          {displayScores.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-2">Rank</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-right py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {displayScores.map((entry, index) => {
                  const actualRank = startIndex + index + 1
                  const isCurrentScore = currentScore && entry.score === currentScore
                  return (
                    <tr 
                      key={index} 
                      className={`border-b border-primary/50 ${
                        isCurrentScore ? 'bg-primary/20' : ''
                      }`}
                    >
                      <td className="py-2">{actualRank}</td>
                      <td className="py-2">{entry.name}</td>
                      <td className="py-2 text-right font-bold">{entry.score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-primary/60">No scores yet!</p>
          )}
        </div>
        <button
          className="mt-6 w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
          onClick={onClose}
        >
          Play Again
        </button>
      </div>
    </motion.div>
  )
}
