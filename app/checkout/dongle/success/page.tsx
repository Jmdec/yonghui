"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DongleOrder {
  id?: string | number;
  reference_number?: string;
  customer_name?: string;
  customer_email?: string;
  delivery_method?: "pickup" | "delivery";
  delivery_address?: string;
  plan_name?: string;
  total_price?: number;
}

export default function DongleSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<DongleOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_dongle_order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const reference =
    order?.reference_number ?? (order?.id ? `#${order.id}` : null);
  const isDelivery = order?.delivery_method === "delivery";

  const fmtPrice = (n: number) =>
    n.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

        @keyframes float   { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ping    { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.2); opacity: 0; } }

        .float-animation { animation: float 3s ease-in-out infinite; }
        .slide-in        { animation: slideIn 0.6s ease-out both; }

        *, *::before, *::after { box-sizing: border-box; }

        .suc-page { font-family: 'Sora', sans-serif; color: #0a2540; }

        .suc-mono {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* Detail card */
        .suc-detail-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .suc-detail-head {
          padding: 10px 18px;
          border-bottom: 1px solid #e2e8f0;
          background: #fafafa;
        }
        .suc-detail-body { padding: 16px 18px; }
        .suc-detail-row  {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding: 6px 0;
          border-bottom: 1px solid #f0f4f8;
        }
        .suc-detail-row:last-child { border-bottom: none; }
        .suc-detail-label { color: #b0bccf; flex-shrink: 0; }
        .suc-detail-value { font-size: 12px; font-weight: 600; color: #0a2540; text-align: right; }

        /* Steps */
        .suc-steps { display: flex; flex-direction: column; gap: 10px; }
        .suc-step  { display: flex; gap: 12px; align-items: flex-start; }
        .suc-step-num {
          flex-shrink: 0;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #1d6fd8;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }
        .suc-step-text { font-size: 13px; color: #4a5568; line-height: 1.5; }

        /* Status badge */
        .suc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 99px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 1px;
        }
        .suc-badge-pending  { background: #fef9ec; border: 1px solid #fde68a; color: #92400e; }
        .suc-badge-review   { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d40af; }
        .ping-wrap          { position: relative; display: inline-flex; width: 7px; height: 7px; flex-shrink: 0; }
        .ping-ring          { position: absolute; inset: 0; border-radius: 50%; background: currentColor; opacity: .4; animation: ping 1.6s ease-out infinite; }
        .ping-dot           { position: relative; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
      `}</style>

      <div className="suc-page max-w-lg w-full">
        {/* ── Icon + heading ── */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="float-animation">
              <svg
                className="w-20 h-20 text-green-500"
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

          <h1
            className="text-3xl font-bold text-gray-900 mb-2 slide-in"
            style={{ letterSpacing: "-0.5px" }}
          >
            Order Received!
          </h1>
          <p
            className="text-gray-400 text-sm slide-in"
            style={{ animationDelay: "0.05s" }}
          >
            Your dongle order has been placed successfully.
          </p>

          {reference && (
            <p className="slide-in mt-2" style={{ animationDelay: "0.1s" }}>
              <span className="suc-mono text-gray-400">Reference: </span>
              <span className="font-mono font-bold text-blue-600 text-sm">
                {reference}
              </span>
            </p>
          )}
        </div>

        {/* ── Order detail card ── */}
        {order && (
          <div
            className="suc-detail-card slide-in"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="suc-detail-head">
              <span className="suc-mono" style={{ color: "#1d6fd8" }}>
                Order Details
              </span>
            </div>
            <div className="suc-detail-body">
              {order.plan_name && (
                <div className="suc-detail-row">
                  <span className="suc-mono suc-detail-label">Plan</span>
                  <span className="suc-detail-value">{order.plan_name}</span>
                </div>
              )}
              {order.total_price != null && (
                <div className="suc-detail-row">
                  <span className="suc-mono suc-detail-label">Total paid</span>
                  <span
                    className="suc-detail-value"
                    style={{ color: "#1d6fd8", fontSize: 14 }}
                  >
                    ₱{fmtPrice(order.total_price)}
                  </span>
                </div>
              )}
              {order.customer_name && (
                <div className="suc-detail-row">
                  <span className="suc-mono suc-detail-label">Name</span>
                  <span className="suc-detail-value">
                    {order.customer_name}
                  </span>
                </div>
              )}
              {order.customer_email && (
                <div className="suc-detail-row">
                  <span className="suc-mono suc-detail-label">Email</span>
                  <span className="suc-detail-value">
                    {order.customer_email}
                  </span>
                </div>
              )}
              <div className="suc-detail-row">
                <span className="suc-mono suc-detail-label">Delivery</span>
                <span className="suc-detail-value">
                  {isDelivery
                    ? "🚚 Nationwide delivery"
                    : "🏪 Metro Manila pick-up"}
                </span>
              </div>
              {isDelivery && order.delivery_address && (
                <div className="suc-detail-row">
                  <span className="suc-mono suc-detail-label">Address</span>
                  <span
                    className="suc-detail-value"
                    style={{ maxWidth: "60%" }}
                  >
                    {order.delivery_address}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Status box ── */}
        <div
          className="bg-white border border-blue-100 rounded-2xl p-5 mb-4 shadow-sm slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 26, flexShrink: 0 }}>🕐</div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0a2540",
                  }}
                >
                  Payment Under Review
                </h3>
                <span className="suc-badge suc-badge-review">
                  <span className="ping-wrap" style={{ color: "#1d40af" }}>
                    <span className="ping-ring" />
                    <span className="ping-dot" />
                  </span>
                  Pending
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                We've received your order and payment receipt. Our team will
                verify your payment and confirm your order within a few hours.
              </p>
            </div>
          </div>
        </div>

        {/* ── What happens next ── */}
        <div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 slide-in border border-blue-100"
          style={{ animationDelay: "0.28s" }}
        >
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              fontWeight: 700,
              color: "#0a2540",
            }}
          >
            What happens next?
          </h2>
          <div className="suc-steps">
            {[
              "Our team reviews your payment receipt (usually within a few hours)",
              "We confirm your order and prepare your USB-C dongle for dispatch",
              isDelivery
                ? "Your dongle is shipped nationwide — delivery takes 3–5 business days"
                : "We'll contact you to arrange pick-up in Metro Manila",
              "You receive a confirmation email with tracking or pick-up details",
            ].map((step, i) => (
              <div key={i} className="suc-step">
                <span className="suc-step-num">{i + 1}</span>
                <p className="suc-step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Buttons ── */}
        <div
          className="flex gap-3 slide-in"
          style={{ animationDelay: "0.35s" }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: "#fff",
              border: "2px solid #e2e8f0",
              borderRadius: 12,
              fontFamily: "'Sora', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#0a2540",
              cursor: "pointer",
            }}
          >
            Return Home
          </button>
          <button
            onClick={() => router.push("/destinations")}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: "#0057ff",
              border: "none",
              borderRadius: 12,
              fontFamily: "'Sora', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Browse More Plans
          </button>
        </div>

        <p
          className="text-center slide-in"
          style={{
            animationDelay: "0.4s",
            marginTop: 20,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: "#b0bccf",
            letterSpacing: "1px",
          }}
        >
          🔒 256-bit SSL · Secure checkout
        </p>
      </div>
    </div>
  );
}
