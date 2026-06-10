import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/about",
  "/contact",
  "/support",
  "/destinations",
  "/what-is-esim",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/destinations",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // Let all API routes pass through — they handle auth themselves
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.filter((p) => p !== "/").some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

  if (!token && !isPublic) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|ico|gif)$).*)",
  ],
};
