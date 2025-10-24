"use client";

import { UserAccess, getAuthUser } from "@/src/utils/auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalizationButton from "../LocaleSwitcher";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("");

  const authUser = getAuthUser();
  const role: keyof typeof UserAccess = authUser?.role ?? "guest";

  const access = UserAccess[role];

  const accessKeys =
    typeof access === "object"
      ? (Object.keys(access) as (keyof typeof access)[])
      : null;

  useEffect(() => {
    async function getPage() {
      setMounted(true);
    }

    getPage();
  }, []);

  const Pages = {
    tasks: "tasks",
    projects: "projects",
    developers: "developers",
    clients: "clients",
    dashboard: "dashboard",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 w-20 h-20">
        <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>

      {/* Text */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {t("Unauthorized.title")}
      </h1>
      <p className="max-w-md text-muted-foreground mb-8">
        {t("Unauthorized.description")}
      </p>

      {/* Action */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <Button asChild size="lg">
          <Link
            href={`/${accessKeys && mounted ? Pages[accessKeys?.[0]] : ""}`}
          >
            {t("Unauthorized.button")}{" "}
            {accessKeys && mounted && t(`Pages.${accessKeys?.[0]}`)}
          </Link>
        </Button>
        <LocalizationButton />
      </div>

      {/* Background style */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-blue-50 dark:from-black dark:to-[#0A0A0A]" />
    </div>
  );
}
