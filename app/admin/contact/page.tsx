"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactInquiry {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  created_at: string;
  updated_at: string;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

const STATUS_CONFIG = {
  unread: {
    label: "UNREAD",
    bg: "#EEF2FF",
    border: "#C7D2FE",
    color: "#3B5BDB",
  },
  read: { label: "READ", bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
  replied: {
    label: "REPLIED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    color: "#7C3AED",
  },
  archived: {
    label: "ARCHIVED",
    bg: "#F8FAFF",
    border: "#D1D9E6",
    color: "#6B7A99",
  },
};

const SUBJECT_ICONS: Record<string, string> = {
  "Order / Payment Issue": "💳",
  "eSIM Activation Help": "📡",
  "Plan Information": "📋",
  "Refund Request": "↩️",
  "Business Partnership": "🤝",
  Other: "💬",
};

// Predefined reply templates keyed by subject
const REPLY_TEMPLATES: Record<string, string> = {
  "Order / Payment Issue": `Hi {name},

Thank you for reaching out regarding your order or payment issue. We apologise for any inconvenience this may have caused.

Our team has reviewed your inquiry and we are actively working to resolve this. Could you please confirm your order reference number so we can expedite the process?

We will have this resolved for you within 24 hours.

Warm regards,
YH eSIM Support`,

  "eSIM Activation Help": `Hi {name},

Thank you for contacting YH eSIM support!

Here are the quick steps to activate your eSIM:
1. Go to Settings → Cellular / Mobile Data → Add eSIM
2. Scan the QR code we sent to your email
3. Enable Data Roaming once the profile is installed

If you're still experiencing issues after following these steps, please reply with your device model and we'll assist you further.

Best regards,
YH eSIM Support`,

  "Plan Information": `Hi {name},

Thank you for your interest in YH eSIM!

We'd be happy to help you choose the right plan. Could you let us know:
- Which country or region you're travelling to?
- How many days will you need coverage?
- Do you need voice calls or data only?

Once we have those details, we can recommend the best option for you.

Best regards,
YH eSIM Support`,

  "Refund Request": `Hi {name},

Thank you for getting in touch. We've received your refund request and are sorry to hear your plan didn't meet your expectations.

As per our refund policy, unused eSIM plans are eligible for a full refund within 30 days of purchase. To process your refund, please confirm:
- Your order reference number
- Whether the eSIM QR code has been scanned/installed

We'll process your request within 5–10 business days once confirmed.

Warm regards,
YH eSIM Support`,

  "Business Partnership": `Hi {name},

Thank you for your interest in partnering with YH eSIM!

We're always excited to explore new business opportunities. Could you share a bit more about your organisation and the type of partnership you have in mind?

Our business development team will follow up with you within 2 business days.

Best regards,
YH eSIM Business Team`,

  Other: `Hi {name},

Thank you for contacting YH eSIM support!

We've received your message and a member of our team will review it shortly. We aim to respond to all inquiries within 2 hours during business hours (8am–10pm PHT).

If your matter is urgent, please reach us via WhatsApp at +63 945 675 4591.

Best regards,
YH eSIM Support`,
};

function getTemplate(subject: string, name: string): string {
  const tpl = REPLY_TEMPLATES[subject] ?? REPLY_TEMPLATES["Other"];
  return tpl.replace("{name}", name.split(" ")[0] ?? name);
}

// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 7,
  border: "1px solid #D1D9E6",
  background: "#FFFFFF",
  color: "#1A2540",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Sora', sans-serif",
  transition: "border-color 0.15s",
};
const monoSm: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: "#6B7A99",
};

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({
  total,
  perPage,
  currentPage,
  onPageChange,
  onPerPageChange,
}: {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
}) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const pages: (number | "…")[] = [];
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(lastPage - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < lastPage - 2) pages.push("…");
    pages.push(lastPage);
  }
  const from = Math.min((currentPage - 1) * perPage + 1, total);
  const to = Math.min(currentPage * perPage, total);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        padding: "14px 0 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={monoSm}>
          {total === 0 ? "No records" : `${from}–${to} of ${total}`}
        </span>
        <select
          value={perPage}
          onChange={(e) => {
            onPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          style={{
            padding: "4px 8px",
            borderRadius: 5,
            border: "1px solid #D1D9E6",
            background: "#FFFFFF",
            color: "#4A5A7A",
            fontSize: 11,
            outline: "none",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {ROWS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <PBtn
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </PBtn>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              style={{
                color: "#9AAABF",
                padding: "0 4px",
                lineHeight: "28px",
                fontSize: 13,
              }}
            >
              …
            </span>
          ) : (
            <PBtn
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </PBtn>
          ),
        )}
        <PBtn
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </PBtn>
      </div>
    </div>
  );
}
function PBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 28,
        height: 28,
        padding: "0 6px",
        border: "1px solid",
        borderColor: active ? "#3B5BDB" : "#D1D9E6",
        borderRadius: 5,
        background: active ? "#EEF2FF" : "#FFFFFF",
        color: active ? "#3B5BDB" : disabled ? "#C5CFE0" : "#4A5A7A",
        fontSize: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {children}
    </button>
  );
}

// ─── Reply Composer (Gmail-style) ─────────────────────────────────────────────
function ReplyComposer({
  inquiry,
  onClose,
  onReplied,
}: {
  inquiry: ContactInquiry;
  onClose: () => void;
  onReplied: () => void;
}) {
  const [to] = useState(inquiry.email);
  const [subject, setSubject] = useState(`Re: ${inquiry.subject}`);
  const [body, setBody] = useState(
    getTemplate(inquiry.subject, inquiry.full_name),
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => textRef.current?.focus(), 80);
  }, []);

  const send = async () => {
    if (!body.trim()) {
      setError("Message body cannot be empty.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/contact/${inquiry.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          toEmail: inquiry.email, // ← add these two
          toName: inquiry.full_name, // ← add these two
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to send reply.");
        return;
      }
      setSent(true);
      setTimeout(() => {
        onReplied();
        onClose();
      }, 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: "0 32px 32px",
        pointerEvents: "none",
      }}
    >
      {/* Composer card */}
      <div
        style={{
          width: 560,
          background: "#FFFFFF",
          border: "1px solid #D1D9E6",
          borderRadius: 14,
          boxShadow: "0 8px 48px rgba(30,50,120,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pointerEvents: "all",
          animation: "composeIn 0.22s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1A2540",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "#7B9CC8",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {sent ? "✓ sent" : "// reply"}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={onClose}
              title="Discard"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 5,
                color: "#7B9CC8",
                fontSize: 13,
                cursor: "pointer",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* To field */}
        <div
          style={{ padding: "10px 16px 0", borderBottom: "1px solid #F1F4FA" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 10,
            }}
          >
            <span
              style={{
                ...monoSm,
                fontSize: 10,
                minWidth: 52,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              To
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#EEF2FF",
                border: "1px solid #C7D2FE",
                borderRadius: 20,
                padding: "3px 12px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#3B5BDB",
                }}
              >
                {inquiry.full_name}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: "#6B7A99",
                }}
              >
                &lt;{to}&gt;
              </span>
            </div>
          </div>
        </div>

        {/* Subject field */}
        <div style={{ padding: "0 16px", borderBottom: "1px solid #F1F4FA" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
            }}
          >
            <span
              style={{
                ...monoSm,
                fontSize: 10,
                minWidth: 52,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Subject
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                ...inputStyle,
                border: "none",
                padding: "0",
                fontSize: 13,
                fontWeight: 600,
                color: "#0F172A",
                flex: 1,
              }}
            />
          </div>
        </div>

        {/* Original message preview */}
        <div
          style={{
            padding: "10px 16px",
            background: "#F8FAFF",
            borderBottom: "1px solid #EEF2FA",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              style={{
                width: 3,
                flexShrink: 0,
                alignSelf: "stretch",
                background: "#C7D2FE",
                borderRadius: 2,
                marginTop: 2,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "#9AAABF",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                original ·{" "}
                {new Date(inquiry.created_at).toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#6B7A99",
                  lineHeight: 1.6,
                  fontFamily: "'Sora', sans-serif",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {inquiry.message}
              </p>
            </div>
          </div>
        </div>

        {/* Template selector */}
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid #F1F4FA",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              ...monoSm,
              fontSize: 9,
              letterSpacing: "1px",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            Template
          </span>
          <select
            onChange={(e) =>
              setBody(getTemplate(e.target.value, inquiry.full_name))
            }
            defaultValue={inquiry.subject}
            style={{
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
              border: "1px solid #D1D9E6",
              borderRadius: 5,
              padding: "3px 8px",
              color: "#3B5BDB",
              background: "#F5F7FF",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {Object.keys(REPLY_TEMPLATES).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <span style={{ ...monoSm, fontSize: 9, color: "#C5CFE0" }}>
            · editable below
          </span>
        </div>

        {/* Body */}
        {error && (
          <div
            style={{
              margin: "8px 16px 0",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 12,
              color: "#DC2626",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {error}
          </div>
        )}
        <textarea
          ref={textRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            flex: 1,
            minHeight: 220,
            maxHeight: 320,
            resize: "none",
            border: "none",
            outline: "none",
            padding: "14px 16px",
            fontFamily: "'Sora', sans-serif",
            fontSize: 13,
            color: "#0F172A",
            lineHeight: 1.75,
            background: sent ? "#F0FDF4" : "#FFFFFF",
            transition: "background 0.3s",
          }}
        />

        {/* Footer actions */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #EEF2FA",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            background: "#FAFBFE",
          }}
        >
          <span style={{ ...monoSm, fontSize: 10 }}>
            via <span style={{ color: "#3B5BDB" }}>support@YH.com</span>
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: "7px 16px",
                borderRadius: 6,
                border: "1px solid #D1D9E6",
                background: "#FFFFFF",
                color: "#6B7A99",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Discard
            </button>
            <button
              onClick={send}
              disabled={sending || sent}
              style={{
                padding: "7px 20px",
                borderRadius: 6,
                border: "1.5px solid",
                cursor: sending || sent ? "not-allowed" : "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Sora', sans-serif",
                transition: "all 0.2s",
                borderColor: sent ? "#16A34A" : "#3B5BDB",
                background: sent
                  ? "#16A34A"
                  : sending
                    ? "rgba(59,91,219,0.7)"
                    : "#3B5BDB",
                color: "#FFFFFF",
              }}
            >
              {sent ? "✓ Sent!" : sending ? "Sending…" : "Send Reply ↑"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({
  inquiry,
  onClose,
  onReply,
  onDelete,
  onStatusChange,
}: {
  inquiry: ContactInquiry;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
  onStatusChange: (s: ContactInquiry["status"]) => void;
}) {
  const sc = STATUS_CONFIG[inquiry.status];
  const icon = SUBJECT_ICONS[inquiry.subject] ?? "💬";

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,25,60,0.35)",
          zIndex: 900,
          backdropFilter: "blur(3px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(540px, 100vw)",
          background: "#FAFBFE",
          borderLeft: "1px solid #D1D9E6",
          boxShadow: "-8px 0 40px rgba(30,50,120,0.12)",
          zIndex: 950,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid #EEF2FA",
            background: "#FFFFFF",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#F0F4FF",
                  border: "1px solid #C7D2FE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: "#3B5BDB",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  // inquiry · #{String(inquiry.id).padStart(5, "0")}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0F172A",
                    lineHeight: 1.3,
                  }}
                >
                  {inquiry.subject}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#F1F4FA",
                border: "1px solid #D1D9E6",
                color: "#6B7A99",
                fontSize: 14,
                cursor: "pointer",
                width: 30,
                height: 30,
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Status + actions row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 9,
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: "1.5px",
                fontWeight: 600,
                border: `1px solid ${sc.border}`,
                background: sc.bg,
                color: sc.color,
              }}
            >
              {sc.label}
            </span>
            {/* Quick status change */}
            {(["read", "replied", "archived"] as const)
              .filter((s) => s !== inquiry.status)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 9,
                    cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace",
                    letterSpacing: "1px",
                    fontWeight: 600,
                    border: "1px solid #D1D9E6",
                    background: "#F8FAFF",
                    color: "#9AAABF",
                    transition: "all 0.15s",
                  }}
                >
                  mark {s}
                </button>
              ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button
                onClick={onReply}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: "1.5px solid #3B5BDB",
                  background: "#3B5BDB",
                  color: "#FFFFFF",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                ↩ Reply
              </button>
              <button
                onClick={onDelete}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "1px solid #FECACA",
                  background: "#FFFFFF",
                  color: "#9AAABF",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                  transition: "all 0.15s",
                }}
              >
                del
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {/* Sender card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F4",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#3B5BDB,#6B8EFF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {inquiry.full_name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 700, color: "#0F172A", fontSize: 13 }}
                >
                  {inquiry.full_name}
                </div>
                <a
                  href={`mailto:${inquiry.email}`}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    color: "#3B5BDB",
                    textDecoration: "none",
                  }}
                >
                  {inquiry.email}
                </a>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "#9AAABF",
                  }}
                >
                  {new Date(inquiry.created_at).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "#C5CFE0",
                  }}
                >
                  {new Date(inquiry.created_at).toLocaleTimeString("en-PH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            {inquiry.phone && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: "#9AAABF",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Phone
                </span>
                <a
                  href={`tel:${inquiry.phone}`}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: "#3B5BDB",
                    textDecoration: "none",
                  }}
                >
                  {inquiry.phone}
                </a>
              </div>
            )}
            <div
              style={{
                borderTop: "1px solid #F1F4FA",
                paddingTop: 12,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "#9AAABF",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Message
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#1A2540",
                  lineHeight: 1.8,
                  fontFamily: "'Sora', sans-serif",
                  whiteSpace: "pre-wrap",
                }}
              >
                {inquiry.message}
              </p>
            </div>
          </div>

          {/* Reply prompt */}
          <button
            onClick={onReply}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 10,
              cursor: "pointer",
              border: "1.5px dashed #C7D2FE",
              background: "#F5F7FF",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EEF2FF";
              e.currentTarget.style.borderColor = "#3B5BDB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F5F7FF";
              e.currentTarget.style.borderColor = "#C7D2FE";
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#EEF2FF",
                border: "1px solid #C7D2FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "1rem",
              }}
            >
              ↩
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, color: "#3B5BDB", fontSize: 12 }}>
                Reply to {inquiry.full_name}
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "#9AAABF",
                }}
              >
                Opens composer with pre-filled template
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({
  inquiry,
  onClose,
  onDeleted,
}: {
  inquiry: ContactInquiry;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/contact/${inquiry.id}`, { method: "DELETE" });
      onDeleted();
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,25,60,0.5)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAFBFE",
          border: "1px solid #FECACA",
          borderRadius: 14,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 40px rgba(30,50,120,0.1)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            margin: "0 auto 14px",
          }}
        >
          ⚠️
        </div>
        <h3
          style={{
            margin: "0 0 8px",
            textAlign: "center",
            color: "#DC2626",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Delete Inquiry
        </h3>
        <p
          style={{
            textAlign: "center",
            color: "#6B7A99",
            fontSize: 13,
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          Delete the inquiry from{" "}
          <strong style={{ color: "#1A2540" }}>{inquiry.full_name}</strong>?
          This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 7,
              border: "1px solid #D1D9E6",
              background: "#FFFFFF",
              color: "#6B7A99",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={loading}
            style={{
              padding: "9px 20px",
              borderRadius: 7,
              border: "1.5px solid #DC2626",
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminContactPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      setInquiries(data.data ?? data ?? []);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, perPage]);

  const filtered = inquiries.filter((i) => {
    const matchSearch =
      i.full_name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const handleStatusChange = async (
    inquiry: ContactInquiry,
    status: ContactInquiry["status"],
  ) => {
    try {
      await fetch(`/api/admin/contact/${inquiry.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status } : i)),
      );
      if (selected?.id === inquiry.id)
        setSelected((s) => (s ? { ...s, status } : s));
    } catch {}
  };

  // Stats
  const stats = {
    total: inquiries.length,
    unread: inquiries.filter((i) => i.status === "unread").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
    today: inquiries.filter(
      (i) =>
        new Date(i.created_at).toDateString() === new Date().toDateString(),
    ).length,
  };

  const openReply = (inq: ContactInquiry) => {
    setReplyTarget(inq);
    // mark as read when opening reply
    if (inq.status === "unread") handleStatusChange(inq, "read");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }
        @keyframes composeIn { from { transform: translateY(40px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        .inq-row:hover td { background: #F5F7FF !important; }
        .action-btn:hover { border-color: #3B5BDB !important; color: #3B5BDB !important; background: #EEF2FF !important; }
        .del-btn:hover { border-color: #DC2626 !important; color: #DC2626 !important; background: #FEF2F2 !important; }
        .reply-btn:hover { background: #2F4AC5 !important; border-color: #2F4AC5 !important; }
        .filter-pill:hover { border-color: #3B5BDB !important; color: #3B5BDB !important; }
        input:focus, textarea:focus { border-color: #3B5BDB !important; box-shadow: 0 0 0 3px rgba(59,91,219,0.1) !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #F1F4FA; }
        ::-webkit-scrollbar-thumb { background: #C5CFE0; border-radius: 3px; }
      `}</style>

      <div style={{ fontFamily: "'Sora', sans-serif", color: "#1A2540" }}>
        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "#3B5BDB",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 1.5,
                  background: "#3B5BDB",
                }}
              />
              Admin / Contact Inquiries
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Contact Inbox
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "#9AAABF",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {stats.total} total · click a row to read · ↩ to reply
            </p>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              {
                label: "Unread",
                value: stats.unread,
                color: "#3B5BDB",
                bg: "#EEF2FF",
                border: "#C7D2FE",
              },
              {
                label: "Replied",
                value: stats.replied,
                color: "#7C3AED",
                bg: "#F5F3FF",
                border: "#DDD6FE",
              },
              {
                label: "Today",
                value: stats.today,
                color: "#0891B2",
                bg: "#ECFEFF",
                border: "#A5F3FC",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 10,
                  padding: "10px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 20,
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: s.color,
                    opacity: 0.7,
                    letterSpacing: "1px",
                    marginTop: 3,
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F4",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(30,50,120,0.06)",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid #EEF2FA",
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              background: "#FAFBFE",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 13,
                  color: "#9AAABF",
                }}
              >
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or subject…"
                style={{
                  ...inputStyle,
                  paddingLeft: 32,
                  background: "#FFFFFF",
                }}
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9AAABF",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                clear ×
              </button>
            )}
            {/* Status filters */}
            <div style={{ display: "flex", gap: 5 }}>
              {(["all", "unread", "read", "replied", "archived"] as const).map(
                (s) => (
                  <button
                    key={s}
                    className="filter-pill"
                    onClick={() => setFilterStatus(s)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 20,
                      fontSize: 10,
                      cursor: "pointer",
                      fontFamily: "'IBM Plex Mono', monospace",
                      letterSpacing: "0.5px",
                      fontWeight: 600,
                      transition: "all 0.15s",
                      border: `1px solid ${filterStatus === s ? "#3B5BDB" : "#D1D9E6"}`,
                      background: filterStatus === s ? "#EEF2FF" : "#FFFFFF",
                      color: filterStatus === s ? "#3B5BDB" : "#9AAABF",
                    }}
                  >
                    {s.toUpperCase()}
                    {s === "unread" && stats.unread > 0 && (
                      <span
                        style={{
                          marginLeft: 5,
                          background: "#3B5BDB",
                          color: "#fff",
                          borderRadius: 999,
                          padding: "0 5px",
                          fontSize: 9,
                        }}
                      >
                        {stats.unread}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#F8FAFF" }}>
                  {[
                    "#",
                    "Status",
                    "Name",
                    "Email",
                    "Subject",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 9,
                        fontFamily: "'IBM Plex Mono', monospace",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#9AAABF",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #EEF2FA",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "48px 0",
                        textAlign: "center",
                        color: "#9AAABF",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12,
                      }}
                    >
                      loading…
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "48px 0",
                        textAlign: "center",
                        color: "#9AAABF",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12,
                      }}
                    >
                      {search ? `no results for "${search}"` : "inbox is empty"}
                    </td>
                  </tr>
                ) : (
                  paginated.map((inq, i) => {
                    const sc = STATUS_CONFIG[inq.status];
                    const icon = SUBJECT_ICONS[inq.subject] ?? "💬";
                    const isUnread = inq.status === "unread";
                    return (
                      <tr
                        key={inq.id}
                        className="inq-row"
                        onClick={() => {
                          setSelected(inq);
                          if (inq.status === "unread")
                            handleStatusChange(inq, "read");
                        }}
                        style={{
                          borderTop: "1px solid #F1F4FA",
                          cursor: "pointer",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#C5CFE0",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                          }}
                        >
                          {String((currentPage - 1) * perPage + i + 1).padStart(
                            2,
                            "0",
                          )}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 9px",
                              borderRadius: 20,
                              fontSize: 8,
                              fontFamily: "'IBM Plex Mono', monospace",
                              letterSpacing: "1.5px",
                              fontWeight: 600,
                              border: `1px solid ${sc.border}`,
                              background: sc.bg,
                              color: sc.color,
                            }}
                          >
                            {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg,#3B5BDB,#6B8EFF)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {inq.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              style={{
                                fontWeight: isUnread ? 700 : 500,
                                color: "#0F172A",
                                fontSize: 13,
                              }}
                            >
                              {inq.full_name}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            color: "#3B5BDB",
                          }}
                        >
                          {inq.email}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span style={{ fontSize: 14 }}>{icon}</span>
                            <span
                              style={{
                                fontWeight: isUnread ? 600 : 400,
                                color: "#1A2540",
                                fontSize: 12,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 160,
                              }}
                            >
                              {inq.subject}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            color: "#9AAABF",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(inq.created_at).toLocaleDateString(
                            "en-PH",
                            { month: "short", day: "numeric" },
                          )}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              className="reply-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openReply(inq);
                              }}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 5,
                                border: "1.5px solid #3B5BDB",
                                background: "#3B5BDB",
                                color: "#FFFFFF",
                                fontSize: 11,
                                cursor: "pointer",
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontWeight: 600,
                                transition: "all 0.15s",
                              }}
                            >
                              ↩ reply
                            </button>
                            <button
                              className="del-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(inq);
                              }}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 5,
                                border: "1px solid #FECACA",
                                background: "#FFFFFF",
                                color: "#9AAABF",
                                fontSize: 11,
                                cursor: "pointer",
                                transition: "all 0.15s",
                                fontFamily: "'IBM Plex Mono', monospace",
                              }}
                            >
                              del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              padding: "0 20px 16px",
              borderTop: "1px solid #EEF2FA",
              background: "#FAFBFE",
            }}
          >
            <Pagination
              total={filtered.length}
              perPage={perPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPerPageChange={setPerPage}
            />
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && !replyTarget && (
        <DetailPanel
          inquiry={selected}
          onClose={() => setSelected(null)}
          onReply={() => openReply(selected)}
          onDelete={() => {
            setDeleteTarget(selected);
            setSelected(null);
          }}
          onStatusChange={(s) => handleStatusChange(selected, s)}
        />
      )}

      {/* Reply composer — floats over everything */}
      {replyTarget && (
        <ReplyComposer
          inquiry={replyTarget}
          onClose={() => setReplyTarget(null)}
          onReplied={() => {
            handleStatusChange(replyTarget, "replied");
            fetchInquiries();
          }}
        />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          inquiry={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={fetchInquiries}
        />
      )}
    </>
  );
}
