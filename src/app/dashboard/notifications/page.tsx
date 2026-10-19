"use client";

import { useState } from "react";
import { useSetPageMeta } from "@/src/context/PageMetaProvider";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { notifications } from "@/src/lib/mock-data";
import { useAuth } from "@/src/context/AuthProvider";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import type { UserRole } from "@/src/lib/auth";

const typeLabels: Record<string, { label: string; variant: "danger" | "warning" | "success" | "primary" }> = {
  danger: { label: "خطر", variant: "danger" },
  warning: { label: "تحذير", variant: "warning" },
  success: { label: "نجاح", variant: "success" },
  info: { label: "معلومة", variant: "primary" },
};

function notificationsForRole(role: UserRole) {
  if (role === "customer") return notifications.filter((n) => n.type !== "danger");
  if (role === "employer") return notifications.filter((n) => n.type === "info" || n.type === "success");
  return notifications;
}

function NotificationsList({ role }: { role: UserRole }) {
  const [items, setItems] = useState(() => notificationsForRole(role));
  const unread = items.filter((n) => !n.read).length;

  useSetPageMeta({
    title: "الإشعارات",
    subtitle:
      role === "customer"
        ? `${unread} إشعار شخصي غير مقروء`
        : `${unread} إشعار تشغيلي غير مقروء`,
  });

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const remove = (id: number) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="text-[#0057B8]" size={20} />
          <span className="text-sm text-[var(--text-secondary)]">إجمالي {items.length} إشعار</span>
        </div>
        <Button variant="secondary" size="sm" onClick={markAllRead}>
          <CheckCheck size={16} /> تحديد الكل كمقروء
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((n, i) => {
          const typeInfo = typeLabels[n.type] || typeLabels.info;
          return (
            <Card key={n.id} delay={i * 0.03} className={!n.read ? "border-[#0057B8]/20" : ""}>
              <div className="flex items-start gap-4">
                <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${!n.read ? "bg-[#0057B8]" : "bg-[var(--border-color)]"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[var(--text-primary)]">{n.title}</h3>
                    <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{n.message}</p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">{n.time}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!n.read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead(n.id)}>
                      <CheckCheck size={14} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => remove(n.id)} className="text-[#DC2626]">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <NotificationsList key={user.role} role={user.role} />;
}
