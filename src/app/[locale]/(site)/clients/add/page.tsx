import ClientForm from "@/components/clients/ClientForm";
import { useTranslations } from "next-intl";

export default function NewClientPage() {
  const t = useTranslations("Clients");
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold ">{t("addClient")}</h1>
      <ClientForm />
    </div>
  );
}
