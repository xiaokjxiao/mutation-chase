"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { GameHeader } from "@/components/game-header"
import { StatusPanel } from "@/components/status-panel"
import { PatternDisplay } from "@/components/pattern-display"
import { DNAStrand } from "@/components/dna-strand"
import { GameMenu } from "@/components/game-menu"
import { GameOver } from "@/components/game-over"
import { SpeedIndicator } from "@/components/speed-indicator"
import { useSound } from "@/hooks/use-sound"

// Z-algorithm implementation
function zAlgorithm(s: string): number[] {
  const n = s.length
  const z = new Array(n).fill(0)
  let l = 0,
    r = 0

  for (let i = 1; i < n; i++) {
    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l])
    }
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++
    }
    if (i + z[i] - 1 > r) {
      l = i
      r = i + z[i] - 1
    }
  }

  return z
}

// Generate random DNA sequence
function generateDNA(length: number): string {
  const bases = ["A", "T", "G", "C"]
  return Array.from({ length }, () => bases[Math.floor(Math.random() * bases.length)]).join("")
}

// Calculate speed bonus multiplier
function calculateSpeedBonus(completionTime: number): number {
  if (completionTime < 3) return 3.0
  if (completionTime < 6) return 2.0
  if (completionTime < 10) return 1.5
  return 1.0
}

export default function MutationChase() {
  const [isPending, startTransition] = useTransition()
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [pattern, setPattern] = useState("")
  const [strand, setStrand] = useState("")
  const [exactMatchPositions, setExactMatchPositions] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(30)
  const [maxTime, setMaxTime] = useState(30)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [dangerScore, setDangerScore] = useState(0)
  const [selectedBases, setSelectedBases] = useState<Set<number>>(new Set())
  const [completedMatches, setCompletedMatches] = useState<Set<number>>(new Set())
  const [incorrectBases, setIncorrectBases] = useState<Set<number>>(new Set())
  const [partialMatches, setPartialMatches] = useState<Map<number, Set<number>>>(new Map())
  const [gameOverReason, setGameOverReason] = useState<"time" | "danger">("time")

  // Speed bonus tracking
  const [patternStartTimes, setPatternStartTimes] = useState<Map<number, number>>(new Map())
  const [currentPatternStart, setCurrentPatternStart] = useState<number | null>(null)
  const [currentSpeedBonus, setCurrentSpeedBonus] = useState(1.0)
  const [activePatternElapsed, setActivePatternElapsed] = useState(0)

  // Sound effects
  const { playCorrectSound, playWrongSound, playLevelUpSound, playGameOverSound, playPatternCompleteSound } = useSound()

  // Find exact matches using Z-algorithm
  const findExactMatches = useCallback((p: string, s: string): Set<number> => {
    const combined = p + "$" + s
    const z = zAlgorithm(combined)
    const patternLength = p.length
    const matches = new Set<number>()

    for (let i = patternLength + 1; i < z.length; i++) {
      if (z[i] === patternLength) {
        matches.add(i - patternLength - 1)
      }
    }

    return matches
  }, [])

  // Start new game
  const startGame = useCallback(() => {
    startTransition(() => {
      const newPattern = generateDNA(4 + Math.floor(level / 3))
      const strandLength = 30 + level * 5
      let newStrand = generateDNA(strandLength)

      // Insert exact matches
      const exactMatches = Math.floor(Math.random() * 2) + 2
      for (let i = 0; i < exactMatches; i++) {
        const pos = Math.floor(Math.random() * (newStrand.length - newPattern.length))
        newStrand = newStrand.substring(0, pos) + newPattern + newStrand.substring(pos + newPattern.length)
      }

      const matches = findExactMatches(newPattern, newStrand)
      const newMaxTime = Math.max(15, 30 - level * 2)

      setPattern(newPattern)
      setStrand(newStrand)
      setExactMatchPositions(matches)
      setGameState("playing")
      setTimeLeft(newMaxTime)
      setMaxTime(newMaxTime)
      setSelectedBases(new Set())
      setCompletedMatches(new Set())
      setIncorrectBases(new Set())
      setPartialMatches(new Map())
      setPatternStartTimes(new Map())
      setCurrentPatternStart(null)
      setCurrentSpeedBonus(1.0)
      setActivePatternElapsed(0)
    })
  }, [level, findExactMatches])

  // Handle base click
  const handleBaseClick = useCallback(
    (position: number) => {
      if (selectedBases.has(position) || completedMatches.has(position) || incorrectBases.has(position)) return

      // Check if this position is part of any exact match
      let belongsToMatch = false
      let matchStartPos = -1

      for (const matchPos of exactMatchPositions) {
        if (position >= matchPos && position < matchPos + pattern.length) {
          belongsToMatch = true
          matchStartPos = matchPos
          break
        }
      }

      if (belongsToMatch) {
        playCorrectSound()

        // Start timing if this is the first base of a new pattern
        const newPatternStartTimes = new Map(patternStartTimes)
        if (!newPatternStartTimes.has(matchStartPos)) {
          newPatternStartTimes.set(matchStartPos, Date.now())
          setPatternStartTimes(newPatternStartTimes)
          setCurrentPatternStart(Date.now())
        }

        // Add to selected bases
        const newSelectedBases = new Set(selectedBases)
        newSelectedBases.add(position)
        setSelectedBases(newSelectedBases)

        // Update partial matches
        const newPartialMatches = new Map(partialMatches)
        if (!newPartialMatches.has(matchStartPos)) {
          newPartialMatches.set(matchStartPos, new Set())
        }
        newPartialMatches.get(matchStartPos)!.add(position)
        setPartialMatches(newPartialMatches)

        // Check if the entire match is completed
        const selectedInThisMatch = newPartialMatches.get(matchStartPos)!
        if (selectedInThisMatch.size === pattern.length) {
          playPatternCompleteSound()

          // Calculate completion time and speed bonus
          const startTime = newPatternStartTimes.get(matchStartPos)!
          const completionTime = (Date.now() - startTime) / 1000
          const speedMultiplier = calculateSpeedBonus(completionTime)
          const basePoints = 200 * level
          const bonusPoints = Math.floor(basePoints * speedMultiplier)

          // Complete match found
          const newCompletedMatches = new Set(completedMatches)
          newCompletedMatches.add(matchStartPos)
          setCompletedMatches(newCompletedMatches)

          // Remove from partial matches
          newPartialMatches.delete(matchStartPos)
          setPartialMatches(newPartialMatches)

          // Reset current pattern timing
          setCurrentPatternStart(null)
          setActivePatternElapsed(0)

          // Award points with speed bonus
          setScore((prev) => prev + bonusPoints)

          // Check if all matches are completed
          if (newCompletedMatches.size === exactMatchPositions.size) {
            setTimeout(() => {
              playLevelUpSound()
              setLevel((prev) => prev + 1)
              startGame()
            }, 1500)
          }
        } else {
          // Partial match - award small points
          setScore((prev) => prev + 10 * level)
        }
      } else {
        playWrongSound()

        // Wrong selection
        const newIncorrectBases = new Set(incorrectBases)
        newIncorrectBases.add(position)
        setIncorrectBases(newIncorrectBases)
        setDangerScore((prev) => Math.min(100, prev + 15))
        setScore((prev) => Math.max(0, prev - 50))

        // Reset current pattern timing if active
        setCurrentPatternStart(null)
        setActivePatternElapsed(0)
      }
    },
    [
      selectedBases,
      completedMatches,
      incorrectBases,
      exactMatchPositions,
      pattern.length,
      partialMatches,
      patternStartTimes,
      level,
      startGame,
      playCorrectSound,
      playWrongSound,
      playPatternCompleteSound,
      playLevelUpSound,
    ],
  )

  // Update current speed bonus based on active pattern
  const handleTimeUpdate = useCallback((elapsed: number) => {
    setActivePatternElapsed(elapsed)
    setCurrentSpeedBonus(calculateSpeedBonus(elapsed))
  }, [])

  // Restart game
  const restartGame = useCallback(() => {
    setGameState("menu")
    setScore(0)
    setLevel(1)
    setDangerScore(0)
    setSelectedBases(new Set())
    setCompletedMatches(new Set())
    setIncorrectBases(new Set())
    setPartialMatches(new Map())
    setPatternStartTimes(new Map())
    setCurrentPatternStart(null)
    setCurrentSpeedBonus(1.0)
    setActivePatternElapsed(0)
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && dangerScore < 100) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      playGameOverSound()
      setGameOverReason("time")
      setGameState("gameOver")
    } else if (dangerScore >= 100) {
      playGameOverSound()
      setGameOverReason("danger")
      setGameState("gameOver")
    }
  }, [gameState, timeLeft, dangerScore, playGameOverSound])

  if (gameState === "menu") {
    return <GameMenu onStartGame={startGame} isPending={isPending} />
  }

  if (gameState === "gameOver") {
    return <GameOver score={score} level={level} onRestart={restartGame} reason={gameOverReason} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <GameHeader level={level} score={score} />

        <StatusPanel
          timeLeft={timeLeft}
          maxTime={maxTime}
          dangerScore={dangerScore}
          completedMatches={completedMatches.size}
          totalExactMatches={exactMatchPositions.size}
          currentBonus={currentSpeedBonus}
        />

        <PatternDisplay pattern={pattern} />

        <DNAStrand
          strand={strand}
          pattern={pattern}
          onBaseClick={handleBaseClick}
          selectedBases={selectedBases}
          completedMatches={completedMatches}
          incorrectBases={incorrectBases}
          partialMatches={partialMatches}
          patternStartTimes={patternStartTimes}
        />

        <SpeedIndicator
          isActive={currentPatternStart !== null}
          startTime={currentPatternStart}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  )
}
