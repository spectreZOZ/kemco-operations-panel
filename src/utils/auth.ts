import { deleteCookie } from "cookies-next";

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("authUser");
  return data ? JSON.parse(data) : null;
};

export const logoutUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authUser");
  localStorage.removeItem("role");
  deleteCookie("authToken");
  window.location.href = "/login";
};

export const UserAccess = {
  admin: "ALL",
  developer: {
    tasks: ["GET"],
    projects: ["GET"],
  },
  guest: "NONE",
} as const;

type Role = keyof typeof UserAccess;
type PermissionVerb = "GET" | "POST" | "PUT" | "DELETE";

export function canAccess(
  role: Role,
  resource: string,
  action: PermissionVerb = "GET"
): boolean {
  const access = UserAccess[role];

  if (access === "ALL") return true;
  if (access === "NONE") return false;

  if (access && resource in access) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allowed = (access as any)[resource];
    return allowed.includes(action);
  }

  return false;
}
