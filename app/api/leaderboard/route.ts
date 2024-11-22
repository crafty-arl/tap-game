import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const LEADERBOARD_PATH = path.join(process.cwd(), 'data', 'leaderboard.json')

// Add type definition
interface Score {
  name: string;
  score: number;
}

interface Leaderboard {
  scores: Score[];
}

async function getLeaderboard(): Promise<Leaderboard> {
  try {
    const data = await fs.readFile(LEADERBOARD_PATH, 'utf-8')
    const parsed = JSON.parse(data)
    // Validate the structure
    return { scores: Array.isArray(parsed.scores) ? parsed.scores : [] }
  } catch {
    return { scores: [] }
  }
}

export async function GET() {
  const leaderboard = await getLeaderboard()
  return NextResponse.json(leaderboard.scores)
}

export async function POST(request: Request) {
  const { name, score } = await request.json()
  
  const leaderboard = await getLeaderboard()
  
  leaderboard.scores.push({ name, score })
  // Sort scores in descending order
  leaderboard.scores.sort((a, b) => b.score - a.score)
  // Keep only top 10 scores
  leaderboard.scores = leaderboard.scores.slice(0, 10)
  
  await fs.writeFile(LEADERBOARD_PATH, JSON.stringify(leaderboard, null, 2))
  
  return NextResponse.json(leaderboard.scores)
}