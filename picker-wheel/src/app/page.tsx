'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Wheel } from '@/components/Wheel'
import { OptionsList } from '@/components/OptionsList'
import { AdSlot } from '@/components/AdSlot'
import { WinnerAnnouncement } from '@/components/WinnerAnnouncement'
import { ThemeToggle } from '@/components/ThemeToggle'
import { assignColors } from '@/lib/colors'
import { defaultOptions } from '@/lib/defaults'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { shuffleArray } from '@/lib/wheel'

export type OptionItem = { id: string; label: string; color: string }

export default function HomePage() {
  const [options, setOptions] = useLocalStorage<OptionItem[]>('pw:options', assignColors(defaultOptions))
  const [lastWinner, setLastWinner] = useLocalStorage<OptionItem | null>('pw:lastWinner', null)
  const [spinning, setSpinning] = useState(false)

  const nonEmptyOptions = useMemo(() => options.filter(o => o.label.trim().length > 0), [options])

  useEffect(() => {
    if (options.length === 0) setOptions(assignColors(defaultOptions))
  }, [options, setOptions])

  const handleAdd = (label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return
    const next = assignColors([...options, { id: crypto.randomUUID(), label: trimmed, color: '' }])
    setOptions(next)
  }

  const handleRemove = (id: string) => {
    setOptions(options.filter(o => o.id !== id))
  }

  const handleUpdate = (id: string, label: string) => {
    setOptions(options.map(o => (o.id === id ? { ...o, label } : o)))
  }

  const handleUpdateColor = (id: string, color: string) => {
    setOptions(options.map(o => (o.id === id ? { ...o, color } : o)))
  }

  const handleBulk = (bulk: string) => {
    const parts = bulk
      .split(/\n|,/)
      .map(s => s.trim())
      .filter(Boolean)
    const next = assignColors(parts.map(l => ({ id: crypto.randomUUID(), label: l, color: '' })))
    setOptions(next)
  }

  const handleShuffle = () => {
    setOptions(assignColors(shuffleArray([...options])))
  }

  const handleReset = () => setOptions(assignColors(defaultOptions))
  const handleClear = () => setOptions([])

  const onWinner = (winner: OptionItem) => {
    setLastWinner(winner)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Picker Wheel</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Add options, spin, and get a random winner.</p>
        </header>

      <AdSlot />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section aria-label="Wheel" className="order-2 md:order-1">
          <Wheel
            options={nonEmptyOptions}
            spinning={spinning}
            setSpinning={setSpinning}
            onWinner={onWinner}
            lastWinner={lastWinner}
          />
        </section>

        <section aria-label="Options" className="order-1 md:order-2">
          <OptionsList
            options={options}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
            onUpdateColor={handleUpdateColor}
            onBulk={handleBulk}
            onShuffle={handleShuffle}
            onReset={handleReset}
            onClear={handleClear}
            disabled={spinning}
          />
        </section>
      </div>

      <WinnerAnnouncement winner={lastWinner?.label || ''} />


        <footer className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Made with Next.js. Installable as a PWA. Placeholder ads and analytics included.</p>
        </footer>
      </main>
  )
}