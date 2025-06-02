"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { PatternDisplay } from "@/components/pattern-display";
import { DNAStrand } from "@/components/dna-strand";
import { GameMenu } from "@/components/game-menu";
import { GameOver } from "@/components/game-over";
import { SpeedIndicator } from "@/components/speed-indicator";
import { GameFooter } from "@/components/game-footer";
import { useSound } from "@/hooks/use-sound";
import { findExactMatches } from "@/utils/z-algorithm";
import { Dna } from "lucide-react";

export default function CrimsonCarmine() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [allPatternsCompleted, setAllPatternsCompleted] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [isPending, startTransition] = useTransition();
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu"
  );
  const [pattern, setPattern] = useState("");
  const [strand, setStrand] = useState("");
  const [exactMatchPositions, setExactMatchPositions] = useState<Set<number>>(
    new Set()
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [maxTime, setMaxTime] = useState(30);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dangerScore, setDangerScore] = useState(0);
  const [selectedBases, setSelectedBases] = useState<Set<number>>(new Set());
  const [completedMatches, setCompletedMatches] = useState<Set<number>>(
    new Set()
  );
  const [incorrectBases, setIncorrectBases] = useState<Set<number>>(new Set());
  const [partialMatches, setPartialMatches] = useState<
    Map<number, Set<number>>
  >(new Map());
  const [gameOverReason, setGameOverReason] = useState<"time" | "danger">(
    "time"
  );
  const [isIntentionalGameEnd, setIsIntentionalGameEnd] = useState(false);

  const [patternStartTimes, setPatternStartTimes] = useState<
    Map<number, number>
  >(new Map());
  const [currentPatternStart, setCurrentPatternStart] = useState<number | null>(
    null
  );
  const [currentSpeedBonus, setCurrentSpeedBonus] = useState(1.0);
  const [activePatternElapsed, setActivePatternElapsed] = useState(0);

  const {
    playCorrectSound,
    playWrongSound,
    playLevelUpSound,
    playGameOverSound,
    playPatternCompleteSound,
  } = useSound();

  function generateDNA(length: number): string {
    const bases = ["A", "T", "G", "C"];
    return Array.from(
      { length },
      () => bases[Math.floor(Math.random() * bases.length)]
    ).join("");
  }

  function calculateSpeedBonus(completionTime: number): number {
    if (completionTime < 3) return 3.0;
    if (completionTime < 6) return 2.0;
    if (completionTime < 10) return 1.5;
    return 1.0;
  }

  const startGame = useCallback(() => {
    startTransition(() => {
      const effectiveLevel = gameState === "gameOver" ? 1 : level;
      const newPattern = generateDNA(4 + Math.floor(effectiveLevel / 3));
      const strandLength = 30 + effectiveLevel * 5;
      let newStrand = generateDNA(strandLength);

      const desiredExactMatches = Math.floor(Math.random() * 2) + 2;
      const insertPositions = new Set<number>();

      while (insertPositions.size < desiredExactMatches) {
        const pos = Math.floor(
          Math.random() * (strandLength - newPattern.length)
        );

        let overlaps = false;
        for (const existingPos of insertPositions) {
          if (
            (pos >= existingPos && pos < existingPos + newPattern.length) ||
            (existingPos >= pos && existingPos < pos + newPattern.length)
          ) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          insertPositions.add(pos);
        }
      }

      const positions = Array.from(insertPositions).sort((a, b) => b - a);
      let finalStrand = newStrand;
      for (const pos of positions) {
        finalStrand =
          finalStrand.substring(0, pos) +
          newPattern +
          finalStrand.substring(pos + newPattern.length);
      }

      const matches = findExactMatches(newPattern, finalStrand);

      if (matches.size !== desiredExactMatches) {
        console.warn(
          `Expected ${desiredExactMatches} matches, but found ${matches.size}. Regenerating...`
        );
        startGame();
        return;
      }

      const newMaxTime = Math.max(15, 30 - effectiveLevel * 2);

      setPattern(newPattern);
      setStrand(finalStrand);
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
      setIsIntentionalGameEnd(false);
      setAllPatternsCompleted(false);
    });
  }, [level, gameState]);

  const handleBaseClick = useCallback(
    (position: number) => {
      if (allPatternsCompleted) return;

      if (
        selectedBases.has(position) ||
        completedMatches.has(position) ||
        incorrectBases.has(position)
      )
        return;

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

        const newPatternStartTimes = new Map(patternStartTimes);
        if (!newPatternStartTimes.has(matchStartPos)) {
          newPatternStartTimes.set(matchStartPos, Date.now());
          setPatternStartTimes(newPatternStartTimes);
          setCurrentPatternStart(Date.now());
        }

        const newSelectedBases = new Set(selectedBases);
        newSelectedBases.add(position);
        setSelectedBases(newSelectedBases);

        const newPartialMatches = new Map(partialMatches);
        if (!newPartialMatches.has(matchStartPos)) {
          newPartialMatches.set(matchStartPos, new Set());
        }
        newPartialMatches.get(matchStartPos)!.add(position);
        setPartialMatches(newPartialMatches);

        const selectedInThisMatch = newPartialMatches.get(matchStartPos)!;
        if (selectedInThisMatch.size === pattern.length) {
          playPatternCompleteSound();

          const startTime = newPatternStartTimes.get(matchStartPos)!;
          const completionTime = (Date.now() - startTime) / 1000;
          const speedMultiplier = calculateSpeedBonus(completionTime);
          const basePoints = 200 * level;
          const bonusPoints = Math.floor(basePoints * speedMultiplier);

          const newCompletedMatches = new Set(completedMatches);
          newCompletedMatches.add(matchStartPos);
          setCompletedMatches(newCompletedMatches);

          newPartialMatches.delete(matchStartPos);
          setPartialMatches(newPartialMatches);

          setCurrentPatternStart(null);
          setActivePatternElapsed(0);

          setScore((prev) => prev + bonusPoints);

          if (newCompletedMatches.size === exactMatchPositions.size) {
            setAllPatternsCompleted(true);

            const timeBonus = timeLeft * 10;
            setScore((prev) => prev + timeBonus);

            setTimeout(() => {
              playLevelUpSound();
              setLevel((prev) => prev + 1);
              setAllPatternsCompleted(false);
              startGame();
            }, 2000);
          }
        } else {
          setScore((prev) => prev + 10 * level);
        }
      } else {
        playWrongSound();

        const newIncorrectBases = new Set(incorrectBases);
        newIncorrectBases.add(position);
        setIncorrectBases(newIncorrectBases);
        setDangerScore((prev) => Math.min(100, prev + 10));
        setScore((prev) => Math.max(0, prev - 50));

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
      allPatternsCompleted,
    ]
  );

  const handleTimeUpdate = useCallback((elapsed: number) => {
    setActivePatternElapsed(elapsed);
    setCurrentSpeedBonus(calculateSpeedBonus(elapsed));
  }, []);

  const goToMainMenu = useCallback(() => {
    setIsIntentionalGameEnd(true);
    setGameState("menu");
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
  }, []);

  const restartGame = useCallback(() => {
    setIsIntentionalGameEnd(true);

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

    startTransition(() => {
      startGame();
    });
  }, [startGame]);

  useEffect(() => {
    if (
      gameState === "playing" &&
      timeLeft > 0 &&
      dangerScore < 100 &&
      !allPatternsCompleted
    ) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      if (!isIntentionalGameEnd) {
        playGameOverSound();
      }
      setGameOverReason("time");
      setGameState("gameOver");
    } else if (dangerScore >= 100 && gameState === "playing") {
      if (!isIntentionalGameEnd) {
        playGameOverSound();
      }
      setGameOverReason("danger");
      setGameState("gameOver");
    }
  }, [
    gameState,
    timeLeft,
    dangerScore,
    playGameOverSound,
    isIntentionalGameEnd,
    allPatternsCompleted,
  ]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-white text-xl font-semibold font-rajdhani">
          <div className="flex items-center justify-center mb-2">
            <Dna className="w-16 h-16 animate-spin" />
          </div>
          <p className="m-4 text-3xl">Loading game</p>
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
        onMainMenu={goToMainMenu}
        reason={gameOverReason}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Dna className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white font-orbitron">
            Crimson Carmine
          </h1>
        </div>

        {allPatternsCompleted && (
          <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 font-semibold font-rajdhani animate-pulse">
            Level Complete!
          </div>
        )}
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col items-center justify-center space-y-6 pb-24">
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
          disabled={allPatternsCompleted}
        />

        <SpeedIndicator
          isActive={currentPatternStart !== null && !allPatternsCompleted}
          startTime={currentPatternStart}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      <GameFooter
        level={level}
        score={score}
        timeLeft={timeLeft}
        maxTime={maxTime}
        dangerScore={dangerScore}
        completedMatches={completedMatches.size}
        totalExactMatches={exactMatchPositions.size}
        currentSpeedBonus={currentSpeedBonus}
      />
    </div>
  );
}
