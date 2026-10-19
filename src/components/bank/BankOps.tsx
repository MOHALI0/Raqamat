"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CircleDot,
  Clock3,
  Radio,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import { cn } from "@/src/lib/utils";

export function OpsBanner({
  title,
  subtitle,
  badges = [],
  actions,
  live = true,
  tone = "bank",
  footer,
}: {
  title: string;
  subtitle: string;
  badges?: { label: string; variant?: "primary" | "success" | "warning" | "danger" | "default" }[];
  actions?: React.ReactNode;
  live?: boolean;
  tone?: "bank" | "employer" | "customer";
  footer?: React.ReactNode;
}) {
  const accent =
    tone === "employer" ? "via-[#0F766E]/45" : tone === "customer" ? "via-[#16A34A]/40" : "via-[#0057B8]/40";
  const bannerTone =
    tone === "employer" ? "ops-banner ops-banner--employer" : tone === "customer" ? "ops-banner ops-banner--customer" : "ops-banner";

  return (
    <div className={cn(bannerTone, "mb-6 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]")}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {live && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A]/10 px-2.5 py-1 text-[10px] font-semibold text-[#16A34A]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16A34A] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                </span>
                بث مباشر
              </span>
            )}
            {badges.map((b) => (
              <Badge key={b.label} variant={b.variant || "default"}>
                {b.label}
              </Badge>
            ))}
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">{title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-[var(--text-muted)] sm:text-sm">{subtitle}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className={cn("h-px bg-gradient-to-l from-transparent to-transparent", accent)} />
      {(live || footer) && (
        <div className="flex flex-wrap items-center gap-4 px-5 py-2 text-[10px] text-[var(--text-muted)] sm:text-[11px]">
          {footer ?? (
            <>
              <span className="inline-flex items-center gap-1">
                <Radio size={12} className="text-[#0057B8]" /> مركز العمليات المالية
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#16A34A]" /> قنوات مؤمّنة
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} /> تحديث مستمر كل 30 ثانية
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function MetricRail({
  items,
  title,
}: {
  items: {
    label: string;
    value: string;
    hint?: string;
    tone?: "ok" | "warn" | "critical" | "info";
    progress?: number;
    delta?: string;
  }[];
  title?: string;
}) {
  const toneClass = {
    ok: { value: "text-[#16A34A]", ring: "#16A34A", chip: "bg-[#16A34A]/10 text-[#16A34A]" },
    warn: { value: "text-[#F59E0B]", ring: "#F59E0B", chip: "bg-[#F59E0B]/10 text-[#F59E0B]" },
    critical: { value: "text-[#DC2626]", ring: "#DC2626", chip: "bg-[#DC2626]/10 text-[#DC2626]" },
    info: { value: "text-[#0057B8]", ring: "#0057B8", chip: "bg-[#0057B8]/10 text-[#0057B8]" },
  };

  return (
    <div className="mb-6">
      {title && (
        <p className="mb-2.5 text-xs font-semibold text-[var(--text-muted)]">{title}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const tone = toneClass[item.tone || "info"];
          const progress =
            typeof item.progress === "number" && Number.isFinite(item.progress)
              ? Math.min(100, Math.max(0, Math.round(item.progress * 10) / 10))
              : undefined;
          const r = 18;
          const c = 2 * Math.PI * r;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="metric-cell flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-3 shadow-[var(--shadow-card)]"
            >
              {typeof progress === "number" ? (
                <div className="relative h-12 w-12 shrink-0">
                  <svg width="48" height="48" className="-rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border-color)" strokeWidth="4" />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r={r}
                      fill="none"
                      stroke={tone.ring}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={c}
                      initial={{ strokeDashoffset: c }}
                      animate={{ strokeDashoffset: c - (progress / 100) * c }}
                      transition={{ duration: 0.85, delay: 0.08 + i * 0.04 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums text-[var(--text-primary)]">
                    {Math.round(progress)}
                  </span>
                </div>
              ) : (
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold", tone.chip)}>
                  {i + 1}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-medium leading-4 text-[var(--text-muted)]">{item.label}</p>
                  {item.delta && (
                    <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold", tone.chip)}>
                      {item.delta}
                    </span>
                  )}
                </div>
                <p className={cn("mt-0.5 truncate text-lg font-bold tracking-tight tabular-nums", tone.value)}>
                  {item.value}
                </p>
                {item.hint && (
                  <p className="mt-0.5 truncate text-[10px] leading-4 text-[var(--text-muted)]">{item.hint}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function RiskPulse({
  score,
  label = "مؤشر المخاطر التشغيلي",
  bands = [
    { label: "منخفض", max: 30, color: "#16A34A" },
    { label: "متوسط", max: 55, color: "#F59E0B" },
    { label: "مرتفع", max: 100, color: "#DC2626" },
  ],
  unit = "/100",
}: {
  score: number;
  label?: string;
  bands?: { label: string; max: number; color: string }[];
  unit?: string;
}) {
  const safeScore = Math.min(100, Math.max(0, Math.round(score * 10) / 10));
  const bandIndex = bands.findIndex((b) => safeScore <= b.max);
  const band = bands[bandIndex === -1 ? bands.length - 1 : bandIndex];
  const prevMax = bandIndex > 0 ? bands[bandIndex - 1].max : 0;
  const size = 88;
  const r = 34;
  const c = 2 * Math.PI * r;

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth="8" />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={band.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: c - (safeScore / 100) * c }}
              transition={{ duration: 0.95, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold tabular-nums" style={{ color: band.color }}>
              {safeScore}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span
              className="rounded-lg px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${band.color}18`, color: band.color }}
            >
              {band.label}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">{unit}</span>
          </div>
          <p className="mt-2 text-[10px] text-[var(--text-muted)]">
            النطاق: {prevMax}–{band.max}
          </p>

          <div className="mt-3 flex gap-1">
            {bands.map((b, i) => {
              const start = i === 0 ? 0 : bands[i - 1].max;
              const active = safeScore >= start && safeScore <= b.max;
              return (
                <div key={b.label} className="min-w-0 flex-1">
                  <div
                    className="h-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: active ? b.color : `${b.color}33` }}
                  />
                  <p className="mt-1 truncate text-center text-[9px] text-[var(--text-muted)]">{b.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PipelineStage({
  stages,
}: {
  stages: { name: string; count: number; amount?: string; tone?: string }[];
}) {
  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.name}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--text-primary)]">
              <span className="me-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#0057B8]/10 text-[10px] font-bold text-[#0057B8]">
                {i + 1}
              </span>
              {stage.name}
            </span>
            <span className="tabular-nums text-[var(--text-secondary)]">
              {stage.count}
              {stage.amount ? ` · ${stage.amount}` : ""}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--border-color)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stage.count / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="h-full rounded-full"
              style={{ backgroundColor: stage.tone || "#0057B8" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiveFeed({
  items,
}: {
  items: { id: string; title: string; detail: string; time: string; type: "info" | "success" | "warning" | "danger" }[];
}) {
  const colors = {
    info: "bg-[#0057B8]",
    success: "bg-[#16A34A]",
    warning: "bg-[#F59E0B]",
    danger: "bg-[#DC2626]",
  };

  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "flex gap-3 py-3",
            i < items.length - 1 && "border-b border-[var(--border-color)]"
          )}
        >
          <div className="mt-1.5">
            <span className={cn("block h-2 w-2 rounded-full", colors[item.type])} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
              <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{item.time}</span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModuleLinks({
  links,
}: {
  links: { href: string; title: string; desc: string; icon: LucideIcon; meta?: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex items-start gap-3 rounded-xl border border-[var(--border-color)] p-3 transition-all hover:border-[#0057B8]/40 hover:bg-[#0057B8]/5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0057B8]/10 text-[#0057B8]">
            <link.icon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{link.title}</p>
              <ArrowUpRight size={14} className="text-[var(--text-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0057B8]" />
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{link.desc}</p>
            {link.meta && (
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[#0057B8]">
                <CircleDot size={10} /> {link.meta}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ScoreRingCompact({
  value,
  max = 100,
  label,
  color = "#0057B8",
  decimals = 0,
}: {
  value: number;
  max?: number;
  label: string;
  color?: string;
  decimals?: number;
}) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(safeMax, Math.max(0, value));
  const pct = Math.min(100, (safeValue / safeMax) * 100);
  const size = 80;
  const r = 30;
  const c = 2 * Math.PI * r;
  const display =
    decimals > 0 ? safeValue.toFixed(decimals) : Math.round(safeValue).toString();

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth="7" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (pct / 100) * c }}
            transition={{ duration: 0.95, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-base font-bold leading-none tabular-nums text-[var(--text-primary)]">{display}</p>
          {safeMax !== 100 && (
            <p className="mt-0.5 text-[9px] tabular-nums text-[var(--text-muted)]">/{safeMax}</p>
          )}
        </div>
      </div>
      <p className="text-center text-[11px] font-semibold text-[var(--text-secondary)]">{label}</p>
      <span
        className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold tabular-nums"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {Math.round(pct)}%
      </span>
    </div>
  );
}

export function ActivityChip({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2">
      <Icon size={14} className="text-[#0057B8]" />
      <div>
        <p className="text-[10px] text-[var(--text-muted)]">{label}</p>
        <p className="text-xs font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export { Activity };
