"use client"

import { useCallback, useRef } from "react"

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) => {
      try {
        const audioContext = getAudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.type = type

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (error) {
        console.warn("Audio playback failed:", error)
      }
    },
    [getAudioContext],
  )

  const playCorrectSound = useCallback(() => {
    playTone(523.25, 0.2, "sine", 0.2) // C5 note
  }, [playTone])

  const playWrongSound = useCallback(() => {
    playTone(146.83, 0.4, "sawtooth", 0.3) // D3 note with harsh sawtooth
  }, [playTone])

  const playLevelUpSound = useCallback(() => {
    // Ascending chord progression
    setTimeout(() => playTone(261.63, 0.2, "sine", 0.2), 0) // C4
    setTimeout(() => playTone(329.63, 0.2, "sine", 0.2), 100) // E4
    setTimeout(() => playTone(392.0, 0.2, "sine", 0.2), 200) // G4
    setTimeout(() => playTone(523.25, 0.4, "sine", 0.3), 300) // C5
  }, [playTone])

  const playGameOverSound = useCallback(() => {
    // Descending dramatic sequence
    setTimeout(() => playTone(392.0, 0.3, "square", 0.3), 0) // G4
    setTimeout(() => playTone(349.23, 0.3, "square", 0.3), 200) // F4
    setTimeout(() => playTone(293.66, 0.3, "square", 0.3), 400) // D4
    setTimeout(() => playTone(220.0, 0.6, "square", 0.4), 600) // A3
  }, [playTone])

  const playPatternCompleteSound = useCallback(() => {
    // Quick success chime
    setTimeout(() => playTone(659.25, 0.15, "sine", 0.2), 0) // E5
    setTimeout(() => playTone(783.99, 0.15, "sine", 0.2), 100) // G5
    setTimeout(() => playTone(1046.5, 0.3, "sine", 0.25), 200) // C6
  }, [playTone])

  return {
    playCorrectSound,
    playWrongSound,
    playLevelUpSound,
    playGameOverSound,
    playPatternCompleteSound,
  }
}
