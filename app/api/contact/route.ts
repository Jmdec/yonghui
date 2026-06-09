import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, subject, message } = body;

    // Basic validation
    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    // 1. Save to Laravel
    const laravelRes = await fetch(`${LARAVEL_API}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ full_name, email, phone, subject, message }),
    });

    const laravelData = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(
        { success: false, errors: laravelData.errors ?? laravelData },
        { status: laravelRes.status },
      );
    }

    // 2. Send email notification to admin
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_FROM, // admin receives it
      replyTo: email,
      subject: `[YH eSIM] New Inquiry: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: Arial, sans-serif; background: #060D1A; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 0 auto; background: #0A1628; border: 1px solid rgba(0,180,255,0.2); border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0050CC, #00B4FF); padding: 28px 32px; }
            .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: 2px; }
            .header p  { color: rgba(255,255,255,0.75); margin: 4px 0 0; font-size: 12px; letter-spacing: 1px; }
            .body { padding: 32px; }
            .field { margin-bottom: 20px; }
            .label { font-size: 11px; color: #00B4FF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
            .value { font-size: 15px; color: #E8F4FF; line-height: 1.6; }
            .message-box { background: #060D1A; border: 1px solid rgba(0,180,255,0.15); border-radius: 8px; padding: 16px; color: #B8D4EE; font-size: 14px; line-height: 1.7; }
            .footer { border-top: 1px solid rgba(0,180,255,0.1); padding: 20px 32px; text-align: center; font-size: 11px; color: #3A5A7A; letter-spacing: 1px; }
            .badge { display: inline-block; background: rgba(0,180,255,0.12); border: 1px solid rgba(0,180,255,0.3); border-radius: 20px; padding: 4px 12px; font-size: 11px; color: #00B4FF; letter-spacing: 1px; margin-bottom: 24px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>YONG<span style="color:#00FFB0">HUI</span> eSIM</h1>
              <p>eSIM · GLOBAL NETWORK · NEW INQUIRY</p>
            </div>
            <div class="body">
              <div class="badge">● NEW MESSAGE RECEIVED</div>
              <div class="field">
                <div class="label">Full Name</div>
                <div class="value">${full_name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color:#00B4FF">${email}</a></div>
              </div>
              ${
                phone
                  ? `
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">${phone}</div>
              </div>`
                  : ""
              }
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${message.replace(/\n/g, "<br/>")}</div>
              </div>
              <div style="margin-top:24px;font-size:12px;color:#5A8AAA;">
                Submitted: ${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })} PHT
              </div>
            </div>
            <div class="footer">YH eSIM · YH-esim.com · All rights reserved</div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We'll get back to you shortly.",
    });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
