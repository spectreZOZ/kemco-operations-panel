import "dayjs/locale/ar";
import "dayjs/locale/en";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetTasksQuery } from "@/src/services/tasksApi";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default function TeamActivity({
  developers,
}: {
  developers: Developer[];
}) {
  const locale = useLocale();
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
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>{t("teamActivity")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities
          ?.map((a, index) => {
            const localizedDayjs = dayjs(a.time).locale(locale);

            return (
              <div
                key={`activity-${index + 1}`}
                className="flex items-start gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${index}`} />
                  <AvatarFallback>{a?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {localizedDayjs.fromNow()}
                  </p>
                </div>
              </div>
            );
          })
          .slice(0, 5)}
      </CardContent>
    </Card>
  );
}
