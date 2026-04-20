export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-50 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[#8B5CF6]"
        style={{ animation: 'route-progress 1.2s var(--ease-out-quart) infinite' }}
      />
    </div>
  )
}
