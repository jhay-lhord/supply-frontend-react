/**
 * Converts a numeric index to its corresponding uppercase letter.
 * @param index - The numeric index (1-based) to convert.
 * @returns The corresponding uppercase letter, or undefined if the index is out of range.
 */
export function indexToLetter(index: number): string | undefined {
  // Adjust index to 0-based for calculation
  const adjustedIndex = index - 1;

  // Check if the index is within the valid range (1-26)
  if (adjustedIndex < 0 || adjustedIndex >= 26) {
    return undefined;
  }

  // Convert the index to its corresponding ASCII code and then to a character
  return String.fromCharCode(65 + adjustedIndex);
}

