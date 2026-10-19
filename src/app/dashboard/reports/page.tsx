"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { DataTable, StatusBadge } from "@/src/components/ui/DataTable";
import { SearchBar } from "@/src/components/ui/SearchBar";
import { ExportButtons } from "@/src/components/ui/ExportButtons";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { KpiCard } from "@/src/components/ui/KpiCard";
import { OpsBanner, MetricRail } from "@/src/components/bank/BankOps";
import { reportsList } from "@/src/lib/mock-data";
import { useToast } from "@/src/context/ToastProvider";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Download, Loader2 } from "lucide-react";

const reportTypes = ["الكل", "امتثال", "مخاطر", "AML", "مبيعات", "عملاء"];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("الكل");
  const { toast } = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);

  useSetPageMeta({
    title: "التقارير التنظيمية",
    subtitle: "أرشيف الامتثال والمخاطر والمبيعات",
  });

  const ready = reportsList.filter((r) => r.status === "جاهز").length;
  const pending = reportsList.filter((r) => r.status === "قيد الإعداد").length;

  const handleDownload = (id: string, name: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      toast(`تم تحميل "${name}" بنجاح`, "success");
    }, 1000);
  };

  const filtered = reportsList.filter((r) => {
    const matchSearch = r.name.includes(search) || r.id.includes(search);
    const matchFilter = filter === "الكل" || r.type === filter;
    return matchSearch && matchFilter;
  });

  const columns = [
    { key: "id", header: "مرجع التقرير" },
    { key: "name", header: "اسم التقرير" },
    {
      key: "type",
      header: "التصنيف",
      render: (item: (typeof reportsList)[0]) => <Badge variant="primary">{item.type}</Badge>,
    },
    { key: "date", header: "تاريخ الإصدار" },
    {
      key: "status",
      header: "الحالة",
      render: (item: (typeof reportsList)[0]) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "إجراءات",
      render: (item: (typeof reportsList)[0]) => (
        <Button
          variant="ghost"
          size="sm"
          disabled={downloading === item.id}
          onClick={() => handleDownload(item.id, item.name)}
        >
          {downloading === item.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} تحميل
        </Button>
      ),
    },
  ];

  return (
    <>
      <OpsBanner
        title="مركز التقارير التنظيمية"
        subtitle="إصدارات الامتثال والمخاطر وAML وأداء المبيعات — جاهزة للتحميل والمراجعة"
        badges={[
          { label: `${ready} جاهز`, variant: "success" },
          { label: `${pending} قيد الإعداد`, variant: "warning" },
        ]}
        actions={<ExportButtons filename="فهرس_التقارير" />}
      />

      <MetricRail
        items={[
          { label: "إجمالي الأرشيف", value: String(reportsList.length), hint: "تقارير مسجّلة", tone: "info" },
          { label: "جاهزة للتحميل", value: String(ready), hint: "معتمدة", tone: "ok" },
          { label: "قيد الإعداد", value: String(pending), hint: "دورة إنتاج", tone: "warn" },
          { label: "آخر إصدار", value: "1 يوليو", hint: "امتثال شهري", tone: "info" },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="إجمالي التقارير"
          value={String(reportsList.length)}
          icon="files"
          trend="up"
          change="+2"
          accent="blue"
          sparkline={[3, 4, 4, 5, 5, 6, reportsList.length]}
          progress={80}
        />
        <KpiCard
          title="جاهزة"
          value={String(ready)}
          icon="score"
          trend="up"
          change="معتمدة"
          accent="green"
          sparkline={[2, 3, 3, 4, 4, ready]}
          progress={(ready / reportsList.length) * 100}
        />
        <KpiCard
          title="قيد الإعداد"
          value={String(pending)}
          icon="alert"
          trend="down"
          change="-1"
          accent="amber"
          sparkline={[4, 3, 3, 2, 2, pending]}
          progress={40}
        />
      </div>

      <Card title="فهرس التقارير" subtitle={`${filtered.length} تقرير معروض`} action={<ExportButtons />}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBar
            placeholder="بحث في التقارير..."
            value={search}
            onChange={setSearch}
            className="flex-1 min-w-[200px]"
          />
          <div className="flex flex-wrap gap-1">
            {reportTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === type
                    ? "bg-[#0057B8] text-white"
                    : "bg-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[#0057B8]/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={filtered} />
      </Card>
    </>
  );
}
