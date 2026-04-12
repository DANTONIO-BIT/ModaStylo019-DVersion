// Skeleton loading card — same proportions as ProductCard
// Uses CSS animation (not GSAP) for performance on multiple instances

export const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    {/* Image placeholder */}
    <div
      className="w-full skeleton-shine"
      style={{ aspectRatio: '3/4', background: 'var(--color-surface)' }}
    />
    {/* Text placeholders */}
    <div className="flex flex-col gap-2 px-1">
      <div className="skeleton-shine h-3 w-3/4" style={{ background: 'var(--color-surface)' }} />
      <div className="skeleton-shine h-3 w-1/3" style={{ background: 'var(--color-surface)' }} />
    </div>
  </div>
)
