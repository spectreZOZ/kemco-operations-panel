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
  useAddProjectMutation,
  useUpdateProjectMutation,
} from "@/src/services/projectsApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useGetClientsQuery } from "@/src/services/clientsApi";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";

type ProjectFormValues = {
  name: string;
  clientId: string;
  status: "active" | "on-hold" | "done";
  startDate: string;
  endDate: string;
  progress: number;
  developers?: string[];
  id?: string;
};

export default function ProjectForm({
  parentData,
}: {
  parentData?: ProjectFormValues;
}) {
  const router = useRouter();
  const t = useTranslations("");
  const [addProject, { isLoading, isSuccess }] = useAddProjectMutation();
  const [editProject, { isLoading: isUpdating, isSuccess: isUpdated }] =
    useUpdateProjectMutation();

  const { data: clients = [] } = useGetClientsQuery("");
  const { success, failure } = useToastMessage();

  const schema = yup.object({
    name: yup
      .string()
      .required(t("Projects.projectForm.errors.projectNameRequired")),
    clientId: yup
      .string()
      .required(t("Projects.projectForm.errors.clientRequired")),
    status: yup
      .mixed<"active" | "on-hold" | "done">()
      .oneOf(["active", "on-hold", "done"])
      .required(t("Projects.projectForm.errors.statusRequired")),
    startDate: yup
      .string()
      .required(t("Projects.projectForm.errors.startDateRequired")),
    endDate: yup
      .string()
      .required(t("Projects.projectForm.errors.endDateRequired")),
    progress: yup
      .number()
      .min(0, t("Projects.projectForm.errors.minProgress"))
      .max(100, t("Projects.projectForm.errors.minProgress"))
      .required(t("Projects.projectForm.errors.progressRequired")),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,

    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { status: "active", progress: 0 },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (parentData) {
        await editProject({
          id: parentData.id || "",
          name: data.name,
          clientId: data.clientId,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          progress: data.progress,
          developers: parentData.developers || [],
        }).unwrap();
        success(
          t("Toasts.updateSuccessfully", { name: parentData?.name || "" })
        );
      } else {
        await addProject({
          name: data.name,
          clientId: data.clientId,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          progress: data.progress,
        }).unwrap();
        success(t("Toasts.createSuccessfully", { name: data?.name || "" }));
      }
      setTimeout(() => {
        router.push("/projects");
      }, 1000);
    } catch (err) {
      if (parentData) {
        failure(t("Toasts.updateFailed", { name: parentData?.name || "" }));
      } else {
        failure(t("Toasts.createFailed", { name: data?.name || "" }));
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t("Projects.projectForm.title")}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Project name */}
            <div className="space-y-1">
              <Label htmlFor="name">
                {t("Projects.projectForm.fields.projectName")}
              </Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Client select */}
            <div className="space-y-1">
              <Label htmlFor="clientId">
                {t("Projects.projectForm.fields.client")}
              </Label>
              <Controller
                control={control}
                name="clientId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t(
                          "Projects.projectForm.placeholders.client"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c: Client) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.clientId && (
                <p className="text-red-500 text-xs">
                  {errors.clientId.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label htmlFor="status">
                {" "}
                {t("Projects.projectForm.fields.status")}
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
                      <SelectItem value="active">
                        {t("Projects.projectForm.status.active")}
                      </SelectItem>
                      <SelectItem value="on-hold">
                        {" "}
                        {t("Projects.projectForm.status.on-hold")}
                      </SelectItem>
                      <SelectItem value="done">
                        {" "}
                        {t("Projects.projectForm.status.done")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex flex-col w-full md:w-1/2 space-y-1">
                <Label htmlFor="startDate">
                  {" "}
                  {t("Projects.projectForm.fields.startDate")}
                </Label>
                <Input
                  type="date"
                  id="startDate"
                  placeholder={t("Projects.projectForm.placeholders.date")}
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full md:w-1/2 space-y-1">
                <Label htmlFor="endDate">
                  {" "}
                  {t("Projects.projectForm.fields.endDate")}
                </Label>
                <Input
                  type="date"
                  id="endDate"
                  placeholder={t("Projects.projectForm.placeholders.date")}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <Label htmlFor="progress">
                {t("Projects.projectForm.fields.progress")}
                 (0–100%)
              </Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                {...register("progress", { valueAsNumber: true })}
              />
              {errors.progress && (
                <p className="text-red-500 text-xs">
                  {errors.progress.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/projects")}
            >
              {t("Projects.projectForm.buttons.cancel")}{" "}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUpdating || isSuccess || isUpdated}
            >
              {isLoading || isUpdating
                ? t("Projects.projectForm.buttons.saving")
                : t("Projects.projectForm.buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
