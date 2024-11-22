interface TimerProps {
  timeLeft: number
}

export default function Timer({ timeLeft }: TimerProps) {
  return (
    <div className="text-lg sm:text-2xl font-bold mb-2 sm:mb-0 bg-background border-2 border-primary p-2 rounded">
      Time: {timeLeft}s
    </div>
  )
}

