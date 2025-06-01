"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dna } from "lucide-react";

interface GameMenuProps {
  onStartGame: () => void;
  isPending: boolean;
}

export function GameMenu({ onStartGame, isPending }: GameMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/90 backdrop-blur border-cyan-500/30 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Dna className="w-16 h-16 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2 font-orbitron">
            Crimson Carmine
          </CardTitle>
          <p className="text-cyan-300 font-rajdhani text-lg">
            Align the line, decode Carmine{" "}
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
              🎯 Use the Z-algorithm to locate EXACT genetic pattern matches.
            </p>
            <p>
              🔍 Click EVERY base in the pattern sequence to neutralize the
              threat.
            </p>
            <p>
              ⚠️ Wrong clicks accelerate the Carmine infection — danger hits
              100%, and it’s game over!
            </p>
            <p>
              ⏱️ Time is critical — stop the Carmine virus before it spreads
              beyond control!
            </p>
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
