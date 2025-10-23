"use client";

import QuickActions from "@/components/dashboard/QuickActions";
import RecentProjects from "@/components/dashboard/RecentProjects";
import StatsCards from "@/components/dashboard/StatsCards";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { useGetDevelopersQuery } from "@/src/services/developersApi";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { data: developers } = useGetDevelopersQuery("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <StatsCards developers={developers} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-6">
          <RecentProjects />
          <QuickActions />
        </div>

        {/* Right side */}
        <TeamActivity developers={developers} />
      </div>
    </div>
  );
}
