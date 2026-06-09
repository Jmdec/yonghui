// app/api/orders/[id]/receipt/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { message: "Invalid form data." },
      { status: 400 },
    );
  }

  const receipt = formData.get("receipt");
  if (!receipt || !(receipt instanceof File)) {
    return NextResponse.json(
      { message: "Receipt file is required." },
      { status: 422 },
    );
  }

  const laravelForm = new FormData();
  laravelForm.append("receipt", receipt);

  let res: Response;
  try {
    res = await fetch(`${LARAVEL_API}/api/orders/${id}/receipt`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        // No Content-Type — let fetch set it with the correct multipart boundary
      },
      body: laravelForm,
    });
  } catch (err) {
    console.error("[receipt] Network error:", err);
    return NextResponse.json(
      { message: "Could not reach server." },
      { status: 502 },
    );
  }

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Upload failed.", errors: data.errors },
      { status: res.status },
    );
  }

  return NextResponse.json(
    { message: data.message, order: data.order, receipt_url: data.receipt_url },
    { status: 200 },
  );
}
