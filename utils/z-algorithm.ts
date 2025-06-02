export function zAlgorithm(s: string): number[] {
  const length = s.length;
  const zArray = new Array(length).fill(0); // Result array, all zeros initially

  for (let position = 1; position < length; position++) {
    // Start from 1 to skip the first character
    let matchLength = 0; // Length of the match starting from this position

    while (
      position + matchLength < length && // Ensure we don't go out of bounds
      s[matchLength] === s[position + matchLength] // Compare characters
    ) {
      matchLength++; // Increment match length
    }

    zArray[position] = matchLength; // Store the match length
  }

  return zArray; // Return the Z-array
}

export function findExactMatches(pattern: string, text: string): Set<number> {
  // Join pattern and text with a character that doesn't appear in either
  const combined = pattern + "$" + text;

  // Calculate Z-values for the combined string
  const zArray = zAlgorithm(combined);

  const matches = new Set<number>();
  const patternLength = pattern.length;

  // Check positions after the pattern and separator
  // If Z-value equals pattern length, we found a match
  for (let i = patternLength + 1; i < combined.length; i++) {
    if (zArray[i] === patternLength) {
      // Convert position in combined string back to position in original text
      const positionInText = i - patternLength - 1;
      matches.add(positionInText);
    }
  }

  return matches;
}
