"use client";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { permissions } from "@/src/lib/mock-data";
import { Shield, Users, Edit, Trash2, Plus } from "lucide-react";

const colorMap: Record<string, "primary" | "success" | "warning" | "danger"> = {
  primary: "primary",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export default function PermissionsPage() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-secondary)]">
          {permissions.reduce((acc, p) => acc + p.users, 0).toLocaleString("ar-SA")} مستخدم مسجل
        </p>
        <Button variant="primary" size="sm">
          <Plus size={16} /> دور جديد
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {permissions.map((perm, i) => (
          <Card key={perm.role} delay={i * 0.05}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0057B8]/10 text-[#0057B8]">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{perm.role}</h3>
                  <p className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Users size={12} /> {perm.users.toLocaleString("ar-SA")} مستخدم
                  </p>
                </div>
              </div>
              <Badge variant={colorMap[perm.color] || "default"}>{perm.access[0]}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {perm.access.map((a) => (
                <span key={a} className="rounded-lg bg-[var(--border-color)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2 border-t border-[var(--border-color)] pt-4">
              <Button variant="ghost" size="sm"><Edit size={14} /> تعديل</Button>
              <Button variant="ghost" size="sm" className="text-[#DC2626]"><Trash2 size={14} /> حذف</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="مصفوفة الصلاحيات" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)]">الدور</th>
                {["لوحة التحكم", "AML", "تسويق", "مبيعات", "تقارير", "إعدادات"].map((h) => (
                  <th key={h} className="px-4 py-3 text-center text-xs font-semibold text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.slice(0, 4).map((perm) => (
                <tr key={perm.role} className="border-b border-[var(--border-color)]">
                  <td className="px-4 py-3 font-medium">{perm.role}</td>
                  {[true, perm.role.includes("AML"), perm.role.includes("تسويق"), perm.role.includes("مبيعات"), true, perm.role.includes("مدير")].map((has, j) => (
                    <td key={j} className="px-4 py-3 text-center">
                      {has ? (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
                      ) : (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--border-color)]" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
