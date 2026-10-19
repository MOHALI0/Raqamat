import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/src/context/ThemeProvider";
import { ToastProvider } from "@/src/context/ToastProvider";
import { AuthProvider } from "@/src/context/AuthProvider";
import { OffersProvider } from "@/src/context/OffersProvider";
import { WorkflowsProvider } from "@/src/context/WorkflowsProvider";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "الهوية المالية الموحدة | Unified Financial Identity",
  description:
    "منصة الهوية المالية الموحدة للبنوك والعملاء وجهات العمل — تمويل، مستندات، وامتثال في مكان واحد",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <body className={`${ibmArabic.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <OffersProvider>
              <WorkflowsProvider>
                <ToastProvider>{children}</ToastProvider>
              </WorkflowsProvider>
            </OffersProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
