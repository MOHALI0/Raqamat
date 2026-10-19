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
import { CheckCircle2, XCircle, Wallet, ArrowRight, ShieldCheck } from "lucide-react";

export default function EmployerSalaryPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { salaryTransfers, decideSalaryTransfer } = useWorkflows();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const myTransfers = salaryTransfers.filter((s) => s.employerId === (user?.id || "emp-1"));
  const pending = myTransfers.filter((s) => s.status === "pending").length;

  useSetPageMeta({
    title: "اعتماد تحويل الراتب",
    subtitle: "طلبات البنوك لربط راتب الموظف بحساب التمويل",
  });

  return (
    <>
      <OpsBanner
        live={false}
        tone="employer"
        title="طابور تحويل الرواتب"
        subtitle="راجع طلب كل بنك واعتمد تحويل راتب الموظف أو ارفضه مع ذكر السبب"
        badges={[{ label: `${pending} بانتظار`, variant: pending ? "warning" : "success" }]}
        actions={
          <Link href="/dashboard/employer">
            <Button size="sm" variant="ghost">
              <ArrowRight size={14} /> لوحة جهة العمل
            </Button>
          </Link>
        }
        footer={
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#0F766E]" /> الاعتماد يسري من دورة الراتب القادمة
          </span>
        }
      />

      <div className="space-y-3">
        {myTransfers.length === 0 && (
          <Card>
            <EmptyState
              tone="employer"
              icon={Wallet}
              title="لا توجد طلبات تحويل"
              description="عندما يطلب بنك تحويل راتب موظف سيظهر الطلب هنا للاعتماد."
              action={
                <Link href="/dashboard/employer">
                  <Button size="sm" variant="employer">العودة للوحة</Button>
                </Link>
              }
            />
          </Card>
        )}

        {myTransfers.map((t) => (
          <Card key={t.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold">{t.customerName}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {t.bankName} يطلب تحويل الراتب · رقم الموظف {t.employeeId}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                    <span>
                      الراتب:{" "}
                      <strong className="text-[var(--text-primary)]">{formatCurrency(t.monthlySalary)}</strong>
                    </span>
                    <span>تاريخ الطلب: {formatDateAr(t.createdAt)}</span>
                    <span className="font-mono">{t.id}</span>
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  t.status === "approved" ? "success" : t.status === "rejected" ? "danger" : "warning"
                }
              >
                {t.status === "approved" ? "معتمد" : t.status === "rejected" ? "مرفوض" : "بانتظار"}
              </Badge>
            </div>

            {t.status === "pending" && rejectId !== t.id && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="employer"
                  onClick={() => {
                    decideSalaryTransfer(t.id, "approved", "تم اعتماد التحويل من دورة الراتب القادمة");
                    toast(`تم اعتماد تحويل راتب ${t.customerName}`, "success");
                  }}
                >
                  <CheckCircle2 size={14} /> اعتماد التحويل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setRejectId(t.id);
                    setRejectReason("");
                  }}
                >
                  <XCircle size={14} /> رفض
                </Button>
              </div>
            )}

            {t.status === "pending" && rejectId === t.id && (
              <div className="mt-4 space-y-2 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-3">
                <Field label="سبب الرفض">
                  <Input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="مثال: الموظف غير مسجّل في دورة الرواتب الحالية"
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      decideSalaryTransfer(t.id, "rejected", rejectReason || "تعذّر الاعتماد حالياً");
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

            {t.decisionNote && (
              <p className="mt-3 rounded-lg bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-muted)]">
                ملاحظة القرار: {t.decisionNote}
              </p>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
