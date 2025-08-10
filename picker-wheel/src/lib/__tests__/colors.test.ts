import { assignColors, defaultPalette } from '@/lib/colors'

describe('assignColors', () => {
  test('assigns colors in palette order and preserves labels', () => {
    const items = [
      { id: 'a', label: 'A', color: '' },
      { id: 'b', label: 'B', color: '' },
    ]
    const out = assignColors(items)
    expect(out[0].color).toBe(defaultPalette[0])
    expect(out[1].color).toBe(defaultPalette[1])
  })
})