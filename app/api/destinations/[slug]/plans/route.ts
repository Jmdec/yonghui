import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const res = await fetch(`${LARAVEL_API}/api/destinations/${slug}/plans`);
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
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
