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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetch(`${LARAVEL_API}/api/contact/${id}`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? "Not found." },
        { status: res.status },
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[admin/contact/:id GET]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetch(`${LARAVEL_API}/api/contact/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (res.status === 204 || res.ok) {
      return NextResponse.json({ success: true });
    }

    const data = await res.json();
    return NextResponse.json(
      { error: data.message ?? "Delete failed." },
      { status: res.status },
    );
  } catch (err) {
    console.error("[admin/contact/:id DELETE]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
