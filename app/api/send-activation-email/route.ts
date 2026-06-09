import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Initialize Nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // Use app-specific password, not regular password
  },
});

interface EmailPayload {
  recipientEmail: string;
  orderId: string;
  activationToken: string;
  activationCode: string;
  planName: string;
  planData: string;
  plan_duration: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailPayload = await request.json();

    const {
      recipientEmail,
      orderId,
      activationToken,
      activationCode,
      planName,

      planData,
      plan_duration,
    } = body;

    console.log("[send-activation-email] Received payload:", {
      recipientEmail,
      orderId,
      hasActivationToken: !!activationToken,
      hasActivationCode: !!activationCode,
      planName,

      planData,
      plan_duration,
    });

    // Validate required fields
    if (!recipientEmail || !activationToken || !activationCode) {
      console.error("[send-activation-email] Missing required fields:", {
        hasEmail: !!recipientEmail,
        hasToken: !!activationToken,
        hasCode: !!activationCode,
      });
      return NextResponse.json(
        {
          message: "Missing required fields: email, token, or activation code",
        },
        { status: 400 },
      );
    }

    // Validate Gmail credentials
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error("[send-activation-email] Missing Gmail credentials");
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 500 },
      );
    }

    // Build activation link
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${activationToken}`;

    // HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
    .header { background: linear-gradient(135deg, #0D6EFD 0%, #0090FF 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: white; padding: 40px; border-radius: 0 0 8px 8px; }
    .plan-details { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0D6EFD; }
    .plan-details p { margin: 8px 0; }
    .plan-details strong { color: #0a2540; }
    .code-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .code-section .code { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; background: white; padding: 12px; border-radius: 6px; word-break: break-all; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D6EFD 0%, #0090FF 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .steps { margin: 30px 0; }
    .steps ol { padding-left: 20px; }
    .steps li { margin: 12px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    .highlight { color: #0D6EFD; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your eSIM is Ready! 🎉</h1>
      <p>Order #${orderId}</p>
    </div>

    <div class="content">
      <p>Hi there,</p>
      
      <p>Great news! Your eSIM activation code has been generated and is ready to use. Click the button below to view your activation code and QR code.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${activationLink}" class="cta-button">View My Activation Code</a>
      </div>

      <div class="plan-details">
        <p><strong>Plan Details:</strong></p>
        <p>📱 <strong>${planName}</strong></p>
        
        <p>📊 Data: <strong>${planData}</strong></p>
        <p>⏱️ Validity: <strong>${plan_duration} days</strong></p>
      </div>

      <h2 style="color: #0a2540;">Your Activation Code</h2>
      <p>You can also use this code manually if needed:</p>
      <div class="code-section">
        <div class="code">${activationCode}</div>
      </div>

      <h2 style="color: #0a2540;">How to Activate</h2>
      <div class="steps">
        <ol>
          <li>Click the button above or paste this link in your browser:<br><code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${activationLink}</code></li>
          <li>You'll see your eSIM activation code and QR code</li>
          <li>On your phone, go to: <strong>Settings → Cellular → Add Cellular Plan</strong></li>
          <li>Scan the QR code or enter the activation code manually</li>
        
          <li>Your eSIM will activate within 1-2 minutes</li>
        </ol>
      </div>

      <p style="background: #fffbeb; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
        <strong>⚠️ Important:</strong> Make sure you have an active internet connection (WiFi or cellular data) when activating your eSIM.
      </p>

      <p style="margin-top: 30px;">Questions? Our support team is available 24/7 to help!</p>

      <div class="footer">
        <p>This is an automated message. Please don't reply to this email.</p>
        <p>&copy; 2024 eSIM Store. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Plain text fallback
    const plainText = `
Your eSIM is Ready!

Order #${orderId}

Plan: ${planName}

Data: ${planData}
Validity: ${plan_duration} days

Activation Code: ${activationCode}

View your activation code and QR code here:
${activationLink}

How to Activate:
1. Click the link above or visit: ${activationLink}
2. You'll see your eSIM activation code and QR code
3. On your phone, go to: Settings → Cellular → Add Cellular Plan
4. Scan the QR code or enter the activation code manually
5. Your eSIM will activate within 1-2 minutes

Need help? Contact our 24/7 support team.
    `.trim();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: recipientEmail,
      subject: `Your eSIM Activation Code - Order #${orderId}`,
      text: plainText,
      html: htmlContent,
    };

    const sendResult = await transporter.sendMail(mailOptions);
    console.log("[send-activation-email] Email sent successfully:", {
      messageId: sendResult.messageId,
      to: recipientEmail,
      orderId,
    });

    return NextResponse.json(
      { message: "Activation email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[send-activation-email] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[send-activation-email] Error details:", errorMessage);

    return NextResponse.json(
      { message: `Failed to send activation email: ${errorMessage}` },
      { status: 500 },
    );
  }
}
