"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  FileBarChart,
  Info,
  Lightbulb,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "danger" | "warning" | "success" | "info";
  read: boolean;
}

interface RecommendationItem {
  product: string;
  match: number;
  reason: string;
}

interface InsightItem {
  title: string;
  description: string;
  type: "positive" | "opportunity" | "neutral";
}

interface AlertItem {
  id: number;
  title: string;
  severity: "warning" | "info" | "success" | "danger";
  time: string;
  message: string;
}

interface ComplianceItem {
  label: string;
  status: string;
  progress: number;
}

const notifIcon = {
  danger: AlertTriangle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

export function QuickActions() {
  const actions = [
    { href: "/dashboard/requests", label: "طلبات تمويل", icon: Zap },
    { href: "/dashboard/customers", label: "عميل جديد", icon: Users },
    { href: "/dashboard/aml", label: "مراجعة AML", icon: Shield },
    { href: "/dashboard/reports", label: "تقرير", icon: FileBarChart },
  ];

  return (
    <Card title="إجراءات سريعة">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border-color)] p-3 text-center transition-colors hover:border-[#0057B8]/40 hover:bg-[#0057B8]/5"
          >
            <action.icon size={18} className="text-[#0057B8]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function NotificationsWidget({
  items,
  compact,
}: {
  items: NotificationItem[];
  compact?: boolean;
}) {
  return (
    <Card title="الإشعارات" action={<Link href="/dashboard/notifications" className="text-xs text-[#0057B8]">عرض الكل</Link>}>
      <div className="space-y-2">
        {items.slice(0, compact ? 4 : 6).map((item) => {
          const Icon = notifIcon[item.type] || Info;
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3 ${
                item.read ? "border-[var(--border-color)]" : "border-[#0057B8]/20 bg-[#0057B8]/5"
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon size={14} className="mt-0.5 shrink-0 text-[#0057B8]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-secondary)]">{item.message}</p>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">{item.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function RecommendationsPanel({
  items,
  title,
}: {
  items: RecommendationItem[];
  title: string;
}) {
  return (
    <Card title={title}>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product} className="rounded-xl border border-[var(--border-color)] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[var(--text-primary)]">{item.product}</p>
              <Badge variant="success">{item.match}%</Badge>
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{item.reason}</p>
            <Button variant="primary" size="sm" className="mt-3 w-full">
              تقديم عرض
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CustomerInsightsPanel({ insights }: { insights: InsightItem[] }) {
  const badge: Record<InsightItem["type"], "success" | "primary" | "default"> = {
    positive: "success",
    opportunity: "primary",
    neutral: "default",
  };

  return (
    <Card title="رؤى العميل">
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.title} className="flex gap-3 rounded-xl border border-[var(--border-color)] p-3">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{insight.title}</p>
                <Badge variant={badge[insight.type]}>
                  {insight.type === "positive" ? "إيجابي" : insight.type === "opportunity" ? "فرصة" : "محايد"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  const variant: Record<AlertItem["severity"], "warning" | "primary" | "success" | "danger"> = {
    warning: "warning",
    info: "primary",
    success: "success",
    danger: "danger",
  };

  return (
    <Card title="تنبيهات AML">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-xl border border-[var(--border-color)] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{alert.title}</p>
              <Badge variant={variant[alert.severity]}>{alert.time}</Badge>
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{alert.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CompliancePanel({ items }: { items: ComplianceItem[] }) {
  return (
    <Card title="حالة الامتثال">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
              <span className="text-[var(--text-muted)]">{item.status}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--border-color)]">
              <div
                className="h-full rounded-full bg-[#16A34A]"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DecisionPanel() {
  return (
    <Card title="قرار الامتثال">
      <div className="space-y-3">
        <div className="rounded-xl bg-[#16A34A]/10 p-4 text-center">
          <CheckCircle2 className="mx-auto text-[#16A34A]" size={28} />
          <p className="mt-2 text-sm font-semibold text-[#16A34A]">موصى بالموافقة</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">درجة المخاطر ضمن الحدود المقبولة</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="primary" size="sm">موافقة</Button>
          <Button variant="secondary" size="sm">تصعيد</Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <ArrowLeftRight size={12} />
          يمكن إعادة التقييم بعد تحديث الوثائق
        </div>
      </div>
    </Card>
  );
}
