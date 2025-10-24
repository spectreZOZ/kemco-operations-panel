"use client";

import TaskForm from "@/src/components/forms/TaskForm";
import { useGetTaskQuery } from "@/src/services/tasksApi";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditTaskPage() {
  const t = useTranslations("Tasks");
  const { id } = useParams();

  const { data: task } = useGetTaskQuery(id as string, { skip: !id });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold ">{t("editTask")}</h1>
      <TaskForm
        parentData={{
          id: task?.id || "",
          ...task,
          developer: task?.developer?.toString() || "",
          projectId: task?.projectId?.toString() || "",
        }}
      />
    </div>
  );
}
