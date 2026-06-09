import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import QRCode from "qrcode";
import { sendActivationEmail } from "@/lib/email-service";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api";

interface OrderData {
  id: string;
  reference: string;
  plan_name: string;
  destination: string;
  data_amount: string;
  validity_days: number;
  payment_status: string;
  user_email: string;
  user_name?: string;
  activation_code?: string;
}

/**
 * POST /api/payment-success
 *
 * MANUAL PAYMENT APPROVAL FLOW:
 * Called from Laravel admin panel when admin approves a payment receipt to:
 * 1. Generate activation code & QR code
 * 2. Update order in Laravel
 * 3. Send email with QR code & activation guide
 *
 * Request body (from Laravel admin):
 * {
 *   order_id: string (required),
 *   admin_token: string (required) - Your Laravel admin API token
 * }
 *
 * Returns:
 * {
 *   success: boolean,
 *   message: string,
 *   activationCode: string,
 *   emailSent: boolean
 * }
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request
    const { order_id, admin_token } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "order_id is required." },
        { status: 400 },
      );
    }

    if (!admin_token) {
      return NextResponse.json(
        {
          success: false,
          message: "admin_token is required for authorization.",
        },
        { status: 401 },
      );
    }

    // 2. Verify admin token (simple validation - you can enhance this)
    const validAdminToken = process.env.ADMIN_API_TOKEN;
    if (!validAdminToken || admin_token !== validAdminToken) {
      console.warn(`[payment-success] Invalid admin token attempt`);
      return NextResponse.json(
        { success: false, message: "Invalid admin token." },
        { status: 403 },
      );
    }

    // 3. Fetch order from Laravel
    const orderRes = await fetch(`${LARAVEL_API}/orders/${order_id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!orderRes.ok) {
      console.error(`[payment-success] Order not found: ${order_id}`);
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    const order = (await orderRes.json()) as OrderData;

    // 4. Check if already has activation code (prevent duplicate processing)
    if (order.activation_code) {
      console.log(
        `[payment-success] Order ${order_id} already has activation code`,
      );
      return NextResponse.json({
        success: false,
        message: "Activation code already exists for this order.",
        alreadyProcessed: true,
      });
    }

    // 5. Generate unique activation code
    const activationCode = generateActivationCode();
    console.log(
      `[payment-success] Generated code ${activationCode} for order ${order_id}`,
    );

    // 6. Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(activationCode, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
    });

    // 7. Update order in Laravel with activation code
    const updateRes = await fetch(`${LARAVEL_API}/orders/${order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        activation_code: activationCode,
        payment_status: "confirmed",
        qr_sent_at: new Date().toISOString(),
      }),
    });

    if (!updateRes.ok) {
      console.error(
        `[payment-success] Failed to update order: ${await updateRes.text()}`,
      );
      return NextResponse.json(
        { success: false, message: "Failed to update order in database." },
        { status: 502 },
      );
    }

    // 8. Send email with QR code and activation guide
    const emailResult = await sendActivationEmail({
      to: order.user_email,
      activationCode,
      qrCodeDataUrl,
      reference: order.reference,
      planName: order.plan_name,
      destination: order.destination,
      dataAmount: order.data_amount,
      validityDays: order.validity_days,
      customerName: order.user_name,
    });

    if (!emailResult.success) {
      console.error(
        "[payment-success] Failed to send email:",
        emailResult.error,
      );
      // Continue - activation code is stored even if email fails
      // Admin can retry from Laravel
    }

    return NextResponse.json(
      {
        success: true,
        message: "Activation code generated and email sent!",
        activationCode: activationCode.substring(0, 8) + "****",
        emailSent: emailResult.success,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[payment-success] Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error processing payment." },
      { status: 500 },
    );
  }
}

/**
 * Generate a unique 16-character activation code
 * Format: XXXX-XXXX-XXXX-XXXX
 */
function generateActivationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) {
      code += "-";
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}
