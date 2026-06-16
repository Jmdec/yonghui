import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Params = { params: Promise<{ id: string }> };

// ── POST /api/product-orders/[id]/receipt ─────────────────────────────────────
// Forwards a multipart/form-data receipt upload to Laravel.
// The client sends a FormData with a single "receipt" file field.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Pass the raw FormData through — do NOT parse it in Next.js,
    // just stream it directly so Laravel receives the file intact.
    const formData = await req.formData();

    const res = await fetch(`${API_BASE}/api/product-orders/${id}/receipt`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // Let fetch set Content-Type with the correct multipart boundary.
        ...(req.headers.get("cookie")
          ? { Cookie: req.headers.get("cookie")! }
          : {}),
      },
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[product-orders/:id/receipt POST]", err);
    return NextResponse.json(
      { message: "Receipt upload failed." },
      { status: 500 },
    );
  }
}
