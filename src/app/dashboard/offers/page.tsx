"use client";

import { useMemo, useState } from "react";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { useOffers } from "@/src/context/OffersProvider";
import { useToast } from "@/src/context/ToastProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { KpiCard, KpiGrid } from "@/src/components/ui/KpiCard";
import { currentCustomer } from "@/src/lib/mock-data";
import {
  assessEligibility,
  FINANCING_PRODUCTS,
  FinancingProductType,
  formatDateAr,
} from "@/src/lib/financing";
import { formatCurrency } from "@/src/lib/utils";
import {
  CheckCircle2,
  Clock3,
  HandCoins,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";

const statusVariant: Record<string, "success" | "warning" | "danger" | "primary" | "default"> = {
  open: "primary",
  matched: "warning",
  closed: "success",
  cancelled: "default",
  pending: "warning",
  accepted: "success",
  rejected: "danger",
  expired: "default",
};

const statusLabel: Record<string, string> = {
  open: "بانتظار عروض",
  matched: "عروض واردة",
  closed: "مكتمل",
  cancelled: "ملغي",
  pending: "بانتظار قرارك",
  accepted: "مقبول",
  rejected: "مرفوض",
  expired: "منتهي",
};

export default function CustomerOffersPage() {
  const { toast } = useToast();
  const { createRequest, cancelRequest, respondToOffer, customerRequests, offersForCustomer } =
    useOffers();

  const myRequests = customerRequests(currentCustomer.id);
  const myOffers = offersForCustomer(currentCustomer.id);

  const [productType, setProductType] = useState<FinancingProductType>("personal");
  const product = FINANCING_PRODUCTS.find((p) => p.type === productType)!;
  const [amount, setAmount] = useState(120000);
  const [tenure, setTenure] = useState(36);
  const [purpose, setPurpose] = useState("تمويل احتياجات شخصية مع أقساط ميسرة");
  const [submitting, setSubmitting] = useState(false);

  useSetPageMeta({
    title: "طلب العروض التمويلية",
    subtitle: "قارن عروض البنوك واختر الأنسب لملفك المالي",
  });

  const eligibility = useMemo(
    () =>
      assessEligibility(
        product,
        currentCustomer.creditScore,
        currentCustomer.commitmentRatio,
        amount
      ),
    [amount, product]
  );

  const pendingOffers = myOffers.filter((o) => o.status === "pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.eligible) {
      toast("لا يمكن إرسال الطلب حالياً بسبب شروط الأهلية", "warning");
      return;
    }
    setSubmitting(true);
    createRequest({
      productType,
      amount,
      tenureMonths: tenure,
      purpose,
    });
    toast("تم رفع طلب تلقي العروض بنجاح — ستصلك عروض البنوك قريباً", "success");
    setSubmitting(false);
  };

  return (
    <>
      <KpiGrid columns={4}>
        <KpiCard
          title="طلباتي"
          value={String(myRequests.length)}
          icon="files"
          trend="flat"
          deltaTone="neutral"
          change={`${myRequests.filter((r) => r.status === "open").length} مفتوح`}
          progress={myRequests.length ? 100 : 0}
          progressLabel="سجل الطلبات"
        />
        <KpiCard
          title="عروض بانتظار القرار"
          value={String(pendingOffers.length)}
          icon="alert"
          trend={pendingOffers.length ? "up" : "flat"}
          deltaTone="neutral"
          change={
            myOffers.length
              ? `${Math.round((pendingOffers.length / myOffers.length) * 100)}% من العروض`
              : "لا عروض"
          }
          accent="amber"
          progress={myOffers.length ? (pendingOffers.length / myOffers.length) * 100 : 0}
          progressLabel="نسبة المعلّق"
        />
        <KpiCard
          title="عروض مقبولة"
          value={String(myOffers.filter((o) => o.status === "accepted").length)}
          icon="score"
          trend="up"
          deltaTone="good"
          change={
            myOffers.length
              ? `${Math.round(
                  (myOffers.filter((o) => o.status === "accepted").length / myOffers.length) * 100
                )}%`
              : "—"
          }
          accent="green"
          progress={
            myOffers.length
              ? (myOffers.filter((o) => o.status === "accepted").length / myOffers.length) * 100
              : 0
          }
          progressLabel="نسبة القبول"
        />
        <KpiCard
          title="القدرة التقديرية"
          value={formatCurrency(currentCustomer.expectedCreditLimit)}
          icon="income"
          trend="up"
          change={`${currentCustomer.acceptanceRate}% قبول`}
          accent="blue"
          progress={currentCustomer.acceptanceRate}
          progressLabel="احتمال القبول"
        />
      </KpiGrid>

      <div className="mb-6 grid gap-4 lg:grid-cols-5">
        <Card title="رفع طلب تلقي عروض" subtitle="يُشارك ملخص ملفك المالي مع البنوك المشاركة فقط" className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">المنتج التمويلي</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {FINANCING_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProductType(p.type);
                      setAmount(Math.min(Math.max(amount, p.minAmount), p.maxAmount));
                      setTenure(Math.min(Math.max(tenure, p.minTenure), p.maxTenure));
                    }}
                    className={`rounded-xl border p-3 text-right transition-colors ${
                      productType === p.type
                        ? "border-[#0057B8] bg-[#0057B8]/5"
                        : "border-[var(--border-color)] hover:border-[#0057B8]/30"
                    }`}
                  >
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-2">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
                  المبلغ المطلوب ({formatCurrency(product.minAmount)} — {formatCurrency(product.maxAmount)})
                </label>
                <input
                  type="number"
                  value={amount}
                  min={product.minAmount}
                  max={product.maxAmount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm focus:border-[#0057B8] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
                  مدة التمويل (شهر) — حتى {product.maxTenure}
                </label>
                <input
                  type="number"
                  value={tenure}
                  min={product.minTenure}
                  max={product.maxTenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm focus:border-[#0057B8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">الغرض من التمويل</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm focus:border-[#0057B8] focus:outline-none"
              />
            </div>

            <div
              className={`rounded-xl border p-3 text-xs ${
                eligibility.eligible
                  ? "border-[#16A34A]/30 bg-[#16A34A]/5 text-[#16A34A]"
                  : "border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#B45309]"
              }`}
            >
              {eligibility.eligible ? (
                <p className="flex items-center gap-2">
                  <Sparkles size={14} /> مؤهل مبدئياً لهذا المنتج — سيتم تقييم العروض من البنوك
                </p>
              ) : (
                <ul className="space-y-1">
                  {eligibility.reasons.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={submitting || !eligibility.eligible}>
              <Send size={16} /> إرسال طلب تلقي العروض
            </Button>
          </form>
        </Card>

        <Card title="ملخص ملفك المعروض للبنوك" className="lg:col-span-2">
          <div className="space-y-3 text-sm">
            {[
              ["التصنيف الائتماني", String(currentCustomer.creditScore)],
              ["الدخل الشهري", formatCurrency(currentCustomer.monthlyIncome)],
              ["نسبة الالتزامات", `${currentCustomer.commitmentRatio}%`],
              ["جهة العمل", currentCustomer.employer],
              ["درجة الهوية", `${currentCustomer.identityScore}/100`],
              ["المنتجات الحالية", currentCustomer.products.join("، ")],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-3 border-b border-[var(--border-color)] pb-2">
                <span className="text-xs text-[var(--text-muted)]">{label}</span>
                <span className="text-left text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[var(--text-muted)]">
            لا تُشارك تفاصيل الحسابات أو كلمات المرور. البنوك ترى مؤشرات الأهلية فقط لتقديم عرض مناسب.
          </p>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="طلباتي" subtitle={`${myRequests.length} طلب`}>
          <div className="space-y-3">
            {myRequests.length === 0 && (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">لا توجد طلبات بعد — ابدأ برفع طلب جديد</p>
            )}
            {myRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-[var(--border-color)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{req.productName}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{req.id} · {formatDateAr(req.createdAt)}</p>
                  </div>
                  <Badge variant={statusVariant[req.status]}>{statusLabel[req.status]}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                  <span>المبلغ: {formatCurrency(req.amount)}</span>
                  <span>المدة: {req.tenureMonths} شهر</span>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{req.purpose}</p>
                {(req.status === "open" || req.status === "matched") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-[#DC2626]"
                    onClick={() => {
                      cancelRequest(req.id);
                      toast("تم إلغاء الطلب", "info");
                    }}
                  >
                    إلغاء الطلب
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="عروض البنوك" subtitle={`${pendingOffers.length} بانتظار قرارك`} action={<HandCoins size={18} className="text-[#0057B8]" />}>
          <div className="space-y-3">
            {myOffers.length === 0 && (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">ستظهر هنا عروض البنوك بعد تقديم طلبك</p>
            )}
            {myOffers.map((offer) => (
              <div key={offer.id} className="rounded-xl border border-[var(--border-color)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{offer.bankName}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      للطلب {offer.requestId} · ينتهي {formatDateAr(offer.expiresAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[offer.status]}>{statusLabel[offer.status]}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div>
                    <p className="text-[var(--text-muted)]">المبلغ</p>
                    <p className="font-medium">{formatCurrency(offer.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">القسط الشهري</p>
                    <p className="font-medium">{formatCurrency(offer.monthlyInstallment)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">معدل الربح</p>
                    <p className="font-medium">{offer.profitRate}%</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">احتمال الموافقة</p>
                    <p className="font-medium">{offer.approvalProbability}%</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {offer.conditions.map((c) => (
                    <span key={c} className="rounded-lg bg-[var(--border-color)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
                      {c}
                    </span>
                  ))}
                </div>
                {offer.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        respondToOffer(offer.id, "accepted");
                        toast(`تم قبول عرض ${offer.bankName}`, "success");
                      }}
                    >
                      <CheckCircle2 size={14} /> قبول العرض
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        respondToOffer(offer.id, "rejected");
                        toast("تم رفض العرض", "info");
                      }}
                    >
                      <XCircle size={14} /> رفض
                    </Button>
                  </div>
                )}
                {offer.status === "pending" && (
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <Clock3 size={12} /> العرض ساري حتى انتهاء المهلة المحددة
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
