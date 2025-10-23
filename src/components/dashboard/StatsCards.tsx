import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock4, Code2, FolderKanban, Users } from "lucide-react";

import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useGetTasksQuery } from "@/src/services/tasksApi";
import { useTranslations } from "next-intl";

export default function StatsCards({
  developers,
  clients,
}: {
  developers: Developer[];
  clients: Client[];
}) {
  const t = useTranslations("Dashboard");

  const { data: tasks } = useGetTasksQuery({
    status: "In Progress",
  });
  const { data: projects } = useGetProjectsQuery("Active");

  const stats = [
    {
      key: "totalClients",
      value: clients?.length || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      key: "activeProjects",
      value: projects?.length || 0,
      icon: FolderKanban,
      color: "text-green-500",
    },
    {
      key: "developers",
      value: developers?.length || 0,
      icon: Code2,
      color: "text-purple-500",
    },
    {
      key: "pendingTasks",
      value: tasks?.length || 0,
      change: "No change",
      icon: Clock4,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.key} className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {t(`stats.${stat.key}`)}
            </CardTitle>
            <stat.icon
              size={40}
              className={`${stat.color} bg-primary/10 p-2 rounded-md`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
