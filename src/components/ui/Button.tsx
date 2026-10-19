"use client";

import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "employer";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-[#0057B8] text-white hover:bg-[#004494] shadow-sm shadow-[#0057B8]/25",
  secondary: "border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[#0057B8]/40",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--border-color)]",
  danger:
    "border border-[#DC2626]/30 bg-[#DC2626]/5 text-[#DC2626] hover:bg-[#DC2626]/10 hover:border-[#DC2626]/50",
  employer: "bg-[#0F766E] text-white hover:bg-[#0D9488] shadow-sm shadow-[#0F766E]/25",
};

const sizes = {
  sm: "gap-1.5 px-3 py-1.5 text-xs rounded-lg",
  md: "gap-2 px-4 py-2.5 text-sm rounded-xl",
  lg: "gap-2 px-5 py-3 text-sm rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
