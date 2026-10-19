"use client";

import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  tone?: "default" | "employer" | "customer" | "bank";
}

const toneClass = {
  default: "bg-[var(--border-color)] text-[var(--text-muted)]",
  bank: "bg-[#0057B8]/10 text-[#0057B8]",
  customer: "bg-[#16A34A]/10 text-[#16A34A]",
  employer: "bg-[#0F766E]/10 text-[#0F766E]",
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
  tone = "default",
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-4 py-12 text-center", className)}>
      <div
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
          toneClass[tone]
        )}
      >
        <Icon size={26} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-6 text-[var(--text-muted)]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
