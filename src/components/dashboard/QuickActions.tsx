import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderPlus, Plus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const actions = [
  { label: "addClient", icon: Plus, href: "/clients/add" },
  { label: "newProject", icon: FolderPlus, href: "/projects/add" },
  { label: "addDeveloper", icon: UserPlus, href: "/developers/add" },
];

export default function QuickActions() {
  const t = useTranslations("Dashboard.quickActions");
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={"outline"}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center justify-center p-6 h-24 text-center cursor-pointer"
            >
              <action.icon className="h-5 w-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t(`actions.${action.label}`)}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
