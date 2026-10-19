"use client";

import Link from "next/link";
import { useState } from "react";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { useAuth } from "@/src/context/AuthProvider";
import { useWorkflows } from "@/src/context/WorkflowsProvider";
import { useToast } from "@/src/context/ToastProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Field, Input } from "@/src/components/ui/Field";
import { OpsBanner } from "@/src/components/bank/BankOps";
import { formatCurrency } from "@/src/lib/utils";
import { formatDateAr } from "@/src/lib/financing";
import { FileBadge2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function EmployerCertificatesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { salaryCertificates, issueSalaryCertificate, rejectSalaryCertificate } = useWorkflows();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const myCerts = salaryCertificates.filter((c) => c.employerId === (user?.id || "emp-1"));
  const pending = myCerts.filter((c) => c.status === "pending").length;

  useSetPageMeta({
    title: "شهادات التعريف بالراتب",
    subtitle: "إصدار شهادات رسمية للبنوك",
  });

  return (
    <>
      <OpsBanner
        live={false}
        tone="employer"
        title="إصدار شهادات الراتب"
        subtitle="راجع الطلبات الصادرة من البنوك أو الموظفين وأصدر شهادة تعريف بالراتب معتمدة"
        badges={[
          {
            label: pending ? `${pending} بانتظار الإصدار` : "لا طلبات معلّقة",
            variant: pending ? "warning" : "success",
          },
        ]}
        actions={
          <Link href="/dashboard/employer">
            <Button size="sm" variant="ghost">
              <ArrowRight size={14} /> لوحة جهة العمل
            </Button>
          </Link>
        }
        footer={
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#0F766E]" /> الشهادة تحمل رقماً رسمياً قابلاً للتحقق
          </span>
        }
      />

      <div className="space-y-3">
        {myCerts.length === 0 && (
          <Card>
            <EmptyState
              tone="employer"
              icon={FileBadge2}
              title="لا توجد طلبات شهادات"
              description="طلبات التعريف بالراتب من البنوك ستظهر هنا لإصدارها."
              action={
                <Link href="/dashboard/employer">
                  <Button size="sm" variant="employer">العودة للوحة</Button>
                </Link>
              }
            />
          </Card>
        )}

        {myCerts.map((c) => (
          <Card key={c.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                  <FileBadge2 size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold">{c.customerName}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {c.jobTitle} · لصالح {c.bankName || "الاستخدام العام"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                    <span>
                      الراتب:{" "}
                      <strong className="text-[var(--text-primary)]">{formatCurrency(c.monthlySalary)}</strong>
                    </span>
                    <span>تاريخ التعيين: {c.hireDate}</span>
                    <span className="font-mono">{c.id}</span>
                  </div>
                  {c.certificateNo && (
                    <p className="mt-2 inline-flex rounded-lg bg-[#16A34A]/10 px-2.5 py-1 text-xs font-medium text-[#16A34A]">
                      رقم الشهادة: {c.certificateNo}
                    </p>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  c.status === "issued" ? "success" : c.status === "rejected" ? "danger" : "warning"
                }
              >
                {c.status === "issued" ? "صادرة" : c.status === "rejected" ? "مرفوضة" : "بانتظار"}
              </Badge>
            </div>

            {c.status === "pending" && rejectId !== c.id && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="employer"
                  onClick={() => {
                    issueSalaryCertificate(c.id);
                    toast(`تم إصدار شهادة راتب لـ ${c.customerName}`, "success");
                  }}
                >
                  <CheckCircle2 size={14} /> إصدار الشهادة
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setRejectId(c.id);
                    setRejectReason("");
                  }}
                >
                  <XCircle size={14} /> رفض
                </Button>
              </div>
            )}

            {c.status === "pending" && rejectId === c.id && (
              <div className="mt-4 space-y-2 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-3">
                <Field label="سبب الرفض">
                  <Input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="مثال: بيانات الراتب تحتاج تحديثاً من الموارد البشرية"
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      rejectSalaryCertificate(c.id);
                      toast(rejectReason ? `تم الرفض: ${rejectReason}` : "تم رفض طلب الشهادة", "info");
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

            {c.issuedAt && (
              <p className="mt-3 text-xs text-[var(--text-muted)]">تاريخ الإصدار: {formatDateAr(c.issuedAt)}</p>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
