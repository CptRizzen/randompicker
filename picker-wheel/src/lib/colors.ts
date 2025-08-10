export const defaultPalette = [
  '#f87171', // red-400
  '#fb923c', // orange-400
  '#fbbf24', // amber-400
  '#a3e635', // lime-400
  '#34d399', // emerald-400
  '#22d3ee', // cyan-400
  '#60a5fa', // blue-400
  '#a78bfa', // violet-400
  '#f472b6', // pink-400
  '#facc15', // yellow-400
]

export function assignColors<T extends { id: string; label: string; color: string }>(items: T[]): T[] {
  if (!items.length) return items
  const withColors = items.map((item, idx) => ({
    ...item,
    color: item.color || defaultPalette[idx % defaultPalette.length],
  }))
  return withColors
}