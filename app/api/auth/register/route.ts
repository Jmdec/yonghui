import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, password_confirmation } = body;

    if (!name || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 422 },
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 422 },
      );
    }

    // Forward registration to Laravel
    const laravelRes = await fetch(`${LARAVEL_API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(
        {
          message: data.message ?? "Registration failed.",
          errors: data.errors,
        },
        { status: laravelRes.status },
      );
    }

    const { token, user } = data;

    const response = NextResponse.json(
      { message: "Account created successfully.", user },
      { status: 201 },
    );

    // Immediately log user in — set HttpOnly cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("[register] error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
