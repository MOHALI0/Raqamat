"use client";

import Link from "next/link";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { OpsBanner, ScoreRingCompact } from "@/src/components/bank/BankOps";
import { buildAdvisorTips } from "@/src/lib/advisor";
import { currentCustomer } from "@/src/lib/mock-data";
import { calcSamaCapacity, DEFAULT_OBLIGATIONS } from "@/src/lib/sama";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";
import {
  Lightbulb,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const priorityVariant = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "primary" as const,
};

const priorityLabel = {
  high: "أولوية عالية",
  medium: "متوسطة",
  low: "تحسين مستمر",
};

const priorityVisual = {
  high: {
    icon: AlertTriangle,
    wrap: "bg-[#DC2626]/10 text-[#DC2626]",
    border: "hover:border-[#DC2626]/30",
  },
  medium: {
    icon: Lightbulb,
    wrap: "bg-[#F59E0B]/10 text-[#F59E0B]",
    border: "hover:border-[#F59E0B]/30",
  },
  low: {
    icon: CheckCircle2,
    wrap: "bg-[#0057B8]/10 text-[#0057B8]",
    border: "hover:border-[#0057B8]/30",
  },
};

export default function AdvisorPage() {
  const tips = buildAdvisorTips();
  const capacity = calcSamaCapacity({
    grossSalary: currentCustomer.monthlyIncome,
    totalMonthlyIncome: currentCustomer.monthlyIncome + currentCustomer.otherIncome,
    employmentStatus: "employee",
    obligations: DEFAULT_OBLIGATIONS,
    assumedApr: 4.9,
    tenureMonths: 60,
  });

  useSetPageMeta({
    title: "المستشار المالي الذكي",
    subtitle: "نصائح مخصّصة لتحسين ملفك ورفع أهليتك التمويلية",
  });

  const highCount = tips.filter((t) => t.priority === "high").length;

  return (
    <>
      <OpsBanner
        live={false}
        tone="customer"
        title="مستشارك المالي الذكي"
        subtitle="تحليل فوري لملفك الائتماني وقدرتك وفق معايير البنك المركزي مع توصيات قابلة للتنفيذ"
        badges={[
          { label: `${tips.length} توصية`, variant: "primary" },
          { label: highCount ? `${highCount} عالية الأولوية` : "ملف متوازن", variant: highCount ? "warning" : "success" },
          { label: `SIMAH ${currentCustomer.creditScore}`, variant: "success" },
        ]}
        actions={
          <Link href="/dashboard/capacity">
            <Button size="sm" variant="primary">
              <Sparkles size={14} /> حاسبة القدرة التمويلية
            </Button>
          </Link>
        }
        footer={
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#16A34A]" /> التوصيات مبنية على ملفك الحالي وحدود SAMA
          </span>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="صحة ملفك المالي" className="lg:col-span-4">
          <div className="flex justify-around py-2">
            <ScoreRingCompact value={currentCustomer.identityScore} label="الهوية" color="#16A34A" />
            <ScoreRingCompact value={currentCustomer.creditScore} max={850} label="SIMAH" color="#0057B8" />
            <ScoreRingCompact
              value={Math.round(100 - capacity.utilization.salaryLinkedPct)}
              label="مرونة الاستقطاع"
              color="#F59E0B"
            />
          </div>
          <div className="mt-3 rounded-xl bg-gradient-to-l from-[#0057B8]/8 to-[#16A34A]/8 p-3 text-xs leading-6 text-[var(--text-secondary)]">
            القدرة التقديرية الحالية للتمويل الجديد:
            <strong className="ms-1 text-[var(--text-primary)]">
              {formatCurrency(capacity.estimatedFinanceAmount)}
            </strong>
            {" "}بقسط أقصى{" "}
            <strong className="text-[var(--text-primary)]">
              {formatCurrency(capacity.maxNewInstallment)}
            </strong>
            /شهر وفق حدود SAMA.
          </div>
        </Card>

        <Card title="ملخص سريع" subtitle="مؤشرات الاستقطاع الحالية" className="lg:col-span-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {[
              {
                label: "استقطاع الراتب المستخدم",
                value: `${capacity.utilization.salaryLinkedPct}%`,
                progress: capacity.utilization.salaryLinkedPct,
                tone:
                  capacity.utilization.salaryLinkedPct > 80
                    ? "critical"
                    : capacity.utilization.salaryLinkedPct > 60
                      ? "warn"
                      : "ok",
                hint: `حد ${capacity.limits.salaryDeductionCapPct}%`,
              },
              {
                label: "متبقي للاستقطاع",
                value: formatCurrency(capacity.remainingSalaryLinked),
                progress:
                  capacity.limits.salaryDeductionCapAmount > 0
                    ? Math.round(
                        (capacity.remainingSalaryLinked / capacity.limits.salaryDeductionCapAmount) *
                          1000
                      ) / 10
                    : 0,
                tone: capacity.remainingSalaryLinked > 0 ? "ok" : "critical",
                hint: "قدرة إضافية",
              },
              {
                label: "التزامات غير عقارية",
                value: `${capacity.utilization.nonMortgagePct}%`,
                progress: capacity.utilization.nonMortgagePct,
                tone: capacity.utilization.nonMortgagePct > 40 ? "warn" : "info",
                hint: "حد 45%",
              },
              {
                label: "حد SAMA للاستقطاع",
                value: `${capacity.limits.salaryDeductionCapPct}%`,
                progress: capacity.limits.salaryDeductionCapPct,
                tone: "info",
                hint: formatCurrency(capacity.limits.salaryDeductionCapAmount),
              },
            ].map((item) => {
              const bar =
                item.tone === "critical"
                  ? "bg-[#DC2626]"
                  : item.tone === "warn"
                    ? "bg-[#F59E0B]"
                    : item.tone === "ok"
                      ? "bg-[#16A34A]"
                      : "bg-[#0057B8]";
              const border =
                item.tone === "warn" || item.tone === "critical"
                  ? "border-[#F59E0B]/35 bg-[#F59E0B]/5"
                  : "border-[var(--border-color)]";
              return (
                <div key={item.label} className={`rounded-xl border p-3 ${border}`}>
                  <p className="text-[11px] text-[var(--text-muted)]">{item.label}</p>
                  <p className="mt-1 text-lg font-bold tabular-nums">{item.value}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">{item.hint}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--border-color)]">
                    <div
                      className={`h-full rounded-full ${bar}`}
                      style={{ width: `${Math.min(100, item.progress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Info size={14} className="text-[#0057B8]" />
        <p className="text-xs text-[var(--text-muted)]">مرتّبة حسب الأولوية — ابدأ بالتوصيات الحمراء أولاً</p>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => {
          const visual = priorityVisual[tip.priority];
          const Icon = visual.icon;
          return (
            <Card key={tip.id} delay={i * 0.04} className={cn("border transition-colors", visual.border)}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", visual.wrap)}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant={priorityVariant[tip.priority]}>{priorityLabel[tip.priority]}</Badge>
                      <Badge variant="default">{tip.category}</Badge>
                    </div>
                    <h3 className="text-base font-bold">{tip.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{tip.advice}</p>
                    <p className="mt-2 text-xs font-medium text-[#0057B8]">{tip.impact}</p>
                    {tip.href && (
                      <Link href={tip.href} className="mt-3 inline-flex">
                        <Button size="sm" variant="secondary">
                          {tip.actionLabel || "تفاصيل"} <ArrowLeft size={14} />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
