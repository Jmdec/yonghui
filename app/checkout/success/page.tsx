"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [reference, setReference] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_order_data");
    const id = sessionStorage.getItem("last_order_id");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setReference(data.reference ?? `#${id}`);
        setPaymentMethod(data.payment_method ?? null);
      } catch {}
    } else if (id) {
      setReference(`#${id}`);
    }
  }, []);

  const isManual = ["gcash", "maya", "bank"].includes(paymentMethod ?? "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-animation { animation: float 3s ease-in-out infinite; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in { animation: slideIn 0.6s ease-out both; }
      `}</style>

      <div className="max-w-lg w-full">
        {/* Icon */}
        <div className="text-center mb-10">
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
            Order Received!
          </h1>

          {reference && (
            <p
              className="text-gray-500 text-sm slide-in"
              style={{ animationDelay: "0.1s" }}
            >
              Reference:{" "}
              <span className="font-mono font-bold text-blue-600">
                {reference}
              </span>
            </p>
          )}
        </div>

        {/* Status box */}
        <div
          className="bg-white border border-blue-100 rounded-2xl p-6 mb-6 shadow-sm slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          {isManual ? (
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">🕐</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Payment Under Review
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We received your order and payment receipt. Our team will
                  verify your payment and send your eSIM activation code to your
                  email within a few hours.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">✉️</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Check Your Email
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your eSIM activation code will be sent to your email shortly.
                  Please allow a few minutes for delivery.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* What happens next */}
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 slide-in border border-blue-100"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="font-bold text-gray-900 mb-4">What happens next?</h2>
          <div className="space-y-3">
            {[
              isManual
                ? "Our team reviews your payment receipt (usually within a few hours)"
                : "Payment is confirmed automatically",
              "We assign your eSIM activation code",
              "You receive an email with your QR code and activation instructions",
              "Scan the QR code in your phone's Settings → Cellular → Add Plan",
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <p className="text-gray-600 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 slide-in" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Return Home
          </button>
          <button
            onClick={() => router.push("/destinations")}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse More Plans
          </button>
        </div>

        {/* <p
          className="text-center text-gray-400 text-sm mt-8 slide-in"
          style={{ animationDelay: "0.5s" }}
        >
          Need help?{" "}
          <a
            href="mailto:support@esim.com"
            className="text-blue-600 hover:underline"
          >
            Contact support
          </a>
        </p> */}
      </div>
    </div>
  );
}
