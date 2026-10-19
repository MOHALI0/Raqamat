"use client";

import { useState } from "react";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { useOffers } from "@/src/context/OffersProvider";
import { useToast } from "@/src/context/ToastProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { KpiCard, KpiGrid } from "@/src/components/ui/KpiCard";
import { OpsBanner, MetricRail } from "@/src/components/bank/BankOps";
import {
  calcMonthlyInstallment,
  formatDateAr,
  PARTICIPATING_BANKS,
} from "@/src/lib/financing";
import { formatCurrency } from "@/src/lib/utils";
import { Building2, Send, ShieldCheck } from "lucide-react";

export default function BankRequestsPage() {
  const { toast } = useToast();
  const { openRequests, offersForRequest, submitOffer, stats, offers } = useOffers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { amount: number; tenure: number }>>({});

  const activeId = selectedId ?? openRequests[0]?.id ?? null;
  const selected = openRequests.find((r) => r.id === activeId) ?? null;

  const [bankId, setBankId] = useState(PARTICIPATING_BANKS[0].id);
  const draft = activeId ? drafts[activeId] : undefined;
  const amount = draft?.amount ?? selected?.amount ?? 0;
  const tenure = draft?.tenure ?? selected?.tenureMonths ?? 36;
  const [rate, setRate] = useState(4.49);
  const [notes, setNotes] = useState("عرض مبني على ملف الهوية المالية الموحدة");

  useSetPageMeta({
    title: "طابور التمويل المركزي",
    subtitle: "استقبال طلبات العملاء وتقديم عروض البنوك المشاركة",
  });

  const updateDraft = (field: "amount" | "tenure", value: number) => {
    if (!activeId) return;
    setDrafts((prev) => ({
      ...prev,
      [activeId]: {
        amount: field === "amount" ? value : (prev[activeId]?.amount ?? selected?.amount ?? 0),
        tenure: field === "tenure" ? value : (prev[activeId]?.tenure ?? selected?.tenureMonths ?? 36),
      },
    }));
  };

  const pickRequest = (id: string) => setSelectedId(id);

  const installment = calcMonthlyInstallment(amount || 0, tenure || 1, rate || 0);
  const selectedOffers = selected ? offersForRequest(selected.id) : [];
  const bank = PARTICIPATING_BANKS.find((b) => b.id === bankId)!;

  const handleOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const offer = submitOffer({
      requestId: selected.id,
      bankId: bank.id,
      bankName: bank.name,
      amount,
      tenureMonths: tenure,
      profitRate: rate,
      conditions: ["تحويل الراتب", "تقييم ائتماني ساري", "بدون كفيل عند استيفاء الشروط"],
      notes,
    });
    if (offer) toast(`تم إرسال عرض ${bank.name} للعميل ${selected.customerName}`, "success");
  };

  return (
    <>
      <OpsBanner
        title="طابور التمويل المركزي"
        subtitle="محرك مطابقة الطلبات والعروض — استقبال طلبات العملاء وإرسال عروض البنوك المشاركة"
        badges={[
          { label: `${stats.openRequests} طلب نشط`, variant: "warning" },
          { label: `${stats.pendingOffers} عرض معلّق`, variant: "primary" },
        ]}
      />

      <MetricRail
        items={[
          {
            label: "طلبات نشطة",
            value: String(stats.openRequests),
            hint: "قابلة للعروض",
            tone: "warn",
            progress: Math.min(100, stats.openRequests * 12),
            delta: "طابور حيّ",
          },
          {
            label: "عروض معلّقة",
            value: String(stats.pendingOffers),
            hint: "بانتظار العميل",
            tone: "info",
            progress: Math.min(100, stats.pendingOffers * 15),
            delta: "قرار مطلوب",
          },
          {
            label: "متوسط معدل الربح",
            value: `${stats.avgOfferRate}%`,
            hint: "مرجّح على العروض",
            tone: "ok",
            progress: Math.min(100, (stats.avgOfferRate / 8) * 100),
            delta: "سنوي",
          },
          {
            label: "حجم الطابور",
            value: formatCurrency(stats.totalRequestedAmount),
            hint: `إغلاق ${stats.conversionRate}%`,
            tone: "info",
            progress: Math.min(100, stats.conversionRate),
            delta: `${stats.conversionRate}%`,
          },
        ]}
      />

      <KpiGrid columns={4}>
        <KpiCard
          title="طلبات نشطة"
          value={String(stats.openRequests)}
          icon="files"
          trend="up"
          change={`${stats.openRequests} حيّ`}
          accent="amber"
          sparkline={[2, 3, 3, 4, 5, stats.openRequests || 4]}
          progress={Math.min(100, stats.openRequests * 12)}
          progressLabel="ضغط الطابور"
        />
        <KpiCard
          title="عروض معلّقة"
          value={String(stats.pendingOffers)}
          icon="alert"
          trend="up"
          deltaTone="neutral"
          change="بانتظار العميل"
          accent="blue"
          sparkline={[1, 2, 2, 3, stats.pendingOffers || 3]}
          progress={Math.min(100, stats.pendingOffers * 15)}
          progressLabel="عروض قيد القرار"
        />
        <KpiCard
          title="متوسط معدل الربح"
          value={`${stats.avgOfferRate}`}
          unit="%"
          icon="percent"
          trend="flat"
          deltaTone="good"
          change="مرجّح"
          accent="green"
          sparkline={[5.1, 4.9, 4.7, 4.6, stats.avgOfferRate || 4.5]}
          progress={Math.min(100, (stats.avgOfferRate / 8) * 100)}
          progressLabel="مقابل سقف 8%"
        />
        <KpiCard
          title="حجم الطلبات"
          value={formatCurrency(stats.totalRequestedAmount)}
          icon="income"
          trend="up"
          change={`${stats.conversionRate}% إغلاق`}
          accent="blue"
          sparkline={[40, 48, 55, 62, 70, 76]}
          progress={Math.min(100, stats.conversionRate)}
          progressLabel="معدل التحويل"
        />
      </KpiGrid>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card title="قائمة طلبات العملاء" subtitle={`${openRequests.length} طلب قابل للعروض`} className="lg:col-span-2">
          <div className="space-y-2">
            {openRequests.length === 0 && (
              <p className="py-10 text-center text-sm text-[var(--text-muted)]">لا توجد طلبات مفتوحة حالياً</p>
            )}
            {openRequests.map((req) => {
              const active = activeId === req.id;
              return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => pickRequest(req.id)}
                  className={`w-full rounded-xl border p-3 text-right transition-colors ${
                    active
                      ? "border-[#0057B8] bg-[#0057B8]/5"
                      : "border-[var(--border-color)] hover:border-[#0057B8]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{req.customerName}</p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {req.productName} · {req.id}
                      </p>
                    </div>
                    <Badge variant={req.status === "open" ? "primary" : "warning"}>
                      {req.status === "open" ? "جديد" : "عروض واردة"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[var(--text-secondary)]">
                    <span>{formatCurrency(req.amount)}</span>
                    <span>{req.tenureMonths} شهر</span>
                    <span>Score {req.creditScore}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {selected ? (
            <>
              <Card
                title={`تفاصيل الطلب — ${selected.customerName}`}
                subtitle={formatDateAr(selected.createdAt)}
                action={
                  <Badge variant="primary">
                    <ShieldCheck size={12} className="me-1 inline" />
                    ملف موثّق
                  </Badge>
                }
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    ["المنتج", selected.productName],
                    ["المبلغ المطلوب", formatCurrency(selected.amount)],
                    ["المدة", `${selected.tenureMonths} شهر`],
                    ["التصنيف الائتماني", String(selected.creditScore)],
                    ["الدخل الشهري", formatCurrency(selected.monthlyIncome)],
                    ["نسبة الالتزامات", `${selected.commitmentRatio}%`],
                    ["جهة العمل", selected.employer],
                    ["البريد", selected.customerEmail],
                    ["الغرض", selected.purpose],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-[var(--bg-secondary)] p-3">
                      <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
                      <p className="mt-1 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="تقديم عرض بنكي" subtitle="محاكاة عرض تمويل من بنك مشارك">
                <form onSubmit={handleOffer} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs text-[var(--text-muted)]">البنك المقدّم للعرض</label>
                      <select
                        value={bankId}
                        onChange={(e) => setBankId(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm"
                      >
                        {PARTICIPATING_BANKS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-[var(--text-muted)]">مبلغ العرض</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => updateDraft("amount", Number(e.target.value))}
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-[var(--text-muted)]">المدة (شهر)</label>
                      <input
                        type="number"
                        value={tenure}
                        onChange={(e) => updateDraft("tenure", Number(e.target.value))}
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-[var(--text-muted)]">معدل الربح السنوي %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-[var(--text-muted)]">ملاحظات العرض</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#0057B8]/5 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-[#0057B8]">
                      <Building2 size={16} />
                      القسط الشهري التقديري: <strong>{formatCurrency(installment)}</strong>
                    </div>
                    <Button type="submit" size="sm">
                      <Send size={14} /> إرسال العرض للعميل
                    </Button>
                  </div>
                </form>
              </Card>

              <Card title="العروض المرسلة على هذا الطلب">
                <div className="space-y-2">
                  {selectedOffers.length === 0 && (
                    <p className="py-6 text-center text-sm text-[var(--text-muted)]">لم يُرسل أي عرض بعد</p>
                  )}
                  {selectedOffers.map((o) => (
                    <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border-color)] p-3 text-sm">
                      <div>
                        <p className="font-medium">{o.bankName}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {formatCurrency(o.amount)} · قسط {formatCurrency(o.monthlyInstallment)} · {o.profitRate}%
                        </p>
                      </div>
                      <Badge
                        variant={
                          o.status === "accepted" ? "success" : o.status === "rejected" ? "danger" : "warning"
                        }
                      >
                        {o.status === "accepted" ? "مقبول" : o.status === "rejected" ? "مرفوض" : o.status === "expired" ? "منتهي" : "معلّق"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <p className="py-16 text-center text-sm text-[var(--text-muted)]">اختر طلباً من القائمة لبدء تقديم عرض</p>
            </Card>
          )}
        </div>
      </div>

      <Card title="آخر العروض على المنصة" className="mt-4" subtitle={`${offers.length} عرض`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                <th className="px-3 py-2 text-right font-medium">العرض</th>
                <th className="px-3 py-2 text-right font-medium">البنك</th>
                <th className="px-3 py-2 text-right font-medium">الطلب</th>
                <th className="px-3 py-2 text-right font-medium">المبلغ</th>
                <th className="px-3 py-2 text-right font-medium">القسط</th>
                <th className="px-3 py-2 text-right font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {offers.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b border-[var(--border-color)]">
                  <td className="px-3 py-2">{o.id}</td>
                  <td className="px-3 py-2">{o.bankName}</td>
                  <td className="px-3 py-2">{o.requestId}</td>
                  <td className="px-3 py-2">{formatCurrency(o.amount)}</td>
                  <td className="px-3 py-2">{formatCurrency(o.monthlyInstallment)}</td>
                  <td className="px-3 py-2">
                    <Badge variant={o.status === "accepted" ? "success" : o.status === "pending" ? "warning" : "default"}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
