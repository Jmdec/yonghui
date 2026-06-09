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

function GridBg() {
  return (
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="cog"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(14,99,214,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cog)" />
      </svg>
    </div>
  );
}

function PingDot() {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: 8,
        height: 8,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#1d6fd8",
          opacity: 0.4,
          animation: "ping 1.5s ease-out infinite",
        }}
      />
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#1d6fd8",
        }}
      />
    </span>
  );
}

function EsimChip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 20px",
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(14,99,214,0.15)",
        borderRadius: 12,
        backdropFilter: "blur(8px)",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes chipScan { 0% { top: -40%; } 100% { top: 140%; } }
        @keyframes dashFlow { 0% { stroke-dashoffset: 40; } 100% { stroke-dashoffset: 0; } }
        @keyframes chipFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes orb-float { from { transform: translate(0,0) scale(1); } to { transform: translate(20px,12px) scale(1.05); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(180deg, rgba(13,110,253,0.06), transparent)",
          top: "-40%",
          animation: "chipScan 2.5s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div
        style={{
          animation: "chipFloat 3s ease-in-out infinite",
          flexShrink: 0,
        }}
      >
        <svg width="48" height="38" viewBox="0 0 48 38">
          <rect x="0" y="0" width="48" height="38" rx="7" fill="#0C447C" />
          <rect
            x="3"
            y="3"
            width="42"
            height="32"
            rx="5"
            fill="none"
            stroke="#1d6fd8"
            strokeWidth="1"
          />
          <rect
            x="7"
            y="7"
            width="14"
            height="11"
            rx="2"
            fill="#1d6fd8"
            opacity="0.7"
          />
          <rect
            x="7"
            y="21"
            width="9"
            height="8"
            rx="1"
            fill="#60a5fa"
            opacity="0.5"
          />
          <rect
            x="19"
            y="21"
            width="9"
            height="8"
            rx="1"
            fill="#60a5fa"
            opacity="0.5"
          />
          <rect
            x="31"
            y="21"
            width="9"
            height="8"
            rx="1"
            fill="#60a5fa"
            opacity="0.5"
          />
          <rect
            x="24"
            y="7"
            width="16"
            height="4"
            rx="1"
            fill="#60a5fa"
            opacity="0.4"
          />
          <rect
            x="24"
            y="13"
            width="16"
            height="4"
            rx="1"
            fill="#60a5fa"
            opacity="0.4"
          />
        </svg>
      </div>
      <svg width="60" height="16" viewBox="0 0 60 16" style={{ flexShrink: 0 }}>
        <line
          x1="0"
          y1="8"
          x2="60"
          y2="8"
          stroke="rgba(14,99,214,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="0"
          y1="8"
          x2="60"
          y2="8"
          stroke="#1d6fd8"
          strokeWidth="1.5"
          strokeDasharray="10 6"
          style={{ animation: "dashFlow 0.8s linear infinite" }}
        />
        <polygon points="56,4 60,8 56,12" fill="#0C447C" />
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9,
            letterSpacing: "2px",
            color: "#1d6fd8",
            fontWeight: 700,
            marginBottom: 3,
          }}
        >
          ESIM PROVISIONING READY
        </div>
        <div
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 12,
            color: "#0a2540",
            fontWeight: 600,
          }}
        >
          Instant digital delivery — no physical SIM required
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
      >
        <PingDot />
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9,
            color: "#1d6fd8",
            letterSpacing: "1px",
          }}
        >
          LIVE
        </span>
      </div>
    </div>
  );
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
  const [tick, setTick] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("selected_plan");
    if (raw) {
      try {
        setPlan(JSON.parse(raw));
      } catch {}
    }
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const timeStr = now.toUTCString().slice(17, 25);
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
      // Step 1: Create the order in Laravel
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
        alert(checkoutData.message ?? "Checkout failed. Please try again.");
        return;
      }

      const orderId = checkoutData.order?.id;
      const activationCode = checkoutData.activation_code;
      const activationToken = checkoutData.activation_token;
      const customerEmail = checkoutData.customer_email;

      console.log("[checkout] Response received:", {
        orderId,
        hasActivationCode: !!activationCode,
        hasActivationToken: !!activationToken,
        email: customerEmail,
      });

      // Step 2: Upload receipt for GCash / Maya / Bank
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
          alert(
            receiptData.message ?? "Receipt upload failed. Please try again.",
          );
          return;
        }
      }

      // Step 3: Save order data (including activation code & token) in sessionStorage
      sessionStorage.setItem("last_order_id", String(orderId));

      // Store the full order data with activation details
      const orderDataForEmail = {
        id: checkoutData.order?.id,
        customer_email: customerEmail,
        reference: checkoutData.order?.reference,
        plan_name: checkoutData.order?.plan_name,
        destination: checkoutData.order?.plan?.destination || "",
        data_amount: checkoutData.order?.plan_data || "",
        validity_days: checkoutData.order?.plan?.validity_days || 0,
        activation_code: activationCode,
        activation_token: activationToken,
      };

      console.log(
        "[checkout] Storing order data in sessionStorage:",
        orderDataForEmail,
      );
      sessionStorage.setItem(
        "last_order_data",
        JSON.stringify(orderDataForEmail),
      );

      // Step 4: Redirect to success page
      router.push("/checkout/success");
    } catch (err) {
      console.error("[handleSubmit]", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    background:
      focused === field ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
    border: `1px solid ${focused === field ? "#0D6EFD" : "rgba(14,99,214,0.2)"}`,
    boxShadow: focused === field ? "0 0 0 3px rgba(13,110,253,0.1)" : "none",
    padding: "10px 14px",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12,
    color: "#0a2540",
    outline: "none",
    borderRadius: 6,
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    letterSpacing: "0.3px",
    boxSizing: "border-box" as const,
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9,
    color: "#4a6a8a",
    letterSpacing: "1.5px",
    marginBottom: 5,
  };

  const canSubmit = (() => {
    if (paymentMethod === "gcash" || paymentMethod === "maya") return !!receipt;
    if (paymentMethod === "bank") return !!selectedBank && !!receipt;
    if (paymentMethod === "card")
      return (
        cardData.email &&
        cardData.name &&
        cardData.number &&
        cardData.expiry &&
        cardData.cvc
      );
    return false;
  })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800;900&family=Share+Tech+Mono&display=swap');
        ::placeholder { color: rgba(74,106,138,0.45) !important; font-family: 'Share Tech Mono', monospace; font-size: 11px; }
        .co-page { min-height: 100vh; background: radial-gradient(ellipse 700px 500px at 10% 20%, rgba(99,179,237,0.2) 0%, transparent 70%), radial-gradient(ellipse 500px 600px at 90% 70%, rgba(147,197,253,0.18) 0%, transparent 70%), linear-gradient(160deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%); font-family: 'Share Tech Mono', monospace; color: #1e3a5f; position: relative; overflow-x: hidden; }
        .co-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(60px); animation: orb-float 12s ease-in-out infinite alternate; }
        .co-content { position: relative; z-index: 2; }
        .co-topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 28px; border-bottom: 1px solid rgba(14,99,214,0.12); background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); font-size: 10px; letter-spacing: 1.5px; color: #4a6a8a; }
        .co-topbar-left { display: flex; align-items: center; gap: 20px; }
        .co-topbar-status { display: flex; align-items: center; gap: 6px; color: #1d6fd8; font-weight: 700; }
        .co-hero { padding: 24px 28px 18px; border-bottom: 1px solid rgba(14,99,214,0.1); background: rgba(255,255,255,0.55); backdrop-filter: blur(8px); }
        .co-eyebrow { font-size: 9px; color: #1d6fd8; letter-spacing: 3px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .co-eyebrow-line { width: 28px; height: 1px; background: #1d6fd8; opacity: 0.5; }
        .co-title { font-family: 'Exo 2', sans-serif; font-size: clamp(26px, 4vw, 42px); font-weight: 900; line-height: 0.95; letter-spacing: -1px; color: #0a2540; }
        .co-title .co-accent { color: #0D6EFD; }
        .co-body { max-width: 1040px; margin: 0 auto; padding: 24px 28px 40px; display: grid; grid-template-columns: 1fr 1.05fr; gap: 20px; align-items: start; }
        @media (max-width: 768px) { .co-body { grid-template-columns: 1fr; } }
        .co-panel { background: rgba(255,255,255,0.65); border: 1px solid rgba(14,99,214,0.15); border-radius: 14px; backdrop-filter: blur(8px); overflow: hidden; position: relative; }
        .co-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #0D6EFD 50%, transparent); opacity: 0.4; }
        .co-panel-head { padding: 14px 18px; border-bottom: 1px solid rgba(14,99,214,0.1); background: rgba(255,255,255,0.5); font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 700; color: #0a2540; letter-spacing: 0.3px; display: flex; align-items: center; gap: 8px; }
        .co-panel-head .icon { font-size: 14px; opacity: 0.7; }
        .co-panel-body { padding: 18px; }
        .co-line { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(14,99,214,0.08); }
        .co-line:last-child { border-bottom: none; }
        .co-line-name { font-size: 11px; color: #1e3a5f; }
        .co-line-meta { font-size: 9px; color: #6a90b4; letter-spacing: 0.5px; margin-top: 2px; }
        .co-line-price { font-family: 'Exo 2', sans-serif; font-size: 16px; font-weight: 800; color: #0a2540; letter-spacing: -0.5px; white-space: nowrap; }
        .co-divider { height: 1px; background: rgba(14,99,214,0.12); margin: 12px 0; }
        .co-total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0 0; }
        .co-total-label { font-family: 'Exo 2', sans-serif; font-size: 12px; font-weight: 700; color: #0a2540; letter-spacing: 0.3px; }
        .co-total-price { font-family: 'Exo 2', sans-serif; font-size: 24px; font-weight: 900; color: #0D6EFD; letter-spacing: -0.5px; }
        .co-spec-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
        .co-chip { padding: 3px 8px; background: rgba(219,234,254,0.6); border: 1px solid rgba(14,99,214,0.18); border-radius: 5px; font-size: 9px; color: #0C447C; font-weight: 700; letter-spacing: 0.5px; }
        .co-trust { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(14,99,214,0.1); }
        .co-trust-item { display: flex; align-items: center; gap: 5px; font-size: 9px; color: #4a6a8a; letter-spacing: 0.5px; }
        .co-field-group { display: flex; flex-direction: column; gap: 14px; }
        .co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .co-submit { width: 100%; padding: 14px 0; margin-top: 16px; background: linear-gradient(135deg, #0D6EFD, #0090FF); color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.15s, box-shadow 0.2s, gap 0.15s; }
        .co-submit:hover:not(:disabled) { background: linear-gradient(135deg, #0C447C, #0D6EFD); box-shadow: 0 8px 24px rgba(13,110,253,0.35); gap: 12px; }
        .co-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .co-secure-note { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 9px; color: #4a6a8a; letter-spacing: 0.8px; }
        .co-skel { height: 16px; border-radius: 4px; background: linear-gradient(90deg, rgba(219,234,254,0.6) 25%, rgba(191,219,254,0.4) 50%, rgba(219,234,254,0.6) 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; margin-bottom: 8px; }

        /* Payment method tabs */
        .pm-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 18px; }
        .pm-tab { padding: 8px 4px; border: 1px solid rgba(14,99,214,0.2); border-radius: 8px; background: rgba(255,255,255,0.5); cursor: pointer; text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 1px; color: #4a6a8a; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .pm-tab:hover { border-color: #0D6EFD; color: #0D6EFD; background: rgba(219,234,254,0.4); }
        .pm-tab.active { border-color: #0D6EFD; background: rgba(13,110,253,0.08); color: #0D6EFD; box-shadow: 0 0 0 2px rgba(13,110,253,0.15); }
        .pm-tab .pm-icon { font-size: 18px; }

        /* GCash / Maya info box */
        .ewallet-box { background: rgba(219,234,254,0.35); border: 1px solid rgba(14,99,214,0.18); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; }
        .ewallet-number { font-family: 'Exo 2', sans-serif; font-size: 22px; font-weight: 900; color: #0C447C; letter-spacing: 2px; margin: 4px 0; }
        .ewallet-name { font-size: 9px; color: #4a6a8a; letter-spacing: 1px; }
        .ewallet-amount { display: inline-block; margin-top: 8px; padding: 4px 10px; background: rgba(13,110,253,0.1); border-radius: 4px; font-size: 11px; color: #0D6EFD; font-weight: 700; letter-spacing: 0.5px; }

        /* Bank grid */
        .bank-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px; margin-bottom: 14px; }
        .bank-item { padding: 9px 10px; border: 1px solid rgba(14,99,214,0.18); border-radius: 8px; background: rgba(255,255,255,0.6); cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .bank-item:hover { border-color: #0D6EFD; background: rgba(219,234,254,0.4); }
        .bank-item.selected { border-color: #0D6EFD; background: rgba(13,110,253,0.08); box-shadow: 0 0 0 2px rgba(13,110,253,0.15); }
        .bank-badge { width: 32px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: 'Exo 2', sans-serif; font-size: 8px; font-weight: 900; color: #fff; flex-shrink: 0; }
        .bank-label { font-size: 9px; color: #1e3a5f; letter-spacing: 0.3px; line-height: 1.3; }
        .bank-abbr { font-family: 'Exo 2', sans-serif; font-size: 11px; font-weight: 800; color: #0a2540; }

        /* Upload receipt */
        .upload-zone { border: 2px dashed rgba(14,99,214,0.3); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(219,234,254,0.15); position: relative; overflow: hidden; }
        .upload-zone:hover { border-color: #0D6EFD; background: rgba(219,234,254,0.3); }
        .upload-zone.has-file { border-color: #0D6EFD; background: rgba(13,110,253,0.05); border-style: solid; }
        .upload-preview { max-width: 100%; max-height: 140px; border-radius: 6px; object-fit: contain; margin: 8px auto 0; display: block; }
        .upload-label-text { font-size: 10px; color: #4a6a8a; letter-spacing: 1px; margin-top: 6px; }
        .upload-icon { font-size: 28px; margin-bottom: 4px; }

        .section-fade { animation: fadeSlideIn 0.25s ease both; }
      `}</style>

      <div className="co-page">
        <GridBg />
        <div
          className="co-orb"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)",
            top: -80,
            left: -80,
          }}
        />
        <div
          className="co-orb"
          style={{
            width: 350,
            height: 350,
            background:
              "radial-gradient(circle, rgba(147,197,253,0.14) 0%, transparent 70%)",
            bottom: 80,
            right: -60,
            animationDelay: "-6s",
          }}
        />

        <div className="co-content">
          <Navigation />

          <div className="co-topbar">
            <div className="co-topbar-left">
              <span className="co-topbar-status">
                <PingDot /> SECURE CHECKOUT
              </span>
              <span>SYS.UTC {timeStr}</span>
            </div>
            <span>SSL ENCRYPTED // PCI COMPLIANT</span>
          </div>

          <div className="co-hero">
            <div className="co-eyebrow">
              <span className="co-eyebrow-line" />
              ORDER CONFIRMATION
            </div>
            <h1 className="co-title">
              COMPLETE<span className="co-accent"> PURCHASE</span>
            </h1>
          </div>

          <div className="co-body">
            {/* Left: Order Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <EsimChip />

              <div className="co-panel">
                <div className="co-panel-head">
                  <span className="icon">◈</span> ORDER SUMMARY
                </div>
                <div className="co-panel-body">
                  {plan ? (
                    <>
                      <div className="co-line">
                        <div>
                          <div className="co-line-name">{plan.name}</div>
                          <div className="co-line-meta">
                            {plan.destinationName
                              ? plan.destinationName.toUpperCase()
                              : "ESIM PLAN"}{" "}
                            · {plan.duration.toUpperCase()}
                          </div>
                          <div className="co-spec-row">
                            <span className="co-chip">{plan.data}</span>
                            <span className="co-chip">{plan.duration}</span>
                            {plan.popular && (
                              <span className="co-chip">★ TOP PICK</span>
                            )}
                          </div>
                        </div>
                        <div className="co-line-price">₱{plan.price}</div>
                      </div>

                      <div className="co-divider" />

                      <div className="co-total-row">
                        <span className="co-total-label">TOTAL</span>
                        <span className="co-total-price">
                          ₱{total.toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="co-skel" style={{ width: "60%" }} />
                      <div className="co-skel" style={{ width: "40%" }} />
                      <div
                        className="co-skel"
                        style={{ width: "80%", marginTop: 16 }}
                      />
                    </>
                  )}
                </div>
              </div>

              {plan && plan.features.length > 0 && (
                <div className="co-panel">
                  <div className="co-panel-head">
                    <span className="icon">✓</span> PLAN INCLUDES
                  </div>
                  <div className="co-panel-body" style={{ paddingTop: 12 }}>
                    {plan.features.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 0",
                          borderBottom:
                            i < plan.features.length - 1
                              ? "1px solid rgba(14,99,214,0.07)"
                              : "none",
                          fontSize: 11,
                          color: "#1e3a5f",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#1d6fd8",
                            flexShrink: 0,
                            opacity: 0.7,
                          }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Payment */}
            <div className="co-panel">
              <div className="co-panel-head">
                <span className="icon">▣</span> PAYMENT METHOD
              </div>
              <div className="co-panel-body">
                {/* Method tabs */}
                <div className="pm-tabs">
                  {/* GCash */}
                  <button
                    className={`pm-tab ${paymentMethod === "gcash" ? "active" : ""}`}
                    onClick={() => {
                      setPaymentMethod("gcash");
                      setSelectedBank(null);
                      setReceipt(null);
                      setReceiptPreview(null);
                    }}
                  >
                    <svg
                      width="34"
                      height="20"
                      viewBox="0 0 68 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="68"
                        height="40"
                        rx="8"
                        fill={paymentMethod === "gcash" ? "#007DFE" : "#e0ecff"}
                      />
                      <text
                        x="34"
                        y="27"
                        textAnchor="middle"
                        fontFamily="Arial Black, sans-serif"
                        fontWeight="900"
                        fontSize="16"
                        fill={paymentMethod === "gcash" ? "white" : "#007DFE"}
                        letterSpacing="-0.5"
                      >
                        GCash
                      </text>
                    </svg>
                    GCASH
                  </button>
                  {/* Maya */}
                  <button
                    className={`pm-tab ${paymentMethod === "maya" ? "active" : ""}`}
                    onClick={() => {
                      setPaymentMethod("maya");
                      setSelectedBank(null);
                      setReceipt(null);
                      setReceiptPreview(null);
                    }}
                  >
                    <svg
                      width="34"
                      height="20"
                      viewBox="0 0 68 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                        fontFamily="Arial Black, sans-serif"
                        fontWeight="900"
                        fontSize="16"
                        fill={paymentMethod === "maya" ? "white" : "#00B388"}
                        letterSpacing="-0.5"
                      >
                        Maya
                      </text>
                    </svg>
                    MAYA
                  </button>
                  {/* Bank */}
                  <button
                    className={`pm-tab ${paymentMethod === "bank" ? "active" : ""}`}
                    onClick={() => {
                      setPaymentMethod("bank");
                      setSelectedBank(null);
                      setReceipt(null);
                      setReceiptPreview(null);
                    }}
                  >
                    <svg
                      width="28"
                      height="24"
                      viewBox="0 0 28 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 10h24M14 2L2 10h24L14 2z"
                        stroke={
                          paymentMethod === "bank" ? "#0C447C" : "#4a6a8a"
                        }
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="4"
                        y="10"
                        width="3"
                        height="9"
                        rx="0.5"
                        fill={paymentMethod === "bank" ? "#0C447C" : "#4a6a8a"}
                      />
                      <rect
                        x="10.5"
                        y="10"
                        width="3"
                        height="9"
                        rx="0.5"
                        fill={paymentMethod === "bank" ? "#0C447C" : "#4a6a8a"}
                      />
                      <rect
                        x="17"
                        y="10"
                        width="3"
                        height="9"
                        rx="0.5"
                        fill={paymentMethod === "bank" ? "#0C447C" : "#4a6a8a"}
                      />
                      <rect
                        x="2"
                        y="20"
                        width="24"
                        height="2.5"
                        rx="0.5"
                        fill={paymentMethod === "bank" ? "#0C447C" : "#4a6a8a"}
                      />
                    </svg>
                    BANK
                  </button>
                  {/* Card */}
                  <button
                    className={`pm-tab ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => {
                      setPaymentMethod("card");
                      setSelectedBank(null);
                      setReceipt(null);
                      setReceiptPreview(null);
                    }}
                  >
                    <svg
                      width="32"
                      height="22"
                      viewBox="0 0 32 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="30"
                        height="20"
                        rx="3"
                        stroke={
                          paymentMethod === "card" ? "#0D6EFD" : "#4a6a8a"
                        }
                        strokeWidth="1.8"
                        fill={
                          paymentMethod === "card"
                            ? "rgba(13,110,253,0.08)"
                            : "none"
                        }
                      />
                      <rect
                        x="1"
                        y="6"
                        width="30"
                        height="5"
                        fill={paymentMethod === "card" ? "#0D6EFD" : "#4a6a8a"}
                        opacity="0.35"
                      />
                      <rect
                        x="4"
                        y="15"
                        width="9"
                        height="2.5"
                        rx="1"
                        fill={paymentMethod === "card" ? "#0D6EFD" : "#4a6a8a"}
                        opacity="0.7"
                      />
                      <rect
                        x="15"
                        y="15"
                        width="5"
                        height="2.5"
                        rx="1"
                        fill={paymentMethod === "card" ? "#0D6EFD" : "#4a6a8a"}
                        opacity="0.7"
                      />
                    </svg>
                    CARD
                  </button>
                </div>

                {/* GCash */}
                {paymentMethod === "gcash" && (
                  <div className="section-fade">
                    <div className="ewallet-box">
                      <div className="ewallet-name">
                        SEND PAYMENT TO GCASH NUMBER
                      </div>
                      <div className="ewallet-number">0945 675 4591</div>
                      <div className="ewallet-name">
                        ACCOUNT NAME: [MERCHANT NAME]
                      </div>
                      {plan && (
                        <div className="ewallet-amount">
                          AMOUNT: ₱{total.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#4a6a8a",
                        letterSpacing: "0.5px",
                        marginBottom: 12,
                      }}
                    >
                      Send the exact amount then upload your GCash screenshot
                      below.
                    </div>
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
                      className="ewallet-box"
                      style={{
                        background: "rgba(220,252,231,0.35)",
                        border: "1px solid rgba(22,163,74,0.2)",
                      }}
                    >
                      <div
                        className="ewallet-name"
                        style={{ color: "#166534" }}
                      >
                        SEND PAYMENT TO MAYA NUMBER
                      </div>
                      <div
                        className="ewallet-number"
                        style={{ color: "#166534" }}
                      >
                        0945 675 4591
                      </div>
                      <div
                        className="ewallet-name"
                        style={{ color: "#4ade80" }}
                      >
                        ACCOUNT NAME: [MERCHANT NAME]
                      </div>
                      {plan && (
                        <div
                          className="ewallet-amount"
                          style={{
                            background: "rgba(22,163,74,0.1)",
                            color: "#16a34a",
                          }}
                        >
                          AMOUNT: ₱{total.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#4a6a8a",
                        letterSpacing: "0.5px",
                        marginBottom: 12,
                      }}
                    >
                      Send the exact amount then upload your Maya screenshot
                      below.
                    </div>
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
                    <div
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 9,
                        color: "#4a6a8a",
                        letterSpacing: "1.5px",
                        marginBottom: 8,
                      }}
                    >
                      SELECT YOUR BANK
                    </div>
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
                          <div className="bank-label">
                            <div className="bank-abbr">{bank.abbr}</div>
                            <div
                              style={{
                                fontSize: 8,
                                color: "#6a90b4",
                                marginTop: 1,
                              }}
                            >
                              {bank.name.split(" ").slice(0, 2).join(" ")}
                            </div>
                          </div>
                          {selectedBank === bank.id && (
                            <span
                              style={{
                                marginLeft: "auto",
                                color: "#0D6EFD",
                                fontSize: 14,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedBank && (
                      <div className="section-fade">
                        <div
                          className="ewallet-box"
                          style={{ marginBottom: 12 }}
                        >
                          <div className="ewallet-name">
                            BANK TRANSFER DETAILS —{" "}
                            {BANKS.find(
                              (b) => b.id === selectedBank,
                            )?.name.toUpperCase()}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#0C447C",
                              letterSpacing: 1,
                              margin: "6px 0 2px",
                            }}
                          >
                            ACCT: 1234-5678-9012
                          </div>
                          <div className="ewallet-name">
                            ACCOUNT NAME: [MERCHANT NAME]
                          </div>
                          {plan && (
                            <div className="ewallet-amount">
                              AMOUNT: ₱{total.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#4a6a8a",
                            letterSpacing: "0.5px",
                            marginBottom: 12,
                          }}
                        >
                          Transfer the exact amount then upload your deposit
                          slip or screenshot below.
                        </div>
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
                    <div className="co-field-group">
                      <div>
                        <label style={labelStyle}>EMAIL ADDRESS</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={cardData.email}
                          onChange={(e) =>
                            setCardData({ ...cardData, email: e.target.value })
                          }
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("email")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CARD HOLDER NAME</label>
                        <input
                          type="text"
                          placeholder="Juan Dela Cruz"
                          value={cardData.name}
                          onChange={(e) =>
                            setCardData({ ...cardData, name: e.target.value })
                          }
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("name")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CARD NUMBER</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            placeholder="4532 1234 5678 9010"
                            value={cardData.number}
                            onChange={(e) => {
                              const raw = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16);
                              const fmt = raw.replace(/(.{4})/g, "$1 ").trim();
                              setCardData({ ...cardData, number: fmt });
                            }}
                            onFocus={() => setFocused("number")}
                            onBlur={() => setFocused(null)}
                            style={{
                              ...inputStyle("number"),
                              paddingRight: 44,
                            }}
                          />
                          <svg
                            width="22"
                            height="16"
                            viewBox="0 0 22 16"
                            style={{
                              position: "absolute",
                              right: 12,
                              top: "50%",
                              transform: "translateY(-50%)",
                              opacity: 0.5,
                            }}
                          >
                            <rect
                              x="0"
                              y="0"
                              width="22"
                              height="16"
                              rx="3"
                              fill="#1d6fd8"
                            />
                            <rect
                              x="0"
                              y="4"
                              width="22"
                              height="4"
                              fill="#0a2540"
                              opacity="0.5"
                            />
                            <rect
                              x="3"
                              y="10"
                              width="10"
                              height="2"
                              rx="1"
                              fill="rgba(255,255,255,0.6)"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="co-row">
                        <div>
                          <label style={labelStyle}>EXPIRY DATE</label>
                          <input
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
                            style={inputStyle("expiry")}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>CVC / CVV</label>
                          <input
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
                            style={inputStyle("cvc")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="co-submit"
                  disabled={submitting || !canSubmit}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <>PROCESSING… ◌</>
                  ) : (
                    <>
                      COMPLETE PURCHASE {plan ? `— ₱${total.toFixed(2)}` : ""} ›
                    </>
                  )}
                </button>

                <div className="co-secure-note">
                  <span>🔒</span>
                  <span>256-BIT SSL ENCRYPTED · SECURE PAYMENT</span>
                </div>
                <div className="co-trust">
                  {[
                    "⚡ INSTANT ACTIVATION",
                    "🌐 NO SIM SWAP",
                    "💬 24/7 SUPPORT",
                  ].map((t) => (
                    <span key={t} className="co-trust-item">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Upload Receipt sub-component */
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
      <div
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9,
          color: "#4a6a8a",
          letterSpacing: "1.5px",
          marginBottom: 6,
        }}
      >
        UPLOAD PAYMENT RECEIPT
      </div>
      <div
        className={`upload-zone ${receipt ? "has-file" : ""}`}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Receipt" className="upload-preview" />
            <div className="upload-label-text" style={{ color: "#0D6EFD" }}>
              ✓ {receipt?.name} · TAP TO CHANGE
            </div>
          </>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <div
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#0C447C",
              }}
            >
              Upload Receipt / Screenshot
            </div>
            <div className="upload-label-text">
              TAP TO BROWSE · JPG, PNG, PDF
            </div>
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
