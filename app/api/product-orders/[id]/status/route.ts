// app/api/product-orders/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const token = req.cookies.get("auth_token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const res = await fetch(`${LARAVEL_API}/api/product-orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const raw = await res.text();
    console.error("[product-orders status PATCH] Non-JSON:", raw.slice(0, 300));
    return NextResponse.json(
      { message: "Unexpected response from server." },
      { status: 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
