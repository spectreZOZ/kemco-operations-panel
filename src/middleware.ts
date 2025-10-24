import { NextRequest, NextResponse } from "next/server";

import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");
  const logged = !!token;
  const url = request.nextUrl.pathname;
  request.headers.set("x-pathname", url);

  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.some((p) => url.includes(p));

  // 🚫 Not logged in → kick to /login
  if (!isAuthPage && !logged) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Already logged in, but hitting login/register → bounce home
  if (isAuthPage && logged) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Step 1: Use the incoming request
  const defaultLocale = (request.headers.get("accept-language") ?? "ar")
    .split(",")[0]
    .split("-")[0];

  // Step 2: Create and call the next-intl middleware
  const handleI18nRouting = createIntlMiddleware(routing);
  const response = handleI18nRouting(request);

  // Step 3: Alter the response
  response.headers.set("accept-language", defaultLocale);

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
