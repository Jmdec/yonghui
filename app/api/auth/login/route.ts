// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function POST(req: NextRequest) {
  // ── 1. Parse & validate request body ────────────────────────────────────
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { email, password } = body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 422 },
    );
  }

  // ── 2. Forward credentials to Laravel ───────────────────────────────────
  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${LARAVEL_API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (networkErr) {
    console.error("[login] Network error reaching Laravel:", networkErr);
    return NextResponse.json(
      { message: "Could not reach authentication server." },
      { status: 502 },
    );
  }

  // ── 3. Guard against non-JSON responses (HTML error pages, etc.) ─────────
  const contentType = laravelRes.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const raw = await laravelRes.text();
    console.error(
      "[login] Laravel returned non-JSON —",
      laravelRes.status,
      raw.slice(0, 300),
    );
    return NextResponse.json(
      { message: "Unexpected response from authentication server." },
      { status: 502 },
    );
  }

  // ── 4. Handle Laravel error responses ───────────────────────────────────
  const data = await laravelRes.json();

  if (!laravelRes.ok) {
    return NextResponse.json(
      { message: data.message ?? "Invalid credentials." },
      { status: laravelRes.status },
    );
  }

  // ── 5. Validate expected payload shape ───────────────────────────────────
  const { token, user } = data as { token?: string; user?: unknown };

  if (!token || typeof token !== "string") {
    console.error("[login] Laravel response missing token:", data);
    return NextResponse.json(
      { message: "Authentication server returned an unexpected response." },
      { status: 502 },
    );
  }

  // ── 6. Set HttpOnly cookie & return ─────────────────────────────────────
  const response = NextResponse.json(
    { message: "Login successful.", user },
    { status: 200 },
  );

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
