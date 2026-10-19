"use client";

import { Badge } from "./Badge";
import { cn } from "@/src/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "primary" | "default"> = {
  نشط: "success",
  مكتمل: "success",
  جاهز: "success",
  منخفض: "success",
  مراجعة: "warning",
  "قيد المراجعة": "warning",
  متوسط: "warning",
  معلق: "danger",
  مرتفع: "danger",
  "قيد الإعداد": "warning",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariant[status] || "default"}>{status}</Badge>;
}

export function DataTable<T>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-3 text-right text-xs font-semibold text-[var(--text-muted)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "border-b border-[var(--border-color)] transition-colors",
                onRowClick && "cursor-pointer hover:bg-[var(--bg-secondary)]"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3 text-[var(--text-primary)]">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
