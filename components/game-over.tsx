"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull } from "lucide-react";

interface GameOverProps {
  score: number;
  level: number;
  onRestart: () => void;
  reason: "time" | "danger";
}

export function GameOver({ score, level, onRestart, reason }: GameOverProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-red-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/90 backdrop-blur border-red-500/30 shadow-2xl">
        <CardHeader className="text-center">
          <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-white mb-2 font-orbitron">
            {reason === "danger" ? "Virus Mutated!" : "Time's Up!"}
          </CardTitle>
          <p className="text-red-300 font-rajdhani text-lg">Mission Failed</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-white text-lg font-rajdhani">
              Final Score: <span className="font-mono">{score}</span>
            </p>
            <p className="text-white text-lg font-rajdhani">
              Level Reached: <span className="font-mono">{level}</span>
            </p>
            <p className="text-red-300 text-sm mt-2 font-rajdhani">
              {reason === "danger"
                ? "Too many wrong selections!"
                : "Ran out of time!"}
            </p>
          </div>
          <Button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-rajdhani font-semibold"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
