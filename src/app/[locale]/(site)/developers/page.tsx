"use client";

import CustomHeader from "@/src/components/CustomHeader";
import { DeveloperCard } from "@/src/components/cards/DeveloperCard";
import { useGetDevelopersQuery } from "@/src/services/developersApi";
import { useTranslations } from "next-intl";

export default function DevelopersPage() {
  const { data: developers } = useGetDevelopersQuery("");
  const t = useTranslations("Developers");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeader title={t("title")} />

      <div className="flex flex-col gap-3">
        {developers?.map((dev: Developer) => (
          <DeveloperCard key={dev.id} developer={dev} />
        ))}
      </div>
    </div>
  );
}
