"use client";

import Link from "next/link";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { useAuth } from "@/src/context/AuthProvider";
import { useWorkflows } from "@/src/context/WorkflowsProvider";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { OpsBanner, MetricRail, ModuleLinks } from "@/src/components/bank/BankOps";
import { formatCurrency } from "@/src/lib/utils";
import { FileBadge2, Wallet, Building2, Briefcase, ShieldCheck } from "lucide-react";

export default function EmployerHomePage() {
  const { user } = useAuth();
  const { salaryTransfers, salaryCertificates } = useWorkflows();

  useSetPageMeta({
    title: "بوابة جهة العمل",
    subtitle: user?.orgName || "شركة النخبة للتجارة",
  });

  const employerId = user?.id || "emp-1";
  const myTransfers = salaryTransfers.filter((s) => s.employerId === employerId);
  const myCerts = salaryCertificates.filter((c) => c.employerId === employerId);
  const pendingTransfers = myTransfers.filter((s) => s.status === "pending");
  const pendingCerts = myCerts.filter((c) => c.status === "pending");
  const issuedCount = myCerts.filter((c) => c.status === "issued").length;
  const waiting = pendingTransfers.length + pendingCerts.length;

  return (
    <>
      <OpsBanner
        live={false}
        tone="employer"
        title={`مرحباً، ${user?.name || "مسؤول الموارد البشرية"}`}
        subtitle="اعتماد تحويل الرواتب وإصدار شهادات التعريف بالراتب للبنوك عبر الهوية المالية الموحدة"
        badges={[
          { label: user?.orgName || "جهة العمل", variant: "primary" },
          { label: waiting ? `${waiting} بانتظارك` : "لا طلبات معلّقة", variant: waiting ? "warning" : "success" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/employer/salary">
              <Button size="sm" variant="employer">مراجعة التحويلات</Button>
            </Link>
            <Link href="/dashboard/employer/certificates">
              <Button size="sm" variant="secondary">الشهادات</Button>
            </Link>
          </div>
        }
        footer={
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#0F766E]" /> قرارات جهة العمل تُبلَّغ للبنك فوراً
          </span>
        }
      />

      <MetricRail
        items={[
          {
            label: "تحويلات بانتظار الاعتماد",
            value: String(pendingTransfers.length),
            hint: "طلبات بنوك لربط الراتب",
            tone: pendingTransfers.length ? "warn" : "ok",
            progress:
              myTransfers.length > 0
                ? Math.round((pendingTransfers.length / myTransfers.length) * 1000) / 10
                : 0,
            delta: `${myTransfers.length} إجمالي`,
          },
          {
            label: "شهادات بانتظار الإصدار",
            value: String(pendingCerts.length),
            hint: "تعريف بالراتب للبنوك",
            tone: pendingCerts.length ? "info" : "ok",
            progress:
              myCerts.length > 0 ? Math.round((pendingCerts.length / myCerts.length) * 1000) / 10 : 0,
            delta: `${myCerts.length} إجمالي`,
          },
          {
            label: "شهادات صادرة",
            value: String(issuedCount),
            hint: "مكتملة وموثّقة",
            tone: "ok",
            progress:
              myCerts.length > 0 ? Math.round((issuedCount / myCerts.length) * 1000) / 10 : 0,
            delta: "نسبة الإصدار",
          },
          {
            label: "موظفون في الطابور",
            value: String(new Set([...myTransfers, ...myCerts].map((s) => s.customerId)).size),
            hint: "موظفون لديهم طلبات نشطة أو سابقة",
            tone: "info",
            progress: Math.min(
              100,
              new Set([...myTransfers, ...myCerts].map((s) => s.customerId)).size * 20
            ),
          },
        ]}
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card
          title="طلبات تحويل الراتب"
          subtitle="الأحدث بانتظار الاعتماد"
          action={
            <Link href="/dashboard/employer/salary" className="text-xs font-medium text-[#0F766E] hover:underline">
              عرض الكل
            </Link>
          }
        >
          <div className="space-y-3">
            {pendingTransfers.slice(0, 4).map((t) => (
              <Link
                key={t.id}
                href="/dashboard/employer/salary"
                className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3 transition-colors hover:border-[#0F766E]/35 hover:bg-[#0F766E]/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.customerName}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t.bankName} · {formatCurrency(t.monthlySalary)}
                    </p>
                  </div>
                </div>
                <Badge variant="warning">بانتظار</Badge>
              </Link>
            ))}
            {pendingTransfers.length === 0 && (
              <EmptyState
                tone="employer"
                icon={Wallet}
                title="لا تحويلات معلّقة"
                description="ستظهر هنا طلبات البنوك لربط راتب الموظف بحساب التمويل."
                className="py-8"
              />
            )}
          </div>
        </Card>

        <Card
          title="شهادات التعريف بالراتب"
          subtitle="الأحدث بانتظار الإصدار"
          action={
            <Link href="/dashboard/employer/certificates" className="text-xs font-medium text-[#0F766E] hover:underline">
              عرض الكل
            </Link>
          }
        >
          <div className="space-y-3">
            {pendingCerts.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href="/dashboard/employer/certificates"
                className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3 transition-colors hover:border-[#0F766E]/35 hover:bg-[#0F766E]/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                    <FileBadge2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{c.customerName}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {c.bankName || "طلب داخلي"} · {formatCurrency(c.monthlySalary)}
                    </p>
                  </div>
                </div>
                <Badge variant="warning">بانتظار</Badge>
              </Link>
            ))}
            {pendingCerts.length === 0 && (
              <EmptyState
                tone="employer"
                icon={FileBadge2}
                title="لا شهادات معلّقة"
                description="طلبات البنوك لتعريف الراتب ستظهر هنا لإصدارها."
                className="py-8"
              />
            )}
          </div>
        </Card>
      </div>

      <Card title="خدمات جهة العمل" subtitle="اختر المهمة التالية">
        <ModuleLinks
          links={[
            {
              href: "/dashboard/employer/salary",
              title: "اعتماد تحويل الراتب",
              desc: "موافقة أو رفض طلبات البنوك لتحويل رواتب الموظفين",
              icon: Wallet,
              meta: `${pendingTransfers.length} معلّق`,
            },
            {
              href: "/dashboard/employer/certificates",
              title: "شهادات التعريف بالراتب",
              desc: "إصدار شهادات رسمية للبنوك ببيانات الراتب والوظيفة",
              icon: FileBadge2,
              meta: `${pendingCerts.length} معلّق`,
            },
            {
              href: "/dashboard/settings",
              title: "إعدادات الجهة",
              desc: "بيانات المنشأة والتفضيلات",
              icon: Building2,
            },
            {
              href: "/dashboard/notifications",
              title: "التنبيهات",
              desc: "طلبات جديدة وقرارات صادرة",
              icon: Briefcase,
            },
          ]}
        />
      </Card>
    </>
  );
}
