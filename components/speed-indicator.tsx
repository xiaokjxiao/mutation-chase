"use client"

import { useEffect, useState } from "react"

interface SpeedIndicatorProps {
  isActive: boolean
  startTime: number | null
  onTimeUpdate: (elapsed: number) => void
}

export function SpeedIndicator({ isActive, startTime, onTimeUpdate }: SpeedIndicatorProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isActive || !startTime) {
      setElapsed(0)
      return
    }

    const interval = setInterval(() => {
      const newElapsed = (Date.now() - startTime) / 1000
      setElapsed(newElapsed)
      onTimeUpdate(newElapsed)
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, startTime, onTimeUpdate])

  if (!isActive) return null

  const getSpeedColor = (time: number) => {
    if (time < 3) return "text-emerald-400"
    if (time < 6) return "text-amber-400"
    if (time < 10) return "text-orange-400"
    return "text-red-400"
  }

  const getSpeedText = (time: number) => {
    if (time < 3) return "LIGHTNING FAST!"
    if (time < 6) return "Quick!"
    if (time < 10) return "Good pace"
    return "Too slow..."
  }

  return (
    <div className="fixed top-4 right-4 bg-slate-900/90 backdrop-blur rounded-lg p-3 border border-cyan-500/30 z-40 shadow-xl">
      <div className="text-white text-sm font-semibold font-rajdhani">Pattern in Progress</div>
      <div className={`text-lg font-bold font-mono ${getSpeedColor(elapsed)}`}>{elapsed.toFixed(1)}s</div>
      <div className={`text-xs font-rajdhani ${getSpeedColor(elapsed)}`}>{getSpeedText(elapsed)}</div>
    </div>
  )
}
