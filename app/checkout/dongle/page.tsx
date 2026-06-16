"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/nav";

// ─── Types ────────────────────────────────────────────────────────────────────
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

interface AuthUser {
  name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  mobile?: string;
}

type PaymentMethod = "gcash" | "maya" | "bank";
type DeliveryMethod = "pickup" | "delivery";

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

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9,
        color: "#b0bccf",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        margin: "0 0 5px",
      }}
    >
      {children}
    </p>
  );
}

function FieldInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  prefilled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  prefilled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: focused
          ? "#ffffff"
          : prefilled && value
            ? "#f0f4fb"
            : "#fafafa",
        border: `1.5px solid ${focused ? "#1d6fd8" : prefilled && value ? "#bfd4f5" : "#e2e8f0"}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "'Sora', sans-serif",
        fontSize: 13,
        color: "#0a2540",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(29,111,216,0.1)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
        boxSizing: "border-box",
      }}
    />
  );
}

function FieldTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: focused ? "#ffffff" : "#fafafa",
        border: `1.5px solid ${focused ? "#1d6fd8" : "#e2e8f0"}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "'Sora', sans-serif",
        fontSize: 13,
        color: "#0a2540",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(29,111,216,0.1)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        resize: "vertical",
        boxSizing: "border-box",
      }}
    />
  );
}

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
      <FieldLabel>Upload Payment Receipt</FieldLabel>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px ${receipt ? "solid" : "dashed"} ${receipt ? "#1d6fd8" : "#e2e8f0"}`,
          borderRadius: 12,
          padding: "20px 16px",
          textAlign: "center",
          cursor: "pointer",
          background: receipt ? "#f0f4fb" : "#fafafa",
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Receipt"
              style={{
                maxWidth: "100%",
                maxHeight: 140,
                borderRadius: 8,
                objectFit: "contain",
                marginBottom: 8,
                display: "block",
                margin: "0 auto 8px",
              }}
            />
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "#1d6fd8",
                margin: 0,
              }}
            >
              ✓ {receipt?.name} — tap to change
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#eef3fb",
                border: "1px solid #d4dfee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#1d6fd8",
                margin: "0 auto 10px",
                fontWeight: 700,
              }}
            >
              ↑
            </div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0a2540",
                margin: "0 0 3px",
              }}
            >
              Upload screenshot or receipt
            </p>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "#b0bccf",
                margin: 0,
              }}
            >
              JPG, PNG or PDF
            </p>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DongleCheckoutPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<SelectedPlan | null>(null);

  // Customer fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Tracks which fields were prefilled from the logged-in user
  const [prefilledFields, setPrefilledFields] = useState<Set<string>>(
    new Set(),
  );
  const [userLoading, setUserLoading] = useState(true);

  // Delivery
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gcash");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Load plan ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("selected_plan");
    if (raw) {
      try {
        setPlan(JSON.parse(raw));
      } catch {}
    }
  }, []);

  // ── Autofill from logged-in user ──────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) return; // not logged in — silently skip

        const data = await res.json();
        const user: AuthUser = data.user ?? data;

        const filled = new Set<string>();

        // name — try common field names from Laravel user model
        const name = user.name?.trim();
        if (name) {
          setCustomerName(name);
          filled.add("name");
        }

        // email
        const email = user.email?.trim();
        if (email) {
          setCustomerEmail(email);
          filled.add("email");
        }

        // phone — Laravel models vary: phone, phone_number, mobile
        const phone = (user.phone ?? user.phone_number ?? user.mobile)?.trim();
        if (phone) {
          setCustomerPhone(phone);
          filled.add("phone");
        }

        setPrefilledFields(filled);
      } catch {
        // network error or not authenticated — ignore
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceipt(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const resetPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setSelectedBank(null);
    setReceipt(null);
    setReceiptPreview(null);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerName.trim()) e.customerName = "Full name is required.";
    if (!customerEmail.trim()) e.customerEmail = "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
      e.customerEmail = "Enter a valid email.";
    if (deliveryMethod === "delivery" && !deliveryAddress.trim())
      e.deliveryAddress = "Delivery address is required.";
    if (paymentMethod === "bank" && !selectedBank) e.bank = "Select your bank.";
    if (!receipt) e.receipt = "Payment receipt is required.";
    return e;
  };

  const canSubmit =
    !!plan &&
    !!customerName.trim() &&
    !!customerEmail.trim() &&
    (deliveryMethod === "pickup" || !!deliveryAddress.trim()) &&
    (paymentMethod !== "bank" || !!selectedBank) &&
    !!receipt;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (!plan) return;

    setSubmitting(true);
    setErrors({});

    try {
      const orderRes = await fetch("/api/product-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: Number(plan.id),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || undefined,
          delivery_method: deliveryMethod,
          delivery_address:
            deliveryMethod === "delivery" ? deliveryAddress : undefined,
          quantity: 1,
          notes: notes || undefined,
          payment_method: paymentMethod,
          bank_name: paymentMethod === "bank" ? selectedBank : undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setErrors({
          _global: orderData.message ?? "Order failed. Please try again.",
        });
        return;
      }

      const orderId = orderData.order?.id;

      if (receipt && orderId) {
        const fd = new FormData();
        fd.append("receipt", receipt);
        const receiptRes = await fetch(
          `/api/product-orders/${orderId}/receipt`,
          {
            method: "POST",
            credentials: "include",
            body: fd,
          },
        );
        if (!receiptRes.ok) {
          const rd = await receiptRes.json();
          setErrors({ _global: rd.message ?? "Receipt upload failed." });
          return;
        }
      }

      sessionStorage.setItem(
        "last_dongle_order",
        JSON.stringify({
          id: orderId,
          reference_number: orderData.order?.reference_number,
          customer_name: customerName,
          customer_email: customerEmail,
          delivery_method: deliveryMethod,
          delivery_address: deliveryAddress,
          plan_name: plan.name,
          total_price: plan.price,
        }),
      );

      router.push("/checkout/dongle/success");
    } catch (err) {
      console.error(err);
      setErrors({ _global: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const total = plan?.price ?? 0;
  const fmtPrice = (n: number) =>
    n.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ping    { 0% { transform:scale(1); opacity:0.5; } 100% { transform:scale(2.2); opacity:0; } }
        @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

        *, *::before, *::after { box-sizing: border-box; }

        .dco-page { min-height: 100vh; background: #f5f5f0; font-family: 'Sora', sans-serif; color: #0a2540; }

        .dco-status {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 32px;
          font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1.5px;
        }
        .dco-status-live { display: flex; align-items: center; gap: 8px; color: #1d6fd8; font-weight: 500; }
        .ping { position: relative; display: inline-flex; width: 7px; height: 7px; flex-shrink: 0; }
        .ping-ring { position: absolute; inset: 0; border-radius: 50%; background: #1d6fd8; opacity: .4; animation: ping 1.6s ease-out infinite; }
        .ping-dot  { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #1d6fd8; }

        .dco-hero { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 28px 32px 22px; }
        .dco-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'IBM Plex Mono', monospace; font-size: 9px;
          color: #1d6fd8; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 10px;
        }
        .dco-eyebrow-line { display: inline-block; width: 14px; height: 1px; background: #1d6fd8; }
        .dco-hero h1 { margin: 0; font-size: clamp(22px, 3vw, 34px); font-weight: 800; color: #0a2540; letter-spacing: -0.5px; }
        .dco-hero p  { margin: 6px 0 0; font-size: 13px; color: #b0bccf; }
        .dco-crumb {
          display: flex; align-items: center; gap: 6px; margin-top: 14px;
          font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1px;
        }
        .dco-crumb-active { color: #1d6fd8; font-weight: 500; }
        .dco-crumb-sep { color: #e2e8f0; }

        .dco-body {
          max-width: 1080px; margin: 0 auto; padding: 28px 32px 56px;
          display: grid; grid-template-columns: 1fr 1.1fr; gap: 20px; align-items: start;
        }
        @media (max-width: 768px) {
          .dco-body { grid-template-columns: 1fr; padding: 20px 16px 40px; }
        }

        .dco-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; animation: fadeUp 0.35s ease both; }
        .dco-panel + .dco-panel { margin-top: 14px; }
        .dco-panel-head { padding: 14px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; }
        .dco-panel-title { font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 500; color: #1d6fd8; letter-spacing: 2px; text-transform: uppercase; }
        .dco-panel-badge { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: #b0bccf; letter-spacing: 1px; }
        .dco-panel-body { padding: 20px; }

        .dco-order-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px; }
        .dco-plan-name { font-size: 15px; font-weight: 700; color: #0a2540; margin-bottom: 3px; }
        .dco-plan-dest { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1px; margin-bottom: 10px; }
        .dco-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .dco-chip { padding: 3px 9px; background: #f0f4fb; border: 1px solid #d4dfee; border-radius: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #1d6fd8; font-weight: 500; letter-spacing: 0.3px; }
        .dco-price-large { font-size: 20px; font-weight: 800; color: #0a2540; white-space: nowrap; }
        .dco-total-row { display: flex; align-items: center; justify-content: space-between; }
        .dco-total-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1.5px; }
        .dco-total-price { font-size: 26px; font-weight: 800; color: #1d6fd8; }

        .dco-delivery-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .dco-dtab { padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: border-color 0.15s, background 0.15s, box-shadow 0.15s; }
        .dco-dtab:hover  { border-color: #1d6fd8; background: #f0f4fb; }
        .dco-dtab.active { border-color: #1d6fd8; background: #f0f4fb; box-shadow: 0 0 0 3px rgba(29,111,216,0.1); }
        .dco-dtab-icon  { font-size: 20px; flex-shrink: 0; }
        .dco-dtab-label { font-size: 12px; font-weight: 700; color: #0a2540; }
        .dco-dtab-sub   { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; margin-top: 1px; }

        .dco-pm-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 20px; }
        .dco-pm-tab { padding: 10px 6px 8px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 5px; transition: border-color 0.15s, background 0.15s, box-shadow 0.15s; }
        .dco-pm-tab:hover  { border-color: #1d6fd8; background: #f0f4fb; }
        .dco-pm-tab.active { border-color: #1d6fd8; background: #f0f4fb; box-shadow: 0 0 0 3px rgba(29,111,216,0.1); }
        .dco-pm-tab-label  { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 1px; color: #b0bccf; }
        .dco-pm-tab.active .dco-pm-tab-label { color: #1d6fd8; }

        .dco-ew-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; margin-bottom: 16px; }
        .dco-ew-label  { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1.5px; margin: 0 0 4px; }
        .dco-ew-number { font-size: 22px; font-weight: 800; color: #0a2540; letter-spacing: 1px; margin-bottom: 3px; }
        .dco-ew-name   { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 0.5px; margin: 0; }
        .dco-ew-amount { display: inline-block; margin-top: 10px; padding: 4px 10px; background: #eef3fb; border: 1px solid #d4dfee; border-radius: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #1d6fd8; font-weight: 500; }
        .dco-ew-hint   { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 0.5px; margin: 0 0 14px; line-height: 1.6; }

        .dco-bank-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px; margin-bottom: 16px; }
        .dco-bank-item { padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; display: flex; align-items: center; gap: 9px; transition: border-color 0.15s, background 0.15s; }
        .dco-bank-item:hover    { border-color: #1d6fd8; background: #f8fafc; }
        .dco-bank-item.selected { border-color: #1d6fd8; background: #f0f4fb; box-shadow: 0 0 0 2px rgba(29,111,216,0.12); }
        .dco-bank-badge { width: 34px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-size: 7px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .dco-bank-name  { font-size: 11px; font-weight: 600; color: #0a2540; line-height: 1.2; }
        .dco-bank-sub   { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: #b0bccf; margin-top: 1px; }
        .dco-bank-check { margin-left: auto; color: #1d6fd8; font-size: 13px; flex-shrink: 0; }

        .dco-field-group { display: flex; flex-direction: column; gap: 14px; }
        .dco-field-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: end; }
        .dco-field-wrap  { display: flex; flex-direction: column; }
        .dco-field-error { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #dc2626; margin: 4px 0 0; }

        /* Prefill badge */
        .dco-prefill-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-family: 'IBM Plex Mono', monospace; font-size: 8px;
          color: #1d6fd8; letter-spacing: 0.5px;
          margin-bottom: 4px; animation: fadeIn 0.3s ease;
        }
        .dco-prefill-dot { width: 4px; height: 4px; border-radius: 50%; background: #1d6fd8; }

        /* Autofill banner */
        .dco-autofill-banner {
          display: flex; align-items: center; gap: 10px;
          background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;
          padding: 10px 14px; margin-bottom: 18px;
          font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #1d40af;
          letter-spacing: 0.5px; line-height: 1.5;
          animation: fadeIn 0.4s ease;
        }
        .dco-autofill-icon { font-size: 16px; flex-shrink: 0; }

        .dco-trust { display: flex; gap: 10px; flex-wrap: wrap; padding: 12px 20px; border-top: 1px solid #e2e8f0; background: #fafafa; }
        .dco-trust-item { display: flex; align-items: center; gap: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; }
        .dco-trust-dot  { width: 5px; height: 5px; border-radius: 50%; background: #1d6fd8; opacity: .5; flex-shrink: 0; }

        .dco-feat-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 12px; color: #0a2540; border-bottom: 1px solid #f5f5f0; }
        .dco-feat-item:last-child { border-bottom: none; }
        .dco-feat-dot  { width: 5px; height: 5px; border-radius: 50%; background: #1d6fd8; opacity: .6; flex-shrink: 0; }

        .dco-submit {
          width: 100%; padding: 14px 20px; margin-top: 20px;
          background: #0057ff; color: #fff; border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: space-between;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .dco-submit:hover:not(:disabled) { background: #0040cc; box-shadow: 0 8px 24px rgba(0,87,255,0.25); transform: translateY(-1px); }
        .dco-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .dco-submit-arrow { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .dco-secure { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 1px; }

        .dco-global-err { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #991b1b; }

        .dco-divider { display: flex; align-items: center; gap: 8px; margin: 18px 0 14px; }
        .dco-divider-line  { flex: 1; height: 1px; background: #e2e8f0; }
        .dco-divider-label { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: #b0bccf; letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; }

        .dco-skel { height: 14px; border-radius: 5px; background: linear-gradient(90deg,#f0f4f8 25%,#e8eef6 50%,#f0f4f8 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; margin-bottom: 10px; }

        /* Field skeleton while user loads */
        .dco-field-skel { height: 40px; border-radius: 8px; background: linear-gradient(90deg,#f0f4f8 25%,#e8eef6 50%,#f0f4f8 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; }

        .section-fade { animation: fadeUp 0.2s ease both; }
      `}</style>

      <div className="dco-page">
        <Navigation />

        {/* Status bar */}
        <div className="dco-status">
          <div className="dco-status-live">
            <span className="ping">
              <span className="ping-ring" />
              <span className="ping-dot" />
            </span>
            Secure checkout
          </div>
          <span>256-bit SSL encrypted · PCI compliant</span>
        </div>

        {/* Hero */}
        <div className="dco-hero">
          <div className="dco-eyebrow">
            <span className="dco-eyebrow-line" />
            USB-C Dongle — Complete your order
          </div>
          <h1>Dongle Checkout</h1>
          <p>Fill in your details and choose a payment method below.</p>
          <div className="dco-crumb">
            <span>Dongle</span>
            <span className="dco-crumb-sep">›</span>
            <span className="dco-crumb-active">Checkout</span>
          </div>
        </div>

        <div className="dco-body">
          {/* ── LEFT ── */}
          <div>
            <div className="dco-panel">
              <div className="dco-panel-head">
                <span className="dco-panel-title">Order Summary</span>
                <span className="dco-panel-badge">1 item</span>
              </div>
              <div className="dco-panel-body">
                {plan ? (
                  <>
                    <div className="dco-order-row">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="dco-plan-name">{plan.name}</div>
                        <div className="dco-plan-dest">
                          {(
                            plan.destinationName ??
                            "MAINLAND CHINA · HK · MACAU"
                          ).toUpperCase()}{" "}
                          · USB-C DONGLE
                        </div>
                        <div className="dco-chips">
                          <span className="dco-chip">{plan.data}</span>
                          <span className="dco-chip">{plan.duration}</span>
                          <span className="dco-chip">🇵🇭 PH delivery</span>
                          {plan.popular && (
                            <span className="dco-chip">★ Top pick</span>
                          )}
                        </div>
                      </div>
                      <div className="dco-price-large">
                        ₱{fmtPrice(plan.price)}
                      </div>
                    </div>
                    <div className="dco-total-row">
                      <span className="dco-total-label">Total due</span>
                      <span className="dco-total-price">
                        ₱{fmtPrice(total)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dco-skel" style={{ width: "55%" }} />
                    <div className="dco-skel" style={{ width: "35%" }} />
                    <div
                      className="dco-skel"
                      style={{ width: "70%", marginTop: 16 }}
                    />
                  </>
                )}
              </div>
              <div className="dco-trust">
                {[
                  "📦 Ships to Philippines",
                  "🔌 Plug & play USB-C",
                  "💬 24/7 support",
                ].map((t) => (
                  <span key={t} className="dco-trust-item">
                    <span className="dco-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {plan && plan.features.length > 0 && (
              <div className="dco-panel">
                <div className="dco-panel-head">
                  <span className="dco-panel-title">Package includes</span>
                </div>
                <div
                  className="dco-panel-body"
                  style={{ paddingTop: 12, paddingBottom: 12 }}
                >
                  {plan.features.map((f, i) => (
                    <div key={i} className="dco-feat-item">
                      <span className="dco-feat-dot" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="dco-panel" style={{ marginTop: 14 }}>
              <div
                className="dco-panel-body"
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
                  📦
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
                    Physical device — ships within Philippines
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
                    Shipped after payment confirmation. Pick-up in Metro Manila
                    also available.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="dco-panel">
            <div className="dco-panel-head">
              <span className="dco-panel-title">
                Your Details &amp; Payment
              </span>
            </div>
            <div className="dco-panel-body">
              {errors._global && (
                <div className="dco-global-err">⚠ {errors._global}</div>
              )}

              {/* Autofill banner — shown once user data loads and at least one field was filled */}
              {!userLoading && prefilledFields.size > 0 && (
                <div className="dco-autofill-banner">
                  <span className="dco-autofill-icon">👤</span>
                  <span>
                    We filled in your details from your account. You can edit
                    any field before placing your order.
                  </span>
                </div>
              )}

              {/* ── Customer info ── */}
              <div className="dco-field-group">
                <div className="dco-field-wrap">
                  {prefilledFields.has("name") && (
                    <span className="dco-prefill-badge">
                      <span className="dco-prefill-dot" />
                      from your account
                    </span>
                  )}
                  <FieldLabel>Full Name *</FieldLabel>
                  {userLoading ? (
                    <div className="dco-field-skel" />
                  ) : (
                    <FieldInput
                      value={customerName}
                      onChange={setCustomerName}
                      placeholder="Juan Dela Cruz"
                      required
                      prefilled={prefilledFields.has("name")}
                    />
                  )}
                  {errors.customerName && (
                    <p className="dco-field-error">{errors.customerName}</p>
                  )}
                </div>

                <div className="dco-field-row">
                  <div className="dco-field-wrap">
                    {prefilledFields.has("email") && (
                      <span className="dco-prefill-badge">
                        <span className="dco-prefill-dot" />
                        from your account
                      </span>
                    )}
                    <FieldLabel>Email *</FieldLabel>
                    {userLoading ? (
                      <div className="dco-field-skel" />
                    ) : (
                      <FieldInput
                        value={customerEmail}
                        onChange={setCustomerEmail}
                        placeholder="juan@email.com"
                        type="email"
                        required
                        prefilled={prefilledFields.has("email")}
                      />
                    )}
                    {errors.customerEmail && (
                      <p className="dco-field-error">{errors.customerEmail}</p>
                    )}
                  </div>
                  <div className="dco-field-wrap">
                    {prefilledFields.has("phone") && (
                      <span className="dco-prefill-badge">
                        <span className="dco-prefill-dot" />
                        from your account
                      </span>
                    )}
                    <FieldLabel>Phone (optional)</FieldLabel>
                    {userLoading ? (
                      <div className="dco-field-skel" />
                    ) : (
                      <FieldInput
                        value={customerPhone}
                        onChange={(v) => setCustomerPhone(v.replace(/\D/g, ""))}
                        placeholder="09XX XXX XXXX"
                        type="tel"
                        prefilled={prefilledFields.has("phone")}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ── Delivery ── */}
              <div className="dco-divider">
                <div className="dco-divider-line" />
                <span className="dco-divider-label">Delivery</span>
                <div className="dco-divider-line" />
              </div>

              <div className="dco-delivery-tabs">
                <div
                  className={`dco-dtab ${deliveryMethod === "pickup" ? "active" : ""}`}
                  onClick={() => setDeliveryMethod("pickup")}
                >
                  <span className="dco-dtab-icon">🏪</span>
                  <div>
                    <div className="dco-dtab-label">Pick-up</div>
                    <div className="dco-dtab-sub">Metro Manila only</div>
                  </div>
                </div>
                <div
                  className={`dco-dtab ${deliveryMethod === "delivery" ? "active" : ""}`}
                  onClick={() => setDeliveryMethod("delivery")}
                >
                  <span className="dco-dtab-icon">🚚</span>
                  <div>
                    <div className="dco-dtab-label">Delivery</div>
                    <div className="dco-dtab-sub">Nationwide · 3–5 days</div>
                  </div>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <div
                  className="dco-field-wrap section-fade"
                  style={{ marginBottom: 4 }}
                >
                  <FieldLabel>Delivery Address *</FieldLabel>
                  <FieldTextarea
                    value={deliveryAddress}
                    onChange={setDeliveryAddress}
                    placeholder="Unit/House No., Street, Barangay, City, Province, ZIP"
                    rows={3}
                  />
                  {errors.deliveryAddress && (
                    <p className="dco-field-error">{errors.deliveryAddress}</p>
                  )}
                </div>
              )}

              <div className="dco-field-wrap" style={{ marginTop: 12 }}>
                <FieldLabel>Order Notes (optional)</FieldLabel>
                <FieldTextarea
                  value={notes}
                  onChange={setNotes}
                  placeholder="Any special instructions for pick-up or delivery…"
                  rows={2}
                />
              </div>

              {/* ── Payment ── */}
              <div className="dco-divider">
                <div className="dco-divider-line" />
                <span className="dco-divider-label">Payment</span>
                <div className="dco-divider-line" />
              </div>

              <div className="dco-pm-tabs">
                <button
                  className={`dco-pm-tab ${paymentMethod === "gcash" ? "active" : ""}`}
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
                  <span className="dco-pm-tab-label">GCash</span>
                </button>
                <button
                  className={`dco-pm-tab ${paymentMethod === "maya" ? "active" : ""}`}
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
                  <span className="dco-pm-tab-label">Maya</span>
                </button>
                <button
                  className={`dco-pm-tab ${paymentMethod === "bank" ? "active" : ""}`}
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
                  <span className="dco-pm-tab-label">Bank</span>
                </button>
              </div>

              {paymentMethod === "gcash" && (
                <div className="section-fade">
                  <div className="dco-ew-box">
                    <p className="dco-ew-label">Send to GCash number</p>
                    <div className="dco-ew-number">0945 675 4591</div>
                    <p className="dco-ew-name">Account name: [Merchant Name]</p>
                    {plan && (
                      <span className="dco-ew-amount">
                        Amount: ₱{fmtPrice(total)}
                      </span>
                    )}
                  </div>
                  <p className="dco-ew-hint">
                    Send the exact amount, then upload your GCash screenshot
                    below.
                  </p>
                  <UploadReceipt
                    receipt={receipt}
                    preview={receiptPreview}
                    onFile={handleFileChange}
                    fileRef={fileRef}
                  />
                  {errors.receipt && (
                    <p className="dco-field-error">{errors.receipt}</p>
                  )}
                </div>
              )}

              {paymentMethod === "maya" && (
                <div className="section-fade">
                  <div
                    className="dco-ew-box"
                    style={{ background: "#f0faf6", borderColor: "#b6e8d6" }}
                  >
                    <p className="dco-ew-label" style={{ color: "#00935f" }}>
                      Send to Maya number
                    </p>
                    <div className="dco-ew-number">0945 675 4591</div>
                    <p className="dco-ew-name">Account name: [Merchant Name]</p>
                    {plan && (
                      <span
                        className="dco-ew-amount"
                        style={{
                          background: "#dcf5ec",
                          borderColor: "#a7e8ce",
                          color: "#00935f",
                        }}
                      >
                        Amount: ₱{fmtPrice(total)}
                      </span>
                    )}
                  </div>
                  <p className="dco-ew-hint">
                    Send the exact amount, then upload your Maya screenshot
                    below.
                  </p>
                  <UploadReceipt
                    receipt={receipt}
                    preview={receiptPreview}
                    onFile={handleFileChange}
                    fileRef={fileRef}
                  />
                  {errors.receipt && (
                    <p className="dco-field-error">{errors.receipt}</p>
                  )}
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="section-fade">
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9,
                      color: "#b0bccf",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      margin: "0 0 8px",
                    }}
                  >
                    Select your bank
                  </p>
                  <div className="dco-bank-grid">
                    {BANKS.map((bank) => (
                      <div
                        key={bank.id}
                        className={`dco-bank-item ${selectedBank === bank.id ? "selected" : ""}`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <div
                          className="dco-bank-badge"
                          style={{ background: bank.color }}
                        >
                          {bank.abbr.slice(0, 3)}
                        </div>
                        <div>
                          <div className="dco-bank-name">{bank.abbr}</div>
                          <div className="dco-bank-sub">
                            {bank.name.split(" ").slice(0, 2).join(" ")}
                          </div>
                        </div>
                        {selectedBank === bank.id && (
                          <span className="dco-bank-check">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.bank && (
                    <p className="dco-field-error" style={{ marginBottom: 10 }}>
                      {errors.bank}
                    </p>
                  )}
                  {selectedBank && (
                    <div className="section-fade">
                      <div className="dco-ew-box" style={{ marginBottom: 12 }}>
                        <p className="dco-ew-label">
                          Transfer to —{" "}
                          {BANKS.find((b) => b.id === selectedBank)?.name}
                        </p>
                        <div
                          className="dco-ew-number"
                          style={{ fontSize: 16, letterSpacing: 2 }}
                        >
                          1234-5678-9012
                        </div>
                        <p className="dco-ew-name">
                          Account name: [Merchant Name]
                        </p>
                        {plan && (
                          <span className="dco-ew-amount">
                            Amount: ₱{fmtPrice(total)}
                          </span>
                        )}
                      </div>
                      <p className="dco-ew-hint">
                        Transfer the exact amount, then upload your deposit slip
                        or screenshot below.
                      </p>
                      <UploadReceipt
                        receipt={receipt}
                        preview={receiptPreview}
                        onFile={handleFileChange}
                        fileRef={fileRef}
                      />
                      {errors.receipt && (
                        <p className="dco-field-error">{errors.receipt}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                className="dco-submit"
                disabled={submitting || !canSubmit || userLoading}
                onClick={handleSubmit}
              >
                <span>
                  {submitting
                    ? "Processing…"
                    : plan
                      ? `Place order — ₱${fmtPrice(total)}`
                      : "Place order"}
                </span>
                <span className="dco-submit-arrow">→</span>
              </button>
              <p className="dco-secure">🔒 256-bit SSL · Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
