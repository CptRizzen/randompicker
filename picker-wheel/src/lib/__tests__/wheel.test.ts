import { angleToIndex, computeSlices, shuffleArray } from '@/lib/wheel'

describe('wheel math', () => {
  test('computeSlices returns correct count and paths', () => {
    const labels = ['A', 'B', 'C', 'D']
    const slices = computeSlices(labels)
    expect(slices).toHaveLength(4)
    expect(slices[0].path).toContain('A 100 100') // arc command exists
  })

  test('angleToIndex maps angles to indices correctly', () => {
    // Test with 4 slices (90 degrees each)
    expect(angleToIndex(0, 4)).toBe(0)    // First slice
    expect(angleToIndex(45, 4)).toBe(0)   // Still first slice
    expect(angleToIndex(89.9, 4)).toBe(0) // Still first slice
    expect(angleToIndex(90, 4)).toBe(1)   // Second slice
    expect(angleToIndex(180, 4)).toBe(2)  // Third slice
    expect(angleToIndex(270, 4)).toBe(3)  // Fourth slice
    expect(angleToIndex(359, 4)).toBe(3)  // Still fourth slice
    expect(angleToIndex(360, 4)).toBe(0)  // Back to first slice
  })

  test('angleToIndex works with different slice counts', () => {
    // Test with 3 slices (120 degrees each)
    expect(angleToIndex(0, 3)).toBe(0)
    expect(angleToIndex(60, 3)).toBe(0)
    expect(angleToIndex(120, 3)).toBe(1)
    expect(angleToIndex(240, 3)).toBe(2)
    
    // Test with 6 slices (60 degrees each)
    expect(angleToIndex(30, 6)).toBe(0)
    expect(angleToIndex(60, 6)).toBe(1)
    expect(angleToIndex(120, 6)).toBe(2)
  })

  test('shuffleArray produces permutation', () => {
    const arr = [1, 2, 3, 4, 5]
    const out = shuffleArray([...arr])
    expect(out.sort()).toEqual(arr.sort())
  })
})