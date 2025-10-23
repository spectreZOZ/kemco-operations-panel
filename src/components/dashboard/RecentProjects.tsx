import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function RecentProjects({ clients }: { clients: Client[] }) {
  const t = useTranslations("Dashboard");
  const { data: projectsData } = useGetProjectsQuery("");

  const colors = [
    "bg-blue-500",
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];

  const projects = useMemo(() => {
    return (
      projectsData?.map((projectData) => {
        const client = clients?.find(
          (c) => Number(c.id) === Number(projectData?.clientId)
        );

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        return {
          name: projectData.name,
          company: client?.company,
          color: randomColor,
          progress: projectData?.progress,
        };
      }) || []
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsData, clients]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("recentProjects")}</CardTitle>
        <Link href="/projects" className="text-sm text-primary hover:underline">
          {t("viewAll")}
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects?.map((p) => (
          <div key={p.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={p.color} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.company}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {p.progress}%
              </span>
            </div>
            <Progress value={p.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
