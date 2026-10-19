"use client";

import { Search } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "بحث...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        size={16}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] py-2.5 pr-10 pl-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#0057B8] focus:outline-none focus:ring-2 focus:ring-[#0057B8]/20"
      />
    </div>
  );
}
