type Props = { winner: string }

export function WinnerAnnouncement({ winner }: Props) {
  return (
    <div className="mt-6" aria-live="polite" aria-atomic="true" role="status">
      {winner ? (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          Winner: <strong>{winner}</strong>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Spin the wheel to pick a winner.</p>
      )}
    </div>
  )
}