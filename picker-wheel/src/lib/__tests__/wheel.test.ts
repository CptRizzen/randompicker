import { angleToIndex, computeSlices, shuffleArray } from '@/lib/wheel'

describe('wheel math', () => {
  test('computeSlices returns correct count and paths', () => {
    const labels = ['A', 'B', 'C', 'D']
    const slices = computeSlices(labels)
    expect(slices).toHaveLength(4)
    expect(slices[0].path).toContain('A 100 100') // arc command exists
  })

  test('angleToIndex maps angles to indices', () => {
    expect(angleToIndex(0, 4)).toBe(0)
    expect(angleToIndex(89.9, 4)).toBe(0)
    expect(angleToIndex(90, 4)).toBe(1)
    expect(angleToIndex(359, 4)).toBe(3)
  })

  test('shuffleArray produces permutation', () => {
    const arr = [1, 2, 3, 4, 5]
    const out = shuffleArray([...arr])
    expect(out.sort()).toEqual(arr.sort())
  })
})