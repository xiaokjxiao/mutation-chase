// generate dna
export function generateDNA(length: number): string {
  const bases = ["A", "T", "G", "C"]
  return Array.from({ length }, () => bases[Math.floor(Math.random() * bases.length)]).join("")
}

// calculate speed bonus
export function calculateSpeedBonus(completionTime: number): number {
  if (completionTime < 3) return 3.0
  if (completionTime < 6) return 2.0
  if (completionTime < 10) return 1.5
  return 1.0
}
