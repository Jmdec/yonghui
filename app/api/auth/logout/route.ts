import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // Tell Laravel to invalidate the token
  if (token) {
    try {
      await fetch(`${LARAVEL_API}/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Non-fatal — still clear the cookie
    }
  }

  // Always clear the cookie on the Next.js side
  const response = NextResponse.json(
    { message: "Logged out." },
    { status: 200 },
  );
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
