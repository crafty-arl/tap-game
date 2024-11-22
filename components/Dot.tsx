import { motion } from 'framer-motion'

interface DotProps {
  type: 'good' | 'bad' | 'bonus'
  onClick: (type: 'good' | 'bad' | 'bonus') => void
  isBouncing: boolean
}

export default function Dot({ type, onClick, isBouncing }: DotProps) {
  const colors = {
    good: 'bg-cyan-400 dark:bg-cyan-500',
    bad: 'bg-red-400 dark:bg-red-500',
    bonus: 'bg-yellow-400 dark:bg-yellow-500',
  }

  const handleClick = (type: 'good' | 'bad' | 'bonus') => {
    onClick(type)
  }

  return (
    <motion.button
      className={`w-full h-full rounded-full absolute cursor-pointer ${colors[type]} shadow-lg`}
      onClick={() => handleClick(type)}
      aria-label={`${type} dot`}
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        y: isBouncing ? [0, -10, 0] : 0,
        boxShadow: isBouncing ? [
          '0 0 0 0 rgba(0, 0, 0, 0)',
          '0 0 20px 10px rgba(0, 0, 0, 0.1)',
          '0 0 0 0 rgba(0, 0, 0, 0)'
        ] : '0 0 0 0 rgba(0, 0, 0, 0)'
      }}
      exit={{ scale: 0 }}
      transition={{ 
        scale: { duration: 0.2 },
        y: isBouncing ? { repeat: Infinity, duration: 0.5 } : {},
        boxShadow: isBouncing ? { repeat: Infinity, duration: 0.5 } : {}
      }}
      whileTap={{ scale: 0.9 }}
    />
  )
}
