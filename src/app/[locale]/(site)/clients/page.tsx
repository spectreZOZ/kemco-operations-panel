"use client";

import { Button } from "@/components/ui/button";
import ClientsTable from "@/components/clients/ClientsTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useGetClientsQuery } from "@/src/services/clientsApi";
import { useTranslations } from "next-intl";

export default function ClientsPage() {
  const { data: clients } = useGetClientsQuery("");
  const t = useTranslations("Clients");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold mb-3 md:mb-0">{t("title")}</h1>
        <Link href={"/clients/add"}>
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            {t("addClient")}
          </Button>
        </Link>
      </div>

      {/* Table */}
      <ClientsTable data={clients} />
    </div>
  );
}
