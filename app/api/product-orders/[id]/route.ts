import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Params = { params: Promise<{ id: string }> };

// ── GET /api/product-orders/[id] ──────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const res = await fetch(`${API_BASE}/api/product-orders/${id}`, {
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[product-orders/:id GET]", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ── PATCH /api/product-orders/[id]/status lives in its own route file ─────────
// Nothing extra needed here — keep this file focused on the resource itself.
