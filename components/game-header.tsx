"use client"

import { Badge } from "@/components/ui/badge"
import { Dna } from "lucide-react"

interface GameHeaderProps {
  level: number
  score: number
}

export function GameHeader({ level, score }: GameHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Dna className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white font-orbitron">Mutation Chase</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="text-white border-cyan-400 font-mono">
          Level {level}
        </Badge>
        <Badge variant="outline" className="text-white border-emerald-400 font-mono">
          Score: {score}
        </Badge>
      </div>
    </div>
  )
}
