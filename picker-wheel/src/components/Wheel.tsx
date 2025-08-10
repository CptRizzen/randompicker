'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { OptionItem } from '@/app/page'
import { angleToIndex, computeSlices, getSpinTargetRotation } from '@/lib/wheel'

type Props = {
  options: OptionItem[]
  onWinner: (winner: OptionItem) => void
  spinning: boolean
  setSpinning: (v: boolean) => void
}

export function Wheel({ options, onWinner, spinning, setSpinning }: Props) {
  const [rotation, setRotation] = useState(() => Math.random() * 360)
  const baseRotRef = useRef(Math.random() * 360)
  const spinButtonRef = useRef<HTMLButtonElement | null>(null)

  const slices = useMemo(() => computeSlices(options.map(o => o.label)), [options])

  useEffect(() => {
    // Reset to a new random rotation if options change significantly
    if (options.length > 0) {
      const newRandomRotation = Math.random() * 360
      setRotation(newRandomRotation)
      baseRotRef.current = newRandomRotation
    }
  }, [options.length])

  const handleSpin = () => {
    if (spinning || options.length === 0) return
    setSpinning(true)

    const targetRotation = getSpinTargetRotation(baseRotRef.current)
    baseRotRef.current = targetRotation
    setRotation(targetRotation)
  }

  const onTransitionEnd = () => {
    // Determine the winner based on final rotation
    // The pointer is at the top (12 o'clock position)
    // Since slices now start at the top and go clockwise, we can directly
    // calculate which slice is under the pointer
    const normalizedRotation = ((rotation % 360) + 360) % 360
    
    // The wheel rotates clockwise, so we need to find which slice
    // is at the top after rotation
    const pointerAngle = normalizedRotation % 360
    const idx = angleToIndex(pointerAngle, slices.length)
    
    const winner = options[idx]
    if (winner) onWinner(winner)
    setSpinning(false)
    spinButtonRef.current?.focus()
  }

  const size = 280

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Pointer - moved outside and made more prominent */}
        <div className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 transition-all duration-300 ${spinning ? 'animate-pulse scale-110' : 'scale-100'}`}>
          <div className="flex flex-col items-center">
            <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg" aria-hidden="true" />
            <div className="mt-1 h-3 w-1 bg-red-500 rounded-full" aria-hidden="true" />
          </div>
        </div>

        <div
          className="mx-auto h-[280px] w-[280px] select-none rounded-full border-2 border-gray-300 shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.2s cubic-bezier(0.12, 0.11, 0, 1)' : undefined,
            willChange: 'transform',
          }}
          aria-live="off"
          role="img"
          aria-label={`Picker wheel with ${options.length} options`}
          onTransitionEnd={onTransitionEnd}
        >
          <svg viewBox="-100 -100 200 200" width={size} height={size} className="block h-full w-full">
            {slices.map((slice, i) => (
              <path key={i} d={slice.path} fill={options[i]?.color || slice.color} stroke="#fff" strokeWidth="1" />
            ))}
            {slices.map((slice, i) => (
              <text
                key={`t-${i}`}
                x={slice.textPosition.x}
                y={slice.textPosition.y}
                transform={`rotate(${slice.textRotation})`}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="4"
                fill="#111827"
                fontWeight="bold"
              >
                {options[i]?.label || ''}
              </text>
            ))}
            {/* Center circle */}
            <circle cx="0" cy="0" r="8" fill="#374151" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <button
        ref={spinButtonRef}
        onClick={handleSpin}
        className="mt-6 rounded-lg bg-brand px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
        aria-label="Spin the wheel"
        disabled={spinning || options.length === 0}
      >
        {spinning ? 'Spinning…' : 'Spin the Wheel!'}
      </button>
    </div>
  )
}