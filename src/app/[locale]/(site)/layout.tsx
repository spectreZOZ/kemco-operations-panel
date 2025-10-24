"use client";

import LocalizationButton from "@/src/components/LocaleSwitcher";
import Sidebar from "@/src/components/layout/Sidebar";
import { ThemeToggle } from "@/src/components/theme-toggle";
import Transition from "@/src/components/Transition";
import useAccessGuard from "@/src/hooks/useGuard";
import { useLocale } from "next-intl";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();
  useAccessGuard();
  return (
    <main
      className={`w-full h-full min-h-screen flex justify-between items-start`}
    >
      <Sidebar />
      <div
        className={`grow flex-1 overflow-y-auto ${
          locale === "ar" ? "md:mr-64" : "md:ml-64"
        } md:p-6 pt-16 md:pt-0`}
      >
        <div className="px-4 md:px-7 pt-7 flex items-center gap-2 justify-end">
          <ThemeToggle />
          <LocalizationButton />
        </div>
        <Transition>{children}</Transition>
      </div>
    </main>
  );
}
