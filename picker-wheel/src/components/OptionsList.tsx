'use client'

import { useRef, useState } from 'react'
import type { OptionItem } from '@/app/page'

type Props = {
  options: OptionItem[]
  onAdd: (label: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, label: string) => void
  onBulk: (bulk: string) => void
  onShuffle: () => void
  onReset: () => void
  onClear: () => void
  disabled?: boolean
}

export function OptionsList({ options, onAdd, onRemove, onUpdate, onBulk, onShuffle, onReset, onClear, disabled }: Props) {
  const [newLabel, setNewLabel] = useState('')
  const bulkRef = useRef<HTMLTextAreaElement | null>(null)

  return (
    <div>
      <div className="rounded-lg border border-gray-200 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Add an option"
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            disabled={disabled}
          >
            Add
          </button>
        </div>

        <ul className="mt-3 space-y-2" aria-label="Option list">
          {options.map(opt => (
            <li key={opt.id} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: opt.color }} aria-hidden="true" />
              <input
                className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={opt.label}
                onChange={e => onUpdate(opt.id, e.target.value)}
                aria-label={`Edit option ${opt.label}`}
                disabled={disabled}
              />
              <button
                onClick={() => onRemove(opt.id)}
                className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
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
        <button onClick={onShuffle} className="rounded border px-3 py-2 text-sm hover:bg-gray-50" disabled={disabled}>Shuffle</button>
        <button onClick={onReset} className="rounded border px-3 py-2 text-sm hover:bg-gray-50" disabled={disabled}>Reset</button>
        <button onClick={onClear} className="rounded border px-3 py-2 text-sm hover:bg-gray-50" disabled={disabled}>Clear</button>
      </div>

      <div className="mt-4">
        <label htmlFor="bulk" className="mb-1 block text-xs font-medium text-gray-600">Bulk paste (comma or newline separated)</label>
        <textarea
          id="bulk"
          ref={bulkRef}
          rows={3}
          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder={"e.g.\nRed\nBlue\nGreen"}
          aria-label="Bulk paste options"
          disabled={disabled}
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onBulk(bulkRef.current?.value || '')}
            className="rounded bg-brand px-3 py-2 text-sm text-white hover:bg-brand-dark disabled:opacity-50"
            disabled={disabled}
          >
            Apply
          </button>
          <button
            onClick={() => { if (bulkRef.current) bulkRef.current.value = '' }}
            className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}