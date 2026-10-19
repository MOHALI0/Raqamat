"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Users,
  ShoppingBag,
  Megaphone,
  ShieldAlert,
  FileBarChart,
  Bell,
  KeyRound,
  Settings,
  HandCoins,
  Inbox,
  FileText,
  Sparkles,
  Calculator,
  Briefcase,
  Wallet,
  FileBadge2,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  LogOut,
  Moon,
  Sun,
  Building2,
  User,
} from "lucide-react";
import { useLayout } from "@/src/context/LayoutProvider";
import { usePageMeta } from "@/src/context/PageMetaProvider";
import { useTheme } from "@/src/context/ThemeProvider";
import { useAuth } from "@/src/context/AuthProvider";
import { notifications } from "@/src/lib/mock-data";
import { cn } from "@/src/lib/utils";
import type { UserRole } from "@/src/lib/auth";

const allNavItems = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/customer", label: "ملفي المالي", icon: UserCircle, roles: ["customer"] as UserRole[] },
  { href: "/dashboard/offers", label: "طلب العروض", icon: HandCoins, roles: ["customer"] as UserRole[] },
  { href: "/dashboard/advisor", label: "المستشار الذكي", icon: Sparkles, roles: ["customer"] as UserRole[] },
  { href: "/dashboard/capacity", label: "القدرة التمويلية", icon: Calculator, roles: ["customer"] as UserRole[] },
  { href: "/dashboard/documents", label: "المستندات", icon: FileText, roles: ["bank", "customer"] as UserRole[] },
  { href: "/dashboard/employer", label: "لوحة جهة العمل", icon: Briefcase, roles: ["employer"] as UserRole[] },
  { href: "/dashboard/employer/salary", label: "تحويل الراتب", icon: Wallet, roles: ["employer"] as UserRole[] },
  { href: "/dashboard/employer/certificates", label: "شهادات الراتب", icon: FileBadge2, roles: ["employer"] as UserRole[] },
  { href: "/dashboard/customers", label: "العملاء", icon: Users, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/sales", label: "المبيعات", icon: ShoppingBag, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/requests", label: "طلبات التمويل", icon: Inbox, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/marketing", label: "التسويق", icon: Megaphone, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/aml", label: "AML", icon: ShieldAlert, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/reports", label: "التقارير", icon: FileBarChart, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/notifications", label: "الإشعارات", icon: Bell, roles: ["bank", "customer", "employer"] as UserRole[] },
  { href: "/dashboard/permissions", label: "الصلاحيات", icon: KeyRound, roles: ["bank"] as UserRole[] },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, roles: ["bank", "customer", "employer"] as UserRole[] },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/dashboard/customer") return pathname === "/dashboard/customer";
  if (href === "/dashboard/employer") return pathname === "/dashboard/employer";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function notificationsForRole(role: UserRole) {
  if (role === "customer") return notifications.filter((n) => n.type !== "danger");
  if (role === "employer") return notifications.filter((n) => n.type === "info" || n.type === "success");
  return notifications;
}

export function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useLayout();
  const { meta } = usePageMeta();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const role = user?.role ?? "bank";
  const navItems = allNavItems.filter((item) => item.roles.includes(role));
  const roleNotifications = notificationsForRole(role);
  const unread = roleNotifications.filter((n) => !n.read).length;
  const isBank = role === "bank";
  const isEmployer = role === "employer";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const brandTitle = isBank ? "لوحة البنك" : isEmployer ? "بوابة جهة العمل" : "بوابة العميل";
  const brandColor = isBank ? "bg-[#0057B8]" : isEmployer ? "bg-[#0F766E]" : "bg-[#16A34A]";
  const BrandIcon = isBank ? Building2 : isEmployer ? Briefcase : User;
  const badgeColor = isBank
    ? "bg-[#0057B8]/10 text-[#0057B8]"
    : isEmployer
      ? "bg-[#0F766E]/10 text-[#0F766E]"
      : "bg-[#16A34A]/10 text-[#16A34A]";
  const navActiveClass = isBank
    ? "bg-[#0057B8] text-white shadow-sm shadow-[#0057B8]/25"
    : isEmployer
      ? "bg-[#0F766E] text-white shadow-sm shadow-[#0F766E]/25"
      : "bg-[#16A34A] text-white shadow-sm shadow-[#16A34A]/25";

  const sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col border-[var(--border-color)] bg-[var(--sidebar-bg)] backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[76px]" : "w-[260px]",
        "border-s"
      )}
    >
      <div className={cn("flex items-center gap-3 border-b border-[var(--border-color)] p-4", collapsed && "justify-center")}>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white", brandColor)}>
          <BrandIcon size={20} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--text-primary)]">{brandTitle}</p>
            <p className="truncate text-[11px] text-[var(--text-muted)]">
              {user?.roleLabel} · {user?.name}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? navActiveClass
                  : "text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)]",
                collapsed && "justify-center px-2"
              )}
              title={item.label}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.href === "/dashboard/notifications" && unread > 0 && (
                <span className="ms-auto rounded-md bg-white/20 px-1.5 py-0.5 text-[10px]">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border-color)] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--border-color)]",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]" dir="rtl">
      <div className="sticky top-0 hidden h-screen lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)] lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <button
              className="hidden rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)] lg:inline-flex"
              onClick={toggleCollapsed}
            >
              {collapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-bold text-[var(--text-primary)] sm:text-lg">{meta.title}</h1>
                <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-medium", badgeColor)}>
                  {user?.roleLabel}
                </span>
              </div>
              <p className="truncate text-xs text-[var(--text-muted)]">{meta.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link
              href="/dashboard/notifications"
              className="relative rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 left-1 h-2 w-2 rounded-full bg-[#DC2626]" />
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
