interface RoundProps {
  round: number
}

export default function Round({ round }: RoundProps) {
  return (
    <div className="text-lg sm:text-2xl font-bold bg-background border-2 border-primary p-2 rounded">
      Round: {round}/3
    </div>
  )
}

