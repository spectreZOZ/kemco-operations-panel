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

import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import React from "react";
import { logoutUser } from "@/src/utils/auth";
import { useTranslations } from "next-intl";

const LogoutAlert = () => {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("Modals");
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <LogOut className="h-4 w-4 text-muted-foreground" />
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-start">
            {t("logout.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-start">
            {t("logout.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("logout.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logoutUser();
              setOpen(false);
            }}
          >
            {t("logout.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlert;
