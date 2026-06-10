// app/api/admin/esim-codes/[codeId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  return {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
  };
}

type Params = { params: Promise<{ codeId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const { codeId } = await params;
  try {
    const url = `${LARAVEL_API}/api/admin/esim-codes/${codeId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(req),
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
