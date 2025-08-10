// Wheel math helpers are kept framework-agnostic for testability

export type Slice = {
  startAngle: number
  endAngle: number
  path: string
  color: string
  textPosition: { x: number; y: number }
  textRotation: number
}

// Create pie slice paths for n options, centered at 0,0 radius 100
// Slices start at the top (12 o'clock) and go clockwise
export function computeSlices(labels: string[], colors?: string[]): Slice[] {
  const n = Math.max(1, labels.length)
  const anglePer = 360 / n
  const radius = 100

  const toRad = (deg: number) => (deg * Math.PI) / 180

  return labels.map((label, i) => {
    // Start at -90 degrees to position first slice at top (12 o'clock)
    const startAngle = i * anglePer - 90
    const endAngle = (i + 1) * anglePer - 90

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    const x1 = Math.cos(toRad(startAngle)) * radius
    const y1 = Math.sin(toRad(startAngle)) * radius
    const x2 = Math.cos(toRad(endAngle)) * radius
    const y2 = Math.sin(toRad(endAngle)) * radius

    const path = [
      `M 0 0`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ')

    const mid = startAngle + anglePer / 2
    const textRadius = radius * 0.6
    const tx = Math.cos(toRad(mid)) * textRadius
    const ty = Math.sin(toRad(mid)) * textRadius

    return {
      startAngle,
      endAngle,
      path,
      color: colors?.[i] || '#e5e7eb',
      textPosition: { x: tx, y: ty },
      textRotation: mid,
    }
  })
}

// Given a top pointer at angle 0, map landing angle [0,360) to index among n slices clockwise
export function angleToIndex(angleFromTop: number, count: number): number {
  if (count <= 0) return 0
  const anglePer = 360 / count
  const idx = Math.floor(angleFromTop / anglePer) % count
  return idx
}

// Compute a new spin target rotation using easing-friendly big turns + randomness
export function getSpinTargetRotation(currentBaseRotation: number): number {
  const EXTRA_TURNS = 5 + Math.floor(Math.random() * 3) // 5-7 full turns
  const randomOffset = Math.random() * 360
  const target = currentBaseRotation + EXTRA_TURNS * 360 + randomOffset
  return target
}

export function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}