"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useTranslations } from "next-intl";

export default function StatusTabs({
  setStatus,
  status,
}: {
  status: string | undefined;
  setStatus: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const handleChange = (value: string) => {
    setStatus(value);
  };
  const t = useTranslations("Tasks");

  return (
    <Tabs value={status} onValueChange={handleChange}>
      <TabsList className="bg-blue-50/80 dark:bg-[#333333] rounded-full p-1 flex space-x-1">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-800 dark:data-[state=active]:bg-black data-[state=active]:shadow-sm rounded-full px-4 py-1 text-sm text-primary transition"
        >
          {t("status.all")}
        </TabsTrigger>
        <TabsTrigger
          value="to-do"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-800 dark:data-[state=active]:bg-black data-[state=active]:shadow-sm rounded-full px-4 py-1 text-sm text-primary transition"
        >
          {t("status.to-do")}
        </TabsTrigger>
        <TabsTrigger
          value="in-progress"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-800 dark:data-[state=active]:bg-black data-[state=active]:shadow-sm rounded-full px-4 py-1 text-sm text-primary transition"
        >
          {t("status.in-progress")}
        </TabsTrigger>
        <TabsTrigger
          value="done"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-800 dark:data-[state=active]:bg-black data-[state=active]:shadow-sm rounded-full px-4 py-1 text-sm text-primary transition"
        >
          {t("status.done")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
