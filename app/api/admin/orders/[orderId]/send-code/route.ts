import { NextRequest, NextResponse } from "next/server";
import { sendActivationEmail } from "@/lib/email-service";
import QRCode from "qrcode";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

function authHeaders(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value ?? "";
  const auth = req.headers.get("authorization") ?? "";

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : auth,
  };
}

type Params = { params: Promise<{ orderId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { orderId } = await params;

  try {
    // 1 — Fetch full order from Laravel
    const orderRes = await fetch(`${LARAVEL_API}/api/admin/orders/${orderId}`, {
      headers: authHeaders(req),
    });
    if (!orderRes.ok) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }
    const orderData = await orderRes.json();
    const order = orderData.data ?? orderData;

    // 2 — Guard: must have esim code and user email
    if (!order.esim_code?.code) {
      return NextResponse.json(
        { message: "No eSIM code assigned to this order." },
        { status: 422 },
      );
    }
    if (!order.user?.email) {
      return NextResponse.json(
        { message: "Order has no customer email." },
        { status: 422 },
      );
    }

    const code: string = order.esim_code.code;
    const email: string = order.user.email;

    // 3 — Generate QR code as base64 data URL
    let qrCodeDataUrl = "";
    try {
      qrCodeDataUrl = await QRCode.toDataURL(code, {
        width: 300,
        margin: 2,
        color: { dark: "#0a2540", light: "#ffffff" },
      });
    } catch (qrErr) {
      console.warn("[send-code] QR generation failed:", qrErr);
      // non-fatal — email will show text code only
    }

    // 4 — Send email from Next.js
    const emailResult = await sendActivationEmail({
      to: email,
      activationCode: code,
      qrCodeDataUrl,
      reference: order.reference ?? `#${order.id}`,
      planName: order.plan?.name ?? order.plan_name ?? "eSIM Plan",
      destination:
        order.plan?.destination?.name ?? order.destination_name ?? "—",
      dataAmount: order.plan?.data_label ?? order.plan_data ?? "—",
      validityDays: order.plan?.validity_days ?? 0,
      customerName: order.user?.name ?? "",
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { message: emailResult.error ?? "Failed to send email." },
        { status: 500 },
      );
    }

    // 5 — Tell Laravel to stamp code_sent_at
    const markRes = await fetch(
      `${LARAVEL_API}/api/admin/orders/${orderId}/mark-code-sent`,
      { method: "POST", headers: authHeaders(req) },
    );
    const markData = await markRes.json().catch(() => ({}));

    return NextResponse.json({
      message: "Code sent successfully.",
      order: markData.order ?? {
        ...order,
        code_sent_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[send-code] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
