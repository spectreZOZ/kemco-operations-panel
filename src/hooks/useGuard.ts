"use client";

import {
  UserAccess,
  canAccess,
  getAuthUser,
  logoutUser,
} from "@/src/utils/auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function useAccessGuard() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const authUser = getAuthUser();
  const role: keyof typeof UserAccess = authUser?.role ?? "guest";

  useEffect(() => {
    async function getPage() {
      setMounted(true);
    }

    getPage();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!authUser) {
      logoutUser();
      router.replace("/login");
      return;
    }

    const access = UserAccess[role];
    if (access === "NONE") {
      logoutUser();
      router.replace("/login");
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    const localeSegments = ["en", "ar"];
    const startIndex = localeSegments.includes(segments[0]) ? 1 : 0;

    // e.g.  "/en/projects/add"  ->  resource = "projects"  action = "POST"
    const resource = segments[startIndex] || "dashboard";
    const nextSegment = segments[startIndex + 1];

    let method: "GET" | "POST" | "PUT" | "DELETE" = "GET";

    switch (nextSegment) {
      case "add":
        method = "POST";
        break;
      case "edit":
        method = "PUT";
        break;
      case "delete":
        method = "DELETE";
        break;
      default:
        method = "GET";
        break;
    }

    const canAccessThisPage = canAccess(role, resource, method);

    if (!canAccessThisPage && access !== "ALL") {
      router.replace("/unauthorized");
    }

    if (access === "ALL") {
      router.replace("/dashboard");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, mounted, role, pathname]);
}
