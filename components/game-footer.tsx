"use client";

import { Dna, Shield, Clock, AlertTriangle, Zap } from "lucide-react";

interface GameFooterProps {
  level: number;
  score: number;
  timeLeft: number;
  maxTime: number;
  dangerScore: number;
  completedMatches: number;
  totalExactMatches: number;
  currentSpeedBonus: number;
}

export function GameFooter({
  level,
  score,
  timeLeft,
  maxTime,
  dangerScore,
  completedMatches,
  totalExactMatches,
  currentSpeedBonus,
}: GameFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-cyan-500/30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {/* Level */}
          <div className="bg-slate-800/80 rounded-lg p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Dna className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-rajdhani">LEVEL</div>
              <div className="text-lg font-bold text-white font-mono">{level}</div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-slate-800/80 rounded-lg p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-rajdhani">SCORE</div>
              <div className="text-lg font-bold text-white font-mono">{score}</div>
            </div>
          </div>

          {/* Time Left */}
          <div className="bg-slate-800/80 rounded-lg p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-rajdhani">TIME</div>
              <div className="flex items-center">
                <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      timeLeft > maxTime * 0.6
                        ? "bg-emerald-500"
                        : timeLeft > maxTime * 0.3
                        ? "bg-amber-500"
                        : timeLeft > maxTime * 0.15
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-white font-mono">
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Danger Score */}
          <div className="bg-slate-800/80 rounded-lg p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-rajdhani">DANGER</div>
              <div className="flex items-center">
                <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                    style={{ width: `${dangerScore}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-white font-mono">
                  {dangerScore}
                </span>
              </div>
            </div>
          </div>

          {/* Patterns */}
          <div className="bg-slate-800/80 rounded-lg p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-sky-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-rajdhani">PATTERNS</div>
              <div className="text-lg font-bold text-white font-mono">
                {completedMatches} / {totalExactMatches}
              </div>
            </div>
          </div>

          {/* Speed Bonus */}
          <div className="bg-slate-800/80 rounded-lg p-2 flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-rajdhani">BONUS</div>
              <div
                className={`text-lg font-bold font-mono ${
                  currentSpeedBonus > 1 ? "text-purple-300" : "text-white"
                }`}
              >
                {currentSpeedBonus.toFixed(1)}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
