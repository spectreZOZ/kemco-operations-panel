import ProjectForm from "@/src/components/projects/ProjectForm";
import { useTranslations } from "next-intl";

export default function NewProjectPage() {
  const t = useTranslations("Projects");
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold ">{t("addProject")}</h1>
      <ProjectForm />
    </div>
  );
}
