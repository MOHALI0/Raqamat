export function KpiSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="skeleton mb-3 h-10 w-10 rounded-xl" />
      <div className="skeleton mb-2 h-7 w-20 rounded-lg" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="skeleton mb-4 h-4 w-32 rounded" />
      <div className="skeleton h-48 w-full rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-full rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-10 w-full rounded-lg" />
      ))}
    </div>
  );
}
