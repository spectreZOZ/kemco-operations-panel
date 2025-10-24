"use client";

import * as yup from "yup";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "@/src/services/tasksApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";
import { useGetDevelopersQuery } from "@/src/services/developersApi";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";

type TaskFormValues = {
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  projectId: string;
  developer: string;
  id?: string;
};

export default function TaskForm({
  parentData,
}: {
  parentData?: TaskFormValues;
}) {
  const router = useRouter();
  const t = useTranslations("");
  const [addTask, { isLoading, isSuccess }] = useAddTaskMutation();
  const [editTask, { isLoading: isUpdating, isSuccess: isUpdated }] =
    useUpdateTaskMutation();

  const { data: projects = [] } = useGetProjectsQuery("");
  const { data: developers = [] } = useGetDevelopersQuery("");
  const { success, failure } = useToastMessage();

  const schema = yup.object({
    title: yup.string().required(t("Tasks.taskForm.validation.titleRequired")),
    description: yup
      .string()
      .required(t("Tasks.taskForm.validation.descriptionRequired")),
    status: yup
      .mixed<"to-do" | "in-progress" | "done">()
      .oneOf(["to-do", "in-progress", "done"])
      .required(t("Tasks.taskForm.validation.statusRequired")),
    priority: yup
      .mixed<"low" | "medium" | "high">()
      .oneOf(["low", "medium", "high"])
      .required(t("Tasks.taskForm.validation.priorityRequired")),
    dueDate: yup
      .string()
      .required(t("Tasks.taskForm.validation.dueDateRequired")),
    projectId: yup
      .string()
      .required(t("Tasks.taskForm.validation.projectRequired")),
    developer: yup
      .string()
      .required(t("Tasks.taskForm.validation.developerRequired")),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { status: "to-do", priority: "low" },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (parentData) {
        await editTask({
          id: parentData.id || "",
          ...data,
        }).unwrap();
        success(
          t("Toasts.updateSuccessfully", { name: parentData?.title || "" })
        );
      } else {
        await addTask(data).unwrap();
        success(t("Toasts.createSuccessfully", { name: data?.title || "" }));
      }
      setTimeout(() => {
        router.push("/tasks");
      }, 1000);
    } catch (err) {
      if (parentData) {
        failure(t("Toasts.updateFailed", { name: parentData?.title || "" }));
      } else {
        failure(t("Toasts.createFailed", { name: data?.title || "" }));
      }
      console.error("Error creating client", err);
    }
  };

  useEffect(() => {
    if (parentData) {
      reset(parentData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentData]);

  return (
    <div className="flex justify-center mt-12">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{t("Tasks.taskForm.title")}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Task title */}
            <div className="space-y-1">
              <Label htmlFor="title">{t("Tasks.taskForm.fields.title")}</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>

            {/* Task description */}
            <div className="space-y-1">
              <Label htmlFor="description">
                {t("Tasks.taskForm.fields.description")}
              </Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Developer select */}
              <div className="space-y-1 w-full md:w-1/2">
                <Label htmlFor="developer">
                  {t("Tasks.taskForm.fields.developer")}
                </Label>
                <Controller
                  control={control}
                  name="developer"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            "Tasks.taskForm.placeholders.developer"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {developers.map((c: Project) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.developer && (
                  <p className="text-red-500 text-xs">
                    {errors.developer.message}
                  </p>
                )}
              </div>

              {/* Project select */}
              <div className="space-y-1 w-full md:w-1/2">
                <Label htmlFor="projectId">
                  {t("Tasks.taskForm.fields.project")}
                </Label>
                <Controller
                  control={control}
                  name="projectId"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("Tasks.taskForm.placeholders.project")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((c: Project) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.projectId && (
                  <p className="text-red-500 text-xs">
                    {errors.projectId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Status */}
              <div className="space-y-1 w-full md:w-1/2">
                <Label htmlFor="status">
                  {" "}
                  {t("Tasks.taskForm.fields.status")}
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-do">
                          {t("Tasks.status.to-do")}
                        </SelectItem>
                        <SelectItem value="in-progress">
                          {" "}
                          {t("Tasks.status.in-progress")}
                        </SelectItem>
                        <SelectItem value="done">
                          {" "}
                          {t("Tasks.status.done")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.status && (
                  <p className="text-red-500 text-xs">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 w-full md:w-1/2">
                <Label htmlFor="priority">
                  {" "}
                  {t("Tasks.taskForm.fields.priority")}
                </Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          {t("Tasks.priorities.low")}
                        </SelectItem>
                        <SelectItem value="medium">
                          {" "}
                          {t("Tasks.priorities.medium")}
                        </SelectItem>
                        <SelectItem value="high">
                          {" "}
                          {t("Tasks.priorities.high")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.status && (
                  <p className="text-red-500 text-xs">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="dueDate">
                {" "}
                {t("Tasks.taskForm.fields.dueDate")}
              </Label>
              <Input type="date" id="dueDate" {...register("dueDate")} />
              {errors.dueDate && (
                <p className="text-red-500 text-xs">{errors.dueDate.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/tasks")}
            >
              {t("Tasks.taskForm.buttons.cancel")}{" "}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUpdating || isSuccess || isUpdated}
            >
              {isLoading || isUpdating
                ? t("Tasks.taskForm.buttons.saving")
                : t("Tasks.taskForm.buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
