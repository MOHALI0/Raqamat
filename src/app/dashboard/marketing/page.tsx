"use client";

import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { KpiCard } from "@/src/components/ui/KpiCard";
import { Card } from "@/src/components/ui/Card";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import {
  PieChartWidget,
  BarChartWidget,
  RadarChartWidget,
  LineChartWidget,
} from "@/src/components/charts/Charts";
import {
  RecommendationsPanel,
  CustomerInsightsPanel,
} from "@/src/components/dashboard/Widgets";
import { OpsBanner, MetricRail, ScoreRingCompact } from "@/src/components/bank/BankOps";
import {
  currentCustomer,
  incomeSourceData,
  commitmentRatioData,
  radarData,
  incomeGrowthData,
  marketingRecommendations,
  customerInsights,
} from "@/src/lib/mock-data";
import { formatCurrency } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import Link from "next/link";

export default function MarketingDashboardPage() {
  useSetPageMeta({
    title: "ذكاء العروض والتسويق",
    subtitle: `تحليل أهلية وترشيح منتجات · ${currentCustomer.name}`,
  });

  const kpis = [
    {
      title: "الدخل الشهري",
      value: formatCurrency(currentCustomer.monthlyIncome),
      icon: "income",
      trend: "up" as const,
      change: "+3.2%",
      accent: "green" as const,
      sparkline: [24, 25, 26, 27, 27.5, 28, 28.5],
      progress: 72,
    },
    {
      title: "الدخل السنوي",
      value: formatCurrency(currentCustomer.annualIncome),
      icon: "income",
      trend: "up" as const,
      change: "+5%",
      accent: "blue" as const,
      sparkline: [300, 310, 320, 330, 335, 340, 342],
      progress: 68,
    },
    {
      title: "نسبة الالتزامات",
      value: `${currentCustomer.commitmentRatio}%`,
      icon: "percent",
      trend: "down" as const,
      change: "-2%",
      accent: "amber" as const,
      sparkline: [40, 38, 37, 36, 35, 34.5, 34.2],
      progress: currentCustomer.commitmentRatio,
      subtitle: "DTI ضمن الحدود",
    },
    {
      title: "القدرة الشرائية",
      value: formatCurrency(currentCustomer.purchasingPower),
      icon: "target",
      trend: "up" as const,
      change: "+8%",
      accent: "blue" as const,
      sparkline: [120, 128, 135, 142, 148, 152, 156],
      progress: 75,
    },
    {
      title: "التصنيف الائتماني",
      value: String(currentCustomer.creditScore),
      icon: "score",
      trend: "up" as const,
      change: "+12",
      accent: "green" as const,
      sparkline: [698, 710, 720, 728, 734, 738, 742],
      progress: (currentCustomer.creditScore / 850) * 100,
      subtitle: currentCustomer.simahScoreBand,
    },
    {
      title: "المنتجات الحالية",
      value: String(currentCustomer.products.length),
      icon: "files",
      trend: "up" as const,
      change: "+1",
      accent: "slate" as const,
      sparkline: [1, 1, 2, 2, 2, 3, 3],
      progress: 60,
    },
  ];

  return (
    <>
      <OpsBanner
        title="محرك ذكاء العروض"
        subtitle="ترشيح منتجات تمويلية مبني على ملف الهوية المالية وسلوك الإنفاق والقدرة الائتمانية"
        badges={[
          { label: currentCustomer.id, variant: "primary" },
          { label: `${currentCustomer.riskLevel} المخاطر`, variant: "success" },
          { label: `${currentCustomer.eligibleProducts} منتجات مؤهلة`, variant: "warning" },
        ]}
        actions={
          <>
            <Link href="/dashboard/requests">
              <Button size="sm" variant="secondary">عرض الطلبات</Button>
            </Link>
            <ExportButtons filename="تحليل_تسويقي" />
          </>
        }
      />

      <MetricRail
        items={[
          { label: "درجة الهوية", value: `${currentCustomer.identityScore}/100`, hint: "اكتمال الملف", tone: "ok" },
          { label: "احتمال القبول", value: `${currentCustomer.acceptanceRate}%`, hint: "نموذج الترشيح", tone: "ok" },
          { label: "استخدام الائتمان", value: `${currentCustomer.utilizationRate}%`, hint: "البطاقة الحالية", tone: "warn" },
          { label: "سداد في الموعد", value: `${currentCustomer.onTimePaymentRate}%`, hint: "آخر 24 شهراً", tone: "ok" },
        ]}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {currentCustomer.products.map((p) => (
          <Badge key={p} variant="primary">{p}</Badge>
        ))}
        <Badge variant="success">{currentCustomer.employer}</Badge>
        <Badge>{currentCustomer.city}</Badge>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.title} {...kpi} delay={i * 0.04} />
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="بصمة العميل (Radar)" subtitle="أبعاد الأهلية الستة" className="lg:col-span-4">
          <RadarChartWidget data={radarData} />
        </Card>
        <Card title="مصادر الدخل" subtitle="تركيبة الدخل الشهري" className="lg:col-span-4">
          <PieChartWidget data={incomeSourceData} />
        </Card>
        <Card title="ملخص الأهلية" className="lg:col-span-4">
          <div className="flex justify-around py-4">
            <ScoreRingCompact value={currentCustomer.creditScore} max={850} label="SIMAH" color="#0057B8" />
            <ScoreRingCompact value={currentCustomer.identityScore} label="الهوية" color="#16A34A" />
            <ScoreRingCompact value={currentCustomer.acceptanceRate} label="القبول" color="#F59E0B" />
          </div>
          <div className="mt-2 rounded-xl bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-secondary)]">
            العميل ضمن شريحة <strong className="text-[var(--text-primary)]">{currentCustomer.simahScoreBand}</strong> مع
            قدرة تقديرية حتى <strong className="text-[var(--text-primary)]">{formatCurrency(currentCustomer.expectedCreditLimit)}</strong>.
          </div>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="هيكل الالتزامات" subtitle="مساهمة كل منتج في DTI">
          <BarChartWidget data={commitmentRatioData} dataKey="ratio" xKey="name" color="#F59E0B" />
        </Card>
        <Card title="مسار نمو الدخل" subtitle="12 شهراً">
          <LineChartWidget data={incomeGrowthData} dataKey="income" color="#16A34A" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecommendationsPanel items={marketingRecommendations} title="العروض المقترحة — أعلى مطابقة" />
        <CustomerInsightsPanel insights={customerInsights} />
      </div>
    </>
  );
}
