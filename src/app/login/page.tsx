"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  User,
  Moon,
  Sun,
  Briefcase,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useTheme } from "@/src/context/ThemeProvider";
import { useAuth } from "@/src/context/AuthProvider";
import { DEMO_USERS, ROLE_HOME, type UserRole } from "@/src/lib/auth";
import { cn } from "@/src/lib/utils";

const roleHelp: Record<UserRole, string> = {
  bank: "بوابة البنك: إدارة العملاء، طلبات التمويل، المستندات الرسمية، الامتثال، والتقارير.",
  customer: "بوابة العميل: الملف المالي، طلب العروض، المستشار الذكي، القدرة التمويلية، والمستندات.",
  employer: "بوابة جهة العمل: اعتماد تحويل الرواتب وإصدار شهادات التعريف بالراتب للبنوك.",
};

const roleAccent: Record<UserRole, string> = {
  bank: "bg-[#0057B8] text-white shadow-sm shadow-[#0057B8]/30",
  customer: "bg-[#16A34A] text-white shadow-sm shadow-[#16A34A]/30",
  employer: "bg-[#0F766E] text-white shadow-sm shadow-[#0F766E]/30",
};

const roleMark: Record<UserRole, string> = {
  bank: "bg-[#0057B8] shadow-[#0057B8]/30",
  customer: "bg-[#16A34A] shadow-[#16A34A]/30",
  employer: "bg-[#0F766E] shadow-[#0F766E]/30",
};

const roleFocus: Record<UserRole, string> = {
  bank: "focus:border-[#0057B8] focus:ring-[#0057B8]/20",
  customer: "focus:border-[#16A34A] focus:ring-[#16A34A]/20",
  employer: "focus:border-[#0F766E] focus:ring-[#0F766E]/20",
};

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { login, user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>("bank");
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [authLoading, user, router]);

  const selectRole = (next: UserRole) => {
    setRole(next);
    setError("");
    const demo = DEMO_USERS.find((u) => u.role === next)!;
    setEmail(demo.email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      router.push(ROLE_HOME[result.user.role]);
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-4" dir="rtl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#0057B8]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#16A34A]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F766E]/5 blur-3xl" />
      </div>

      <button
        onClick={toggleTheme}
        aria-label="تبديل المظهر"
        className="absolute top-4 left-4 rounded-xl p-2.5 text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8">
          <div className="mb-6 text-center">
            <div
              className={cn(
                "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg transition-colors",
                roleMark[role]
              )}
            >
              <Fingerprint size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">الهوية المالية الموحدة</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              منصة واحدة للبنك والعميل وجهة العمل — اختر نوع الحساب ثم سجّل الدخول
            </p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-[var(--bg-secondary)] p-1.5">
            {(
              [
                { id: "bank" as const, label: "بنك", icon: Building2 },
                { id: "customer" as const, label: "عميل", icon: User },
                { id: "employer" as const, label: "جهة عمل", icon: Briefcase },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectRole(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-medium transition-all sm:text-sm",
                  role === item.id
                    ? roleAccent[item.id]
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  placeholder="name@example.com"
                  className={cn(
                    "w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2",
                    roleFocus[role]
                  )}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={cn(
                    "w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] py-3 pr-10 pl-10 text-sm focus:outline-none focus:ring-2",
                    roleFocus[role]
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-[#DC2626]/10 px-3 py-2 text-xs leading-5 text-[#DC2626]">{error}</p>
            )}

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3 text-xs leading-6 text-[var(--text-muted)]">
              <p>{roleHelp[role]}</p>
              <p className="mt-1.5">
                حساب تجريبي · كلمة المرور:{" "}
                <span className="rounded-md bg-[var(--border-color)] px-1.5 py-0.5 font-medium text-[var(--text-secondary)]">
                  password
                </span>
              </p>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full",
                role === "employer" && "bg-[#0F766E] hover:bg-[#0D9488] shadow-[#0F766E]/25",
                role === "customer" && "bg-[#16A34A] hover:bg-[#15803D] shadow-[#16A34A]/25"
              )}
              size="lg"
              disabled={loading}
            >
              {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </div>

        <p
          className="mt-6 text-center text-[11px] tracking-wide text-[var(--text-muted)]"
          dir="ltr"
        >
          Created by Raqmat Team
        </p>
      </motion.div>
    </div>
  );
}
