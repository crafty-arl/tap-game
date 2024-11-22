'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface EndScreenProps {
  score: number
  onPlayAgain: () => void
  onSubmitScore: () => void
}

export default function EndScreen({ score, onPlayAgain, onSubmitScore }: EndScreenProps) {
  const router = useRouter()

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-4 sm:p-6">
      <div className="text-center mb-2 sm:mb-4">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          Game Over!
        </motion.h2>
        <motion.p 
          className="text-xl sm:text-2xl text-black/80 dark:text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Final Score: <span className="font-bold">{score}</span>
        </motion.p>
      </div>

      <motion.div 
        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-3 sm:p-4 bg-arcade-orange hover:bg-arcade-orange/90 
                     text-white font-bold rounded-xl shadow-lg 
                     transition-colors duration-200 text-sm sm:text-base"
          onClick={() => {
            onPlayAgain()
            router.push('/')
          }}
        >
          Play Again
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-3 sm:p-4 bg-arcade-pink hover:bg-arcade-pink/90 
                     text-white font-bold rounded-xl shadow-lg 
                     transition-colors duration-200 text-sm sm:text-base"
          onClick={onSubmitScore}
        >
          Submit Score
        </motion.button>
      </motion.div>
    </div>
  )
}
