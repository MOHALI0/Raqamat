"use client";

import { KpiCard, KpiGrid } from "@/src/components/ui/KpiCard";
import { Card } from "@/src/components/ui/Card";
import { DataTable, StatusBadge } from "@/src/components/ui/DataTable";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import { Button } from "@/src/components/ui/Button";
import {
  AreaChartWidget,
  BarChartWidget,
  LineChartWidget,
  VerticalBarChart,
  MultiLineChart,
  DonutChartWidget,
} from "@/src/components/charts/Charts";
import {
  OpsBanner,
  MetricRail,
  RiskPulse,
  PipelineStage,
  LiveFeed,
  ModuleLinks,
  ScoreRingCompact,
} from "@/src/components/bank/BankOps";
import {
  customerGrowthData,
  commitmentRatioData,
  riskIndexData,
  bankProductsData,
  monthlyActivityData,
  recentTransactions,
} from "@/src/lib/mock-data";
import { useOffers } from "@/src/context/OffersProvider";
import { formatCurrency } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthProvider";
import Link from "next/link";
import {
  Inbox,
  ShieldAlert,
  Users,
  ShoppingBag,
  Megaphone,
  FileBarChart,
  FileText,
} from "lucide-react";

const sparkGrowth = [62, 64, 68, 71, 74, 78, 82, 86, 88, 91, 94, 98];
const sparkRisk = [32, 30, 28, 31, 27, 26, 24, 25, 23, 24, 22, 24];
const sparkVolume = [40, 42, 45, 48, 52, 55, 58, 61, 64, 68, 72, 76];

export default function MainDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { stats } = useOffers();

  const liveKpis = [
    {
      title: "العملاء المفعّلون",
      value: "12,486",
      icon: "users",
      trend: "up" as const,
      change: "+6.4%",
      subtitle: "مقابل الشهر السابق",
      accent: "blue" as const,
      sparkline: sparkGrowth,
      progress: 78,
    },
    {
      title: "طلبات تمويل مفتوحة",
      value: String(stats.openRequests),
      icon: "files",
      trend: "up" as const,
      change: `${stats.pendingOffers} عرض`,
      subtitle: "في طابور القرار",
      accent: "amber" as const,
      sparkline: [2, 3, 3, 4, 5, 4, 6, stats.openRequests || 4],
      progress: Math.min(100, stats.openRequests * 18),
    },
    {
      title: "تنبيهات AML مفتوحة",
      value: "17",
      icon: "alert",
      trend: "down" as const,
      change: "-9%",
      subtitle: "تحت المراقبة النشطة",
      accent: "red" as const,
      sparkline: sparkRisk.slice().reverse(),
      progress: 34,
    },
    {
      title: "متوسط SIMAH",
      value: "724",
      icon: "score",
      trend: "up" as const,
      change: "+5",
      subtitle: "شريحة جيدة جداً",
      accent: "green" as const,
      sparkline: [690, 698, 705, 712, 718, 720, 724],
      progress: 72,
    },
    {
      title: "حجم الطلبات النشطة",
      value: formatCurrency(stats.totalRequestedAmount),
      icon: "income",
      trend: "up" as const,
      change: `${stats.conversionRate}% إغلاق`,
      subtitle: "قيمة دفتر الطلبات",
      accent: "blue" as const,
      sparkline: sparkVolume,
      progress: 64,
    },
    {
      title: "متوسط معدل العروض",
      value: `${stats.avgOfferRate || 4.5}%`,
      icon: "percent",
      trend: "down" as const,
      change: "-0.2%",
      subtitle: "تكلفة تمويل مرجّحة",
      accent: "slate" as const,
      sparkline: [5.1, 4.9, 4.8, 4.7, 4.6, 4.55, stats.avgOfferRate || 4.5],
      progress: 45,
    },
  ];

  const txColumns = [
    { key: "id", header: "مرجع العملية" },
    { key: "customer", header: "الطرف" },
    { key: "type", header: "القناة" },
    {
      key: "amount",
      header: "المبلغ",
      render: (item: (typeof recentTransactions)[0]) => (
        <span className="font-semibold tabular-nums">{formatCurrency(item.amount)}</span>
      ),
    },
    { key: "status", header: "الحالة", render: (item: (typeof recentTransactions)[0]) => <StatusBadge status={item.status} /> },
    { key: "date", header: "التوقيت" },
    { key: "risk", header: "درجة المخاطر", render: (item: (typeof recentTransactions)[0]) => <StatusBadge status={item.risk} /> },
  ];

  const feed = [
    { id: "1", title: "طلب تمويل عقاري جديد", detail: "هند الغامدي · 850,000 ر.س · Score 804", time: "منذ 12 د", type: "success" as const },
    { id: "2", title: "تنبيه مراقبة معاملات", detail: "تحويل دولي يتجاوز الحد اليومي — نورة الحربي", time: "منذ 28 د", type: "danger" as const },
    { id: "3", title: "عرض بانتظار قبول العميل", detail: "بنك رقمات → أحمد العتيبي · تمويل شخصي", time: "منذ ساعة", type: "info" as const },
    { id: "4", title: "اكتمال KYC دفعي", detail: "5 ملفات هُويّة اجتازت التحقق الآلي", time: "منذ 2 س", type: "success" as const },
    { id: "5", title: "انخفاض مؤشر المخاطر", detail: "المؤشر التشغيلي استقر عند 24 نقطة", time: "منذ 3 س", type: "warning" as const },
  ];

  return (
    <>
      <OpsBanner
        title={`مركز القيادة · ${user?.name ?? "فريق رقمات"}`}
        subtitle="لوحة تشغيل الهوية المالية الموحدة — نظرة لحظية على المحفظة والامتثال وطلبات التمويل"
        badges={[
          { label: "بيئة إنتاج تجريبية", variant: "primary" },
          { label: "SLA 99.95%", variant: "success" },
        ]}
        actions={
          <>
            <Link href="/dashboard/requests">
              <Button size="sm" variant="primary">طابور التمويل</Button>
            </Link>
            <ExportButtons filename="تقرير_العمليات" />
          </>
        }
      />

      <MetricRail
        items={[
          {
            label: "سيولة اليوم",
            value: "٤٢٫٨ م",
            hint: "صافي تدفقات واردة",
            tone: "ok",
            progress: 78,
            delta: "+7.8%",
          },
          {
            label: "معدل التحويل",
            value: `${stats.conversionRate || 24.1}%`,
            hint: "طلبات → عقود",
            tone: "info",
            progress: stats.conversionRate || 24.1,
            delta: "حيّ",
          },
          {
            label: "ملفات تحت المراجعة",
            value: "23",
            hint: "AML + ائتمان",
            tone: "warn",
            progress: 46,
            delta: "يتطلب قراراً",
          },
          {
            label: "زمن الاستجابة",
            value: "1.8 ث",
            hint: "متوسط API",
            tone: "ok",
            progress: 92,
            delta: "ضمن الهدف",
          },
        ]}
      />

      <KpiGrid columns={6}>
        {liveKpis.map((kpi, i) => (
          <KpiCard key={kpi.title} {...kpi} delay={i * 0.04} />
        ))}
      </KpiGrid>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="نمو قاعدة العملاء" subtitle="اتجاه 12 شهراً · مفعّلون" className="lg:col-span-5" delay={0.05}>
          <AreaChartWidget data={customerGrowthData} dataKey="customers" />
        </Card>
        <Card title="قنوات المنتجات" subtitle="توزيع المحفظة النشطة" className="lg:col-span-4" delay={0.08}>
          <VerticalBarChart data={bankProductsData} dataKey="value" xKey="name" />
        </Card>
        <div className="space-y-4 lg:col-span-3">
          <RiskPulse score={24} />
          <Card title="مؤشرات الجودة" delay={0.1}>
            <div className="flex justify-around py-2">
              <ScoreRingCompact value={91} label="AML Score" color="#16A34A" />
              <ScoreRingCompact value={724} max={850} label="SIMAH" color="#0057B8" />
              <ScoreRingCompact value={87} label="قبول" color="#F59E0B" />
            </div>
          </Card>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="تدفقات النشاط الشهري" subtitle="إيداع · سحب · تحويل" className="lg:col-span-5" delay={0.05}>
          <MultiLineChart
            data={monthlyActivityData}
            lines={[
              { key: "deposits", color: "#16A34A", name: "إيداعات" },
              { key: "withdrawals", color: "#DC2626", name: "سحوبات" },
              { key: "transfers", color: "#0057B8", name: "تحويلات" },
            ]}
          />
        </Card>
        <Card title="هيكل الالتزامات" subtitle="نسب DTI حسب المنتج" className="lg:col-span-3" delay={0.08}>
          <BarChartWidget data={commitmentRatioData} dataKey="ratio" xKey="name" color="#F59E0B" />
        </Card>
        <Card title="مسار التحويل التمويلي" subtitle="من الطلب إلى العقد" className="lg:col-span-4" delay={0.1}>
          <PipelineStage
            stages={[
              { name: "طلبات تلقي عروض", count: 1280, amount: "١٨٦ م", tone: "#64748B" },
              { name: "ملفات مكتملة", count: 940, tone: "#0057B8" },
              { name: "عروض مقدمة", count: 610, tone: "#1a6fd4" },
              { name: "قيد قرار العميل", count: 265, tone: "#F59E0B" },
              { name: "عقود مُغلقة", count: 118, amount: `${stats.conversionRate}%`, tone: "#16A34A" },
            ]}
          />
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="مؤشر المخاطر الزمني" subtitle="نقاط المخاطر المركّبة" className="lg:col-span-4" delay={0.05}>
          <LineChartWidget data={riskIndexData} dataKey="risk" color="#DC2626" />
        </Card>
        <Card title="توزيع مصادر الدخل (محفظة)" subtitle="تركيبة الدخل المجمّعة" className="lg:col-span-3" delay={0.08}>
          <DonutChartWidget
            data={[
              { name: "رواتب", value: 58 },
              { name: "أعمال", value: 18 },
              { name: "استثمار", value: 14 },
              { name: "أخرى", value: 10 },
            ]}
          />
        </Card>
        <Card title="سجل الأحداث التشغيلي" subtitle="آخر التحديثات الحية" className="lg:col-span-5" delay={0.1}>
          <LiveFeed items={feed} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card
          title="دفتر العمليات الأخيرة"
          subtitle="مراقبة لحظية للقنوات عالية القيمة"
          className="lg:col-span-8"
          action={<ExportButtons />}
        >
          <DataTable
            columns={txColumns}
            data={recentTransactions}
            onRowClick={() => router.push("/dashboard/customers/C-10482")}
          />
        </Card>
        <Card title="بوابات التشغيل" subtitle="انتقال سريع للوحدات" className="lg:col-span-4">
          <ModuleLinks
            links={[
              { href: "/dashboard/requests", title: "طابور التمويل", desc: "استقبال الطلبات وتقديم العروض", icon: Inbox, meta: `${stats.openRequests} نشط` },
              { href: "/dashboard/customers", title: "إدارة العملاء", desc: "ملفات · مخاطر · تصنيف", icon: Users, meta: "12.4 ألف" },
              { href: "/dashboard/sales", title: "غرفة المبيعات", desc: "قمع التحويل وفرص الإغلاق", icon: ShoppingBag },
              { href: "/dashboard/marketing", title: "ذكاء العروض", desc: "ترشيح منتجات حسب الملف", icon: Megaphone },
              { href: "/dashboard/aml", title: "مركز الامتثال", desc: "AML · مراقبة · قرارات", icon: ShieldAlert, meta: "17 تنبيه" },
              { href: "/dashboard/documents", title: "المستندات الرسمية", desc: "مخالصة · شراء مديونية · إخلاء طرف", icon: FileText },
              { href: "/dashboard/reports", title: "التقارير التنظيمية", desc: "امتثال ومخاطر ومبيعات", icon: FileBarChart },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
