"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import AssignDevelopersModal from "../modals/AssignDevelopersModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProjectsQuery } from "@/src/services/projectsApi";
import { useTranslations } from "next-intl";

type DeveloperCardProps = {
  developer: Developer;
};

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const t = useTranslations("Developers");
  const { name, skills, projectIds, id } = developer;
  const { data: projectsData } = useGetProjectsQuery("");

  const projects = projectsData?.filter((p) => projectIds?.includes(p.id));

  return (
    <Card className="">
      <CardContent className="flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?u=${id}`} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{name}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-blue-50/80 text-blue-800"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {projects && projects?.length > 0 ? (
            <>
              {projects?.map((item) => (
                <Badge
                  key={`badge-project-${item.id}`}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {item?.name}
                </Badge>
              ))}
            </>
          ) : (
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {t("available")}
            </Badge>
          )}

          {projects && projects?.length > 0 ? (
            <AssignDevelopersModal
              developer={developer}
              trigger={<Button>{t("unassign")}</Button>}
            />
          ) : (
            <AssignDevelopersModal
              developer={developer}
              trigger={<Button>{t("assign")}</Button>}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
