"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/nav";

interface SelectedPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  data: string;
  features: string[];
  popular?: boolean;
  destinationName?: string;
}

type PaymentMethod = "gcash" | "maya" | "bank" | "card";

const BANKS = [
  { id: "bdo", name: "BDO Unibank", abbr: "BDO", color: "#003087" },
  {
    id: "bpi",
    name: "Bank of the Philippine Islands",
    abbr: "BPI",
    color: "#c8102e",
  },
  { id: "security", name: "Security Bank", abbr: "SBC", color: "#e31e24" },
  { id: "metrobank", name: "Metrobank", abbr: "MBT", color: "#002060" },
  {
    id: "landbank",
    name: "Landbank of the Philippines",
    abbr: "LBP",
    color: "#006633",
  },
  {
    id: "pnb",
    name: "Philippine National Bank",
    abbr: "PNB",
    color: "#003366",
  },
  { id: "unionbank", name: "UnionBank", abbr: "UBP", color: "#e87722" },
  { id: "rcbc", name: "RCBC", abbr: "RCBC", color: "#b90000" },
];

function UploadReceipt({
  receipt,
  preview,
  onFile,
  fileRef,
}: {
  receipt: File | null;
  preview: string | null;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div>
      <p className="field-label">Upload Payment Receipt</p>
      <div
        className={`upload-zone ${receipt ? "has-file" : ""}`}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Receipt" className="upload-preview" />
            <p className="upload-hint" style={{ color: "#1d6fd8" }}>
              ✓ {receipt?.name} — tap to change
            </p>
          </>
        ) : (
          <>
            <div className="upload-icon">↑</div>
            <p className="upload-title">Upload screenshot or receipt</p>
            <p className="upload-hint">JPG, PNG or PDF</p>
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={onFile}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<SelectedPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gcash");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
    email: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("selected_plan");
    if (raw) {
      try {
        setPlan(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const total = plan ? plan.price : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceipt(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!plan) return;
    setSubmitting(true);
    try {
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          plan_id: plan.id,
          payment_method: paymentMethod,
          bank_name: paymentMethod === "bank" ? selectedBank : undefined,
          email: paymentMethod === "card" ? cardData.email : undefined,
          card_name: paymentMethod === "card" ? cardData.name : undefined,
          card_number: paymentMethod === "card" ? cardData.number : undefined,
          card_expiry: paymentMethod === "card" ? cardData.expiry : undefined,
          card_cvc: paymentMethod === "card" ? cardData.cvc : undefined,
        }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        alert(checkoutData.message ?? "Checkout failed.");
        return;
      }
      const orderId = checkoutData.order?.id;
      if (receipt && orderId) {
        const form = new FormData();
        form.append("receipt", receipt);
        const receiptRes = await fetch(`/api/orders/${orderId}/receipt`, {
          method: "POST",
          credentials: "include",
          body: form,
        });
        const receiptData = await receiptRes.json();
        if (!receiptRes.ok) {
          alert(receiptData.message ?? "Receipt upload failed.");
          return;
        }
      }
      sessionStorage.setItem("last_order_id", String(orderId));
      sessionStorage.setItem(
        "last_order_data",
        JSON.stringify({
          id: checkoutData.order?.id,
          customer_email: checkoutData.customer_email,
          reference: checkoutData.order?.reference,
          plan_name: checkoutData.order?.plan_name,
          destination: checkoutData.order?.plan?.destination || "",
          data_amount: checkoutData.order?.plan_data || "",
          validity_days: checkoutData.order?.plan?.validity_days || 0,
          activation_code: checkoutData.activation_code,
          activation_token: checkoutData.activation_token,
        }),
      );
      router.push("/checkout/success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = (() => {
    if (paymentMethod === "gcash" || paymentMethod === "maya") return !!receipt;
    if (paymentMethod === "bank") return !!selectedBank && !!receipt;
    if (paymentMethod === "card")
      return !!(
        cardData.email &&
        cardData.name &&
        cardData.number &&
        cardData.expiry &&
        cardData.cvc
      );
    return false;
  })();

  const inputCls = (f: string) =>
    `field-input${focused === f ? " focused" : ""}`;

  const resetPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setSelectedBank(null);
    setReceipt(null);
    setReceiptPreview(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
        @keyframes ping { 0% { transform:scale(1); opacity:0.5; } 100% { transform:scale(2.2); opacity:0; } }

        *, *::before, *::after { box-sizing: border-box; }

        .co-page {
          min-height: 100vh;
          background: #f5f5f0;
          font-family: 'Sora', sans-serif;
          color: #0a2540;
        }

        /* ── Status bar ── */
        .co-statusbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 32px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #b0bccf;
          letter-spacing: 1.5px;
        }
        .co-statusbar-live {
          display: flex; align-items: center; gap: 8px;
          color: #1d6fd8; font-weight: 500;
        }
        .co-ping { position: relative; display: inline-flex; width: 7px; height: 7px; flex-shrink: 0; }
        .co-ping-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: #1d6fd8; opacity: 0.4;
          animation: ping 1.6s ease-out infinite;
        }
        .co-ping-dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #1d6fd8; }

        /* ── Hero ── */
        .co-hero {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 28px 32px 22px;
        }
        .co-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #1d6fd8;
          letter-spacing: 2.5px; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .co-eyebrow-line { display: inline-block; width: 14px; height: 1px; background: #1d6fd8; }
        .co-hero-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800; color: #0a2540;
          line-height: 1.1; letter-spacing: -0.5px; margin: 0;
        }
        .co-hero-sub { margin: 6px 0 0; font-size: 13px; color: #b0bccf; }
        .co-crumb {
          display: flex; align-items: center; gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf;
          letter-spacing: 1px; margin-top: 14px;
        }
        .co-crumb-active { color: #1d6fd8; font-weight: 500; }
        .co-crumb-sep { color: #e2e8f0; }

        /* ── Body ── */
        .co-body {
          max-width: 1080px; margin: 0 auto;
          padding: 28px 32px 56px;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 20px; align-items: start;
        }
        @media (max-width: 768px) { .co-body { grid-template-columns: 1fr; padding: 20px 16px 40px; } }

        /* ── Panel ── */
        .co-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px; overflow: hidden;
          animation: fadeUp 0.35s ease both;
        }
        .co-panel + .co-panel { margin-top: 14px; }
        .co-panel-head {
          padding: 14px 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .co-panel-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; font-weight: 500;
          color: #1d6fd8; letter-spacing: 2px; text-transform: uppercase;
        }
        .co-panel-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px; color: #b0bccf; letter-spacing: 1px;
        }
        .co-panel-body { padding: 20px; }

        /* ── Order summary ── */
        .co-order-row {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;
        }
        .co-plan-name { font-size: 15px; font-weight: 700; color: #0a2540; margin-bottom: 3px; }
        .co-plan-dest {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf; letter-spacing: 1px; margin-bottom: 10px;
        }
        .co-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .co-chip {
          padding: 3px 9px;
          background: #f0f4fb; border: 1px solid #d4dfee; border-radius: 5px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #1d6fd8; font-weight: 500; letter-spacing: 0.3px;
        }
        .co-price-large { font-size: 20px; font-weight: 800; color: #0a2540; white-space: nowrap; }
        .co-total-row { display: flex; align-items: center; justify-content: space-between; }
        .co-total-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf; letter-spacing: 1.5px;
        }
        .co-total-price { font-size: 26px; font-weight: 800; color: #1d6fd8; }

        /* ── Feature list ── */
        .co-feat-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 0; font-size: 12px; color: #0a2540;
          border-bottom: 1px solid #f5f5f0;
        }
        .co-feat-item:last-child { border-bottom: none; }
        .co-feat-dot { width: 5px; height: 5px; border-radius: 50%; background: #1d6fd8; opacity: 0.6; flex-shrink: 0; }

        /* ── Trust strip ── */
        .co-trust {
          display: flex; gap: 10px; flex-wrap: wrap;
          padding: 12px 20px; border-top: 1px solid #e2e8f0; background: #fafafa;
        }
        .co-trust-item {
          display: flex; align-items: center; gap: 5px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf; letter-spacing: 0.5px;
        }
        .co-trust-dot { width: 5px; height: 5px; border-radius: 50%; background: #1d6fd8; opacity: 0.5; flex-shrink: 0; }

        /* ── Payment tabs ── */
        .pm-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 20px; }
        .pm-tab {
          padding: 10px 6px 8px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #ffffff; cursor: pointer;
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 5px;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .pm-tab:hover { border-color: #1d6fd8; background: #f0f4fb; }
        .pm-tab.active { border-color: #1d6fd8; background: #f0f4fb; box-shadow: 0 0 0 3px rgba(29,111,216,0.1); }
        .pm-tab-label { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 1px; color: #b0bccf; }
        .pm-tab.active .pm-tab-label { color: #1d6fd8; }

        /* ── eWallet box ── */
        .ew-box {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 16px 18px; margin-bottom: 16px;
        }
        .ew-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1.5px; margin: 0 0 4px; }
        .ew-number { font-size: 22px; font-weight: 800; color: #0a2540; letter-spacing: 1px; margin-bottom: 3px; }
        .ew-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 0.5px; margin: 0; }
        .ew-amount {
          display: inline-block; margin-top: 10px;
          padding: 4px 10px; background: #eef3fb; border: 1px solid #d4dfee;
          border-radius: 5px; font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; color: #1d6fd8; font-weight: 500;
        }
        .ew-hint {
          font-family: 'IBM Plex Mono', monospace; font-size: 9px;
          color: #b0bccf; letter-spacing: 0.5px; margin: 0 0 14px; line-height: 1.6;
        }

        /* ── Bank grid ── */
        .bank-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px; margin-bottom: 16px; }
        .bank-item {
          padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #ffffff; cursor: pointer;
          display: flex; align-items: center; gap: 9px;
          transition: border-color 0.15s, background 0.15s;
        }
        .bank-item:hover { border-color: #1d6fd8; background: #f8fafc; }
        .bank-item.selected { border-color: #1d6fd8; background: #f0f4fb; box-shadow: 0 0 0 2px rgba(29,111,216,0.12); }
        .bank-badge {
          width: 34px; height: 22px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif; font-size: 7px; font-weight: 800;
          color: #fff; flex-shrink: 0; letter-spacing: 0.3px;
        }
        .bank-name { font-size: 11px; font-weight: 600; color: #0a2540; line-height: 1.2; }
        .bank-sub { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: #b0bccf; margin-top: 1px; }
        .bank-check { margin-left: auto; color: #1d6fd8; font-size: 13px; flex-shrink: 0; }

        /* ── Fields ── */
        .field-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf;
          letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 5px;
        }
        .field-input {
          width: 100%; background: #fafafa;
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 10px 14px; font-family: 'Sora', sans-serif;
          font-size: 13px; color: #0a2540; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .field-input::placeholder { color: #b0bccf; font-size: 12px; }
        .field-input.focused, .field-input:focus {
          border-color: #1d6fd8; box-shadow: 0 0 0 3px rgba(29,111,216,0.1); background: #ffffff;
        }
        .field-group { display: flex; flex-direction: column; gap: 14px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-wrap { display: flex; flex-direction: column; }

        /* ── Upload ── */
        .upload-zone {
          border: 2px dashed #e2e8f0; border-radius: 12px;
          padding: 24px 16px; text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s; background: #fafafa;
        }
        .upload-zone:hover, .upload-zone.has-file { border-color: #1d6fd8; background: #f0f4fb; border-style: solid; }
        .upload-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: #eef3fb; border: 1px solid #d4dfee;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #1d6fd8; margin: 0 auto 10px; font-weight: 700;
        }
        .upload-title { font-size: 13px; font-weight: 600; color: #0a2540; margin: 0 0 3px; }
        .upload-hint { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 0.5px; margin: 0; }
        .upload-preview { max-width: 100%; max-height: 140px; border-radius: 8px; object-fit: contain; margin: 0 auto 10px; display: block; }

        /* ── Submit ── */
        .co-submit {
          width: 100%; padding: 14px 20px; margin-top: 20px;
          background: #0057ff; color: #ffffff; border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: space-between;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .co-submit:hover:not(:disabled) { background: #0040cc; box-shadow: 0 8px 24px rgba(0,87,255,0.25); transform: translateY(-1px); }
        .co-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .co-submit-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .co-secure {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 10px; font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf; letter-spacing: 1px;
        }

        /* ── Skeleton ── */
        .co-skel {
          height: 14px; border-radius: 5px;
          background: linear-gradient(90deg, #f0f4f8 25%, #e8eef6 50%, #f0f4f8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite; margin-bottom: 10px;
        }

        .section-fade { animation: fadeUp 0.2s ease both; }
      `}</style>

      <div className="co-page">
        <Navigation />

        {/* Status bar */}
        <div className="co-statusbar">
          <div className="co-statusbar-live">
            <span className="co-ping">
              <span className="co-ping-ring" />
              <span className="co-ping-dot" />
            </span>
            Secure checkout
          </div>
          <span>256-bit SSL encrypted · PCI compliant</span>
        </div>

        {/* Hero */}
        <div className="co-hero">
          <div className="co-eyebrow">
            <span className="co-eyebrow-line" />
            Complete your order
          </div>
          <h1 className="co-hero-title">Checkout</h1>
          <p className="co-hero-sub">
            Review your plan and choose a payment method below.
          </p>
          <div className="co-crumb">
            <span>Destinations</span>
            <span className="co-crumb-sep">›</span>
            <span>Plans</span>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-active">Checkout</span>
          </div>
        </div>

        <div className="co-body">
          {/* LEFT — Order summary */}
          <div>
            <div className="co-panel">
              <div className="co-panel-head">
                <span className="co-panel-title">Order Summary</span>
                <span className="co-panel-badge">1 item</span>
              </div>
              <div className="co-panel-body">
                {plan ? (
                  <>
                    <div className="co-order-row">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="co-plan-name">{plan.name}</div>
                        <div className="co-plan-dest">
                          {plan.destinationName
                            ? plan.destinationName.toUpperCase()
                            : "ESIM PLAN"}{" "}
                          · {plan.duration.toUpperCase()}
                        </div>
                        <div className="co-chips">
                          <span className="co-chip">{plan.data}</span>
                          <span className="co-chip">{plan.duration}</span>
                          <span className="co-chip">eSIM</span>
                          {plan.popular && (
                            <span className="co-chip">★ Top pick</span>
                          )}
                        </div>
                      </div>
                      <div className="co-price-large">₱{plan.price}</div>
                    </div>
                    <div className="co-total-row">
                      <span className="co-total-label">Total due</span>
                      <span className="co-total-price">
                        ₱{total.toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="co-skel" style={{ width: "55%" }} />
                    <div className="co-skel" style={{ width: "35%" }} />
                    <div
                      className="co-skel"
                      style={{ width: "70%", marginTop: 16 }}
                    />
                  </>
                )}
              </div>
              <div className="co-trust">
                {[
                  "⚡ Instant activation",
                  "📱 No SIM swap needed",
                  "💬 24/7 support",
                ].map((t) => (
                  <span key={t} className="co-trust-item">
                    <span className="co-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {plan && plan.features.length > 0 && (
              <div className="co-panel">
                <div className="co-panel-head">
                  <span className="co-panel-title">Plan includes</span>
                </div>
                <div
                  className="co-panel-body"
                  style={{ paddingTop: 12, paddingBottom: 12 }}
                >
                  {plan.features.map((f, i) => (
                    <div key={i} className="co-feat-item">
                      <span className="co-feat-dot" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* eSIM delivery info */}
            <div className="co-panel" style={{ marginTop: 14 }}>
              <div
                className="co-panel-body"
                style={{ display: "flex", alignItems: "center", gap: 14 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "#eef3fb",
                    border: "1px solid #d4dfee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 22,
                  }}
                >
                  📱
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0a2540",
                      marginBottom: 2,
                    }}
                  >
                    Instant digital delivery
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9,
                      color: "#b0bccf",
                      letterSpacing: "0.5px",
                      lineHeight: 1.6,
                    }}
                  >
                    Your eSIM QR code is delivered immediately after payment
                    confirmation. No physical SIM required.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Payment */}
          <div className="co-panel">
            <div className="co-panel-head">
              <span className="co-panel-title">Payment Method</span>
            </div>
            <div className="co-panel-body">
              {/* Method tabs */}
              <div className="pm-tabs">
                <button
                  className={`pm-tab ${paymentMethod === "gcash" ? "active" : ""}`}
                  onClick={() => resetPayment("gcash")}
                >
                  <svg width="36" height="20" viewBox="0 0 68 40" fill="none">
                    <rect
                      width="68"
                      height="40"
                      rx="8"
                      fill={paymentMethod === "gcash" ? "#0057ff" : "#e8eef8"}
                    />
                    <text
                      x="34"
                      y="27"
                      textAnchor="middle"
                      fontFamily="Arial Black,sans-serif"
                      fontWeight="900"
                      fontSize="16"
                      fill={paymentMethod === "gcash" ? "white" : "#1d6fd8"}
                      letterSpacing="-0.5"
                    >
                      GCash
                    </text>
                  </svg>
                  <span className="pm-tab-label">GCash</span>
                </button>
                <button
                  className={`pm-tab ${paymentMethod === "maya" ? "active" : ""}`}
                  onClick={() => resetPayment("maya")}
                >
                  <svg width="36" height="20" viewBox="0 0 68 40" fill="none">
                    <rect
                      width="68"
                      height="40"
                      rx="8"
                      fill={paymentMethod === "maya" ? "#00B388" : "#e0f5ef"}
                    />
                    <text
                      x="34"
                      y="27"
                      textAnchor="middle"
                      fontFamily="Arial Black,sans-serif"
                      fontWeight="900"
                      fontSize="16"
                      fill={paymentMethod === "maya" ? "white" : "#00935f"}
                      letterSpacing="-0.5"
                    >
                      Maya
                    </text>
                  </svg>
                  <span className="pm-tab-label">Maya</span>
                </button>
                <button
                  className={`pm-tab ${paymentMethod === "bank" ? "active" : ""}`}
                  onClick={() => resetPayment("bank")}
                >
                  <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                    <path
                      d="M2 10h24M14 2L2 10h24L14 2z"
                      stroke={paymentMethod === "bank" ? "#1d6fd8" : "#b0bccf"}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="4"
                      y="10"
                      width="3"
                      height="9"
                      rx="0.5"
                      fill={paymentMethod === "bank" ? "#1d6fd8" : "#b0bccf"}
                    />
                    <rect
                      x="10.5"
                      y="10"
                      width="3"
                      height="9"
                      rx="0.5"
                      fill={paymentMethod === "bank" ? "#1d6fd8" : "#b0bccf"}
                    />
                    <rect
                      x="17"
                      y="10"
                      width="3"
                      height="9"
                      rx="0.5"
                      fill={paymentMethod === "bank" ? "#1d6fd8" : "#b0bccf"}
                    />
                    <rect
                      x="2"
                      y="20"
                      width="24"
                      height="2.5"
                      rx="0.5"
                      fill={paymentMethod === "bank" ? "#1d6fd8" : "#b0bccf"}
                    />
                  </svg>
                  <span className="pm-tab-label">Bank</span>
                </button>
                <button
                  className={`pm-tab ${paymentMethod === "card" ? "active" : ""}`}
                  onClick={() => resetPayment("card")}
                >
                  <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="30"
                      height="20"
                      rx="3"
                      stroke={paymentMethod === "card" ? "#1d6fd8" : "#b0bccf"}
                      strokeWidth="1.8"
                      fill={
                        paymentMethod === "card"
                          ? "rgba(29,111,216,0.07)"
                          : "none"
                      }
                    />
                    <rect
                      x="1"
                      y="6"
                      width="30"
                      height="5"
                      fill={paymentMethod === "card" ? "#1d6fd8" : "#b0bccf"}
                      opacity="0.3"
                    />
                    <rect
                      x="4"
                      y="15"
                      width="9"
                      height="2.5"
                      rx="1"
                      fill={paymentMethod === "card" ? "#1d6fd8" : "#b0bccf"}
                      opacity="0.7"
                    />
                    <rect
                      x="15"
                      y="15"
                      width="5"
                      height="2.5"
                      rx="1"
                      fill={paymentMethod === "card" ? "#1d6fd8" : "#b0bccf"}
                      opacity="0.7"
                    />
                  </svg>
                  <span className="pm-tab-label">Card</span>
                </button>
              </div>

              {/* GCash */}
              {paymentMethod === "gcash" && (
                <div className="section-fade">
                  <div className="ew-box">
                    <p className="ew-label">Send to GCash number</p>
                    <div className="ew-number">0945 675 4591</div>
                    <p className="ew-name">Account name: [Merchant Name]</p>
                    {plan && (
                      <span className="ew-amount">
                        Amount: ₱{total.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="ew-hint">
                    Send the exact amount, then upload your GCash screenshot
                    below.
                  </p>
                  <UploadReceipt
                    receipt={receipt}
                    preview={receiptPreview}
                    onFile={handleFileChange}
                    fileRef={fileInputRef}
                  />
                </div>
              )}

              {/* Maya */}
              {paymentMethod === "maya" && (
                <div className="section-fade">
                  <div
                    className="ew-box"
                    style={{ background: "#f0faf6", borderColor: "#b6e8d6" }}
                  >
                    <p className="ew-label" style={{ color: "#00935f" }}>
                      Send to Maya number
                    </p>
                    <div className="ew-number">0945 675 4591</div>
                    <p className="ew-name">Account name: [Merchant Name]</p>
                    {plan && (
                      <span
                        className="ew-amount"
                        style={{
                          background: "#dcf5ec",
                          borderColor: "#a7e8ce",
                          color: "#00935f",
                        }}
                      >
                        Amount: ₱{total.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="ew-hint">
                    Send the exact amount, then upload your Maya screenshot
                    below.
                  </p>
                  <UploadReceipt
                    receipt={receipt}
                    preview={receiptPreview}
                    onFile={handleFileChange}
                    fileRef={fileInputRef}
                  />
                </div>
              )}

              {/* Bank */}
              {paymentMethod === "bank" && (
                <div className="section-fade">
                  <p className="field-label" style={{ marginBottom: 8 }}>
                    Select your bank
                  </p>
                  <div className="bank-grid">
                    {BANKS.map((bank) => (
                      <div
                        key={bank.id}
                        className={`bank-item ${selectedBank === bank.id ? "selected" : ""}`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <div
                          className="bank-badge"
                          style={{ background: bank.color }}
                        >
                          {bank.abbr.slice(0, 3)}
                        </div>
                        <div>
                          <div className="bank-name">{bank.abbr}</div>
                          <div className="bank-sub">
                            {bank.name.split(" ").slice(0, 2).join(" ")}
                          </div>
                        </div>
                        {selectedBank === bank.id && (
                          <span className="bank-check">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedBank && (
                    <div className="section-fade">
                      <div className="ew-box" style={{ marginBottom: 12 }}>
                        <p className="ew-label">
                          Transfer to —{" "}
                          {BANKS.find((b) => b.id === selectedBank)?.name}
                        </p>
                        <div
                          className="ew-number"
                          style={{ fontSize: 16, letterSpacing: 2 }}
                        >
                          1234-5678-9012
                        </div>
                        <p className="ew-name">Account name: [Merchant Name]</p>
                        {plan && (
                          <span className="ew-amount">
                            Amount: ₱{total.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="ew-hint">
                        Transfer the exact amount, then upload your deposit slip
                        or screenshot below.
                      </p>
                      <UploadReceipt
                        receipt={receipt}
                        preview={receiptPreview}
                        onFile={handleFileChange}
                        fileRef={fileInputRef}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Card */}
              {paymentMethod === "card" && (
                <div className="section-fade">
                  <div className="field-group">
                    <div className="field-wrap">
                      <p className="field-label">Email address</p>
                      <input
                        className={inputCls("email")}
                        type="email"
                        placeholder="your@email.com"
                        value={cardData.email}
                        onChange={(e) =>
                          setCardData({ ...cardData, email: e.target.value })
                        }
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div className="field-wrap">
                      <p className="field-label">Cardholder name</p>
                      <input
                        className={inputCls("name")}
                        type="text"
                        placeholder="Juan Dela Cruz"
                        value={cardData.name}
                        onChange={(e) =>
                          setCardData({ ...cardData, name: e.target.value })
                        }
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div className="field-wrap">
                      <p className="field-label">Card number</p>
                      <input
                        className={inputCls("number")}
                        type="text"
                        placeholder="4532 1234 5678 9010"
                        value={cardData.number}
                        onChange={(e) => {
                          const raw = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16);
                          setCardData({
                            ...cardData,
                            number: raw.replace(/(.{4})/g, "$1 ").trim(),
                          });
                        }}
                        onFocus={() => setFocused("number")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div className="field-row">
                      <div className="field-wrap">
                        <p className="field-label">Expiry</p>
                        <input
                          className={inputCls("expiry")}
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => {
                            let v = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            if (v.length > 2)
                              v = v.slice(0, 2) + "/" + v.slice(2);
                            setCardData({ ...cardData, expiry: v });
                          }}
                          onFocus={() => setFocused("expiry")}
                          onBlur={() => setFocused(null)}
                        />
                      </div>
                      <div className="field-wrap">
                        <p className="field-label">CVC / CVV</p>
                        <input
                          className={inputCls("cvc")}
                          type="text"
                          placeholder="123"
                          value={cardData.cvc}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvc: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                          onFocus={() => setFocused("cvc")}
                          onBlur={() => setFocused(null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                className="co-submit"
                disabled={submitting || !canSubmit}
                onClick={handleSubmit}
              >
                <span>
                  {submitting
                    ? "Processing…"
                    : plan
                      ? `Complete purchase — ₱${total.toFixed(2)}`
                      : "Complete purchase"}
                </span>
                <span className="co-submit-arrow">→</span>
              </button>
              <p className="co-secure">🔒 256-bit SSL · Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
