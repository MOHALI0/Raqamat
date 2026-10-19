"use client";

import { use } from "react";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import {
  RadarChartWidget,
  PieChartWidget,
  LineChartWidget,
  TimelineWidget,
} from "@/src/components/charts/Charts";
import {
  currentCustomer,
  customersList,
  radarData,
  incomeSourceData,
  incomeGrowthData,
  customerJourney,
  marketingRecommendations,
} from "@/src/lib/mock-data";
import { formatCurrency } from "@/src/lib/utils";
import Link from "next/link";
import {
  Mail,
  Phone,
  Building2,
  CreditCard,
  ArrowRight,
  Edit,
  MessageSquare,
} from "lucide-react";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = customersList.find((c) => c.id === id) || {
    ...customersList[0],
    id,
  };

  useSetPageMeta({
    title: customer.name,
    subtitle: `ملف العميل ${customer.id}`,
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{customer.id}</Badge>
          <Badge variant={customer.risk === "منخفض" ? "success" : customer.risk === "متوسط" ? "warning" : "danger"}>
            مخاطر {customer.risk}
          </Badge>
          <Badge variant={customer.status === "نشط" ? "success" : "warning"}>{customer.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButtons />
          <Button variant="secondary" size="sm"><Edit size={16} /> تعديل</Button>
          <Button variant="primary" size="sm"><MessageSquare size={16} /> تواصل</Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0057B8] text-2xl font-bold text-white">
              {customer.name.split(" ")[0]?.[0]}{customer.name.split(" ")[1]?.[0]}
            </div>
            <h2 className="mt-4 text-lg font-bold">{customer.name}</h2>
            <p className="text-sm text-[var(--text-muted)]">{currentCustomer.job}</p>
            <div className="mt-4 w-full space-y-2 text-right text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Mail size={14} /> {currentCustomer.email}
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Phone size={14} /> {currentCustomer.phone}
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Building2 size={14} /> {currentCustomer.employer}
              </div>
            </div>
            <div className="mt-4 flex w-full gap-2">
              <Link href="/dashboard/marketing" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">تسويق</Button>
              </Link>
              <Link href="/dashboard/aml" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">AML</Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {[
            { label: "التصنيف الائتماني", value: String(customer.score), color: "#0057B8" },
            { label: "الدخل الشهري", value: formatCurrency(customer.income), color: "#16A34A" },
            { label: "نسبة الالتزامات", value: `${currentCustomer.commitmentRatio}%`, color: "#F59E0B" },
            { label: "القدرة الشرائية", value: formatCurrency(currentCustomer.purchasingPower), color: "#8B5CF6" },
            { label: "المنتجات", value: String(currentCustomer.products.length), color: "#0057B8" },
            { label: "AML Score", value: "91%", color: "#16A34A" },
          ].map((item) => (
            <Card key={item.label}>
              <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="تحليل العميل">
          <RadarChartWidget data={radarData} />
        </Card>
        <Card title="مصادر الدخل">
          <PieChartWidget data={incomeSourceData} />
        </Card>
        <Card title="نمو الدخل">
          <LineChartWidget data={incomeGrowthData} dataKey="income" />
        </Card>
        <Card title="رحلة العميل">
          <TimelineWidget items={customerJourney} />
        </Card>
      </div>

      <Card title="المنتجات الحالية">
        <div className="flex flex-wrap gap-3">
          {currentCustomer.products.map((product) => (
            <div key={product} className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-3">
              <CreditCard size={18} className="text-[#0057B8]" />
              <span className="text-sm font-medium">{product}</span>
              <Badge variant="success">نشط</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {marketingRecommendations.slice(0, 3).map((rec) => (
          <div key={rec.product} className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{rec.product}</p>
              <Badge variant="success">{rec.match}%</Badge>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">{rec.reason}</p>
            <Button variant="primary" size="sm" className="mt-3 w-full">
              تقديم عرض <ArrowRight size={14} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
