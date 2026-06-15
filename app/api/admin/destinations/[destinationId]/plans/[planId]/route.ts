import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

// ✅ Read token from HttpOnly cookie
function authHeaders(req: NextRequest) {
  const rawToken = req.cookies.get("auth_token")?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string; planId: string }> },
) {
  const { destinationId, planId } = await params;
  try {
    const url = `${LARAVEL_API}/api/admin/destinations/${destinationId}/plans/${planId}`;
    const res = await fetch(url, { headers: authHeaders(req) });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string; planId: string }> },
) {
  const { destinationId, planId } = await params;
  try {
    const body = await req.json();
    const url = `${LARAVEL_API}/api/admin/destinations/${destinationId}/plans/${planId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string; planId: string }> },
) {
  const { destinationId, planId } = await params;
  try {
    const url = `${LARAVEL_API}/api/admin/destinations/${destinationId}/plans/${planId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(req),
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
