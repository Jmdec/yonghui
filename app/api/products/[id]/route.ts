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

// GET /api/products/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // ✅ use the public route, not /admin/products
    const url = `${LARAVEL_API}/api/products/${id}`;
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
    console.error("PROXY ERROR GET product:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST /api/products/[id] — handles PUT via _method=PUT (multipart)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const url = `${LARAVEL_API}/api/products/${id}`;
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
    console.error("PROXY ERROR POST product:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const url = `${LARAVEL_API}/api/products/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(req, { "Content-Type": "application/json" }),
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
    console.error("PROXY ERROR DELETE product:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
