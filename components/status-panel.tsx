"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, AlertTriangle, Shield, Zap } from "lucide-react";

interface StatusPanelProps {
  timeLeft: number;
  maxTime: number;
  dangerScore: number;
  completedMatches: number;
  totalExactMatches: number;
  currentBonus: number;
}

export function StatusPanel({
  timeLeft,
  maxTime,
  dangerScore,
  completedMatches,
  totalExactMatches,
  currentBonus,
}: StatusPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-slate-900/80 backdrop-blur border-cyan-500/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold font-rajdhani">
              Time Left
            </span>
          </div>
          <div className="mt-2">
            <Progress value={(timeLeft / maxTime) * 100} className="h-2" />
            <p
              className={`text-sm mt-1 font-mono ${
                timeLeft <= 5 ? "text-red-400" : "text-cyan-300"
              }`}
            >
              {timeLeft}s
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 backdrop-blur border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-white font-semibold font-rajdhani">
              Danger Score
            </span>
          </div>
          <div className="mt-2">
            <Progress value={dangerScore} className="h-2" />
            <p
              className={`text-sm mt-1 font-mono ${
                dangerScore >= 80 ? "text-red-400 font-bold" : "text-red-300"
              }`}
            >
              {dangerScore}/100
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 backdrop-blur border-emerald-500/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-semibold font-rajdhani">
              Patterns Found
            </span>
          </div>
          <div className="mt-2">
            <p className="text-emerald-300 font-mono">
              {completedMatches} / {totalExactMatches}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 backdrop-blur border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-white font-semibold font-rajdhani">
              Speed Bonus
            </span>
          </div>
          <div className="mt-2">
            <p
              className={`text-sm mt-1 font-bold font-mono ${
                currentBonus > 1 ? "text-amber-300" : "text-amber-400"
              }`}
            >
              {currentBonus > 1 ? `${currentBonus.toFixed(1)}x` : "1.0x"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
