// app/api/admin/plans/[planId]/esim-codes/bulk/route.ts

import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  return {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
  };
}

type Params = { params: Promise<{ planId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { planId } = await params;
  try {
    const body = await req.json();
    const url = `${LARAVEL_API}/api/admin/plans/${planId}/esim-codes/bulk`;
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
