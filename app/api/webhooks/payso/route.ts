import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

const PAYSO_WEBHOOK_SECRET = process.env.PAYSO_WEBHOOK_SECRET ?? "";

const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN ?? "";

interface PaysoWebhookPayload {
  id?: string;
  payment_id?: string;
  status?: string;
  reference?: string;
  metadata?: {
    reference?: string;
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify signature
  const signature = req.headers.get("x-payso-signature") ?? "";

  if (PAYSO_WEBHOOK_SECRET) {
    const expected = crypto
      .createHmac("sha256", PAYSO_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expected);
    const signatureBuffer = Buffer.from(signature);

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      console.warn("[payso webhook] Invalid signature");

      return NextResponse.json(
        { message: "Invalid signature." },
        { status: 401 },
      );
    }
  }

  // Parse payload
  let payload: PaysoWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as PaysoWebhookPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  console.info("[payso webhook] Received:", payload);

  const paysoId = payload.id ?? payload.payment_id;
  const status = payload.status;
  const reference = payload.reference ?? payload.metadata?.reference;

  if (!paysoId || !status) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 422 },
    );
  }

  if (status === "paid" || status === "completed" || status === "success") {
    try {
      const res = await fetch(`${LARAVEL_API}/webhooks/payso-internal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${INTERNAL_TOKEN}`,
        },
        body: JSON.stringify({
          payso_payment_id: paysoId,
          reference,
          status: "paid",
        }),
      });

      if (!res.ok) {
        const err = await res.text();

        console.error("[payso webhook] Laravel update failed:", err);

        return NextResponse.json(
          { message: "Order update failed." },
          { status: 500 },
        );
      }

      console.info(
        "[payso webhook] Order marked as paid:",
        reference ?? paysoId,
      );
    } catch (err) {
      console.error("[payso webhook] Could not reach Laravel:", err);

      return NextResponse.json(
        { message: "Could not reach order server." },
        { status: 500 },
      );
    }
  } else if (status === "failed") {
    try {
      await fetch(`${LARAVEL_API}/webhooks/payso-internal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${INTERNAL_TOKEN}`,
        },
        body: JSON.stringify({
          payso_payment_id: paysoId,
          reference,
          status: "failed",
        }),
      });
    } catch {
      // best effort
    }
  }

  return NextResponse.json({ message: "Webhook received." }, { status: 200 });
}
