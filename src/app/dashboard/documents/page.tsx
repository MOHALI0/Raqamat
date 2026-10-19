"use client";

import { useMemo, useState } from "react";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { useAuth } from "@/src/context/AuthProvider";
import { useWorkflows } from "@/src/context/WorkflowsProvider";
import { useToast } from "@/src/context/ToastProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { KpiCard, KpiGrid } from "@/src/components/ui/KpiCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/src/components/ui/Field";
import { OpsBanner, MetricRail } from "@/src/components/bank/BankOps";
import { DOC_TYPE_META, type DocRequestType } from "@/src/lib/workflows";
import { formatDateAr, PARTICIPATING_BANKS } from "@/src/lib/financing";
import { currentCustomer, customersList } from "@/src/lib/mock-data";
import { resolveSessionBank } from "@/src/lib/auth";
import {
  Building2,
  Briefcase,
  CheckCircle2,
  FileText,
  Lock,
  Send,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

const statusMap: Record<string, { label: string; variant: "warning" | "success" | "danger" | "default" }> = {
  pending: { label: "بانتظار الرد", variant: "warning" },
  approved: { label: "موافق", variant: "success" },
  rejected: { label: "مرفوض", variant: "danger" },
  issued: { label: "صادر", variant: "success" },
  cancelled: { label: "ملغي", variant: "default" },
};

const audienceBadge: Record<string, { label: string; variant: "primary" | "success" | "warning" }> = {
  customer: { label: "بنك → عميل", variant: "success" },
  employer: { label: "بنك → جهة عمل", variant: "warning" },
  bank: { label: "بنك → بنك", variant: "primary" },
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    documentRequests,
    createDocumentRequest,
    respondDocumentRequest,
    createSalaryTransfer,
    createSalaryCertificate,
    stats,
  } = useWorkflows();

  const isBank = user?.role === "bank";
  const isCustomer = user?.role === "customer";
  const sessionBank = resolveSessionBank(user);

  const [docType, setDocType] = useState<DocRequestType>("clearance_letter");
  const [customerId, setCustomerId] = useState(currentCustomer.id);
  const [notes, setNotes] = useState("");
  const [counterpartyBankId, setCounterpartyBankId] = useState(
    () => PARTICIPATING_BANKS.find((b) => b.id !== sessionBank.id)?.id || PARTICIPATING_BANKS[1].id
  );
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const audience = DOC_TYPE_META[docType].audience;
  const isDebtPurchase = docType === "debt_purchase";
  const isSalaryRequest = docType === "salary_certificate" || docType === "iban_letter";

  const otherBanks = useMemo(
    () => PARTICIPATING_BANKS.filter((b) => b.id !== sessionBank.id),
    [sessionBank.id]
  );

  useSetPageMeta({
    title: isBank ? "طلبات المستندات الرسمية" : "مستنداتي البنكية",
    subtitle: isBank
      ? "طلبات باسم بنكك فقط — شراء مديونية بين البنوك، ورواتب مع جهة العمل"
      : "الموافقة على طلبات البنوك للمستندات الرسمية",
  });

  const visibleDocs = useMemo(() => {
    if (isCustomer) return documentRequests.filter((d) => d.customerId === currentCustomer.id);
    return documentRequests;
  }, [documentRequests, isCustomer]);

  const pendingDocs = visibleDocs.filter((d) => d.status === "pending");
  const selectedCustomer = customersList.find((c) => c.id === customerId) || customersList[0];
  const counterpartyBank = otherBanks.find((b) => b.id === counterpartyBankId) || otherBanks[0];

  const bankDocTypes: DocRequestType[] = [
    "clearance_letter",
    "debt_purchase",
    "liability_clearance",
    "salary_certificate",
    "iban_letter",
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (docType === "salary_certificate") {
      createSalaryCertificate({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        requestedBy: "bank",
        bankName: sessionBank.name,
        monthlySalary: selectedCustomer.income,
        employerId: selectedCustomer.employerId,
        employerName: selectedCustomer.employer,
      });
      toast(`تم إرسال طلب شهادة الراتب إلى ${selectedCustomer.employer}`, "success");
      return;
    }

    if (docType === "iban_letter") {
      createSalaryTransfer({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        bankId: sessionBank.id,
        bankName: sessionBank.name,
        monthlySalary: selectedCustomer.income,
        employerId: selectedCustomer.employerId,
        employerName: selectedCustomer.employer,
      });
      toast(`تم إرسال طلب تحويل الراتب إلى ${selectedCustomer.employer}`, "success");
      return;
    }

    if (isDebtPurchase && !counterpartyBank) {
      toast("اختر البنك الحامل للمديونية", "error");
      return;
    }

    createDocumentRequest({
      type: docType,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      bankId: sessionBank.id,
      bankName: sessionBank.name,
      counterpartyBankId: isDebtPurchase ? counterpartyBank.id : undefined,
      counterpartyBankName: isDebtPurchase ? counterpartyBank.name : undefined,
      notes,
    });

    if (isDebtPurchase) {
      toast(`تم إرسال طلب شراء المديونية إلى ${counterpartyBank.name}`, "success");
    } else {
      toast("تم إرسال طلب المستند إلى العميل", "success");
    }
    setNotes("");
  };

  const routeHint = (() => {
    if (isDebtPurchase) return `${sessionBank.name} → ${counterpartyBank?.name || "بنك آخر"}`;
    if (isSalaryRequest) return `${sessionBank.name} → ${selectedCustomer.employer}`;
    return `${sessionBank.name} → ${selectedCustomer.name}`;
  })();

  return (
    <>
      {isBank ? (
        <OpsBanner
          title="غرفة المستندات الرسمية"
          subtitle="الطلبات تُرسل باسم بنكك المسجّل فقط. شراء المديونية بين البنوك، وتحويل الراتب وشهاداته مع جهة العمل."
          badges={[
            { label: sessionBank.name, variant: "primary" },
            { label: `${stats.pendingDocs} بانتظار الرد`, variant: "warning" },
            { label: `${stats.pendingCertificates} شهادات معلّقة`, variant: "primary" },
          ]}
        />
      ) : (
        <OpsBanner
          live={false}
          tone="customer"
          title="مستنداتك البنكية"
          subtitle="راجع طلبات البنوك ووافق على المخالصة أو شراء المديونية أو إخلاء الطرف بضغطة واحدة"
          badges={[
            { label: `${pendingDocs.length} بانتظارك`, variant: pendingDocs.length ? "warning" : "success" },
          ]}
          footer={
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#16A34A]" /> موافقتك تُسجَّل بشكل آمن في الهوية المالية
            </span>
          }
        />
      )}

      {isBank && (
        <MetricRail
          items={[
            {
              label: "طلبات مستندات معلّقة",
              value: String(stats.pendingDocs),
              hint: "بانتظار رد العميل أو البنك المقابل",
              tone: stats.pendingDocs > 0 ? "warn" : "ok",
              progress:
                documentRequests.length > 0
                  ? Math.round((stats.pendingDocs / documentRequests.length) * 1000) / 10
                  : 0,
              delta: `${documentRequests.length} إجمالي`,
            },
            {
              label: "تحويلات راتب معلّقة",
              value: String(stats.pendingTransfers),
              hint: "لدى جهات العمل",
              tone: stats.pendingTransfers > 0 ? "info" : "ok",
              progress: Math.min(100, stats.pendingTransfers * 25),
              delta: "بنك → جهة عمل",
            },
            {
              label: "شهادات بانتظار الإصدار",
              value: String(stats.pendingCertificates),
              hint: "تعريف بالراتب",
              tone: stats.pendingCertificates > 0 ? "warn" : "ok",
              progress: Math.min(100, stats.pendingCertificates * 25),
              delta: "بنك → جهة عمل",
            },
            {
              label: "شهادات صادرة",
              value: String(stats.issuedCertificates),
              hint: "مكتملة وموثّقة",
              tone: "ok",
              progress:
                stats.issuedCertificates + stats.pendingCertificates > 0
                  ? Math.round(
                      (stats.issuedCertificates /
                        (stats.issuedCertificates + stats.pendingCertificates)) *
                        1000
                    ) / 10
                  : 0,
              delta: "نسبة الإنجاز",
            },
          ]}
        />
      )}

      {!isBank && (
        <KpiGrid columns={3}>
          <KpiCard
            title="بانتظار موافقتك"
            value={String(pendingDocs.length)}
            icon="files"
            trend={pendingDocs.length > 0 ? "up" : "flat"}
            deltaTone={pendingDocs.length > 0 ? "neutral" : "good"}
            change={
              visibleDocs.length
                ? `${Math.round((pendingDocs.length / visibleDocs.length) * 100)}% من طلباتك`
                : "لا طلبات"
            }
            accent="amber"
            progress={
              visibleDocs.length ? (pendingDocs.length / visibleDocs.length) * 100 : 0
            }
            progressLabel="نسبة المعلّق"
          />
          <KpiCard
            title="موافق عليها"
            value={String(visibleDocs.filter((d) => d.status === "approved").length)}
            icon="score"
            trend="up"
            deltaTone="good"
            change={
              visibleDocs.length
                ? `${Math.round(
                    (visibleDocs.filter((d) => d.status === "approved").length / visibleDocs.length) *
                      100
                  )}%`
                : "—"
            }
            accent="green"
            progress={
              visibleDocs.length
                ? (visibleDocs.filter((d) => d.status === "approved").length / visibleDocs.length) *
                  100
                : 0
            }
            progressLabel="نسبة الموافقة"
          />
          <KpiCard
            title="إجمالي الطلبات"
            value={String(visibleDocs.length)}
            icon="bank"
            trend="flat"
            deltaTone="neutral"
            change={`${visibleDocs.filter((d) => d.status === "rejected").length} مرفوض`}
            accent="blue"
            progress={100}
            progressLabel="سجل المستندات"
          />
        </KpiGrid>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        {isBank && (
          <Card title="إرسال طلب جديد" subtitle="باسم البنك المسجّل فقط" className="lg:col-span-2">
            <form onSubmit={handleCreate} className="space-y-3.5">
              <Field label="البنك المرسل">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0057B8]/10 text-[#0057B8]">
                    <Building2 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{sessionBank.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">مربوط بحسابك — لا يمكن تغييره</p>
                  </div>
                  <Lock size={14} className="shrink-0 text-[var(--text-muted)]" />
                </div>
              </Field>

              <Field label="نوع المستند" hint={DOC_TYPE_META[docType].description}>
                <Select value={docType} onChange={(e) => setDocType(e.target.value as DocRequestType)}>
                  {bankDocTypes.map((t) => (
                    <option key={t} value={t}>
                      {DOC_TYPE_META[t].title} · {DOC_TYPE_META[t].routeLabel}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={audienceBadge[audience].variant}>{audienceBadge[audience].label}</Badge>
                <span className="text-[11px] text-[var(--text-muted)]">{routeHint}</span>
              </div>

              <Field label="العميل المعني">
                <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  {customersList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </Select>
              </Field>

              {isDebtPurchase && (
                <Field
                  label="البنك الحامل للمديونية"
                  hint="يُرسل الطلب بين بنكك وهذا البنك لشراء المديونية"
                >
                  <Select value={counterpartyBankId} onChange={(e) => setCounterpartyBankId(e.target.value)}>
                    {otherBanks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}

              {isSalaryRequest && (
                <Field label="جهة العمل المستلمة">
                  <div className="flex items-center gap-2 rounded-xl border border-[#0F766E]/25 bg-[#0F766E]/5 px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F766E]/10 text-[#0F766E]">
                      <Briefcase size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{selectedCustomer.employer}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        مرتبطة بملف العميل — الطلب يصل لبوابة جهة العمل
                      </p>
                    </div>
                  </div>
                </Field>
              )}

              {!isDebtPurchase && !isSalaryRequest && (
                <Field label="المستلم">
                  <div className="flex items-center gap-2 rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/5 px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16A34A]/10 text-[#16A34A]">
                      <User size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{selectedCustomer.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">يظهر الطلب في بوابة العميل للموافقة</p>
                    </div>
                  </div>
                </Field>
              )}

              <Field label="ملاحظات">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="تفاصيل إضافية للطلب..."
                />
              </Field>
              <Button type="submit" className="w-full">
                <Send size={14} />{" "}
                {isDebtPurchase
                  ? "إرسال للبنك المقابل"
                  : isSalaryRequest
                    ? "إرسال لجهة العمل"
                    : "إرسال للعميل"}
              </Button>
            </form>
          </Card>
        )}

        <Card
          title={isBank ? "سجل الطلبات" : "طلبات بانتظار موافقتك"}
          subtitle={`${visibleDocs.length} طلب`}
          className={isBank ? "lg:col-span-3" : "lg:col-span-5"}
        >
          <div className="space-y-3">
            {visibleDocs.length === 0 && (
              <EmptyState
                tone={isCustomer ? "customer" : "bank"}
                icon={FileText}
                title="لا توجد طلبات حالياً"
                description={
                  isBank
                    ? "ابدأ بإرسال طلب مستند من النموذج على اليمين."
                    : "عندما يطلب بنك مستنداً رسمياً سيظهر هنا للموافقة."
                }
              />
            )}
            {visibleDocs.map((doc) => {
              const st = statusMap[doc.status] || statusMap.pending;
              const isRejecting = rejectId === doc.id;
              const meta = DOC_TYPE_META[doc.type];
              const routeLine =
                doc.type === "debt_purchase" && doc.counterpartyBankName
                  ? `${doc.bankName} → ${doc.counterpartyBankName}`
                  : `${doc.bankName} → ${doc.customerName}`;

              return (
                <div
                  key={doc.id}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/40 p-4 transition-colors hover:border-[#0057B8]/25"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0057B8]/10 text-[#0057B8]">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{doc.title}</p>
                          <Badge variant={audienceBadge[meta.audience].variant}>
                            {audienceBadge[meta.audience].label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {routeLine} · العميل: {doc.customerName} · {doc.id}
                        </p>
                      </div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{doc.description}</p>
                  {doc.notes && (
                    <p className="mt-2 rounded-lg bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-muted)]">
                      ملاحظة البنك: {doc.notes}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-[var(--text-muted)]">{formatDateAr(doc.createdAt)}</p>

                  {isCustomer && doc.status === "pending" && meta.audience === "customer" && !isRejecting && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          respondDocumentRequest(doc.id, "approved", "تمت الموافقة من العميل");
                          toast("تمت الموافقة على الطلب", "success");
                        }}
                      >
                        <CheckCircle2 size={14} /> موافقة
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setRejectId(doc.id);
                          setRejectReason("");
                        }}
                      >
                        <XCircle size={14} /> رفض
                      </Button>
                    </div>
                  )}

                  {isCustomer && doc.status === "pending" && meta.audience === "bank" && (
                    <p className="mt-3 rounded-lg bg-[#0057B8]/5 px-3 py-2 text-xs text-[var(--text-secondary)]">
                      طلب بين البنوك بخصوص مديونيتك — يُعالَج بين {doc.bankName}
                      {doc.counterpartyBankName ? ` و${doc.counterpartyBankName}` : ""}. يمكنك الاطلاع فقط.
                    </p>
                  )}

                  {isBank && doc.status === "pending" && doc.type === "debt_purchase" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          respondDocumentRequest(
                            doc.id,
                            "approved",
                            `تم قبول طلب الشراء من ${doc.counterpartyBankName || "البنك المقابل"}`
                          );
                          toast("تم تسجيل موافقة البنك المقابل على شراء المديونية", "success");
                        }}
                      >
                        <CheckCircle2 size={14} /> تسجيل موافقة البنك المقابل
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          respondDocumentRequest(doc.id, "rejected", "رفض البنك الحامل للمديونية");
                          toast("تم تسجيل رفض البنك المقابل", "info");
                        }}
                      >
                        <XCircle size={14} /> تسجيل رفض
                      </Button>
                    </div>
                  )}

                  {isCustomer && isRejecting && (
                    <div className="mt-3 space-y-2 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-3">
                      <Field label="سبب الرفض (اختياري)">
                        <Input
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="مثال: بيانات غير مكتملة"
                        />
                      </Field>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            respondDocumentRequest(doc.id, "rejected", rejectReason || "رفض العميل");
                            toast("تم رفض الطلب", "info");
                            setRejectId(null);
                          }}
                        >
                          تأكيد الرفض
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectId(null)}>
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}

                  {doc.responseNote && (
                    <p className="mt-2 text-xs text-[#16A34A]">رد العميل: {doc.responseNote}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
