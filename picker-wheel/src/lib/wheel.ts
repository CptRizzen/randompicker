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
export function computeSlices(labels: string[], colors?: string[]): Slice[] {
  const n = Math.max(1, labels.length)
  const anglePer = 360 / n
  const radius = 100

  const toRad = (deg: number) => (deg * Math.PI) / 180

  return labels.map((label, i) => {
    const startAngle = i * anglePer
    const endAngle = (i + 1) * anglePer

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
    // Position text at 65% of radius for good centering within slices
    const textRadius = radius * 0.65
    const tx = Math.cos(toRad(mid)) * textRadius
    const ty = Math.sin(toRad(mid)) * textRadius

    // TEXT ROTATION for radial reading from outside to inside
    // The text should read with the first letter pointing toward the outside edge
    // and the last letter pointing toward the center
    
    // Base rotation: align text with the radius direction (pointing toward center)
    let textRotation = mid
    
    // For the left half of the wheel (90° to 270°), flip the text 180°
    // so it reads from outside to inside instead of inside to outside
    if (mid > 90 && mid < 270) {
      textRotation += 180
    }

    return {
      startAngle,
      endAngle,
      path,
      color: colors?.[i] || '#e5e7eb',
      textPosition: { x: tx, y: ty },
      textRotation: textRotation,
    }
  })
}

// Given a top pointer at angle 0, map landing angle [0,360) to index among n slices clockwise
export function angleToIndex(angleFromTop: number, count: number): number {
  if (count <= 0) return 0
  
  // Normalize angle to [0, 360)
  const normalizedAngle = ((angleFromTop % 360) + 360) % 360
  
  // Handle the edge case where angle is exactly 360° (should be index 0)
  if (normalizedAngle >= 360) return 0
  
  const anglePer = 360 / count
  const idx = Math.floor(normalizedAngle / anglePer)
  
  // Ensure index is within bounds
  return Math.min(idx, count - 1)
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