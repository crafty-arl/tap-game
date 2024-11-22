import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface NameEntryProps {
  onNameSubmit: (name: string) => void
}

const letters = [' ', ...('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))]

export default function NameEntry({ onNameSubmit }: NameEntryProps) {
  const [name, setName] = useState(['A', 'A', 'A', 'A', 'A'])
  const [currentLetter, setCurrentLetter] = useState(0)

  const handleLetterChange = useCallback((direction: 'up' | 'down') => {
    const newName = [...name]
    let index = letters.indexOf(newName[currentLetter])
    if (direction === 'up') {
      index = (index + 1) % letters.length
    } else {
      index = (index - 1 + letters.length) % letters.length
    }
    newName[currentLetter] = letters[index]
    setName(newName)
  }, [name, currentLetter])

  const handleSubmit = useCallback(() => {
    onNameSubmit(name.join(''))
  }, [name, onNameSubmit])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        handleLetterChange(e.key === 'ArrowUp' ? 'up' : 'down')
      } else if (e.key === 'ArrowRight') {
        setCurrentLetter((prev) => (prev + 1) % 5)
      } else if (e.key === 'ArrowLeft') {
        setCurrentLetter((prev) => (prev - 1 + 5) % 5)
      } else if (e.key === 'Enter') {
        handleSubmit()
      } else if (e.key.length === 1 && e.key.match(/[a-z ]/i)) {
        const newName = [...name]
        newName[currentLetter] = e.key.toUpperCase()
        setName(newName)
        setCurrentLetter((prev) => (prev + 1) % 5)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [name, currentLetter, handleLetterChange, handleSubmit])

  return (
    <div className="text-center p-4 bg-background border-2 border-primary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Enter Your Name</h2>
      <div className="flex justify-center space-x-2 mb-4">
        {name.map((letter, index) => (
          <motion.div
            key={index}
            className={`w-12 h-12 flex items-center justify-center text-2xl font-bold border-2 ${
              index === currentLetter ? 'border-primary' : 'border-secondary'
            }`}
            animate={index === currentLetter ? { y: [0, -10, 0] } : { y: 0 }}
            transition={index === currentLetter ? { repeat: Infinity, duration: 1 } : {}}
          >
            {letter}
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
          onClick={() => handleLetterChange('up')}
        >
          ▲
        </button>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
          onClick={() => handleLetterChange('down')}
        >
          ▼
        </button>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Use arrow keys to navigate and change letters. Press Enter to submit.
      </p>
    </div>
  )
}
