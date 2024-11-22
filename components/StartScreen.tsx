'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface StartScreenProps {
  onStart: () => void
  onViewLeaderboard: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-center text-black dark:text-white mb-3 neon-text"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          TAP MASTER
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-black/80 dark:text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Test your speed. Beat the clock. Top the leaderboard.
        </motion.p>
      </div>

      <motion.div
        className="w-full max-w-sm space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onStart}
          className="w-full px-8 py-4 text-lg sm:text-xl font-bold text-white bg-arcade-orange hover:bg-arcade-orange/90 rounded-xl shadow-lg transition-colors relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">START GAME</span>
          <div className="absolute inset-0 bg-gradient-to-r from-arcade-orange to-arcade-pink opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <Link
          href="/leaderboard"
          className="block w-full"
        >
          <motion.div
            className="w-full px-8 py-4 text-lg sm:text-xl font-bold text-white bg-arcade-pink hover:bg-arcade-pink/90 rounded-xl shadow-lg text-center transition-colors relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">LEADERBOARD</span>
            <div className="absolute inset-0 bg-gradient-to-r from-arcade-pink to-arcade-orange opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </Link>
      </motion.div>

      <motion.div 
        className="text-center text-sm text-black/60 dark:text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>A No-Code Open Source Project</p>
        <p>by Craft The Future</p>
      </motion.div>
    </div>
  )
}
