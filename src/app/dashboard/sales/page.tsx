"use client";

import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { KpiCard } from "@/src/components/ui/KpiCard";
import { Card } from "@/src/components/ui/Card";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import {
  FunnelChartWidget,
  VerticalBarChart,
  LineChartWidget,
  TimelineWidget,
} from "@/src/components/charts/Charts";
import { RecommendationsPanel } from "@/src/components/dashboard/Widgets";
import { OpsBanner, MetricRail, PipelineStage, LiveFeed } from "@/src/components/bank/BankOps";
import {
  currentCustomer,
  salesFunnelData,
  topProductsData,
  approvalProbabilityData,
  closeRateData,
  salesRecommendations,
  customerJourney,
} from "@/src/lib/mock-data";
import { formatCurrency } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { useOffers } from "@/src/context/OffersProvider";
import Link from "next/link";

export default function SalesDashboardPage() {
  const { stats, openRequests } = useOffers();

  useSetPageMeta({
    title: "غرفة المبيعات التمويلية",
    subtitle: `محرك التحويل · ${stats.openRequests} طلب في الطابور الحي`,
  });

  const kpis = [
    {
      title: "طلبات نشطة",
      value: String(stats.openRequests),
      icon: "files",
      trend: "up" as const,
      change: "+3",
      accent: "amber" as const,
      sparkline: [2, 3, 3, 4, 5, 5, stats.openRequests || 4],
      progress: Math.min(100, stats.openRequests * 20),
      subtitle: "في مسار العرض",
    },
    {
      title: "عروض معلّقة",
      value: String(stats.pendingOffers),
      icon: "alert",
      trend: "up" as const,
      change: "حيّة",
      accent: "blue" as const,
      sparkline: [1, 2, 2, 3, 3, 4, stats.pendingOffers || 3],
      progress: 55,
    },
    {
      title: "نسبة الإغلاق",
      value: `${stats.conversionRate}%`,
      icon: "percent",
      trend: "up" as const,
      change: "+2.1%",
      accent: "green" as const,
      sparkline: [16, 17, 18, 19, 21, 22, stats.conversionRate || 24],
      progress: stats.conversionRate || 24,
      subtitle: "طلب → عقد",
    },
    {
      title: "الحد الائتماني المتوقع",
      value: formatCurrency(currentCustomer.expectedCreditLimit),
      icon: "income",
      trend: "up" as const,
      change: "+10K",
      accent: "blue" as const,
      sparkline: [110, 120, 130, 135, 140, 145, 148],
      progress: 62,
    },
    {
      title: "معدل السداد النموذجي",
      value: `${currentCustomer.onTimePaymentRate}%`,
      icon: "score",
      trend: "up" as const,
      change: "+0.4%",
      accent: "green" as const,
      sparkline: [96, 97, 97.5, 98, 98.2, 98.4, 98.6],
      progress: 98,
    },
  ];

  return (
    <>
      <OpsBanner
        title="غرفة المبيعات التمويلية"
        subtitle="قمع تحويل حي من طلبات تلقي العروض حتى إغلاق العقود — مع ترشيح منتجات لحظي"
        badges={[
          { label: "سوق عروض نشط", variant: "primary" },
          { label: `${openRequests.length} بانتظار عرض`, variant: "warning" },
        ]}
        actions={
          <>
            <Link href="/dashboard/requests">
              <Button size="sm" variant="primary">إدارة طابور التمويل</Button>
            </Link>
            <ExportButtons filename="أداء_المبيعات" />
          </>
        }
      />

      <MetricRail
        items={[
          { label: "قيمة الطابور", value: formatCurrency(stats.totalRequestedAmount), hint: "طلبات غير مغلقة", tone: "info" },
          { label: "متوسط ربح العروض", value: `${stats.avgOfferRate || 4.5}%`, hint: "مرجّح بالحجم", tone: "ok" },
          { label: "احتمال الموافقة", value: "86%", hint: "نموذج العميل المرجعي", tone: "ok" },
          { label: "زمن دورة البيع", value: "4.2 يوم", hint: "متوسط حتى الإغلاق", tone: "warn" },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.title} {...kpi} delay={i * 0.04} />
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="قمع التحويل التمويلي" subtitle="طلبات → عروض → عقود" className="lg:col-span-5">
          <FunnelChartWidget data={salesFunnelData} />
        </Card>
        <Card title="مراحل الإغلاق التفصيلية" subtitle="أحجام كل مرحلة" className="lg:col-span-4">
          <PipelineStage
            stages={[
              { name: "طلبات تلقي عروض", count: 1280, tone: "#64748B" },
              { name: "ملفات مكتملة", count: 940, tone: "#0057B8" },
              { name: "عروض مقدمة", count: 610, tone: "#1a6fd4" },
              { name: "قيد قرار العميل", count: 265, tone: "#F59E0B" },
              { name: "عقود مُغلقة", count: 118, tone: "#16A34A" },
            ]}
          />
        </Card>
        <Card title="أحداث المبيعات" className="lg:col-span-3">
          <LiveFeed
            items={[
              { id: "s1", title: "فرصة عالية", detail: "هند الغامدي · تمويل عقاري", time: "الآن", type: "success" },
              { id: "s2", title: "عرض مُرسل", detail: "بنك رقمات → أحمد العتيبي", time: "منذ 20 د", type: "info" },
              { id: "s3", title: "تفاوض جارٍ", detail: "فهد الدوسري · تمويل سيارة", time: "منذ ساعة", type: "warning" },
              { id: "s4", title: "إغلاق ناجح", detail: "بطاقة ائتمان · سارة القحطاني", time: "أمس", type: "success" },
            ]}
          />
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="المنتجات الأعلى تحويلاً" subtitle="عدد الترشيحات المقبولة">
          <VerticalBarChart data={topProductsData} dataKey="count" xKey="product" />
        </Card>
        <Card title="احتمالية الموافقة الائتمانية" subtitle="اتجاه شهري للنموذج">
          <LineChartWidget data={approvalProbabilityData} dataKey="probability" color="#16A34A" />
        </Card>
        <Card title="معدل إغلاق الصفقات" subtitle="% من العروض المقدّمة">
          <LineChartWidget data={closeRateData} dataKey="rate" color="#0057B8" />
        </Card>
        <Card title="رحلة العميل المرجعي" subtitle={currentCustomer.name}>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="primary">Score {currentCustomer.creditScore}</Badge>
            <Badge variant="success">قبول {currentCustomer.acceptanceRate}%</Badge>
            <Badge variant="warning">DTI {currentCustomer.commitmentRatio}%</Badge>
          </div>
          <TimelineWidget items={customerJourney} />
        </Card>
      </div>

      <RecommendationsPanel items={salesRecommendations} title="توصيات محرك المبيعات — أعلى مطابقة" />
    </>
  );
}
