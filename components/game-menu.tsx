"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dna } from "lucide-react"

interface GameMenuProps {
  onStartGame: () => void
  isPending: boolean
}

export function GameMenu({ onStartGame, isPending }: GameMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/90 backdrop-blur border-cyan-500/30 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Dna className="w-16 h-16 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2 font-orbitron">Mutation Chase</CardTitle>
          <p className="text-cyan-300 font-rajdhani text-lg">The Viral Escape</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-300 space-y-2 font-rajdhani">
            <p>🧬 A virus is mutating DNA strands!</p>
            <p>🎯 Find EXACT matches using the Z-algorithm</p>
            <p>🔍 Click EVERY base in the pattern sequence</p>
            <p>⚠️ Wrong clicks increase danger - game ends at 100%!</p>
            <p>⏱️ Race against time before the virus escapes!</p>
          </div>
          <Button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 font-rajdhani font-semibold"
            disabled={isPending}
          >
            {isPending ? "Initializing..." : "Start Mission"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
