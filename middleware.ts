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

  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.filter((p) => p !== "/").some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

  // Unauthenticated → redirect to login for protected routes
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
