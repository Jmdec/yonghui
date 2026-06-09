"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderData {
  id: string;
  customer_email: string;
  reference: string;
  plan_name: string;
  destination: string;
  data_amount: string;
  validity_days: number;
  activation_code: string;
  activation_token: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    const initiate = async () => {
      try {
        // Get order data from sessionStorage (set during checkout)
        const orderDataRaw = sessionStorage.getItem("last_order_data");
        const orderId = sessionStorage.getItem("last_order_id");

        console.log("[v0] Order ID from session:", orderId);
        console.log("[v0] Order data from session:", orderDataRaw);

        if (!orderId) {
          console.log("[v0] No order ID found in sessionStorage");
          setLoading(false);
          return;
        }

        setOrderId(orderId);

        // If we have full order data, send activation email
        if (orderDataRaw) {
          try {
            const orderData: OrderData = JSON.parse(orderDataRaw);

            console.log("[v0] Parsed order data:", {
              email: orderData.customer_email,
              reference: orderData.reference,
              hasToken: !!orderData.activation_token,
              hasCode: !!orderData.activation_code,
              plan: orderData.plan_name,
            });

            // Validate required fields before sending email
            if (!orderData.customer_email) {
              throw new Error("Missing customer email");
            }
            if (!orderData.activation_token) {
              throw new Error(
                "Missing activation token - order may not be fully processed yet",
              );
            }
            if (!orderData.activation_code) {
              throw new Error(
                "Missing activation code - order may not be fully processed yet",
              );
            }

            // Send activation email via Nodemailer
            const emailRes = await fetch("/api/send-activation-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recipientEmail: orderData.customer_email,
                orderId: orderData.reference,
                activationToken: orderData.activation_token,
                activationCode: orderData.activation_code,
                planName: orderData.plan_name,
                destination: orderData.destination,
                dataAmount: orderData.data_amount,
                validityDays: orderData.validity_days,
              }),
            });

            console.log("[v0] Email API response status:", emailRes.status);

            if (emailRes.ok) {
              console.log("[v0] Email sent successfully");
              setEmailSent(true);
            } else {
              const errorData = await emailRes.json();
              console.error("[v0] Email API error:", errorData);
              setEmailError(errorData.message || "Failed to send email");
            }
          } catch (err) {
            console.error("[v0] Email send error:", err);
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Could not send activation email";
            setEmailError(errorMessage);
          }
        } else {
          console.log("[v0] No order data found in sessionStorage");
          setEmailError(
            "Order data not found. Please refresh the page or contact support.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    initiate();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-animation { animation: float 3s ease-in-out infinite; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in { animation: slideIn 0.6s ease-out; }
      `}</style>

      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="float-animation">
              <svg
                className="w-24 h-24 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3 slide-in">
            Order Confirmed!
          </h1>

          <p
            className="text-lg text-gray-600 mb-2 slide-in"
            style={{ animationDelay: "0.1s" }}
          >
            Payment confirmed. Your eSIM activation code has been generated.
          </p>

          <p
            className="text-gray-500 text-sm slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            Order ID:{" "}
            <span className="font-mono font-bold text-blue-600">
              {orderId || "Loading..."}
            </span>
          </p>
        </div>

        {/* Email Notification */}
        {emailError ? (
          <div
            className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8 slide-in shadow-md"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex gap-4">
              <svg
                className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email Delivery Issue
                </h3>
                <p className="text-gray-600 text-sm">
                  {emailError}. Please check your email settings and try again,
                  or contact support.
                </p>
              </div>
            </div>
          </div>
        ) : emailSent ? (
          <div
            className="bg-white border-l-4 border-emerald-500 rounded-lg p-6 mb-8 slide-in shadow-md"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex gap-4">
              <svg
                className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Activation Email Sent
                </h3>
                <p className="text-gray-600 text-sm">
                  Check your inbox for an email with your eSIM activation code
                  and QR code. Click the link to view and activate your eSIM.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-8 slide-in shadow-md"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex gap-4">
              <svg
                className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Sending Activation Email
                </h3>
                <p className="text-gray-600 text-sm">
                  We are preparing and sending your eSIM activation details...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 slide-in border border-blue-100"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            How to Activate Your eSIM
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Open Your Email</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Look for an email titled "Your eSIM is Ready - Activate Now"
                  and click the activation link inside.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  View Your Code & QR
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  You'll see your activation code and a QR code. You can copy
                  the code or scan the QR with your phone.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Add Cellular Plan
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  On your phone: Settings → Cellular → Add Cellular Plan → Scan
                  QR (or enter code manually). Select your carrier.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Activate Instantly
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your eSIM will activate within 1-2 minutes. You can start
                  using data immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 slide-in" style={{ animationDelay: "0.5s" }}>
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return Home
          </button>

          <button
            onClick={() => router.push("/browse")}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse More Plans
          </button>
        </div>

        {/* Support Note */}
        <p
          className="text-center text-gray-500 text-sm mt-8 slide-in"
          style={{ animationDelay: "0.6s" }}
        >
          Need help? Contact our{" "}
          <a
            href="mailto:support@esim.com"
            className="text-blue-600 hover:underline"
          >
            24/7 support team
          </a>
        </p>
      </div>
    </div>
  );
}
