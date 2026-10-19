"use client";

import { cn } from "@/src/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "default";
  className?: string;
}

const variants = {
  primary: "bg-[#0057B8]/10 text-[#0057B8]",
  success: "bg-[#16A34A]/10 text-[#16A34A]",
  warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
  danger: "bg-[#DC2626]/10 text-[#DC2626]",
  default: "bg-[var(--border-color)] text-[var(--text-secondary)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
