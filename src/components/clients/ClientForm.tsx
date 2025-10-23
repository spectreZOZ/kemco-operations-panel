"use client";

import * as yup from "yup";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useAddClientMutation,
  useUpdateClientMutation,
} from "@/src/services/clientsApi";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";

type ClientFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: number[];
  id?: number;
};

export default function ClientForm({
  parentData,
}: {
  parentData?: ClientFormValues;
}) {
  const router = useRouter();
  const t = useTranslations("Clients.clientForm");
  const t2 = useTranslations("");
  const { success, failure } = useToastMessage();
  const [addClient, { isLoading }] = useAddClientMutation();
  const [editClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const { data: allProjects = [] } = useGetProjectsQuery("");

  const openProjects = allProjects.filter(
    (p: Project) => p.status !== "Completed"
  );

  const schema = yup.object({
    name: yup.string().required(t("errors.nameRequired")),
    company: yup.string().required(t("errors.companyRequired")),
    email: yup
      .string()
      .email(t("errors.emailInvalid"))
      .required(t("errors.emailRequired")),
    phone: yup.string().required(t("errors.phoneRequired")),
    projects: yup
      .array()
      .of(yup.number().required())
      .required(t("errors.projectsRequired"))
      .min(1, t("errors.projectsRequired")),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { projects: [] },
  });

  const selectedProjects = watch("projects");

  const toggleProject = (id: number) => {
    const current = new Set(selectedProjects);

    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }

    setValue("projects", Array.from(current));
  };

  console.log(selectedProjects, "selectedProjects");

  const onSubmit = async (data: ClientFormValues) => {
    try {
      if (parentData) {
        await editClient({ id: parentData.id, ...data }).unwrap();
        success(
          t2("Toasts.updateSuccessfully", { name: parentData?.name || "" })
        );
      } else {
        await addClient(data).unwrap();
        success(t("success"));
      }
      setTimeout(() => {
        router.push("/clients");
      }, 2000);
    } catch (err) {
      if (parentData) {
        failure(t2("Toasts.updateFailed", { name: parentData?.name || "" }));
      } else {
        failure(t("error"));
      }
      console.error("Error creating client", err);
    }
  };

  useEffect(() => {
    if (parentData) {
      reset(parentData);
      setValue(
        "projects",
        // @ts-expect-error: error
        parentData.projects?.map((p) => p?.toString()) || []
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentData]);

  return (
    <div className="flex justify-center mt-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fields.name")}</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("fields.company")}</Label>
              <Input id="company" {...register("company")} />
              {errors.company && (
                <p className="text-red-500 text-xs">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("fields.email")}</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("fields.phone")}</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("fields.projects")}</Label>
              <div className="max-h-44 overflow-y-auto border rounded-md p-3 space-y-2">
                {openProjects.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t("noProjects")}
                  </p>
                )}
                {openProjects.map((project: Project) => (
                  <label
                    key={project.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                    <span className="text-sm">{project.name}</span>
                  </label>
                ))}
              </div>
              {errors.projects && (
                <p className="text-red-500 text-xs">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/clients")}
            >
              {t("buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("buttons.saving") : t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
