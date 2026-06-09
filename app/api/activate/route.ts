import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "No activation token provided." },
        { status: 400 },
      );
    }

    // Call Laravel activation endpoint (no auth required)
    const response = await fetch(
      `${LARAVEL_API}/api/activation/${encodeURIComponent(token)}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message ?? "Failed to fetch activation details.",
        },
        { status: response.status },
      );
    }

    // Pass through Laravel response directly
    return NextResponse.json(data);
  } catch (error) {
    console.error("[activate] Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch activation details." },
      { status: 500 },
    );
  }
}
