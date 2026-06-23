const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#a855f7', // purple
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#6366f1', // indigo
  '#f97316', // orange
  '#14b8a6', // teal
  '#e879f9', // fuchsia
  '#8b5cf6', // violet
  '#facc15', // yellow
  '#2dd4bf', // teal-light
  '#fb923c', // orange-light
];

function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
    h |= 0;
  }
  return Math.abs(h);
}

export function getIdolColor(idol: string): string {
  return COLORS[hash(idol) % COLORS.length];
}
