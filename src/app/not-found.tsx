import Link from "next/link";
import { ShieldAlert, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-4" dir="rtl">
      <div className="glass-card max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0057B8]/10 text-[#0057B8]">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-6xl font-bold text-[#0057B8]">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0057B8] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#004494]"
        >
          <Home size={18} />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
