// app/api/checkout/route.ts
//
// This is the SINGLE checkout endpoint for all payment methods.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  GCash / Maya / Bank  →  create order in Laravel (pending)     │
// │                          user uploads receipt separately        │
// │                                                                 │
// │  Card (now dev mode)  →  create order in Laravel (pending)     │
// │                                                                 │
// │  Card (Payso ready)   →  create order → hit Payso API →        │
// │                          return checkout_url to frontend        │
// │                          Payso webhook auto-confirms payment    │
// └─────────────────────────────────────────────────────────────────┘

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";
const PAYSO_ENABLED = process.env.PAYSO_ENABLED === "true"; // flip to true when ready
const PAYSO_API_URL =
  process.env.PAYSO_API_URL ?? "https://api.payso.com.ph/v1";
const PAYSO_API_KEY = process.env.PAYSO_API_KEY ?? "";
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

async function createLaravelOrder(
  token: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  let res: Response;
  try {
    res = await fetch(`${LARAVEL_API}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[checkout] Laravel unreachable:", err);
    throw new Error("Could not reach order server.");
  }

  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const raw = await res.text();
    console.error(
      "[checkout] Laravel non-JSON:",
      res.status,
      raw.slice(0, 300),
    );
    throw new Error("Unexpected response from order server.");
  }

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ── POST /api/checkout ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  // 2. Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const {
    plan_id,
    payment_method,
    bank_name,
    // card fields — only used in dev mode for record keeping
    email,
    card_name,
    card_number,
    card_expiry,
    card_cvc,
  } = body;

  if (!plan_id || !payment_method) {
    return NextResponse.json(
      { message: "plan_id and payment_method are required." },
      { status: 422 },
    );
  }

  // 3. Create order in Laravel first (always)
  let laravelResult: {
    ok: boolean;
    status: number;
    data: Record<string, unknown>;
  };
  try {
    laravelResult = await createLaravelOrder(token, {
      plan_id,
      payment_method,
      bank_name,
      email,
      card_name,
      card_number,
      card_expiry,
      card_cvc,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order creation failed.";
    return NextResponse.json({ message: msg }, { status: 502 });
  }

  if (!laravelResult.ok) {
    return NextResponse.json(
      {
        message: (laravelResult.data.message as string) ?? "Checkout failed.",
        errors: laravelResult.data.errors,
      },
      { status: laravelResult.status },
    );
  }

  const order = laravelResult.data.order as Record<string, unknown>;
  const activationCode = laravelResult.data.activation_code as string;
  const activationToken = laravelResult.data.activation_token as string;
  const customerEmail = laravelResult.data.customer_email as string;

  console.log("[checkout] Order created with activation data:", {
    orderId: order.id,
    hasActivationCode: !!activationCode,
    hasActivationToken: !!activationToken,
    email: customerEmail,
  });

  // 4a. Manual methods (GCash / Maya / Bank) — done, user uploads receipt next
  if (payment_method !== "card") {
    return NextResponse.json(
      {
        message: "Order created. Please upload your payment receipt.",
        order,
        activation_code: activationCode,
        activation_token: activationToken,
        customer_email: customerEmail,
        next_step: "upload_receipt",
      },
      { status: 201 },
    );
  }

  // 4b. Card — dev mode (Payso not yet enabled)
  if (!PAYSO_ENABLED) {
    return NextResponse.json(
      {
        message: "Order created. Payment pending — Payso not yet active.",
        order,
        activation_code: activationCode,
        activation_token: activationToken,
        customer_email: customerEmail,
        next_step: "pending_payment",
      },
      { status: 201 },
    );
  }

  // 4c. Card — Payso enabled: create payment session
  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Adjust the request body shape to match Payso's actual API docs
  // once you have access. Keys below are placeholders.
  // ─────────────────────────────────────────────────────────────────────────
  let paysoRes: Response;
  try {
    paysoRes = await fetch(`${PAYSO_API_URL}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${PAYSO_API_KEY}`,
      },
      body: JSON.stringify({
        amount: order.amount,
        currency: "PHP",
        reference: order.reference, // e.g. ORD-20240601-A3X9
        description: `eSIM — ${order.plan_name}`,
        redirect_url: `${FRONTEND_URL}/checkout/success?ref=${order.reference}`,
        webhook_url: `${FRONTEND_URL}/api/webhooks/payso`,
        // metadata so the webhook can find the order:
        metadata: { order_id: order.id, reference: order.reference },
      }),
    });
  } catch (err) {
    console.error("[checkout] Payso unreachable:", err);
    // Order exists in Laravel — don't fail the whole thing, just warn
    return NextResponse.json(
      {
        message:
          "Order created but payment gateway is unreachable. Please try again.",
        order,
        activation_code: activationCode,
        activation_token: activationToken,
        customer_email: customerEmail,
      },
      { status: 502 },
    );
  }

  const paysoCt = paysoRes.headers.get("content-type") ?? "";
  if (!paysoCt.includes("application/json")) {
    console.error("[checkout] Payso non-JSON:", paysoRes.status);
    return NextResponse.json(
      {
        message: "Unexpected response from payment gateway.",
        order,
        activation_code: activationCode,
        activation_token: activationToken,
        customer_email: customerEmail,
      },
      { status: 502 },
    );
  }

  const paysoData = (await paysoRes.json()) as Record<string, unknown>;

  if (!paysoRes.ok) {
    console.error("[checkout] Payso error:", paysoData);
    return NextResponse.json(
      {
        message: "Payment gateway error. Please try again.",
        order,
        activation_code: activationCode,
        activation_token: activationToken,
        customer_email: customerEmail,
      },
      { status: 502 },
    );
  }

  // Save the Payso payment ID back to Laravel so the webhook can match it
  try {
    await fetch(`${LARAVEL_API}/api/orders/${order.id}/payso`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payso_payment_id: paysoData.id,
        payso_checkout_url: paysoData.checkout_url,
      }),
    });
  } catch (err) {
    // Non-fatal — webhook will still work if Payso sends the reference
    console.warn("[checkout] Could not save Payso ID to Laravel:", err);
  }

  // Return checkout_url → frontend redirects user to Payso hosted page
  return NextResponse.json(
    {
      message: "Order created. Redirecting to payment page.",
      order,
      activation_code: activationCode,
      activation_token: activationToken,
      customer_email: customerEmail,
      checkout_url: paysoData.checkout_url, // frontend: window.location.href = checkout_url
    },
    { status: 201 },
  );
}
