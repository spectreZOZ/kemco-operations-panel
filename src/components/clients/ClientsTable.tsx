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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../modals/ConfirmDialog";
import Link from "next/link";
import { useDeleteClientMutation } from "@/src/services/clientsApi";
import { useEffect } from "react";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";

export default function ClientsTable({ data }: { data: Client[] }) {
  const t = useTranslations("");
  const { success, failure } = useToastMessage();
  const [deleteClient, { isLoading, isSuccess, error, data: deleted }] =
    useDeleteClientMutation();

  const authUser = getAuthUser();
  const role: keyof typeof UserAccess = authUser?.role ?? "guest";

  const canEdit = canAccess(role, "clients", "PUT");
  const canDelete = canAccess(role, "clients", "DELETE");

  useEffect(() => {
    if (isSuccess)
      success(t("Toasts.deleteSuccessfully", { name: deleted?.name || "" }));
    if (error) failure(t("Toasts.deleteFailed", { name: deleted?.name || "" }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  return (
    <div className="rounded-md border bg-background shadow-sm">
      <Table>
        <TableCaption className="sr-only">Clients list</TableCaption>

        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-start">
              {t("Clients.table.name")}
            </TableHead>
            <TableHead className="text-start">
              {t("Clients.table.company")}
            </TableHead>
            <TableHead className="text-start">
              {t("Clients.table.email")}
            </TableHead>
            <TableHead className="text-start">
              {t("Clients.table.phone")}
            </TableHead>
            <TableHead className="text-center">
              {t("Clients.table.projects")}
            </TableHead>
            <TableHead className="text-center w-[120px]">
              {t("Clients.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length > 0 ? (
            data?.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.name || "-"}
                </TableCell>
                <TableCell>{client.company || "-"}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {client.projects?.length || "-"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  {canEdit && (
                    <Link href={`clients/edit/${client?.id}`}>
                      <Button variant="outline" size="sm">
                        {t("Clients.buttons.edit")}
                      </Button>
                    </Link>
                  )}

                  {canDelete && (
                    <ConfirmDialog
                      title={t("Modals.delete.title", { name: client.name })}
                      description={t("Modals.delete.description", {
                        name: client.name,
                      })}
                      trigger={
                        <Button variant="destructive" size="sm">
                          {t("Clients.buttons.delete")}
                        </Button>
                      }
                      onConfirm={async () => {
                        await deleteClient(client?.id).unwrap();
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
