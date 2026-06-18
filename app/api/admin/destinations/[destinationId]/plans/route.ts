import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string }> },
) {
  const { destinationId } = await params;
  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();
  try {
    const url = `${LARAVEL_API}/api/admin/destinations/${destinationId}/plans${query ? `?${query}` : ""}`;
    console.log("GET plans →", url);
    const res = await fetch(url, { headers: authHeaders(req) });
    const text = await res.text();
    console.log("Laravel response:", res.status, text.substring(0, 500));
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Laravel returned non-JSON", body: text.substring(0, 500) },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("PROXY ERROR GET plans:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string }> },
) {
  const { destinationId } = await params;
  try {
    const body = await req.json();
    const url = `${LARAVEL_API}/api/admin/destinations/${destinationId}/plans`;
    console.log("POST plans →", url);
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log("Laravel response:", res.status, text.substring(0, 500));
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Laravel returned non-JSON", body: text.substring(0, 500) },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("PROXY ERROR POST plans:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
