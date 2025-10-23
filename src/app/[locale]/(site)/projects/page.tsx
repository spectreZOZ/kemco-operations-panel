"use client";

import CustomHeader from "@/src/components/CustomHeader";
import ProjectsTable from "@/src/components/projects/ProjectsTable";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useTranslations } from "next-intl";

export default function ProjectsPage() {
  const { data: projects } = useGetProjectsQuery("");
  const t = useTranslations("Projects");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeader
        title={t("title")}
        buttonText={t("addProject")}
        buttonLink="/projects/add"
      />

      {/* Table */}
      <ProjectsTable data={projects || []} />
    </div>
  );
}
