"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalizationButton from "@/src/components/LocaleSwitcher";
import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background relative overflow-hidden">
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40 w-20 h-20">
        <SearchX className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Text */}
      <h1 className="text-3xl font-bold text-foreground mb-2">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground mb-8">{t("description")}</p>

      {/* Action */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <Button asChild size="lg">
          <Link href="/">{t("button")}</Link>
        </Button>
        <LocalizationButton />
      </div>

      {/* Subtle gradient background for light / dark */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-black dark:via-[#0A0A0A] dark:to-[#000]" />
    </div>
  );
}
