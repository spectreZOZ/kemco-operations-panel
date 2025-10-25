"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAccess, canAccess, getAuthUser } from "@/src/utils/auth";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../modals/ConfirmDialog";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { useDeleteProjectMutation } from "@/src/services/projectsApi";
import { useEffect } from "react";
import { useGetClientsQuery } from "@/src/services/clientsApi";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";

export default function ProjectsTable({ data }: { data: Project[] }) {
  const t = useTranslations("");
  const { success, failure } = useToastMessage();
  const [deleteProject, { isLoading, isSuccess, error, data: deleted }] =
    useDeleteProjectMutation();

  const { data: clients } = useGetClientsQuery("");

  const updatedData = data.map((project) => {
    return {
      ...project,
      client: clients?.find((c: Client) => c.id === project.clientId),
    };
  });

  const authUser = getAuthUser();
  const role: keyof typeof UserAccess = authUser?.role ?? "guest";

  const canEdit = canAccess(role, "projects", "PUT");
  const canDelete = canAccess(role, "projects", "DELETE");

  useEffect(() => {
    if (isSuccess)
      success(t("Toasts.deleteSuccessfully", { name: deleted?.name || "" }));
    if (error) failure(t("Toasts.deleteFailed", { name: deleted?.name || "" }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  return (
    <div className="rounded-md border bg-background shadow-sm">
      <Table>
        <TableCaption className="sr-only">Projects list</TableCaption>

        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-start">
              {t("Projects.table.projectName")}
            </TableHead>
            <TableHead className="text-start">
              {t("Projects.table.client")}
            </TableHead>
            <TableHead className="text-start">
              {t("Projects.table.status")}
            </TableHead>
            <TableHead className="text-start ">
              {t("Projects.table.startDate")}
            </TableHead>
            <TableHead className="text-start ">
              {t("Projects.table.endDate")}
            </TableHead>
            <TableHead className="text-start">
              {t("Projects.table.tasks")}
            </TableHead>
            <TableHead className="text-start w-[250px]">
              {t("Projects.table.progress")}
            </TableHead>
            <TableHead className="text-center w-[120px]">
              {t("Projects.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {updatedData?.length > 0 ? (
            updatedData?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.name || "-"}
                </TableCell>
                <TableCell>{project.client?.name || "-"}</TableCell>
                <TableCell>{project.status || "-"}</TableCell>
                <TableCell>{project.startDate || "-"}</TableCell>
                <TableCell>{project.endDate || "-"}</TableCell>
                <TableCell>{project.tasks?.length}</TableCell>
                <TableCell className="">
                  <Progress value={project.progress} />
                  <h2 className="text-xs text-end">{project?.progress}%</h2>
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  {canEdit && (
                    <Link href={`projects/edit/${project?.id}`}>
                      <Button variant="outline" size="sm">
                        {t("Projects.buttons.edit")}
                      </Button>
                    </Link>
                  )}

                  {canDelete && (
                    <ConfirmDialog
                      title={t("Modals.delete.title", { name: project.name })}
                      description={t("Modals.delete.description", {
                        name: project.name,
                      })}
                      trigger={
                        <Button variant="destructive" size="sm">
                          {t("Projects.buttons.delete")}
                        </Button>
                      }
                      onConfirm={async () => {
                        await deleteProject(project?.id).unwrap();
                      }}
                      confirmLabel={t("Modals.delete.confirm")}
                      cancelLabel={t("Modals.delete.cancel")}
                      loadingLabel={t("loading")}
                      loading={isLoading}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t("noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
