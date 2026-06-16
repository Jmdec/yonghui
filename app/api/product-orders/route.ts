// app/api/product-orders/route.ts
import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

function getAuthToken(req: NextRequest): string | null {
  return req.cookies.get("auth_token")?.value ?? null;
}

async function laravelFetch(
  url: string,
  method: string,
  req: NextRequest,
  body?: unknown,
): Promise<NextResponse> {
  const token = getAuthToken(req);

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    console.error(`[product-orders ${method}] Network error:`, err);
    return NextResponse.json(
      { message: "Could not reach server." },
      { status: 502 },
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const raw = await res.text();
    console.error(
      `[product-orders ${method}] Non-JSON response:`,
      raw.slice(0, 300),
    );
    return NextResponse.json(
      { message: "Unexpected response from server." },
      { status: 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// ── GET /api/product-orders ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();
  const url = `${LARAVEL_API}/api/product-orders${qs ? `?${qs}` : ""}`;
  return laravelFetch(url, "GET", req);
}

// ── POST /api/product-orders ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }
  return laravelFetch(`${LARAVEL_API}/api/product-orders`, "POST", req, body);
}
