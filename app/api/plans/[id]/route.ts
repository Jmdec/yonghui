import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();

    const res = await fetch(
      `${LARAVEL_API}/api/admin/destinations/${body.destination_id}/plans/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const text = await res.text();
    const data = JSON.parse(text);

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PLAN UPDATE ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${LARAVEL_API}/api/admin/destinations/plans/${id}`,
    );
    const text = await res.text();
    const data = JSON.parse(text);

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PLAN FETCH ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
