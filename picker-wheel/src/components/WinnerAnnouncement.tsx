'use client'

import { useEffect, useState } from 'react'

type Props = { winner: string }

export function WinnerAnnouncement({ winner }: Props) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (winner) {
      setShowAnimation(true)
      const timer = setTimeout(() => setShowAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [winner])

  return (
    <div className="mt-8" aria-live="polite" aria-atomic="true" role="status">
      {winner ? (
        <div className={`rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 text-center shadow-lg transition-all duration-500 ${showAnimation ? 'scale-105 shadow-xl' : 'scale-100'}`}>
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-lg font-bold text-gray-800 mb-1">🏆 Winner! 🏆</div>
          <div className="text-xl font-extrabold text-orange-600">{winner}</div>
          <div className="text-sm text-gray-600 mt-2">Congratulations!</div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-gray-600">
          <div className="text-lg mb-1">🎲</div>
          <p className="text-sm">Spin the wheel to pick a winner!</p>
        </div>
      )}
    </div>
  )
}