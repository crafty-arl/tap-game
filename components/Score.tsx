interface ScoreProps {
  score: number
}

export default function Score({ score }: ScoreProps) {
  return (
    <div className="text-lg sm:text-2xl font-bold mb-2 sm:mb-0 bg-background border-2 border-primary p-2 rounded">
      Score: {score}
    </div>
  )
}

