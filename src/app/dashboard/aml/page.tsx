"use client";

import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import { KpiCard } from "@/src/components/ui/KpiCard";
import {
  TimelineWidget,
  HeatMapChart,
  NetworkGraph,
  PieChartWidget,
  LineChartWidget,
} from "@/src/components/charts/Charts";
import {
  AlertsPanel,
  CompliancePanel,
  DecisionPanel,
} from "@/src/components/dashboard/Widgets";
import { OpsBanner, MetricRail, RiskPulse, LiveFeed, ScoreRingCompact } from "@/src/components/bank/BankOps";
import {
  currentCustomer,
  amlKpis,
  amlTimeline,
  heatMapData,
  networkNodes,
  networkLinks,
  incomeSourceData,
  incomeGrowthData,
  amlAlerts,
  complianceStatus,
} from "@/src/lib/mock-data";
import { Shield, AlertTriangle, CheckCircle, Eye } from "lucide-react";

export default function AmlDashboardPage() {
  useSetPageMeta({
    title: "مركز الامتثال ومكافحة غسل الأموال",
    subtitle: `مراقبة ملف ${currentCustomer.name} · قرار امتثال لحظي`,
  });

  const accentFor = (color: string) => {
    if (color === "success") return "green" as const;
    if (color === "warning") return "amber" as const;
    return "blue" as const;
  };

  return (
    <>
      <OpsBanner
        title="مركز الامتثال والرقابة"
        subtitle="مراقبة المعاملات، شبكات العلاقات، وقرارات KYC/AML وفق سياسات الهوية المالية الموحدة"
        badges={[
          { label: `ملف #${currentCustomer.id}`, variant: "primary" },
          { label: "AML نظيف", variant: "success" },
          { label: "1 تنبيه مراجعة", variant: "warning" },
        ]}
        actions={<ExportButtons filename="تقرير_AML" />}
      />

      <MetricRail
        items={[
          { label: "AML Score", value: "91%", hint: "فوق حد القبول", tone: "ok" },
          { label: "تنبيهات مفتوحة", value: "1", hint: "يتطلب مراجعاً", tone: "warn" },
          { label: "عمليات عالية المخاطر", value: "0", hint: "آخر 30 يوماً", tone: "ok" },
          { label: "اكتمال KYC", value: "100%", hint: "وثائق سارية", tone: "ok" },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {amlKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.color === "warning" ? "alert" : kpi.color === "success" ? "shield" : "score"}
            trend={kpi.color === "warning" ? "down" : "up"}
            change={kpi.status}
            accent={accentFor(kpi.color)}
            delay={i * 0.04}
            progress={kpi.color === "success" ? 92 : kpi.color === "warning" ? 45 : 70}
          />
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-3">
          <RiskPulse score={18} label="درجة مخاطر الملف" />
          <Card title="حالة الرقابة">
            <div className="flex justify-around py-2">
              <ScoreRingCompact value={91} label="AML" color="#16A34A" />
              <ScoreRingCompact value={100} label="KYC" color="#0057B8" />
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <CheckCircle size={14} className="text-[#16A34A]" /> الهوية موثقة
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <AlertTriangle size={14} className="text-[#F59E0B]" /> 1 تنبيه يتطلب مراجعة
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Shield size={14} className="text-[#0057B8]" /> Sanctions: نظيف
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Eye size={14} className="text-[var(--text-muted)]" /> آخر مراجعة: 3 أيام
              </div>
            </div>
          </Card>
        </div>

        <Card title="الخط الزمني للحركات" subtitle="أحداث مالية خاضعة للمراقبة" className="lg:col-span-4">
          <TimelineWidget items={amlTimeline} />
        </Card>

        <Card title="سجل الرقابة الحي" className="lg:col-span-5">
          <LiveFeed
            items={[
              { id: "a1", title: "تنبيه حد يومي", detail: "تحويل دولي فوق العتبة — قيد التصعيد", time: "28 يونيو", type: "warning" },
              { id: "a2", title: "تحقق هوية", detail: "تجديد وثائق KYC مكتمل", time: "15 يونيو", type: "success" },
              { id: "a3", title: "نمط مسائي", detail: "زيادة طفيفة في نشاط المساء", time: "20 يونيو", type: "info" },
              { id: "a4", title: "مسح قوائم", detail: "PEP / Sanctions — لا تطابق", time: "اليوم", type: "success" },
            ]}
          />
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="خريطة حرارية للأنشطة" subtitle="كثافة العمليات حسب اليوم/الفترة">
          <HeatMapChart data={heatMapData} />
        </Card>
        <Card title="شبكة العلاقات المالية" subtitle="أطراف مرتبطة بالملف">
          <NetworkGraph nodes={networkNodes} links={networkLinks} />
        </Card>
        <Card title="مصادر الأموال" subtitle="تركيبة التدفقات الواردة">
          <PieChartWidget data={incomeSourceData} />
        </Card>
        <Card title="التغير المالي المراقب" subtitle="اتجاه الدخل تحت الرقابة">
          <LineChartWidget data={incomeGrowthData} dataKey="income" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AlertsPanel alerts={amlAlerts} />
        <CompliancePanel items={complianceStatus} />
        <DecisionPanel />
      </div>
    </>
  );
}
