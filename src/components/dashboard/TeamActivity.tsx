import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetTasksQuery } from "@/src/services/tasksApi";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

export default function TeamActivity({
  developers,
}: {
  developers: Developer[];
}) {
  const t = useTranslations("Dashboard");
  const { data: tasks } = useGetTasksQuery({});

  const tasksData: Task[] = tasks;

  const activities = tasksData?.map((task) => {
    const developer = developers?.find((d) => d.id === task?.developerIds[0]);

    return {
      name: developer?.name,
      action: task?.title,
      time: task?.createdAt,
    };
  });

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{t("teamActivity")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities?.map((a, index) => (
          <div key={`activity-${index + 1}`} className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${index}`} />
              <AvatarFallback>{a?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.action}</p>
              <p className="text-xs text-muted-foreground">
                {dayjs(a.time).fromNow()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
