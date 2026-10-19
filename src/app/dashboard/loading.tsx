import { KpiSkeleton, ChartSkeleton, TableSkeleton } from "@/src/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
      <div className="glass-card rounded-2xl p-5">
        <TableSkeleton rows={5} />
      </div>
    </>
  );
}
