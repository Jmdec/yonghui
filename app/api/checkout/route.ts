// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";
const PAYSO_ENABLED = process.env.PAYSO_ENABLED === "true";
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
    email,
    card_name,
    card_number,
    card_expiry,
    card_cvc,
  } = body;

  // 3. Validate — cast plan_id to integer so NaN/string slugs are caught here
  const planIdInt = Number(plan_id);
  if (!planIdInt || !payment_method) {
    return NextResponse.json(
      { message: "plan_id (integer) and payment_method are required." },
      { status: 422 },
    );
  }

  // 4. Create order in Laravel
  let laravelResult: {
    ok: boolean;
    status: number;
    data: Record<string, unknown>;
  };
  try {
    laravelResult = await createLaravelOrder(token, {
      plan_id: planIdInt, // ← always send as integer
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

  console.log("[checkout] Order created:", {
    orderId: order.id,
    hasActivationCode: !!activationCode,
    hasActivationToken: !!activationToken,
    email: customerEmail,
  });

  // 5a. Manual methods (GCash / Maya / Bank)
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

  // 5b. Card — dev mode (Payso not yet enabled)
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

  // 5c. Card — Payso enabled
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
        reference: order.reference,
        description: `eSIM — ${order.plan_name}`,
        redirect_url: `${FRONTEND_URL}/checkout/success?ref=${order.reference}`,
        webhook_url: `${FRONTEND_URL}/api/webhooks/payso`,
        metadata: { order_id: order.id, reference: order.reference },
      }),
    });
  } catch (err) {
    console.error("[checkout] Payso unreachable:", err);
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

  // Save Payso payment ID back to Laravel
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
    console.warn("[checkout] Could not save Payso ID to Laravel:", err);
  }

  return NextResponse.json(
    {
      message: "Order created. Redirecting to payment page.",
      order,
      activation_code: activationCode,
      activation_token: activationToken,
      customer_email: customerEmail,
      checkout_url: paysoData.checkout_url,
    },
    { status: 201 },
  );
}
