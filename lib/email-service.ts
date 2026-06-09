import nodemailer from "nodemailer";
import { Resend } from "resend";

export interface ActivationEmailData {
  to: string;
  activationCode: string;
  qrCodeDataUrl: string;
  reference: string;
  planName: string;
  destination: string;
  dataAmount: string;
  validityDays: number;
  customerName?: string;
}

// Choose your email provider: "resend" or "nodemailer"
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "resend";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || "noreply@esim.com";
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Nodemailer transporter
let nodemailerTransporter: any = null;

if (EMAIL_PROVIDER === "nodemailer" && SMTP_HOST && SMTP_USER) {
  nodemailerTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

/**
 * Generate HTML email template with QR code
 */
function generateEmailTemplate(data: ActivationEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your eSIM Activation Code</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        .header {
          background: linear-gradient(135deg, #0D6EFD 0%, #0090FF 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin-bottom: 32px;
        }
        .section h2 {
          font-size: 18px;
          color: #0a2540;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .qr-container {
          text-align: center;
          margin: 32px 0;
          padding: 24px;
          background: #f8fafc;
          border-radius: 8px;
          border: 2px dashed #0D6EFD;
        }
        .qr-container img {
          max-width: 200px;
          height: auto;
        }
        .plan-details {
          background: #f0f6ff;
          border-left: 4px solid #0D6EFD;
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
        }
        .plan-details-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .plan-details-label {
          color: #4a6a8a;
          font-weight: 500;
        }
        .plan-details-value {
          color: #0a2540;
          font-weight: 700;
        }
        .activation-code-box {
          background: #0a2540;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 16px 0;
          text-align: center;
        }
        .activation-code-box .label {
          font-size: 12px;
          color: #a0c4ff;
          margin-bottom: 8px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .activation-code-box .code {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 2px;
          word-break: break-all;
        }
        .instructions {
          background: #f0f6ff;
          padding: 20px;
          border-radius: 8px;
          margin: 16px 0;
        }
        .instructions ol {
          margin-left: 20px;
          color: #1e3a5f;
          font-size: 14px;
          line-height: 1.8;
        }
        .instructions li {
          margin-bottom: 12px;
        }
        .instructions strong {
          color: #0D6EFD;
        }
        .footer {
          background: #f8fafc;
          padding: 24px 20px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #4a6a8a;
        }
        .footer a {
          color: #0D6EFD;
          text-decoration: none;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #0D6EFD 0%, #0090FF 100%);
          color: white;
          padding: 12px 28px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>✓ Payment Confirmed</h1>
          <p>Your eSIM activation code is ready</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Greeting -->
          <div class="section">
            <p style="font-size: 14px; color: #1e3a5f; line-height: 1.6;">
              ${data.customerName ? `Hello ${data.customerName},<br><br>` : ""}
              Thank you for your purchase! Your eSIM is ready to activate. Below you'll find your activation code and instructions to get started.
            </p>
          </div>

          <!-- Plan Details -->
          <div class="section">
            <h2>Plan Details</h2>
            <div class="plan-details">
              <div class="plan-details-row">
                <span class="plan-details-label">Plan</span>
                <span class="plan-details-value">${data.planName}</span>
              </div>
              <div class="plan-details-row">
                <span class="plan-details-label">Destination</span>
                <span class="plan-details-value">${data.destination}</span>
              </div>
              <div class="plan-details-row">
                <span class="plan-details-label">Data Amount</span>
                <span class="plan-details-value">${data.dataAmount}</span>
              </div>
              <div class="plan-details-row">
                <span class="plan-details-label">Validity</span>
                <span class="plan-details-value">${data.validityDays} days</span>
              </div>
              <div class="plan-details-row">
                <span class="plan-details-label">Order Reference</span>
                <span class="plan-details-value">${data.reference}</span>
              </div>
            </div>
          </div>

          <!-- QR Code Section -->
          <div class="section">
            <h2>Scan to Activate</h2>
            <div class="qr-container">
              <img src="${data.qrCodeDataUrl}" alt="eSIM Activation QR Code" />
              <p style="margin-top: 12px; font-size: 13px; color: #4a6a8a;">Scan this QR code with your phone to start activation</p>
            </div>
          </div>

          <!-- Activation Code -->
          <div class="section">
            <h2>Your Activation Code</h2>
            <p style="font-size: 13px; color: #4a6a8a; margin-bottom: 12px;">If you cannot scan the QR code, enter this code manually:</p>
            <div class="activation-code-box">
              <div class="label">Activation Code</div>
              <div class="code">${data.activationCode}</div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="section">
            <h2>How to Activate Your eSIM</h2>
            <div class="instructions">
              <ol>
                <li><strong>Open Settings</strong> on your phone</li>
                <li><strong>Go to Cellular or Mobile Data</strong> (varies by phone)</li>
                <li><strong>Tap "Add Cellular Plan"</strong> or similar option</li>
                <li><strong>Scan the QR code above</strong> OR select "Enter Details Manually" and paste your activation code</li>
                <li><strong>Select your carrier</strong> for the destination country</li>
                <li><strong>Confirm</strong> and wait 1-2 minutes for activation</li>
              </ol>
            </div>
          </div>

          <!-- View Online Link -->
          <div style="text-align: center;">
            <a href="${FRONTEND_URL}/activate?token=${data.reference}" class="cta-button">View Activation Details Online</a>
          </div>

          <!-- Support -->
          <div class="section" style="text-align: center;">
            <p style="font-size: 13px; color: #4a6a8a; line-height: 1.6;">
              Having trouble? Our 24/7 support team is here to help.<br>
              <a href="mailto:support@esim.com" style="color: #0D6EFD; text-decoration: none;">Contact Support</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>© 2024 eSIM Services. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send activation email via Resend or Nodemailer
 */
export async function sendActivationEmail(
  data: ActivationEmailData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const htmlContent = generateEmailTemplate(data);

    if (EMAIL_PROVIDER === "resend" && resend) {
      const result = await resend.emails.send({
        from: SMTP_FROM,
        to: data.to,
        subject: `Your eSIM Activation Code - Order ${data.reference}`,
        html: htmlContent,
      });

      if (result.error) {
        console.error("[sendActivationEmail] Resend error:", result.error);
        return {
          success: false,
          error: result.error.message || "Failed to send email via Resend",
        };
      }

      console.log(
        "[sendActivationEmail] Email sent via Resend:",
        result.data?.id,
      );
      return { success: true };
    }

    if (EMAIL_PROVIDER === "nodemailer" && nodemailerTransporter) {
      const info = await nodemailerTransporter.sendMail({
        from: SMTP_FROM,
        to: data.to,
        subject: `Your eSIM Activation Code - Order ${data.reference}`,
        html: htmlContent,
      });

      console.log(
        "[sendActivationEmail] Email sent via Nodemailer:",
        info.messageId,
      );
      return { success: true };
    }

    console.warn("[sendActivationEmail] No email provider configured");
    return {
      success: false,
      error: "Email provider not configured",
    };
  } catch (error) {
    console.error("[sendActivationEmail] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
