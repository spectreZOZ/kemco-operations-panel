import TaskForm from "@/src/components/forms/TaskForm";
import { useTranslations } from "next-intl";

export default function NewTaskPage() {
  const t = useTranslations("Tasks");
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold ">{t("newTask")}</h1>
      <TaskForm />
    </div>
  );
}
