'use client';
export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-white/[0.06] skeleton-shimmer" />
          <div className="h-3 w-20 rounded bg-white/[0.04] skeleton-shimmer" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-white/[0.04] skeleton-shimmer mb-2" />
      <div className="flex gap-2 mt-3">
        <div className="h-5 w-14 rounded-full bg-white/[0.04] skeleton-shimmer" />
        <div className="h-5 w-16 rounded-full bg-white/[0.04] skeleton-shimmer" />
        <div className="h-5 w-12 rounded-full bg-white/[0.04] skeleton-shimmer" />
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-3 w-16 rounded bg-white/[0.04] skeleton-shimmer" />
        <div className="h-3 w-20 rounded bg-white/[0.04] skeleton-shimmer" />
      </div>
    </div>
  );
}
