"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { getBaseClassName } from "@/game-utils/base-renderer";

interface DNAStrandProps {
  strand: string;
  pattern: string;
  onBaseClick: (position: number) => void;
  selectedBases: Set<number>;
  completedMatches: Set<number>;
  incorrectBases: Set<number>;
  partialMatches: Map<number, Set<number>>;
  patternStartTimes: Map<number, number>;
}

interface BonusAnimation {
  id: string;
  points: number;
  multiplier: number;
  x: number;
  y: number;
  type: "complete" | "partial" | "penalty";
}

export function DNAStrand({
  strand,
  pattern,
  onBaseClick,
  selectedBases,
  completedMatches,
  incorrectBases,
  partialMatches,
  patternStartTimes,
}: DNAStrandProps) {
  const [bonusAnimations, setBonusAnimations] = useState<BonusAnimation[]>([]);
  const prevCompletedMatches = useRef(new Set<number>());
  const prevSelectedBases = useRef(new Set<number>());
  const prevIncorrectBases = useRef(new Set<number>());

  // Show bonus animation when a pattern is completed
  useEffect(() => {
    const newAnimations: BonusAnimation[] = [];

    // Check for completed matches
    completedMatches.forEach((matchPos) => {
      if (!prevCompletedMatches.current.has(matchPos)) {
        const startTime = patternStartTimes.get(matchPos);
        if (startTime) {
          const completionTime = (Date.now() - startTime) / 1000;
          const speedBonus = Math.max(1, 3 - completionTime / 5);
          const bonusPoints = Math.floor(200 * speedBonus);

          const baseElement = document.querySelector(
            `[data-base-index="${matchPos}"]`
          );
          if (baseElement) {
            const rect = baseElement.getBoundingClientRect();
            newAnimations.push({
              id: `bonus-${matchPos}-${Date.now()}`,
              points: bonusPoints,
              multiplier: speedBonus,
              x: rect.left + rect.width / 2,
              y: rect.top,
              type: "complete",
            });
          }
        }
      }
    });

    // Check for partial matches (new selected bases)
    selectedBases.forEach((pos) => {
      if (!prevSelectedBases.current.has(pos)) {
        const baseElement = document.querySelector(
          `[data-base-index="${pos}"]`
        );
        if (baseElement) {
          const rect = baseElement.getBoundingClientRect();
          newAnimations.push({
            id: `partial-${pos}-${Date.now()}`,
            points: 10,
            multiplier: 1,
            x: rect.left + rect.width / 2,
            y: rect.top,
            type: "partial",
          });
        }
      }
    });

    // Check for incorrect selections
    incorrectBases.forEach((pos) => {
      if (!prevIncorrectBases.current.has(pos)) {
        const baseElement = document.querySelector(
          `[data-base-index="${pos}"]`
        );
        if (baseElement) {
          const rect = baseElement.getBoundingClientRect();
          newAnimations.push({
            id: `penalty-${pos}-${Date.now()}`,
            points: -10,
            multiplier: 1,
            x: rect.left + rect.width / 2,
            y: rect.top,
            type: "penalty",
          });
        }
      }
    });

    if (newAnimations.length > 0) {
      setBonusAnimations((prev) => [...prev, ...newAnimations]);

      setTimeout(() => {
        setBonusAnimations((prev) =>
          prev.filter(
            (anim) => !newAnimations.some((newAnim) => newAnim.id === anim.id)
          )
        );
      }, 2000);
    }

    // Update previous states
    prevCompletedMatches.current = new Set(completedMatches);
    prevSelectedBases.current = new Set(selectedBases);
    prevIncorrectBases.current = new Set(incorrectBases);
  }, [completedMatches, patternStartTimes, selectedBases, incorrectBases]);

  const renderBase = (base: string, index: number) => {
    // Check states first to avoid flickering
    const isCompleted = Array.from(completedMatches).some(
      (pos) => index >= pos && index < pos + pattern.length
    );

    let isPartialMatch = false;
    for (const [matchPos, selectedInMatch] of partialMatches) {
      if (
        index >= matchPos &&
        index < matchPos + pattern.length &&
        selectedInMatch.has(index)
      ) {
        isPartialMatch = true;
        break;
      }
    }

    const isIncorrect = incorrectBases.has(index);

    const className = getBaseClassName({
      isCompleted,
      isPartialMatch,
      isIncorrect,
      base,
    });

    return (
      <span
        key={index}
        className={className}
        onClick={() => onBaseClick(index)}
        data-base-index={index}
      >
        {base}
      </span>
    );
  };

  return (
    <div className="relative">
      <Card className="bg-slate-900/80 backdrop-blur border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">
            Virus-Altered DNA Strand (S)
          </CardTitle>
          <div className="text-slate-300 text-sm font-rajdhani space-y-2">
            <p>
              Click each base in sequence to complete pattern matches.
              <span className="text-amber-400 font-semibold">
                {" "}
                Complete patterns quickly for bonus points!
              </span>
            </p>
            <div className="flex flex-wrap gap-4 mt-1">
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-emerald-500 mr-1"></span>
                <span className="text-xs">Completed Match</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-amber-500 mr-1"></span>
                <span className="text-xs">Partial Match (+10 pts)</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-red-500 mr-1"></span>
                <span className="text-xs">Incorrect (-50 pts)</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-lg leading-relaxed flex flex-wrap justify-center">
            {strand.split("").map((base, index) => renderBase(base, index))}
          </div>
        </CardContent>
      </Card>

      {/* Bonus Animations */}
      {bonusAnimations.map((bonus) => (
        <div
          key={bonus.id}
          className="fixed pointer-events-none z-50 animate-fade-up"
          style={{
            left: bonus.x,
            top: bonus.y - 50,
            transform: "translateX(-50%)",
            animation: "fadeUpAnimation 1.5s forwards",
          }}
        >
          <div
            className={`px-3 py-1 rounded-full shadow-lg font-bold text-sm font-mono ${
              bonus.type === "complete"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white"
                : bonus.type === "partial"
                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
                : "bg-gradient-to-r from-red-500 to-red-700 text-white"
            }`}
          >
            {bonus.type === "penalty"
              ? `-${Math.abs(bonus.points)}`
              : `+${bonus.points}`}
            {bonus.multiplier > 1 ? ` (${bonus.multiplier.toFixed(1)}x)` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
