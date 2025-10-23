"use client";

import QuickActions from "@/components/dashboard/QuickActions";
import RecentProjects from "@/components/dashboard/RecentProjects";
import StatsCards from "@/components/dashboard/StatsCards";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { useGetClientsQuery } from "@/src/services/clientsApi";
import { useGetDevelopersQuery } from "@/src/services/developersApi";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { data: developers } = useGetDevelopersQuery("");
  const { data: clients } = useGetClientsQuery("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <StatsCards developers={developers} clients={clients} />

      <div className="flex flex-col gap-6 w-full h-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <TeamActivity developers={developers} />
          </div>

          <div className="flex-2">
            <RecentProjects clients={clients} />
          </div>
        </div>

        <div className="col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
