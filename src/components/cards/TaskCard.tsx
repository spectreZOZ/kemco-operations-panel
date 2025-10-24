import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Badge } from "../ui/badge";
import { Edit } from "lucide-react";
import React from "react";
import dayjs from "dayjs";
import { useGetDevelopersQuery } from "@/src/services/developersApi";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const t = useTranslations("Tasks");
  const router = useRouter();
  const { data: developers = [] } = useGetDevelopersQuery("");

  const developer = developers?.find(
    (d: Developer) => d.id === task?.developer
  );

  return (
    <div className="bg-white dark:bg-[#777777] p-3 rounded-lg shadow-2xs flex flex-col gap-1 justify-between w-full h-full">
      <div>
        <div className="flex flex-wrap items-center gap-1.5 justify-between">
          <h2 className="font-medium">{task?.title}</h2>
          <div className="space-x-1 flex items-center">
            {" "}
            <Edit
              size={20}
              onClick={() => router.push(`tasks/edit/${task?.id}`)}
            />
            {task?.priority && (
              <Badge
                variant={
                  task?.priority === "low"
                    ? "outline"
                    : task?.priority === "medium"
                    ? "secondary"
                    : "destructive"
                }
              >
                {t(`priorities.${task?.priority}`)}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm opacity-70 mb-4">{task?.description}</p>
      </div>

      <div className="mb-1">
        <h2 className="text-sm mb-0.5">{t("taskForm.fields.developer")}:</h2>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${developer?.id}`} />
            <AvatarFallback>{developer?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <p className="text-sm font-medium">{developer?.name}</p>
        </div>
      </div>

      <div className="bg-black/10 p-1 rounded-md">
        <p className="text-xs text-muted-foreground">
          {t("createdAt")}: {dayjs(task?.createdAt).format("DD/MM/YYYY")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("taskForm.fields.dueDate")}: {task?.dueDate}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;
