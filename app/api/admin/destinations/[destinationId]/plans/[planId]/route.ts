import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  return {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string; planId: string }> },
) {
  const { destinationId, planId } = await params;
  try {
    const url = `${LARAVEL_API}/api/admin/destinations/${destinationId}/plans/${planId}`;
    console.log("GET plan →", url);
    const res = await fetch(url, { headers: authHeaders(req) });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PROXY ERROR GET plan:", err);
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
    console.log("PUT plan →", url);
    const res = await fetch(url, {
      method: "PUT",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PROXY ERROR PUT plan:", err);
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
    console.log("DELETE plan →", url);
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(req),
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PROXY ERROR DELETE plan:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
