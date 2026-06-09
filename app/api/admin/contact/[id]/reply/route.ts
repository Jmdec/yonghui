import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { transporter } from "@/lib/mailer";

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← Promise
) {
  try {
    const { id } = await params; // ← await it
    const { subject, body, toEmail, toName } = await req.json();

    if (!body?.trim()) {
      return NextResponse.json(
        { error: "Reply body cannot be empty." },
        { status: 422 },
      );
    }
    if (!toEmail) {
      return NextResponse.json(
        { error: "Recipient email is required." },
        { status: 422 },
      );
    }

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: `"${toName ?? toEmail}" <${toEmail}>`,
      subject: subject ?? "Re: Your Inquiry",
      text: body,
      html: `<div style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#1A2540;white-space:pre-wrap">${body.replace(/\n/g, "<br/>")}</div>`,
    });

    await fetch(`${LARAVEL_API}/api/contact/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status: "replied" }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/contact/:id/reply POST]", err);
    return NextResponse.json(
      { error: "Failed to send reply. Check SMTP config." },
      { status: 500 },
    );
  }
}
