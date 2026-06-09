// app/api/orders/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${LARAVEL_API}/api/orders/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error("[orders/show] Network error:", err);
    return NextResponse.json(
      { message: "Could not reach server." },
      { status: 502 },
    );
  }

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Not found." },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}
