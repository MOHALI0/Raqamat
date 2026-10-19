"use client";

import { motion } from "framer-motion";
import {
  Users,
  Files,
  AlertTriangle,
  Gauge,
  Wallet,
  Percent,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Shield,
  Landmark,
  Target,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const iconMap = {
  users: Users,
  files: Files,
  alert: AlertTriangle,
  score: Gauge,
  income: Wallet,
  percent: Percent,
  activity: Activity,
  shield: Shield,
  bank: Landmark,
  target: Target,
};

const accentMap = {
  blue: {
    icon: "bg-[#0057B8]/10 text-[#0057B8]",
    ring: "#0057B8",
    bar: "bg-[#0057B8]",
    track: "bg-[#0057B8]/12",
    soft: "hover:border-[#0057B8]/35",
  },
  green: {
    icon: "bg-[#16A34A]/10 text-[#16A34A]",
    ring: "#16A34A",
    bar: "bg-[#16A34A]",
    track: "bg-[#16A34A]/12",
    soft: "hover:border-[#16A34A]/35",
  },
  amber: {
    icon: "bg-[#F59E0B]/10 text-[#F59E0B]",
    ring: "#F59E0B",
    bar: "bg-[#F59E0B]",
    track: "bg-[#F59E0B]/12",
    soft: "hover:border-[#F59E0B]/35",
  },
  red: {
    icon: "bg-[#DC2626]/10 text-[#DC2626]",
    ring: "#DC2626",
    bar: "bg-[#DC2626]",
    track: "bg-[#DC2626]/12",
    soft: "hover:border-[#DC2626]/35",
  },
  slate: {
    icon: "bg-[var(--border-color)] text-[var(--text-secondary)]",
    ring: "#94a3b8",
    bar: "bg-[var(--text-muted)]",
    track: "bg-[var(--border-color)]",
    soft: "hover:border-[var(--text-muted)]",
  },
};

export type KpiDeltaTone = "good" | "bad" | "neutral";

interface KpiCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap | string;
  trend?: "up" | "down" | "flat";
  change?: string;
  deltaTone?: KpiDeltaTone;
  delay?: number;
  subtitle?: string;
  accent?: keyof typeof accentMap;
  sparkline?: number[];
  progress?: number;
  progressLabel?: string;
  unit?: string;
  className?: string;
}

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - 4 - ((v - min) / range) * (h - 8);
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-[72px]" aria-hidden>
      <polygon fill={color} fillOpacity="0.12" points={area} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function ProgressRing({
  value,
  color,
  size = 52,
}: {
  value: number;
  color: string;
  size?: number;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="5"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold tabular-nums text-[var(--text-primary)]">
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

function resolveDeltaTone(trend: "up" | "down" | "flat", override?: KpiDeltaTone): KpiDeltaTone {
  if (override) return override;
  if (trend === "down") return "bad";
  if (trend === "flat") return "neutral";
  return "good";
}

export function KpiCard({
  title,
  value,
  icon,
  trend = "up",
  change,
  deltaTone,
  delay = 0,
  subtitle,
  accent = "blue",
  sparkline,
  progress,
  progressLabel,
  unit,
  className,
}: KpiCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || Gauge;
  const theme = accentMap[accent] || accentMap.blue;
  const tone = resolveDeltaTone(trend, deltaTone);
  const clamped =
    typeof progress === "number" && Number.isFinite(progress)
      ? Math.min(100, Math.max(0, Math.round(progress * 10) / 10))
      : undefined;

  const toneClass =
    tone === "good"
      ? "bg-[#16A34A]/10 text-[#16A34A]"
      : tone === "bad"
        ? "bg-[#DC2626]/10 text-[#DC2626]"
        : "bg-[var(--border-color)] text-[var(--text-secondary)]";

  const TrendIcon = trend === "down" ? TrendingDown : trend === "flat" ? Minus : TrendingUp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        "kpi-tile group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-[var(--shadow-card)] transition-colors",
        theme.soft,
        className
      )}
    >
      {/* رأس البطاقة: العنوان + التغيير */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2.5">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", theme.icon)}>
            <Icon size={16} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[var(--text-secondary)]">{title}</p>
            {subtitle && (
              <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        </div>
        {change && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
              toneClass
            )}
          >
            <TrendIcon size={11} />
            {change}
          </span>
        )}
      </div>

      {/* القيمة + الحلقة */}
      <div className="mt-4 flex flex-1 items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <p className="truncate text-2xl font-bold leading-none tracking-tight text-[var(--text-primary)] tabular-nums sm:text-[1.75rem]">
              {value}
            </p>
            {unit && <span className="text-xs font-medium text-[var(--text-muted)]">{unit}</span>}
          </div>
          {typeof clamped === "number" && progressLabel && (
            <p className="mt-1.5 max-w-[11rem] text-[10px] leading-4 text-[var(--text-muted)]">
              {progressLabel}
            </p>
          )}
          {sparkline && sparkline.length > 1 && (
            <div className="mt-2">
              <MiniSpark values={sparkline} color={theme.ring} />
            </div>
          )}
        </div>

        {typeof clamped === "number" ? (
          <ProgressRing value={clamped} color={theme.ring} />
        ) : (
          <div className={cn("flex h-[52px] w-[52px] items-center justify-center rounded-full", theme.icon)}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** شبكة موحّدة لبطاقات المؤشرات */
export function KpiGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 6;
  className?: string;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    6: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div className={cn("mb-6 grid gap-3", cols[columns], className)}>{children}</div>
  );
}
