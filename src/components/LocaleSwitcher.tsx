"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import { useLocale } from "next-intl";

export default function LocalizationButton({
  className,
}: {
  className?: string;
}) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    const segments = pathname.split("/");
    segments[1] = newLocale; // replace /en or /ar
    router.replace(segments.join("/"));
  };

  const locales = [
    {
      key: "en",
      label: "English",
      flag: "/assets/icons/united-kingdom-flag.png",
    },
    {
      key: "ar",
      label: "عربي",
      flag: "/assets/icons/egypt-flag.png",
    },
  ];

  return (
    <Select defaultValue={currentLocale} onValueChange={switchLanguage}>
      <SelectTrigger
        className={`w-36 justify-between bg-transparent border border-border text-foreground ${className}`}
      >
        <SelectValue placeholder="Select language" />
      </SelectTrigger>

      <SelectContent className="bg-background border-border text-foreground">
        {locales.map((locale) => (
          <SelectItem
            key={locale.key}
            value={locale.key}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Image
                src={locale.flag}
                alt={locale.label}
                width={24}
                height={24}
              />
              <span className={locale.key === "ar" ? "font-cairo" : ""}>
                {locale.label}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
