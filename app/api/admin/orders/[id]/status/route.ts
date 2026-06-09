import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const res = await fetch(`${LARAVEL_API}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (res.status === 401) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (res.status === 404) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? "Failed to update order status." },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[admin/orders/[id]/status PATCH]", err);
    return NextResponse.json(
      { error: "Server error. Could not reach Laravel API." },
      { status: 500 },
    );
  }
}
