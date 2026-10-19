"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { DataTable, StatusBadge } from "@/src/components/ui/DataTable";
import { SearchBar } from "@/src/components/ui/SearchBar";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { KpiCard, KpiGrid } from "@/src/components/ui/KpiCard";
import { OpsBanner, MetricRail, ScoreRingCompact } from "@/src/components/bank/BankOps";
import { customersList } from "@/src/lib/mock-data";
import { formatCurrency } from "@/src/lib/utils";
import { UserPlus, Filter, MapPin } from "lucide-react";

const riskFilters = ["الكل", "منخفض", "متوسط", "مرتفع"];
const statusFilters = ["الكل", "نشط", "مراجعة", "معلق"];

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");

  const filtered = useMemo(() => {
    return customersList.filter((c) => {
      const matchSearch =
        c.name.includes(search) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        ("city" in c && String((c as { city?: string }).city || "").includes(search));
      const matchRisk = riskFilter === "الكل" || c.risk === riskFilter;
      const matchStatus = statusFilter === "الكل" || c.status === statusFilter;
      return matchSearch && matchRisk && matchStatus;
    });
  }, [search, riskFilter, statusFilter]);

  const stats = {
    total: customersList.length,
    active: customersList.filter((c) => c.status === "نشط").length,
    highRisk: customersList.filter((c) => c.risk === "مرتفع").length,
    avgScore: Math.round(customersList.reduce((a, c) => a + c.score, 0) / customersList.length),
    avgDti: Math.round(
      (customersList.reduce((a, c) => a + (("dti" in c ? Number((c as { dti?: number }).dti) : 35) || 35), 0) /
        customersList.length) *
        10
    ) / 10,
  };

  useSetPageMeta({
    title: "سجل العملاء المركزي",
    subtitle: `${customersList.length} ملف هوية مالية · إدارة مخاطر وتصنيف`,
  });

  const columns = [
    {
      key: "name",
      header: "ملف العميل",
      render: (item: (typeof customersList)[0]) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0057B8] to-[#1a6fd4] text-xs font-bold text-white shadow-sm">
            {item.name.split(" ")[0]?.[0]}
            <span
              className={`absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-secondary)] ${
                item.status === "نشط" ? "bg-[#16A34A]" : item.status === "مراجعة" ? "bg-[#F59E0B]" : "bg-[#DC2626]"
              }`}
            />
          </div>
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              {item.id}
              {"city" in item && (item as { city?: string }).city && (
                <>
                  <span>·</span>
                  <MapPin size={10} />
                  {(item as { city?: string }).city}
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "score",
      header: "SIMAH",
      render: (item: (typeof customersList)[0]) => (
        <div>
          <p className="font-bold tabular-nums text-[#0057B8]">{item.score}</p>
          <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-[var(--border-color)]">
            <div
              className="h-full rounded-full bg-[#0057B8]"
              style={{ width: `${(item.score / 850) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "income",
      header: "الدخل الشهري",
      render: (item: (typeof customersList)[0]) => (
        <span className="font-semibold tabular-nums">{formatCurrency(item.income)}</span>
      ),
    },
    {
      key: "dti",
      header: "DTI",
      render: (item: (typeof customersList)[0]) => {
        const dti = "dti" in item ? Number((item as { dti?: number }).dti) : 35;
        return (
          <span className={`tabular-nums font-medium ${dti > 45 ? "text-[#DC2626]" : dti > 35 ? "text-[#F59E0B]" : "text-[#16A34A]"}`}>
            {dti}%
          </span>
        );
      },
    },
    { key: "risk", header: "المخاطر", render: (item: (typeof customersList)[0]) => <StatusBadge status={item.risk} /> },
    { key: "status", header: "الحالة", render: (item: (typeof customersList)[0]) => <StatusBadge status={item.status} /> },
    {
      key: "actions",
      header: "إجراءات",
      render: (item: (typeof customersList)[0]) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/customers/${item.id}`);
          }}
        >
          فتح الملف
        </Button>
      ),
    },
  ];

  return (
    <>
      <OpsBanner
        title="سجل العملاء المركزي"
        subtitle="عرض تشغيلي لملفات الهوية المالية مع مؤشرات الائتمان والمخاطر والالتزامات"
        badges={[
          { label: `${stats.active} نشط`, variant: "success" },
          { label: `${stats.highRisk} مرتفع المخاطر`, variant: "danger" },
        ]}
        actions={
          <>
            <ExportButtons filename="قائمة العملاء" />
            <Button variant="primary" size="sm">
              <UserPlus size={16} /> تسجيل عميل
            </Button>
          </>
        }
      />

      <MetricRail
        items={[
          {
            label: "إجمالي الملفات",
            value: String(stats.total),
            hint: "في السجل المركزي",
            tone: "info",
            progress: 100,
            delta: "كامل",
          },
          {
            label: "متوسط SIMAH",
            value: String(stats.avgScore),
            hint: "من أصل 850",
            tone: stats.avgScore >= 700 ? "ok" : stats.avgScore >= 620 ? "warn" : "critical",
            progress: Math.round((stats.avgScore / 850) * 1000) / 10,
            delta: `${Math.round((stats.avgScore / 850) * 100)}%`,
          },
          {
            label: "متوسط DTI",
            value: `${stats.avgDti}%`,
            hint: "نسبة الالتزامات من الدخل",
            tone: stats.avgDti > 40 ? "warn" : "ok",
            progress: Math.min(100, stats.avgDti),
            delta: stats.avgDti > 40 ? "مرتفع" : "ضمن الحد",
          },
          {
            label: "تحت المراجعة",
            value: String(customersList.filter((c) => c.status === "مراجعة").length),
            hint: "يتطلب قراراً",
            tone: "warn",
            progress:
              stats.total > 0
                ? Math.round(
                    (customersList.filter((c) => c.status === "مراجعة").length / stats.total) * 1000
                  ) / 10
                : 0,
          },
        ]}
      />

      <KpiGrid columns={4}>
        <KpiCard
          title="إجمالي العملاء"
          value={String(stats.total)}
          icon="users"
          trend="up"
          change={`${stats.active} نشط`}
          accent="blue"
          sparkline={[6, 7, 7, 8, 9, 9, stats.total]}
          progress={100}
          progressLabel="قاعدة البيانات"
        />
        <KpiCard
          title="عملاء نشطون"
          value={String(stats.active)}
          icon="activity"
          trend="up"
          deltaTone="good"
          change={`${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}%`}
          accent="green"
          sparkline={[4, 5, 5, 6, 6, 7, stats.active]}
          progress={stats.total ? (stats.active / stats.total) * 100 : 0}
          progressLabel="من إجمالي العملاء"
        />
        <KpiCard
          title="مرتفعي المخاطر"
          value={String(stats.highRisk)}
          icon="alert"
          trend={stats.highRisk > 0 ? "up" : "flat"}
          deltaTone={stats.highRisk > 0 ? "bad" : "good"}
          change={`${stats.total ? Math.round((stats.highRisk / stats.total) * 100) : 0}%`}
          accent="red"
          sparkline={[3, 3, 2, 2, 2, 1, stats.highRisk]}
          progress={stats.total ? (stats.highRisk / stats.total) * 100 : 0}
          progressLabel="نسبة المحفظة"
        />
        <KpiCard
          title="متوسط التصنيف"
          value={String(stats.avgScore)}
          icon="score"
          trend="up"
          change={`${Math.round((stats.avgScore / 850) * 100)}%`}
          accent="amber"
          sparkline={[680, 690, 700, 710, 715, 720, stats.avgScore]}
          progress={(stats.avgScore / 850) * 100}
          progressLabel="من مقياس SIMAH 850"
          subtitle="مؤشر SIMAH المركّب"
        />
      </KpiGrid>

      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Card title="توزيع جودة المحفظة" className="lg:col-span-3">
          <div className="flex justify-around py-4">
            <ScoreRingCompact value={stats.avgScore} max={850} label="متوسط Score" color="#0057B8" />
            <ScoreRingCompact value={Math.round(100 - stats.avgDti)} label="صحة DTI" color="#16A34A" />
          </div>
          <div className="mt-2 space-y-2 border-t border-[var(--border-color)] pt-3 text-xs">
            {[
              { label: "منخفض المخاطر", count: customersList.filter((c) => c.risk === "منخفض").length, color: "#16A34A" },
              { label: "متوسط", count: customersList.filter((c) => c.risk === "متوسط").length, color: "#F59E0B" },
              { label: "مرتفع", count: customersList.filter((c) => c.risk === "مرتفع").length, color: "#DC2626" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.label}
                </span>
                <span className="font-semibold tabular-nums">{r.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="دفتر العملاء"
          subtitle={`${filtered.length} نتيجة معروضة`}
          className="lg:col-span-9"
        >
          <div className="mb-4 space-y-3">
            <SearchBar placeholder="بحث بالاسم، رقم الملف، أو المدينة..." value={search} onChange={setSearch} />
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">المخاطر:</span>
              {riskFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    riskFilter === f ? "bg-[#0057B8] text-white" : "bg-[var(--border-color)] text-[var(--text-secondary)]"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="mr-2 text-xs text-[var(--text-muted)]">الحالة:</span>
              {statusFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    statusFilter === f ? "bg-[#0057B8] text-white" : "bg-[var(--border-color)] text-[var(--text-secondary)]"
                  }`}
                >
                  {f}
                </button>
              ))}
              {(search || riskFilter !== "الكل" || statusFilter !== "الكل") && (
                <Badge variant="primary">{filtered.length} نتيجة</Badge>
              )}
            </div>
          </div>

          {filtered.length > 0 ? (
            <DataTable
              columns={columns}
              data={filtered}
              onRowClick={(item) => router.push(`/dashboard/customers/${item.id}`)}
            />
          ) : (
            <EmptyState title="لا توجد نتائج" description="جرّب تغيير معايير البحث أو الفلترة" />
          )}
        </Card>
      </div>
    </>
  );
}
