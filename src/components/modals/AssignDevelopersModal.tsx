"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  useAssignDeveloperToProjectMutation,
  useUnassignDeveloperFromProjectMutation,
} from "@/src/services/developersApi";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useTranslations } from "next-intl";

type Props = {
  developer: Developer;
  trigger: React.ReactNode;
};

export default function AssignDevelopersModal({ developer, trigger }: Props) {
  const t = useTranslations("Developers");
  const [open, setOpen] = useState(false);
  const { data: projects = [], isLoading } = useGetProjectsQuery("");
  const [assign, { isSuccess: isAssignSuccess }] =
    useAssignDeveloperToProjectMutation();
  const [unassign, { isSuccess: isUnassignSuccess }] =
    useUnassignDeveloperFromProjectMutation();

  useEffect(() => {
    async function closeModal() {
      if (isUnassignSuccess || isAssignSuccess) {
        setOpen(false);
      }
    }

    closeModal();
  }, [isUnassignSuccess, isAssignSuccess]);

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
      </Button>
    );
  }

  // One developer can belong to one project (assuming projectId field)
  const toggleAssignment = async (dev: Developer, projectId: string) => {
    const list = dev.projectIds ?? [];
    const isAssigned = list.includes(projectId);

    try {
      if (isAssigned) {
        await unassign({ id: dev.id, projectId }).unwrap();
      } else {
        await assign({ id: dev.id, projectId }).unwrap();
      }
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-start">
            {t("manageDevelopers")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-start">
            {t("assignOrUnassign")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ul className="max-h-60 overflow-y-auto space-y-2 mt-2">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center gap-2">
              <span>{project.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAssignment(developer, project.id)}
              >
                {developer.projectIds?.includes(project.id)
                  ? t("unassign")
                  : t("assign")}
              </Button>
            </li>
          ))}
        </ul>

        <AlertDialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
