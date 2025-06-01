"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, RefreshCw, Home } from "lucide-react";
import { useEffect } from "react";

interface GameOverProps {
  score: number;
  level: number;
  onRestart: () => void;
  onReturnToMenu: () => void;
  reason: "time" | "danger";
}

export function GameOver({
  score,
  level,
  onRestart,
  onReturnToMenu,
  reason,
}: GameOverProps) {
  // Debug log to verify the function is passed correctly
  useEffect(() => {
    console.log("GameOver mounted, onReturnToMenu is:", !!onReturnToMenu);
  }, [onReturnToMenu]);

  const handleReturnToMenu = () => {
    console.log("Return to menu clicked");
    // Ensure we call the function passed from the parent
    if (onReturnToMenu) {
      onReturnToMenu();
    }
  };

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

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-rajdhani font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            <Button
              onClick={handleReturnToMenu}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 font-rajdhani font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Main Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
