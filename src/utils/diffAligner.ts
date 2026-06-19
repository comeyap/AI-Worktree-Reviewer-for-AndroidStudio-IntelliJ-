export interface AlignedLine {
  originalIndex: number | null; // 1-based line number or null
  originalText: string;
  modifiedIndex: number | null; // 1-based line number or null
  modifiedText: string;
  type: 'equal' | 'addition' | 'deletion' | 'placeholder';
}

/**
 * Super lightweight Longest Common Subsequence (LCS) based diff aligner.
 * Aligns two sets of lines so corresponding lines match, insert empty lines as placeholders
 * to keep side-by-side views perfectly synchronized vertically.
 */
export function alignDiffLines(original: string, modified: string): AlignedLine[] {
  const oLines = original.split('\n');
  const mLines = modified.split('\n');
  
  const originalLength = oLines.length;
  const modifiedLength = mLines.length;

  // memoization matrix for LCS
  const dp: number[][] = Array(originalLength + 1)
    .fill(null)
    .map(() => Array(modifiedLength + 1).fill(0));

  for (let i = 1; i <= originalLength; i++) {
    for (let j = 1; j <= modifiedLength; j++) {
      if (oLines[i - 1].trim() === mLines[j - 1].trim()) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const aligned: AlignedLine[] = [];
  let i = originalLength;
  let j = modifiedLength;

  // Backtrack to build aligned lines
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oLines[i - 1].trim() === mLines[j - 1].trim()) {
      aligned.unshift({
        originalIndex: i,
        originalText: oLines[i - 1],
        modifiedIndex: j,
        modifiedText: mLines[j - 1],
        type: 'equal',
      });
      i--;
      j--;
    } else {
      // Decide whether to delete from original (left), or insert to modified (right)
      if (j === 0 || (i > 0 && dp[i - 1][j] >= dp[i][j - 1])) {
        // Deletion on left side (original has text, modified has blank placeholder)
        aligned.unshift({
          originalIndex: i,
          originalText: oLines[i - 1],
          modifiedIndex: null,
          modifiedText: '',
          type: 'deletion',
        });
        i--;
      } else {
        // Addition on right side (original has blank placeholder, modified has text)
        aligned.unshift({
          originalIndex: null,
          originalText: '',
          modifiedIndex: j,
          modifiedText: mLines[j - 1],
          type: 'addition',
        });
        j--;
      }
    }
  }

  return aligned;
}
