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

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch(`${LARAVEL_API}/api/contact`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? "Failed to fetch inquiries." },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[admin/contact GET]", err);
    return NextResponse.json(
      { error: "Server error. Could not reach Laravel API." },
      { status: 500 },
    );
  }
}
