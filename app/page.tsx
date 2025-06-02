"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { GameHeader } from "@/components/game-header";
import { StatusPanel } from "@/components/status-panel";
import { PatternDisplay } from "@/components/pattern-display";
import { DNAStrand } from "@/components/dna-strand";
import { GameMenu } from "@/components/game-menu";
import { GameOver } from "@/components/game-over";
import { SpeedIndicator } from "@/components/speed-indicator";
import { useSound } from "@/hooks/use-sound";
import { findExactMatches } from "@/utils/z-algorithm";
import { generateDNA, calculateSpeedBonus } from "@/game-utils/game-utils";
import { Dna } from "lucide-react";

export default function MutationChase() {
  // Add a state to track client-side hydration
  const [isHydrated, setIsHydrated] = useState(false);

  // Set hydration state after initial render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [isPending, startTransition] = useTransition();
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu");
  const [pattern, setPattern] = useState("");
  const [strand, setStrand] = useState("");
  const [exactMatchPositions, setExactMatchPositions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(30);
  const [maxTime, setMaxTime] = useState(30);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dangerScore, setDangerScore] = useState(0);
  const [selectedBases, setSelectedBases] = useState<Set<number>>(new Set());
  const [completedMatches, setCompletedMatches] = useState<Set<number>>(new Set());
  const [incorrectBases, setIncorrectBases] = useState<Set<number>>(new Set());
  const [partialMatches, setPartialMatches] = useState<Map<number, Set<number>>>(new Map());
  const [gameOverReason, setGameOverReason] = useState<"time" | "danger">("time");

  // Speed bonus tracking
  const [patternStartTimes, setPatternStartTimes] = useState<
    Map<number, number>
  >(new Map());
  const [currentPatternStart, setCurrentPatternStart] = useState<number | null>(
    null
  );
  const [currentSpeedBonus, setCurrentSpeedBonus] = useState(1.0);
  const [activePatternElapsed, setActivePatternElapsed] = useState(0);

  // Sound effects
  const {
    playCorrectSound,
    playWrongSound,
    playLevelUpSound,
    playGameOverSound,
    playPatternCompleteSound,
  } = useSound();

  // Start new game
  const startGame = useCallback(() => {
    startTransition(() => {
      const newPattern = generateDNA(4 + Math.floor(level / 3));
      const strandLength = 30 + level * 5;
      let newStrand = generateDNA(strandLength);

      // Insert exact matches
      const exactMatches = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < exactMatches; i++) {
        const pos = Math.floor(
          Math.random() * (newStrand.length - newPattern.length)
        );
        newStrand =
          newStrand.substring(0, pos) +
          newPattern +
          newStrand.substring(pos + newPattern.length);
      }

      const matches = findExactMatches(newPattern, newStrand);
      const newMaxTime = Math.max(15, 30 - level * 2); // Minimum 15 seconds and scales with level 

      setPattern(newPattern);
      setStrand(newStrand);
      setExactMatchPositions(matches);
      setGameState("playing");
      setTimeLeft(newMaxTime);
      setMaxTime(newMaxTime);
      setSelectedBases(new Set());
      setCompletedMatches(new Set());
      setIncorrectBases(new Set());
      setPartialMatches(new Map());
      setPatternStartTimes(new Map());
      setCurrentPatternStart(null);
      setCurrentSpeedBonus(1.0);
      setActivePatternElapsed(0);
    });
  }, [level]);

  // Handle base click
  const handleBaseClick = useCallback(
    (position: number) => {
      if (
        selectedBases.has(position) ||
        completedMatches.has(position) ||
        incorrectBases.has(position)
      )
        return;

      // Check if this position is part of any exact match
      let belongsToMatch = false;
      let matchStartPos = -1;

      for (const matchPos of exactMatchPositions) {
        if (position >= matchPos && position < matchPos + pattern.length) {
          belongsToMatch = true;
          matchStartPos = matchPos;
          break;
        }
      }

      if (belongsToMatch) {
        playCorrectSound();

        // Start timing if this is the first base of a new pattern
        const newPatternStartTimes = new Map(patternStartTimes);
        if (!newPatternStartTimes.has(matchStartPos)) {
          newPatternStartTimes.set(matchStartPos, Date.now());
          setPatternStartTimes(newPatternStartTimes);
          setCurrentPatternStart(Date.now());
        }

        // Add to selected bases
        const newSelectedBases = new Set(selectedBases);
        newSelectedBases.add(position);
        setSelectedBases(newSelectedBases);

        // Update partial matches
        const newPartialMatches = new Map(partialMatches);
        if (!newPartialMatches.has(matchStartPos)) {
          newPartialMatches.set(matchStartPos, new Set());
        }
        newPartialMatches.get(matchStartPos)!.add(position);
        setPartialMatches(newPartialMatches);

        // Check if the entire match is completed
        const selectedInThisMatch = newPartialMatches.get(matchStartPos)!;
        if (selectedInThisMatch.size === pattern.length) {
          playPatternCompleteSound();

          // Calculate completion time and speed bonus
          const startTime = newPatternStartTimes.get(matchStartPos)!;
          const completionTime = (Date.now() - startTime) / 1000;
          const speedMultiplier = calculateSpeedBonus(completionTime);
          const basePoints = 200 * level;
          const bonusPoints = Math.floor(basePoints * speedMultiplier);

          // Complete match found
          const newCompletedMatches = new Set(completedMatches);
          newCompletedMatches.add(matchStartPos);
          setCompletedMatches(newCompletedMatches);

          // Remove from partial matches
          newPartialMatches.delete(matchStartPos);
          setPartialMatches(newPartialMatches);

          // Reset current pattern timing
          setCurrentPatternStart(null);
          setActivePatternElapsed(0);

          // Award points with speed bonus
          setScore((prev) => prev + bonusPoints);

          // Check if all matches are completed
          if (newCompletedMatches.size === exactMatchPositions.size) {
            setTimeout(() => {
              playLevelUpSound();
              setLevel((prev) => prev + 1);
              startGame();
            }, 1500);
          }
        } else {
          // Partial match - award small points
          setScore((prev) => prev + 10 * level);
        }
      } else {
        playWrongSound();

        // Wrong selection
        const newIncorrectBases = new Set(incorrectBases);
        newIncorrectBases.add(position);
        setIncorrectBases(newIncorrectBases);
        setDangerScore((prev) => Math.min(100, prev + 10));
        setScore((prev) => Math.max(0, prev - 50));

        // Reset current pattern timing if active
        setCurrentPatternStart(null);
        setActivePatternElapsed(0);
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
    ]
  );

  // Update current speed bonus based on active pattern
  const handleTimeUpdate = useCallback((elapsed: number) => {
    setActivePatternElapsed(elapsed);
    setCurrentSpeedBonus(calculateSpeedBonus(elapsed));
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    // First reset all game state
    setScore(0);
    setLevel(1);
    setDangerScore(0);
    setSelectedBases(new Set());
    setCompletedMatches(new Set());
    setIncorrectBases(new Set());
    setPartialMatches(new Map());
    setPatternStartTimes(new Map());
    setCurrentPatternStart(null);
    setCurrentSpeedBonus(1.0);
    setActivePatternElapsed(0);

    // Start new game immediately
    startGame();
  }, [startGame]);

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGameState("menu");
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && dangerScore < 100) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      playGameOverSound();
      setGameOverReason("time");
      setGameState("gameOver");
    } else if (dangerScore >= 100) {
      playGameOverSound();
      setGameOverReason("danger");
      setGameState("gameOver");
    }
  }, [gameState, timeLeft, dangerScore, playGameOverSound]);

  // Show loading state or nothing until client-side hydration is complete
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
        <Dna className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
        <div className="text-white text-3xl font-semibold font-rajdhani">
          Loading game...
        </div>
      </div>
    );
  }

  if (gameState === "menu") {
    return <GameMenu onStartGame={startGame} isPending={isPending} />;
  }

  if (gameState === "gameOver") {
    return (
      <GameOver
        score={score}
        level={level}
        onRestart={restartGame}
        onReturnToMenu={returnToMenu}
        reason={gameOverReason}
      />
    );
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
  );
}
