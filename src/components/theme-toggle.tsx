"use client";

import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    async function getTheme() {
      setMounted(true);
    }

    getTheme();
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  return (
    <Button
      variant="outline"
      size="default"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? `🌙 ${t("dark")}` : `☀️ ${t("light")}`}
    </Button>
  );
}
