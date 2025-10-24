"use client";

import ProjectForm from "@/src/components/projects/ProjectForm";
import { useGetProjectQuery } from "@/src/services/projectsApi";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditProjectPage() {
  const t = useTranslations("Projects");
  const { id } = useParams();

  const { data: project } = useGetProjectQuery(id as string, { skip: !id });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold ">{t("editProject")}</h1>
      <ProjectForm
        parentData={{
          clientId: project?.clientId || "",
          name: project?.name || "",
          status: project?.status || "active",
          startDate: project?.startDate || "",
          endDate: project?.endDate || "",
          progress: project?.progress || 0,
          id: project?.id || "",
          developers: project?.developers || [],
        }}
      />
    </div>
  );
}
