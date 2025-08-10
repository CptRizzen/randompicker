'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { OptionItem } from '@/app/page'
import { computeSlices, getSpinTargetRotation } from '@/lib/wheel'
import { playSpinSound, playWinnerSound, playClickSound } from '@/lib/sounds'

type Props = {
  options: OptionItem[]
  onWinner: (winner: OptionItem) => void
  spinning: boolean
  setSpinning: (v: boolean) => void
  lastWinner?: OptionItem | null
}

export function Wheel({ options, onWinner, spinning, setSpinning, lastWinner }: Props) {
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const baseRotRef = useRef(0)
  const spinButtonRef = useRef<HTMLButtonElement | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const slices = useMemo(() => computeSlices(options.map(o => o.label)), [options])

  useEffect(() => {
    // Reset rotation if options change significantly
    setRotation(prev => prev % 360)
  }, [options.length])

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isFullscreen])

  const handleSpin = () => {
    if (spinning || options.length === 0) return
    
    // Play click sound for button press
    if (soundEnabled) {
      playClickSound()
    }
    
    setSpinning(true)

    // Play spinning sound
    if (soundEnabled) {
      playSpinSound()
    }

    const targetRotation = getSpinTargetRotation(baseRotRef.current)
    baseRotRef.current = targetRotation
    setRotation(targetRotation)
  }

  const determineWinnerByPosition = () => {
    // COMPLETELY NEW APPROACH: Use actual DOM positioning to find winner
    // Check which slice text element is closest to the top center position
    
    if (!svgRef.current) return 0

    console.log('=== POSITION-BASED WINNER DETERMINATION ===')
    
    // Get the SVG's bounding box to find the center top position
    const svgRect = svgRef.current.getBoundingClientRect()
    const centerX = svgRect.left + svgRect.width / 2
    const topY = svgRect.top + 20 // A bit down from the very top edge
    
    console.log(`Target position: (${centerX.toFixed(1)}, ${topY.toFixed(1)})`)
    
    let closestDistance = Infinity
    let winnerIndex = 0
    
    // Check each text element's position
    const textElements = svgRef.current.querySelectorAll('[data-text-for-slice]')
    
    textElements.forEach((textElement, index) => {
      const textRect = textElement.getBoundingClientRect()
      const textCenterX = textRect.left + textRect.width / 2
      const textCenterY = textRect.top + textRect.height / 2
      
      // Calculate distance from text center to target top position
      const distance = Math.sqrt(
        Math.pow(textCenterX - centerX, 2) + 
        Math.pow(textCenterY - topY, 2)
      )
      
      console.log(`Slice ${index} (${options[index]?.label}):`)
      console.log(`  Text position: (${textCenterX.toFixed(1)}, ${textCenterY.toFixed(1)})`)
      console.log(`  Distance from top: ${distance.toFixed(1)}px`)
      
      if (distance < closestDistance) {
        closestDistance = distance
        winnerIndex = index
      }
    })
    
    console.log(`Winner: Slice ${winnerIndex} (${options[winnerIndex]?.label})`)
    console.log('===============================================')
    
    return winnerIndex
  }

  const onTransitionEnd = () => {
    // Wait a small moment for the wheel to fully stop, then determine winner by actual position
    setTimeout(() => {
      const winnerIndex = determineWinnerByPosition()
      const winner = options[winnerIndex]
      if (winner) {
        onWinner(winner)
        // Play winner celebration sound
        if (soundEnabled) {
          setTimeout(() => playWinnerSound(), 100) // Small delay after wheel stops
        }
      }
      setSpinning(false)
      spinButtonRef.current?.focus()
    }, 200) // Slightly longer delay to ensure all animations are complete
  }

  const size = isFullscreen ? 800 : 320

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const wheelContent = (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Wheel container */}
        <div 
          ref={wheelRef}
          className={`mx-auto select-none rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-lg dark:shadow-gray-800/50 overflow-hidden bg-white dark:bg-gray-800 ${
            isFullscreen ? 'h-[800px] w-[800px]' : 'h-[320px] w-[320px]'
          }`}
        >
          <div
            className="h-full w-full"
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
            <svg 
              ref={svgRef}
              viewBox="-120 -120 240 240" 
              width={size} 
              height={size} 
              className="block h-full w-full"
            >
              {/* Draw pie slices with data attributes for identification */}
              {slices.map((slice, i) => (
                <path 
                  key={i} 
                  d={slice.path} 
                  fill={options[i]?.color || slice.color}
                  stroke="#ffffff"
                  strokeWidth="1"
                  data-slice-index={i}
                  data-slice-label={options[i]?.label}
                />
              ))}
              
              {/* Draw text labels with clear identification */}
              {slices.map((slice, i) => (
                <text
                  key={`t-${i}`}
                  x={slice.textPosition.x}
                  y={slice.textPosition.y}
                  transform={`rotate(${slice.textRotation}, ${slice.textPosition.x}, ${slice.textPosition.y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#111827"
                  className="select-none"
                  data-text-for-slice={i}
                  data-slice-label={options[i]?.label}
                >
                  {options[i]?.label || ''}
                </text>
              ))}
              
              {/* Center circle for the pointer */}
              <circle cx="0" cy="0" r="12" fill="#374151" stroke="#ffffff" strokeWidth="2" className="dark:fill-gray-600" />
            </svg>
          </div>
        </div>

        {/* Center pointer - positioned to completely cover the gray center circle */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 z-10">
          <svg width="180" height="180" viewBox="-90 -90 180 180" className="block">
            {/* Pointer triangle pointing upward with curved bottom */}
            <path 
              d="M 0,-81 L 27,-36 Q 0,-27 -27,-36 Z" 
              fill="#dc2626" 
              stroke="#ffffff" 
              strokeWidth="4.5"
            />
          </svg>
        </div>


      </div>

      {/* Debug info while spinning is disabled */}
      {!spinning && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Current rotation: {(rotation % 360).toFixed(1)}°
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-4 items-center">
        <button
          ref={spinButtonRef}
          onClick={handleSpin}
          className="rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl dark:shadow-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Spin the wheel"
          disabled={spinning || options.length === 0}
        >
          {spinning ? 'Spinning…' : 'Spin the Wheel!'}
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="rounded-md bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 px-4 py-3 text-white font-medium shadow-lg hover:shadow-xl dark:shadow-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen (ESC)' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            // Minimize icon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Expand icon  
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
        
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled)
            if (soundEnabled) {
              playClickSound() // Play sound when turning on
            }
          }}
          className={`rounded-md px-4 py-3 font-medium shadow-lg hover:shadow-xl dark:shadow-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            soundEnabled 
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white focus:ring-green-500' 
              : 'bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white focus:ring-gray-500'
          }`}
          aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
        >
          {soundEnabled ? (
            // Sound on icon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h2l4.5-4.5v13L6 18z" />
            </svg>
          ) : (
            // Sound off icon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a2 2 0 01-2-2v-4a2 2 0 012-2h1.586l4.707-4.707C10.923 1.663 12 2.109 12 3v18c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )

  // Render fullscreen overlay or normal content
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-7xl min-h-full flex flex-col justify-center">
          {/* Exit button in fullscreen mode */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleFullscreen}
              className="rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 transition-colors duration-200"
              aria-label="Exit fullscreen"
              title="Exit fullscreen (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main content area with wheel and ad */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Wheel content */}
            <div className="flex-shrink-0">
              {wheelContent}
            </div>

            {/* Ad placeholder - positioned to the right on large screens, below on smaller screens */}
            <div className="flex-shrink-0">
              <div className="w-80 h-96 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Advertisement
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  320x400 Ad Space
                </p>
                <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
                  Replace with AdSense code
                </div>
                {/* 
                  To integrate with Google AdSense, replace this placeholder with:
                  <ins className="adsbygoogle"
                       style={{ display: 'block' }}
                       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                       data-ad-slot="XXXXXXXXXX"
                       data-ad-format="auto"
                       data-full-width-responsive="true">
                  </ins>
                */}
              </div>
            </div>
          </div>
          
          {/* Winner announcement - only in fullscreen mode */}
          {lastWinner && (
            <div className="mt-8" aria-live="polite" aria-atomic="true" role="status">
              <div className="rounded-md border border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20 px-6 py-4 text-green-800 dark:text-green-200 text-xl text-center">
                Winner: <strong className="text-2xl">{lastWinner.label}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return wheelContent
}