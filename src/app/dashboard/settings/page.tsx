"use client";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useTheme } from "@/src/context/ThemeProvider";
import { currentCustomer } from "@/src/lib/mock-data";
import {
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Share2,
  User,
  Lock,
  Save,
} from "lucide-react";
import { useToast } from "@/src/context/ToastProvider";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
    thirdParty: false,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
        <Card title="المظهر">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "light" ? <Sun size={20} className="text-[#F59E0B]" /> : <Moon size={20} className="text-[#0057B8]" />}
              <div>
                <p className="text-sm font-medium">الوضع {theme === "light" ? "الفاتح" : "الداكن"}</p>
                <p className="text-xs text-[var(--text-muted)]">تبديل بين الوضع الفاتح والداكن</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={toggleTheme}>
              {theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"}
            </Button>
          </div>
        </Card>

        <Card title="الملف الشخصي">
          <div className="space-y-4">
            {[
              { label: "الاسم الكامل", value: currentCustomer.name, icon: User },
              { label: "البريد الإلكتروني", value: currentCustomer.email, icon: User },
              { label: "رقم الهاتف", value: currentCustomer.phone, icon: User },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">{field.label}</label>
                <input
                  defaultValue={field.value}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm focus:border-[#0057B8] focus:outline-none focus:ring-2 focus:ring-[#0057B8]/20"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card title="التنبيهات">
          <div className="space-y-3">
            {[
              { key: "email" as const, label: "إشعارات البريد", desc: "تلقي التنبيهات عبر البريد الإلكتروني", icon: Bell },
              { key: "sms" as const, label: "إشعارات SMS", desc: "تلقي التنبيهات عبر الرسائل النصية", icon: Bell },
              { key: "push" as const, label: "إشعارات Push", desc: "تلقي التنبيهات الفورية", icon: Bell },
              { key: "marketing" as const, label: "عروض تسويقية", desc: "تلقي العروض والتوصيات", icon: Bell },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-[#0057B8]" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key] }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${notifications[item.key] ? "bg-[#0057B8]" : "bg-[var(--border-color)]"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[item.key] ? "right-0.5" : "right-[22px]"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="الخصوصية ومشاركة البيانات">
          <div className="space-y-3">
            {[
              { key: "shareData" as const, label: "مشاركة البيانات", desc: "السماح بمشاركة البيانات مع الشركاء", icon: Share2 },
              { key: "analytics" as const, label: "التحليلات", desc: "السماح بجمع بيانات الاستخدام", icon: Shield },
              { key: "thirdParty" as const, label: "أطراف ثالثة", desc: "السماح بالوصول للأطراف الثالثة", icon: Lock },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-xl border border-[var(--border-color)] p-3">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-[#0057B8]" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrivacy((p) => ({ ...p, [item.key]: !p[item.key] }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${privacy[item.key] ? "bg-[#0057B8]" : "bg-[var(--border-color)]"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${privacy[item.key] ? "right-0.5" : "right-[22px]"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="اللغة">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-[#0057B8]" />
            <select className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm focus:border-[#0057B8] focus:outline-none">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={() => toast("تم حفظ الإعدادات بنجاح", "success")}>
            <Save size={16} /> حفظ التغييرات
          </Button>
        </div>
    </div>
  );
}
