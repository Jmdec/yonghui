import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value ?? "";
  const auth = req.headers.get("authorization") ?? "";

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : auth,
  };
}

type Params = { params: Promise<{ orderId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { orderId } = await params;
  try {
    const body = await req.json();
    const url = `${LARAVEL_API}/api/admin/orders/${orderId}/assign-code`;
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Non-JSON", body: text.substring(0, 500) },
        { status: 500 },
      );
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
