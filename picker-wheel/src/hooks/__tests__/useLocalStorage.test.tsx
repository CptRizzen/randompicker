import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  test('initializes with default and persists updates', () => {
    const { result } = renderHook(() => useLocalStorage('x', 1))
    expect(result.current[0]).toBe(1)
    act(() => {
      result.current[1](2)
    })
    expect(JSON.parse(window.localStorage.getItem('x') || '0')).toBe(2)
  })
})