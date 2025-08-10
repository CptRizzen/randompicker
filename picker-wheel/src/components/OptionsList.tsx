'use client'

import { useRef, useState, useEffect } from 'react'
import type { OptionItem } from '@/app/page'

type Props = {
  options: OptionItem[]
  onAdd: (label: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, label: string) => void
  onUpdateColor: (id: string, color: string) => void
  onBulk: (bulk: string) => void
  onShuffle: () => void
  onReset: () => void
  onClear: () => void
  disabled?: boolean
}

export function OptionsList({ options, onAdd, onRemove, onUpdate, onUpdateColor, onBulk, onShuffle, onReset, onClear, disabled }: Props) {
  const [newLabel, setNewLabel] = useState('')
  const [colorPickerId, setColorPickerId] = useState<string | null>(null)
  const [bulkText, setBulkText] = useState('')
  const bulkRef = useRef<HTMLTextAreaElement | null>(null)

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (colorPickerId && target && !target.closest('.color-picker-container')) {
        setColorPickerId(null)
      }
    }

    if (colorPickerId) {
      // Use a slight delay to avoid immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [colorPickerId])

  return (
    <div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Add an option"
            className="min-w-0 flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onAdd(newLabel)
                setNewLabel('')
              }
            }}
            disabled={disabled}
            aria-label="New option"
          />
          <button
            onClick={() => {
              onAdd(newLabel)
              setNewLabel('')
            }}
            className="rounded-md bg-gray-900 dark:bg-gray-100 px-3 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
          >
            Add
          </button>
        </div>

        <ul className="mt-3 space-y-2" aria-label="Option list">
          {options.map(opt => (
            <li key={opt.id} className="flex items-center gap-2">
              <div className="relative color-picker-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Color button clicked for', opt.label, 'current picker:', colorPickerId)
                    setColorPickerId(colorPickerId === opt.id ? null : opt.id)
                  }}
                  className="inline-block h-6 w-6 rounded-sm border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  style={{ background: opt.color }}
                  aria-label={`Change color for ${opt.label}`}
                  title="Click to change color"
                  disabled={disabled}
                />
                {colorPickerId === opt.id && (
                  <div className="absolute z-50 mt-1 left-0 min-w-max">
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-2xl ring-1 ring-black ring-opacity-5">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={opt.color}
                          onChange={(e) => {
                            onUpdateColor(opt.id, e.target.value)
                          }}
                          className="w-10 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                          aria-label={`Color picker for ${opt.label}`}
                        />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-700 dark:text-gray-300 font-mono">{opt.color}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Click to change</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setColorPickerId(null)
                          }}
                          className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          aria-label="Close color picker"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <input
                className="min-w-0 flex-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={opt.label}
                onChange={e => onUpdate(opt.id, e.target.value)}
                aria-label={`Edit option ${opt.label}`}
                disabled={disabled}
              />
              <button
                onClick={() => onRemove(opt.id)}
                className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-600"
                aria-label={`Remove option ${opt.label}`}
                disabled={disabled}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button onClick={onShuffle} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600" disabled={disabled}>Shuffle</button>
        <button onClick={onReset} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600" disabled={disabled}>Reset</button>
        <button onClick={onClear} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600" disabled={disabled}>Clear</button>
      </div>

      <div className="mt-4">
        <label htmlFor="bulk" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Bulk paste (comma or newline separated)</label>
        <textarea
          id="bulk"
          ref={bulkRef}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder={"e.g.\nRed\nBlue\nGreen"}
          aria-label="Bulk paste options"
          disabled={disabled}
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => {
              onBulk(bulkText)
              setBulkText('') // Clear after applying
            }}
            className={`rounded px-3 py-2 text-sm transition-all duration-200 ${
              bulkText.trim().length > 0 && !disabled
                ? 'bg-brand dark:bg-brand-light text-white dark:text-gray-900 hover:bg-brand-dark dark:hover:bg-brand shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            disabled={disabled || bulkText.trim().length === 0}
            aria-label={bulkText.trim().length > 0 ? 'Apply bulk options' : 'Enter text to apply bulk options'}
          >
            Apply
          </button>
          <button
            onClick={() => setBulkText('')}
            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}