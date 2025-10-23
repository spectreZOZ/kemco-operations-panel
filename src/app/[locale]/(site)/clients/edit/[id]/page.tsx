"use client";

import ClientForm from "@/components/clients/ClientForm";
import { useGetClientQuery } from "@/src/services/clientsApi";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditClientPage() {
  const t = useTranslations("Clients");
  const { id } = useParams();

  const { data: client } = useGetClientQuery(id as string, { skip: !id });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold ">{t("addClient")}</h1>
      <ClientForm
        parentData={{
          company: client?.company || "",
          email: client?.email || "",
          name: client?.name || "",
          phone: client?.phone || "",
          projects: client?.projects || [],
          id: client?.id,
        }}
      />
    </div>
  );
}
