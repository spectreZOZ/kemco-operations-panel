"use client";

import { UserAccess, canAccess, getAuthUser } from "@/src/utils/auth";

import CustomHeader from "@/src/components/CustomHeader";
import ProjectsTable from "@/src/components/projects/ProjectsTable";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useTranslations } from "next-intl";

export default function ProjectsPage() {
  const { data: projects } = useGetProjectsQuery("");
  const t = useTranslations("Projects");
  const authUser = getAuthUser();
  const role: keyof typeof UserAccess = authUser?.role ?? "guest";

  const canCreate = canAccess(role, "projects", "POST");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeader
        title={t("title")}
        buttonText={t("addProject")}
        buttonLink="/projects/add"
        isButtonDisabled={!canCreate}
      />

      {/* Table */}
      <ProjectsTable data={projects || []} />
    </div>
  );
}
