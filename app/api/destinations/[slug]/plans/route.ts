import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const res = await fetch(`${API_URL}/api/destinations/${slug}/plans`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Invalid response", body: text.substring(0, 300) },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("PROXY ERROR:", err);
    return NextResponse.json(
      { message: "Failed to fetch destination plans" },
      { status: 500 },
    );
  }
}
