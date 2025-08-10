type Props = { winner: string }

export function WinnerAnnouncement({ winner }: Props) {
  return (
    <div className="mt-6" aria-live="polite" aria-atomic="true" role="status">
      {winner ? (
        <div className="rounded-md border border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-green-800 dark:text-green-200">
          Winner: <strong>{winner}</strong>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Spin the wheel to pick a winner.</p>
      )}
    </div>
  )
}