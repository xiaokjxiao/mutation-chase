"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { renderBase } from "@/game-utils/base-renderer";

interface PatternDisplayProps {
  pattern: string;
}

export function PatternDisplay({ pattern }: PatternDisplayProps) {
  return (
    <Card className="bg-slate-900/80 backdrop-blur border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2 font-orbitron">
          <Zap className="w-5 h-5" />
          <span>Original Gene Pattern (P)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-lg flex justify-center">
          {pattern.split("").map((base, index) => renderBase(base, index))}
        </div>
      </CardContent>
    </Card>
  );
}
