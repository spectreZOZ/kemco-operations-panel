"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Code2,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Menu,
  Users,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserAccess, canAccess, getAuthUser } from "@/src/utils/auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoutAlert from "../modals/LogoutAlert";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

function SidebarMenu({
  onNavigate,
  authUser,
}: {
  onNavigate?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authUser: any;
}) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    async function getPage() {
      setMounted(true);
    }

    getPage();
  }, []);
  const role: keyof typeof UserAccess = authUser?.role ?? "guest";

  const navItems = [
    { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { key: "clients", href: "/clients", icon: Users },
    { key: "projects", href: "/projects", icon: FolderKanban },
    { key: "tasks", href: "/tasks", icon: ListTodo },
    { key: "developers", href: "/developers", icon: Code2 },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.includes(item.href);
        const canView = canAccess(role, item.key, "GET");

        return (
          mounted &&
          canView && (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-white/15",
                active && "bg-white/25 font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`links.${item.key}`)}
            </Link>
          )
        );
      })}
    </nav>
  );
}

function SidebarBody() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Sidebar");
  const authUser = getAuthUser();

  useEffect(() => {
    async function getPage() {
      setMounted(true);
    }

    getPage();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full p-4 text-white bg-primary-dark dark:bg-background">
      <div>
        <div className="px-2 mb-8">
          <h1 className="text-xl font-bold">KEMCO</h1>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
        <SidebarMenu authUser={authUser} />
      </div>

      {mounted && (
        <div className="flex items-center justify-between p-2 mt-6 rounded-md hover:bg-white/10 transition">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${authUser?.id}`}
              />
              <AvatarFallback>{authUser?.name[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-medium">{authUser?.name}</p>
              {authUser?.role && (
                <p className="text-xs text-muted-foreground">
                  {t(`roles.${authUser?.role}`)}
                </p>
              )}
            </div>
          </div>
          <LogoutAlert />
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Sidebar");

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background fixed inset-y-0 start-0 z-40">
        <SidebarBody />
      </aside>

      {/* Mobile */}
      <div className="flex items-center justify-between p-4 border-b md:hidden fixed top-0 left-0 right-0 bg-background z-30 shadow-sm">
        <h1 className="text-lg font-bold text-primary">KEMCO</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetHeader>
              {/* Visually hidden title for accessibility */}
              <SheetTitle className="sr-only">{t("sheetTitle")}</SheetTitle>
            </SheetHeader>
            <SidebarBody />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
