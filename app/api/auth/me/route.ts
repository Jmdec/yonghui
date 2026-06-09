import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthenticated." },
        { status: 401 },
      );
    }

    const laravelRes = await fetch(`${LARAVEL_API}/api/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      const response = NextResponse.json(
        { message: data.message ?? "Unauthenticated." },
        { status: 401 },
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

    const user = data.user ?? data;

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("[me] error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
