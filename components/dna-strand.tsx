"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

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

  // Show bonus animation when a pattern is completed
  useEffect(() => {
    const newAnimations: BonusAnimation[] = [];

    completedMatches.forEach((matchPos) => {
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
  }, [completedMatches, patternStartTimes]);

  const renderBase = (base: string, index: number) => {
    let className =
      "inline-block w-10 h-10 text-center leading-10 mx-1 my-1 rounded-lg font-bold font-mono text-lg transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg transform ";

    // Base colors with gradients
    switch (base) {
      case "A":
        className +=
          "bg-gradient-to-br from-rose-300 to-rose-500 text-white hover:from-rose-400 hover:to-rose-600 ";
        break;
      case "T":
        className +=
          "bg-gradient-to-br from-sky-300 to-sky-500 text-white hover:from-sky-400 hover:to-sky-600 ";
        break;
      case "G":
        className +=
          "bg-gradient-to-br from-emerald-300 to-emerald-500 text-white hover:from-emerald-400 hover:to-emerald-600 ";
        break;
      case "C":
        className +=
          "bg-gradient-to-br from-amber-300 to-amber-500 text-white hover:from-amber-400 hover:to-amber-600 ";
        break;
    }

    // Check states without flickering animations
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

    if (isCompleted) {
      className = className.replace(
        /bg-gradient-to-br from-\w+-\d+ to-\w+-\d+/,
        "bg-gradient-to-br from-emerald-500 to-emerald-700"
      );
      className += "ring-2 ring-emerald-400 shadow-emerald-400/50 shadow-lg ";
    } else if (isPartialMatch) {
      className = className.replace(
        /bg-gradient-to-br from-\w+-\d+ to-\w+-\d+/,
        "bg-gradient-to-br from-amber-400 to-amber-600"
      );
      className += "ring-2 ring-amber-300 shadow-amber-400/50 shadow-lg ";
    } else if (isIncorrect) {
      className = className.replace(
        /bg-gradient-to-br from-\w+-\d+ to-\w+-\d+/,
        "bg-gradient-to-br from-red-500 to-red-700"
      );
      className += "ring-2 ring-red-400 shadow-red-400/50 shadow-lg ";
    }

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
          <p className="text-slate-300 text-sm font-rajdhani">
            Click each base in sequence to complete pattern matches.
            <span className="text-amber-400 font-semibold">
              {" "}
              Complete patterns quickly for bonus points!
            </span>
          </p>
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
          className="fixed pointer-events-none z-50 animate-bounce"
          style={{
            left: bonus.x,
            top: bonus.y - 50,
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg font-mono">
            +{bonus.points} ({bonus.multiplier.toFixed(1)}x)
          </div>
        </div>
      ))}
    </div>
  );
}
