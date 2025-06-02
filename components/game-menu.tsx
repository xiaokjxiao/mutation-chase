"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dna, Target, AlertTriangle, Clock } from "lucide-react";

interface GameMenuProps {
  onStartGame: () => void;
  isPending: boolean;
}

export function GameMenu({ onStartGame, isPending }: GameMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-slate-900/90 backdrop-blur border-cyan-500/30 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Dna className="w-16 h-16 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2 font-orbitron">
            Crimson Carmine
          </CardTitle>
          <p className="text-cyan-300 font-rajdhani text-lg">
            Stop the infamous, Carmine Virus!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-300 space-y-2 font-rajdhani">
            <p>
              🧬 A lethal virus known as{" "}
              <span className="text-red-400 font-semibold">Carmine</span> is
              mutating DNA strands!
            </p>
            <p>
              🔍 Click EVERY base in the pattern sequence to neutralize the
              threat.
            </p>
            <p>
              ⚠️ Wrong clicks accelerate the Carmine infection — danger hits
              100%, and it's game over!
            </p>
            <p>
              ⏱️ Time is critical — stop the Carmine virus before it spreads
              beyond control!
            </p>
          </div>

          <div className="grid md:grid-cols-2  gap-4 justify-between ">
            <Card className="bg-slate-900/80 backdrop-blur border-emerald-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-400 font-orbitron text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <p className="text-slate-300 text-sm font-rajdhani">
                    Study the original gene pattern (P)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <p className="text-slate-300 text-sm font-rajdhani">
                    Find exact matches in the virus-altered strand (S)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <p className="text-slate-300 text-sm font-rajdhani">
                    Click EVERY base in the pattern sequence
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    4
                  </div>
                  <p className="text-slate-300 text-sm font-rajdhani">
                    Complete patterns quickly for bonus points
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur border-red-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-400 font-orbitron text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <p className="text-slate-300 text-sm font-rajdhani">
                    Timer decreases each level
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <p className="text-slate-300 text-sm font-rajdhani">
                    Wrong clicks add 15% danger
                  </p>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2">
                  <p className="text-red-300 text-xs font-rajdhani font-semibold text-center">
                    Game ends at 100% danger or time out!
                  </p>
                </div>
              </CardContent>
            </Card>
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
  );
}
