"use client";

import ClientsTable from "@/components/clients/ClientsTable";
import CustomHeader from "@/src/components/CustomHeader";
import { useGetClientsQuery } from "@/src/services/clientsApi";
import { useTranslations } from "next-intl";

export default function ClientsPage() {
  const { data: clients } = useGetClientsQuery("");
  const t = useTranslations("Clients");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeader
        title={t("title")}
        buttonText={t("addClient")}
        buttonLink="/clients/add"
      />

      {/* Table */}
      <ClientsTable data={clients} />
    </div>
  );
}
