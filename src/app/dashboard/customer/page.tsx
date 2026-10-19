"use client";

import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import {
  PieChartWidget,
  BarChartWidget,
  LineChartWidget,
  TimelineWidget,
} from "@/src/components/charts/Charts";
import { NotificationsWidget } from "@/src/components/dashboard/Widgets";
import {
  currentCustomer,
  incomeSourceData,
  commitmentRatioData,
  spendingAnalysis,
  wealthGrowthData,
  creditScoreHistory,
  documents,
  financialTimeline,
  notifications,
} from "@/src/lib/mock-data";
import { formatCurrency } from "@/src/lib/utils";
import {
  TrendingUp,
  MinusCircle,
  FileText,
  IdCard,
  FileSignature,
  Receipt,
  User,
  Briefcase,
  Users,
  Home,
} from "lucide-react";
import Link from "next/link";

const docIcons: Record<string, React.ElementType> = {
  "id-card": IdCard,
  "file-text": FileText,
  "file-signature": FileSignature,
  receipt: Receipt,
};

export default function CustomerOwnerDashboardPage() {
  useSetPageMeta({
    title: `مرحباً، ${currentCustomer.name}`,
    subtitle: "بوابة العميل — ملفي المالي",
  });

  const cards = [
    { label: "إجمالي الدخل", value: formatCurrency(currentCustomer.annualIncome) },
    { label: "الالتزامات", value: `${currentCustomer.commitmentRatio}%` },
    { label: "الرصيد المتاح", value: formatCurrency(currentCustomer.availableBalance) },
    { label: "التصنيف الائتماني", value: String(currentCustomer.creditScore) },
    { label: "نسبة الإنفاق", value: `${currentCustomer.spendingRatio}%` },
    { label: "صافي الثروة", value: formatCurrency(currentCustomer.totalWealth) },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-l from-[#0057B8] to-[#1a6fd4] p-6 text-white shadow-lg shadow-[#0057B8]/20">
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <p className="text-sm opacity-80">درجة الهوية المالية</p>
            <p className="text-4xl font-bold tabular-nums">{currentCustomer.identityScore}/100</p>
            <Badge className="mt-2 bg-white/20 text-white">{currentCustomer.financialStatus} · {currentCustomer.simahScoreBand}</Badge>
          </div>
          <div className="sm:max-w-sm sm:text-left">
            <p className="text-sm font-medium">اطلب عروض تمويل من البنوك</p>
            <p className="mt-1 text-sm leading-6 opacity-90">
              ارفع طلباً واحداً واستقبل عروضاً منافسة بناءً على ملفك المالي.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href="/dashboard/offers">
                <Button variant="secondary" size="sm" className="w-full bg-white text-[#0057B8] border-white hover:bg-white/90 sm:w-auto">
                  طلب تلقي العروض
                </Button>
              </Link>
              <div className="flex gap-3 text-sm">
                <Link href="/dashboard/advisor" className="underline-offset-4 opacity-90 hover:underline">
                  المستشار الذكي
                </Link>
                <span className="opacity-40">·</span>
                <Link href="/dashboard/capacity" className="underline-offset-4 opacity-90 hover:underline">
                  حاسبة القدرة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-[var(--text-muted)]">{c.label}</p>
            <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="تحليل الإنفاق الشهري">
          <BarChartWidget data={spendingAnalysis} dataKey="amount" xKey="category" color="#0057B8" />
        </Card>
        <Card title="توزيع الدخل">
          <PieChartWidget data={incomeSourceData} />
        </Card>
        <Card title="الالتزامات">
          <BarChartWidget data={commitmentRatioData} dataKey="ratio" xKey="name" color="#F59E0B" />
        </Card>
        <Card title="تطور الثروة">
          <LineChartWidget data={wealthGrowthData} dataKey="wealth" color="#16A34A" />
        </Card>
        <Card title="تطور التصنيف الائتماني" className="lg:col-span-2">
          <LineChartWidget data={creditScoreHistory} dataKey="score" color="#0057B8" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="المستندات">
          <div className="space-y-2">
            {documents.map((doc, i) => {
              const Icon = docIcons[doc.icon] || FileText;
              return (
                <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#0057B8]" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{doc.date}</p>
                    </div>
                  </div>
                  <Badge variant="success">{doc.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="الأحداث المالية">
          <TimelineWidget items={financialTimeline} />
        </Card>
        <NotificationsWidget items={notifications.filter((n) => n.type !== "danger")} compact />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="الملف الشخصي">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: User, label: "الاسم", value: currentCustomer.name },
              { icon: Briefcase, label: "الوظيفة", value: currentCustomer.job },
              { icon: TrendingUp, label: "الدخل الشهري", value: formatCurrency(currentCustomer.monthlyIncome) },
              { icon: Users, label: "أفراد الأسرة", value: String(currentCustomer.familyMembers) },
              { icon: MinusCircle, label: "الالتزامات", value: `${currentCustomer.commitmentRatio}%` },
              { icon: Home, label: "الممتلكات", value: "شقة + سيارة" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-[var(--bg-secondary)] p-3">
                <item.icon size={18} className="text-[#0057B8]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="الإعدادات السريعة">
          <div className="space-y-3">
            {["الخصوصية", "مشاركة البيانات", "التنبيهات", "تغيير اللغة"].map((setting) => (
              <Link
                key={setting}
                href="/dashboard/settings"
                className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3 transition-colors hover:border-[#0057B8]/30"
              >
                <span className="text-sm font-medium">{setting}</span>
                <span className="text-xs text-[#0057B8]">تعديل ←</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
