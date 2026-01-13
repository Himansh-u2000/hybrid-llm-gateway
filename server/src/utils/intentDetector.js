// utils/intentDetector.js
const HEAVY_KEYWORDS = [
  'explain',
  'explanation',
  'architecture',
  'design',
  'compare',
  'pros and cons',
  'why',
  'how does',
  'in detail',
  'deep',
  'production',
  'scaling'
];

export function isHeavyIntent(messages) {
  const text = messages
    .map(m => m.content)
    .join(' ')
    .toLowerCase();   // 🔥 THIS WAS MISSING

  return HEAVY_KEYWORDS.some(keyword =>
    text.includes(keyword)
  );
}
