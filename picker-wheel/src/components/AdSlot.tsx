export function AdSlot() {
  return (
    <div className="mb-6">
      <div
        className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500"
        data-ad-placeholder={true}
        role="complementary"
        aria-label="Advertisement placeholder"
      >
        Ad placeholder (connect Google AdSense or other networks)
      </div>
    </div>
  )
}