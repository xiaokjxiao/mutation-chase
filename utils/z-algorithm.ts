// z-algorithm 
export function zAlgorithm(s: string): number[] {
  const n = s.length // Length of the input string
  const z = new Array(n).fill(0) // Initialize Z-array with zeros
  let l = 0, // Left boundary of the current Z-box
    r = 0

  for (let i = 1; i < n; i++) {
    // If i is inside the current Z-box, we need to compute Z[i] from scratch
    if (i <= r) {
      // Use previously computed Z-values to avoid unnecessary comparisons
      z[i] = Math.min(r - i + 1, z[i - l])
    }
    // Attempt to extend the Z-box
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++
    }
    // If we extended beyond the current Z-box, update l and r
    if (i + z[i] - 1 > r) {
      l = i
      r = i + z[i] - 1
    }
  }

  return z
}

// find exact matches of pattern p in string s using Z-algorithm
export function findExactMatches(p: string, s: string): Set<number> {
  const combined = p + "$" + s
  const z = zAlgorithm(combined)
  const patternLength = p.length
  const matches = new Set<number>()

  for (let i = patternLength + 1; i < z.length; i++) {
    if (z[i] === patternLength) {
      matches.add(i - patternLength - 1)
    }
  }

  return matches
}
