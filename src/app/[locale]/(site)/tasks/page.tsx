"use client";

import CustomHeader from "@/src/components/CustomHeader";
import StatusTabs from "@/src/components/tabs/TaskStatusTabs";
import TaskCard from "@/src/components/cards/TaskCard";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useGetTasksQuery } from "@/src/services/tasksApi";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function TasksPage() {
  const { data: projects } = useGetProjectsQuery("");
  const t = useTranslations("Tasks");
  const [status, setStatus] = useState<string | undefined>("all");
  const { data: tasks } = useGetTasksQuery({
    status: status === "all" ? undefined : status,
  });

  const filteredProjectsPerTasks = projects?.filter((project) => {
    const filteredTasksPerProjects = tasks?.filter(
      (task: Task) => task.projectId === project.id
    );
    return filteredTasksPerProjects;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeader
        title={t("title")}
        buttonText={t("newTask")}
        buttonLink="/tasks/add"
      />
      <StatusTabs setStatus={setStatus} status={status} />
      <div>
        {filteredProjectsPerTasks?.map((project) => {
          const filteredTasksPerProjects = tasks?.filter(
            (task: Task) => task.projectId === project.id
          );
          const toDoTasks = filteredTasksPerProjects?.filter(
            (task: Task) => task.status === "to-do"
          );
          const inProgressTasks = filteredTasksPerProjects?.filter(
            (task: Task) => task.status === "in-progress"
          );
          const doneTasks = filteredTasksPerProjects?.filter(
            (task: Task) => task.status === "done"
          );
          return (
            <div
              key={project?.id}
              className="rounded-md px-5 py-3 bg-[#f7f9ff] dark:bg-[#333333] flex flex-col gap-3"
            >
              <h2 className="text-xl font-semibold ">{project?.name}</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full h-full">
                <div className="bg-[#F0F4FF] dark:bg-[#555555] p-3 rounded-lg w-full h-full">
                  <h2 className="font-medium text-lg text-[#0B3E7A] dark:text-white">
                    {t("status.to-do")}
                  </h2>

                  <div className="flex flex-col gap-3 mt-2 ">
                    {toDoTasks?.length > 0 ? (
                      toDoTasks?.map((task: Task) => {
                        return <TaskCard task={task} key={task?.id} />;
                      })
                    ) : (
                      <p className="text-sm text-center text-muted-foreground h-40 flex justify-center items-center">
                        {t("noTasksFound")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-[#F0F4FF] dark:bg-[#555555] p-3 rounded-lg">
                  <h2 className="font-medium text-lg text-[#0B3E7A] dark:text-white">
                    {t("status.in-progress")}
                  </h2>

                  <div className="flex flex-col gap-3 mt-2">
                    {inProgressTasks?.length > 0 ? (
                      inProgressTasks?.map((task: Task) => {
                        return <TaskCard task={task} key={task?.id} />;
                      })
                    ) : (
                      <p className="text-sm text-center text-muted-foreground h-40 flex justify-center items-center">
                        {t("noTasksFound")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-[#F0F4FF] dark:bg-[#555555] p-3 rounded-lg">
                  <h2 className="font-medium text-lg text-[#0B3E7A] dark:text-white">
                    {t("status.done")}
                  </h2>

                  <div className="flex flex-col gap-3 mt-2">
                    {doneTasks?.length > 0 ? (
                      doneTasks?.map((task: Task) => {
                        return <TaskCard task={task} key={task?.id} />;
                      })
                    ) : (
                      <p className="text-sm text-center text-muted-foreground h-40 flex justify-center items-center">
                        {t("noTasksFound")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
