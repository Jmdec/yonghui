// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest, extra: Record<string, string> = {}) {
  const token = req.cookies.get("auth_token")?.value ?? "";
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// GET /api/products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();

  try {
    const url = `${LARAVEL_API}/api/products${query ? `?${query}` : ""}`;
    const res = await fetch(url, {
      headers: authHeaders(req, { "Content-Type": "application/json" }),
      cache: "no-store",
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Laravel returned non-JSON", body: text.substring(0, 500) },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("PROXY ERROR GET products:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST /api/products — stream multipart directly to Laravel
export async function POST(req: NextRequest) {
  try {
    const url = `${LARAVEL_API}/api/products`;
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(req, {
        "Content-Type": req.headers.get("content-type") ?? "",
      }),

      body: req.body,
      duplex: "half",
    } as RequestInit);

    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Laravel returned non-JSON", body: text.substring(0, 500) },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("PROXY ERROR POST products:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
