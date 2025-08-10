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
  const [rotation, setRotation] = useState(0)
  const baseRotRef = useRef(0)
  const spinButtonRef = useRef<HTMLButtonElement | null>(null)

  const slices = useMemo(() => computeSlices(options.map(o => o.label)), [options])

  useEffect(() => {
    // Reset rotation if options change significantly
    setRotation(prev => prev % 360)
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
    const normalized = ((rotation % 360) + 360) % 360
    const landingAngleFromTop = (360 - (normalized % 360)) % 360
    const idx = angleToIndex(landingAngleFromTop, slices.length)
    const winner = options[idx]
    if (winner) onWinner(winner)
    setSpinning(false)
    spinButtonRef.current?.focus()
  }

  const size = 280

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className="mx-auto h-[280px] w-[280px] select-none rounded-full border border-gray-200 shadow-sm"
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
              <path key={i} d={slice.path} fill={options[i]?.color || slice.color} />
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
              >
                {options[i]?.label || ''}
              </text>
            ))}
            <circle cx="0" cy="0" r="99" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          </svg>

          {/* Pointer */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
            <div className="h-0 w-0 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-rose-500" aria-hidden="true" />
          </div>
        </div>
      </div>

      <button
        ref={spinButtonRef}
        onClick={handleSpin}
        className="mt-4 rounded-md bg-brand px-5 py-2.5 text-white shadow hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Spin the wheel"
        disabled={spinning || options.length === 0}
      >
        {spinning ? 'Spinning…' : 'Spin'}
      </button>
    </div>
  )
}