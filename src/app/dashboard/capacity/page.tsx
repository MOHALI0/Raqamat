"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { KpiCard, KpiGrid } from "@/src/components/ui/KpiCard";
import { Field, Input, Select } from "@/src/components/ui/Field";
import { OpsBanner, MetricRail, RiskPulse } from "@/src/components/bank/BankOps";
import {
  calcSamaCapacity,
  DEFAULT_OBLIGATIONS,
  type EmploymentStatus,
  type ObligationItem,
} from "@/src/lib/sama";
import { currentCustomer } from "@/src/lib/mock-data";
import { formatCurrency } from "@/src/lib/utils";
import { Info, ShieldCheck, HandCoins } from "lucide-react";

export default function CapacityPage() {
  const [grossSalary, setGrossSalary] = useState(currentCustomer.monthlyIncome);
  const [otherIncome, setOtherIncome] = useState(currentCustomer.otherIncome);
  const [status, setStatus] = useState<EmploymentStatus>("employee");
  const [apr, setApr] = useState(4.9);
  const [tenure, setTenure] = useState(60);
  const [obligations, setObligations] = useState<ObligationItem[]>(DEFAULT_OBLIGATIONS);

  useSetPageMeta({
    title: "حاسبة القدرة التمويلية",
    subtitle: "وفق مبادئ الإقراض المسؤول وأنظمة التمويل الاستهلاكي (SAMA)",
  });

  const totalIncome = grossSalary + otherIncome;

  const result = useMemo(
    () =>
      calcSamaCapacity({
        grossSalary,
        totalMonthlyIncome: totalIncome,
        employmentStatus: status,
        obligations,
        assumedApr: apr,
        tenureMonths: tenure,
      }),
    [apr, grossSalary, obligations, status, tenure, totalIncome]
  );

  const updateObligation = (id: string, monthlyAmount: number) => {
    setObligations((prev) => prev.map((o) => (o.id === id ? { ...o, monthlyAmount } : o)));
  };

  const salaryUtil = Math.min(100, result.utilization.salaryLinkedPct);
  const totalUtil = Math.min(100, result.utilization.totalFinancePct);
  const installmentShare =
    result.limits.salaryDeductionCapAmount > 0
      ? Math.min(100, Math.round((result.maxNewInstallment / result.limits.salaryDeductionCapAmount) * 100))
      : 0;

  return (
    <>
      <OpsBanner
        live={false}
        tone="customer"
        title="كم تستطيع الاقتراض؟"
        subtitle="حساب متبقي نسبة الاستقطاع والقدرة التمويلية وفق حدود البنك المركزي السعودي"
        badges={[
          { label: `حد الاستقطاع ${result.limits.salaryDeductionCapPct}%`, variant: "primary" },
          { label: `شريحة الدخل ${result.limits.incomeBracket}`, variant: "success" },
        ]}
        actions={
          <Link href="/dashboard/offers">
            <Button size="sm" variant="primary">
              <HandCoins size={14} /> اطلب عروض تمويل
            </Button>
          </Link>
        }
        footer={
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#16A34A]" /> النسب وفق مبادئ الإقراض المسؤول (SAMA)
          </span>
        }
      />

      <MetricRail
        items={[
          {
            label: "متبقي استقطاع الراتب",
            value: formatCurrency(result.remainingSalaryLinked),
            hint: `من أصل ${formatCurrency(result.limits.salaryDeductionCapAmount)} · حد ${result.limits.salaryDeductionCapPct}%`,
            tone: result.remainingSalaryLinked > 0 ? "ok" : "critical",
            progress: result.utilization.salaryLinkedPct,
            delta: `${result.utilization.salaryLinkedPct}% مستخدم`,
          },
          {
            label: "متبقي غير عقاري",
            value: formatCurrency(result.remainingNonMortgage),
            hint: `حد ${result.limits.nonMortgageCapPct}% · ${formatCurrency(result.limits.nonMortgageCapAmount)}`,
            tone:
              result.utilization.nonMortgagePct > 90
                ? "critical"
                : result.utilization.nonMortgagePct > 70
                  ? "warn"
                  : "info",
            progress: result.utilization.nonMortgagePct,
            delta: `${result.utilization.nonMortgagePct}% مستخدم`,
          },
          {
            label: "أقصى قسط جديد",
            value: formatCurrency(result.maxNewInstallment),
            hint: "أضيق القيود الثلاثة وفق SAMA",
            tone: result.maxNewInstallment > 0 ? "ok" : "critical",
            progress: Math.min(
              100,
              result.limits.salaryDeductionCapAmount > 0
                ? Math.round((result.maxNewInstallment / result.limits.salaryDeductionCapAmount) * 1000) / 10
                : 0
            ),
            delta: "من حد الاستقطاع",
          },
          {
            label: "تمويل تقديري",
            value: formatCurrency(result.estimatedFinanceAmount),
            hint: `${tenure} شهراً · ربح ${apr}%`,
            tone: "info",
            progress: Math.min(100, result.utilization.totalFinancePct),
            delta: `${result.utilization.totalFinancePct}% إجمالي`,
          },
        ]}
      />

      <KpiGrid columns={3}>
        <KpiCard
          title="استخدام استقطاع الراتب"
          value={`${result.utilization.salaryLinkedPct}`}
          unit="%"
          icon="percent"
          trend={result.utilization.salaryLinkedPct > 70 ? "up" : "flat"}
          deltaTone={
            result.utilization.salaryLinkedPct > 80
              ? "bad"
              : result.utilization.salaryLinkedPct > 60
                ? "neutral"
                : "good"
          }
          change={`حد ${result.limits.salaryDeductionCapPct}%`}
          accent={
            result.utilization.salaryLinkedPct > 80
              ? "red"
              : result.utilization.salaryLinkedPct > 60
                ? "amber"
                : "green"
          }
          progress={salaryUtil}
          progressLabel="من حد SAMA المرتبط بالراتب"
          subtitle={`${formatCurrency(result.usedSalaryLinked)} / ${formatCurrency(result.limits.salaryDeductionCapAmount)}`}
        />
        <KpiCard
          title="الالتزامات الحالية"
          value={formatCurrency(result.usedTotalFinance)}
          icon="files"
          trend={result.utilization.totalFinancePct > 70 ? "up" : "flat"}
          deltaTone={result.utilization.totalFinancePct > 85 ? "bad" : "neutral"}
          change={`${result.utilization.totalFinancePct}% من الحد`}
          accent={result.utilization.totalFinancePct > 85 ? "amber" : "blue"}
          progress={totalUtil}
          progressLabel={`حد إجمالي ${result.limits.totalFinanceCapPct}% · شريحة ${result.limits.incomeBracket}`}
          subtitle={`متبقي ${formatCurrency(result.remainingTotalFinance)}`}
        />
        <KpiCard
          title="مبلغ التمويل المتوقع"
          value={formatCurrency(result.estimatedFinanceAmount)}
          icon="target"
          trend={result.estimatedFinanceAmount > 0 ? "up" : "flat"}
          deltaTone={result.estimatedFinanceAmount > 0 ? "good" : "bad"}
          change={`قسط ${formatCurrency(result.maxNewInstallment)}`}
          accent="green"
          progress={installmentShare}
          progressLabel="حصة القسط من حد الاستقطاع"
          subtitle={`${tenure} شهراً · ${apr}%`}
        />
      </KpiGrid>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card title="مدخلات الحساب" subtitle="عدّل القيم لمحاكاة سيناريوهات مختلفة" className="lg:col-span-5">
          <div className="space-y-3.5">
            <Field label="الراتب الإجمالي الشهري">
              <div className="relative">
                <Input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="pl-14"
                />
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                  ر.س
                </span>
              </div>
            </Field>
            <Field label="دخل إضافي شهري">
              <div className="relative">
                <Input
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                  className="pl-14"
                />
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                  ر.س
                </span>
              </div>
            </Field>
            <Field label="الحالة الوظيفية">
              <Select value={status} onChange={(e) => setStatus(e.target.value as EmploymentStatus)}>
                <option value="employee">موظف (حد استقطاع 33.33%)</option>
                <option value="retired">متقاعد (حد استقطاع 25%)</option>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="مدة التمويل (شهر)" hint="حد أقصى 60 شهراً">
                <Input
                  type="number"
                  min={12}
                  max={60}
                  value={tenure}
                  onChange={(e) => setTenure(Math.min(60, Number(e.target.value)))}
                />
              </Field>
              <Field label="معدل ربح تقديري %">
                <Input
                  type="number"
                  step="0.1"
                  value={apr}
                  onChange={(e) => setApr(Number(e.target.value))}
                />
              </Field>
            </div>

            <div className="border-t border-[var(--border-color)] pt-3">
              <p className="mb-2.5 text-xs font-semibold text-[var(--text-secondary)]">الالتزامات الشهرية الحالية</p>
              <div className="space-y-2.5">
                {obligations.map((o) => (
                  <div key={o.id} className="flex items-center gap-2">
                    <span className="flex-1 text-xs text-[var(--text-muted)]">{o.name}</span>
                    <div className="relative w-32">
                      <Input
                        type="number"
                        value={o.monthlyAmount}
                        onChange={(e) => updateObligation(o.id, Number(e.target.value))}
                        className="py-1.5 pl-10 text-sm tabular-nums"
                      />
                      <span className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-[10px] text-[var(--text-muted)]">
                        ر.س
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-4">
          <RiskPulse
            score={Math.min(100, Math.round(result.utilization.salaryLinkedPct * 10) / 10)}
            label="ضغط الاستقطاع الحالي"
            bands={[
              { label: "مريح", max: 50, color: "#16A34A" },
              { label: "متوسط", max: 75, color: "#F59E0B" },
              { label: "مضغوط", max: 100, color: "#DC2626" },
            ]}
            unit={`% من حد ${result.limits.salaryDeductionCapPct}%`}
          />
          <Card title="حدود SAMA المطبّقة">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-2 border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-muted)]">استقطاع الراتب</span>
                <span className="font-semibold tabular-nums">
                  {result.limits.salaryDeductionCapPct}% · {formatCurrency(result.limits.salaryDeductionCapAmount)}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-muted)]">غير عقاري</span>
                <span className="font-semibold tabular-nums">
                  {result.limits.nonMortgageCapPct}% · {formatCurrency(result.limits.nonMortgageCapAmount)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--text-muted)]">إجمالي تمويلي</span>
                <span className="font-semibold tabular-nums">
                  {result.limits.totalFinanceCapPct}% · {formatCurrency(result.limits.totalFinanceCapAmount)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card title="النتيجة والتفسير" className="lg:col-span-3">
          <div className="mb-3 rounded-2xl bg-gradient-to-b from-[#0057B8]/10 to-[#0057B8]/5 p-5 text-center">
            <p className="text-xs text-[var(--text-muted)]">يمكنك الحصول تقريباً على</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0057B8] sm:text-3xl">
              {formatCurrency(result.estimatedFinanceAmount)}
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              بقسط شهري حتى {formatCurrency(result.maxNewInstallment)}
            </p>
            <Link href="/dashboard/offers" className="mt-4 inline-flex">
              <Button size="sm" variant="primary">
                قارن عروض البنوك
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {result.notes.map((note) => (
              <div key={note} className="flex gap-2 text-[11px] leading-5 text-[var(--text-secondary)]">
                <Info size={12} className="mt-0.5 shrink-0 text-[#0057B8]" />
                <span>{note}</span>
              </div>
            ))}
          </div>
          <Badge variant="primary" className="mt-4">
            مرجع: مبادئ الإقراض المسؤول + أنظمة التمويل الاستهلاكي
          </Badge>
        </Card>
      </div>
    </>
  );
}
