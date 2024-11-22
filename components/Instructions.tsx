import { motion } from 'framer-motion'

export default function Instructions() {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border-2 border-primary p-4 rounded-lg shadow-lg text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-xl font-bold mb-2 text-primary">How to Play</h2>
      <ul className="text-sm">
        <li>Tap <span className="text-cyan-400 dark:text-cyan-500">blue</span> dots for 10 points</li>
        <li>Tap <span className="text-yellow-400 dark:text-yellow-500">yellow</span> dots for 20 points</li>
        <li>Avoid <span className="text-red-400 dark:text-red-500">red</span> dots (-15 points)</li>
        <li>Complete 3 rounds</li>
        <li>Dots move faster in later rounds</li>
      </ul>
    </motion.div>
  )
}

