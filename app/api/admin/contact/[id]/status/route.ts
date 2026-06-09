import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("sanctum_token")?.value ?? process.env.ADMIN_API_TOKEN;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const VALID_STATUSES = ["unread", "read", "replied", "archived"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 422 },
      );
    }

    const res = await fetch(`${LARAVEL_API}/api/contact/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (res.status === 204 || res.ok) {
      const text = await res.text();
      const data = text ? JSON.parse(text) : { success: true };
      return NextResponse.json(data);
    }

    const data = await res.json();
    return NextResponse.json(
      { error: data.message ?? "Status update failed." },
      { status: res.status },
    );
  } catch (err) {
    console.error("[admin/contact/:id/status PATCH]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
