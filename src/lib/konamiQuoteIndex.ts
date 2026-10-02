/** Stable quote index per locale for Konami achievement. */
export function konamiQuoteIndex(lang: string, quoteCount: number): number {
  if (quoteCount <= 0) return 0;
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = (hash * 31 + lang.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % quoteCount;
}
