"use client";

import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { useEffect, useRef, useState } from "react";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function ContactForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setError(
            Object.values(data.errors as Record<string, string[]>)
              .flat()
              .join(" "),
          );
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (f: string) => `ct-input${focused === f ? " focused" : ""}`;

  if (submitted)
    return (
      <div style={{ textAlign: "center", padding: "52px 20px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✅</div>
        <h3 className="ct-success-title">Message sent!</h3>
        <p className="ct-success-sub">
          Thanks, <strong>{form.full_name}</strong>. We'll reply to{" "}
          <strong>{form.email}</strong> within 2 hours.
        </p>
        <button
          className="ct-btn"
          onClick={() => {
            setSubmitted(false);
            setForm({
              full_name: "",
              email: "",
              phone: "",
              subject: "",
              message: "",
            });
          }}
        >
          Send another
        </button>
      </div>
    );

  return (
    <div className="ct-form-fields">
      {error && <div className="ct-error">⚠ {error}</div>}
      <div className="ct-row">
        <div className="ct-field-wrap">
          <label className="ct-label">
            Full Name <span className="ct-req">*</span>
          </label>
          <input
            className={inputCls("full_name")}
            type="text"
            placeholder="Juan Dela Cruz"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            onFocus={() => setFocused("full_name")}
            onBlur={() => setFocused(null)}
          />
        </div>
        <div className="ct-field-wrap">
          <label className="ct-label">
            Email <span className="ct-req">*</span>
          </label>
          <input
            className={inputCls("email")}
            type="email"
            placeholder="juan@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </div>
      <div className="ct-row">
        <div className="ct-field-wrap">
          <label className="ct-label">
            Phone <span className="ct-opt">(optional)</span>
          </label>
          <input
            className={inputCls("phone")}
            type="tel"
            placeholder="+63 9XX XXX XXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused(null)}
          />
        </div>
        <div className="ct-field-wrap">
          <label className="ct-label">
            Subject <span className="ct-req">*</span>
          </label>
          <select
            className={inputCls("subject") + " ct-select"}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            onFocus={() => setFocused("subject")}
            onBlur={() => setFocused(null)}
          >
            <option value="">Select a topic…</option>
            <option value="Order / Payment Issue">Order / Payment Issue</option>
            <option value="eSIM Activation Help">eSIM Activation Help</option>
            <option value="Plan Information">Plan Information</option>
            <option value="Refund Request">Refund Request</option>
            <option value="Business Partnership">Business Partnership</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="ct-field-wrap">
        <label className="ct-label">
          Message <span className="ct-req">*</span>
        </label>
        <textarea
          className={inputCls("message") + " ct-textarea"}
          placeholder="Describe your question or issue in detail…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          rows={5}
        />
      </div>
      <button className="ct-btn" disabled={submitting} onClick={handleSubmit}>
        <span>{submitting ? "Sending…" : "Send Message"}</span>
        <span className="ct-btn-arrow">→</span>
      </button>
      <p className="ct-privacy">
        🔒 Your information is kept private and never shared.
      </p>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "How quickly will I receive my eSIM after purchase?",
      a: "Instantly. Your QR code is emailed and in your dashboard within minutes of payment confirmation.",
    },
    {
      q: "My eSIM isn't connecting — what should I do?",
      a: "Enable data roaming in your phone settings first. If it still fails, contact support and we'll resolve it within the hour.",
    },
    {
      q: "Can I get a refund on an unused eSIM?",
      a: "Yes. Unused plans qualify for a full refund within 30 days. Contact us with your order reference to start the process.",
    },
    {
      q: "Do you offer business or group plans?",
      a: "Yes — volume pricing and corporate accounts are available. Email us to discuss your requirements.",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {faqs.map((f, i) => (
        <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
          <button
            className="faq-btn"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="faq-q">{f.q}</span>
            <span
              className="faq-icon"
              style={{ transform: open === i ? "rotate(45deg)" : "rotate(0)" }}
            >
              +
            </span>
          </button>
          <div className="faq-body" style={{ maxHeight: open === i ? 160 : 0 }}>
            <p className="faq-ans">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContactPage() {
  const { ref: topRef, visible: topVis } = useFadeIn();
  const { ref: faqRef, visible: faqVis } = useFadeIn();

  const channels = [
    {
      icon: "📧",
      label: "Email Us",
      value: "support@YH.com",
      note: "Reply within 2 hrs",
      href: "mailto:support@YH.com",
    },
    {
      icon: "💬",
      label: "Live Chat",
      value: "Chat with us now",
      note: "Available 24/7",
      href: "#",
    },
    {
      icon: "📱",
      label: "WhatsApp",
      value: "+63 945 675 4591",
      note: "Mon–Sun, 8am–10pm PHT",
      href: "https://wa.me/639456754591",
    },
    {
      icon: "📍",
      label: "Office",
      value: "Manila, Philippines",
      note: "Southeast Asia HQ",
      href: "#",
    },
  ];

  return (
    <main className="ct-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes ping { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.2);opacity:0} }

        .ct-page {
          min-height: 100vh;
          background: #f5f5f0;
          font-family: 'Sora', sans-serif;
          color: #0a2540;
        }

        /* ── Status bar ── */
        .ct-statusbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 32px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf; letter-spacing: 1.5px;
        }
        .ct-statusbar-live { display: flex; align-items: center; gap: 8px; color: #1d6fd8; font-weight: 500; }
        .ct-ping { position: relative; display: inline-flex; width: 7px; height: 7px; flex-shrink: 0; }
        .ct-ping-ring { position: absolute; inset: 0; border-radius: 50%; background: #1d6fd8; opacity: 0.4; animation: ping 1.6s ease-out infinite; }
        .ct-ping-dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #1d6fd8; }

        /* ── Hero ── */
        .ct-hero {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 28px 32px 22px;
        }
        .ct-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #1d6fd8;
          letter-spacing: 2.5px; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .ct-eyebrow-line { display: inline-block; width: 14px; height: 1px; background: #1d6fd8; }
        .ct-hero-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(24px, 3.5vw, 38px);
          font-weight: 800; color: #0a2540;
          line-height: 1.1; letter-spacing: -0.5px; margin: 0 0 8px;
        }
        .ct-hero-sub { font-size: 13px; color: #b0bccf; margin: 0; max-width: 520px; line-height: 1.65; }

        /* ── Body ── */
        .ct-body {
          max-width: 1080px; margin: 0 auto;
          padding: 28px 32px 0;
        }
        @media (max-width: 768px) { .ct-body { padding: 20px 16px 0; } }

        .ct-fade {
          transition: opacity 0.55s ease, transform 0.55s ease;
        }

        /* ── Channel strip ── */
        .ct-channels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 860px) { .ct-channels { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .ct-channels { grid-template-columns: 1fr; } }

        .ct-channel {
          display: block; text-decoration: none;
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px;
          padding: 16px 16px 14px;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .ct-channel:hover { border-color: rgba(29,111,216,0.3); box-shadow: 0 6px 20px rgba(29,111,216,0.08); transform: translateY(-2px); }
        .ct-channel-icon { font-size: 22px; margin-bottom: 10px; line-height: 1; }
        .ct-channel-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px; font-weight: 500; color: #b0bccf;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 3px;
        }
        .ct-channel-value { font-size: 12px; font-weight: 700; color: #1d6fd8; margin-bottom: 2px; }
        .ct-channel-note { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 0.3px; }

        /* ── Main grid ── */
        .ct-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.55fr;
          gap: 20px; align-items: start;
          margin-bottom: 0;
        }
        @media (max-width: 768px) { .ct-main-grid { grid-template-columns: 1fr; } }

        /* ── Panel ── */
        .ct-panel {
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 16px; overflow: hidden;
        }
        .ct-panel + .ct-panel { margin-top: 14px; }
        .ct-panel-head {
          padding: 14px 20px; border-bottom: 1px solid #e2e8f0;
        }
        .ct-panel-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; font-weight: 500; color: #1d6fd8;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .ct-panel-body { padding: 20px; }

        /* ── Trust items ── */
        .ct-trust-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f5f5f0; }
        .ct-trust-item:last-child { border-bottom: none; }
        .ct-trust-icon {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          background: #f0f4fb; border: 1px solid #d4dfee;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .ct-trust-title { font-size: 12px; font-weight: 700; color: #0a2540; margin-bottom: 1px; }
        .ct-trust-sub { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b0bccf; letter-spacing: 0.3px; }

        /* ── Response badge ── */
        .ct-response-badge {
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px;
          padding: 14px 18px; display: flex; align-items: center; gap: 14px;
          margin-top: 14px;
        }
        .ct-response-icon {
          width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
          background: #eef3fb; border: 1px solid #d4dfee;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .ct-response-label { font-size: 12px; font-weight: 700; color: #0a2540; margin-bottom: 2px; }
        .ct-response-val { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #1d6fd8; font-weight: 500; letter-spacing: 0.5px; }

        /* ── Form panel ── */
        .ct-form-panel {
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 16px; overflow: hidden;
        }
        .ct-form-panel-head {
          padding: 16px 22px; border-bottom: 1px solid #e2e8f0;
        }
        .ct-form-panel-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; font-weight: 500; color: #1d6fd8;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 2px;
        }
        .ct-form-panel-sub { font-size: 12px; color: #b0bccf; margin: 0; }
        .ct-form-panel-body { padding: 22px; }

        /* ── Form fields ── */
        .ct-form-fields { display: flex; flex-direction: column; gap: 14px; }
        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .ct-row { grid-template-columns: 1fr; } }
        .ct-field-wrap { display: flex; flex-direction: column; }
        .ct-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px;
        }
        .ct-req { color: #1d6fd8; }
        .ct-opt { color: #b0bccf; font-weight: 400; letter-spacing: 0; }
        .ct-input {
          background: #fafafa; border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 10px 14px; font-family: 'Sora', sans-serif;
          font-size: 13px; color: #0a2540; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          width: 100%;
        }
        .ct-input::placeholder { color: #b0bccf; font-size: 12px; }
        .ct-input.focused, .ct-input:focus {
          border-color: #1d6fd8; box-shadow: 0 0 0 3px rgba(29,111,216,0.1); background: #ffffff;
        }
        .ct-select { appearance: none; cursor: pointer; }
        .ct-textarea { resize: vertical; min-height: 120px; }

        .ct-error {
          background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.2);
          border-radius: 8px; padding: 10px 14px;
          font-size: 12px; color: #dc2626;
        }

        /* ── Button ── */
        .ct-btn {
          width: 100%; padding: 13px 20px;
          background: #0057ff; color: #fff; border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: space-between;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .ct-btn:hover:not(:disabled) { background: #0040cc; box-shadow: 0 8px 24px rgba(0,87,255,0.25); transform: translateY(-1px); }
        .ct-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .ct-btn-arrow {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .ct-privacy {
          text-align: center; font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: #b0bccf; letter-spacing: 0.5px; margin: 0;
        }

        /* ── Success ── */
        .ct-success-title { font-size: 18px; font-weight: 800; color: #0a2540; margin: 0 0 8px; }
        .ct-success-sub { font-size: 13px; color: #b0bccf; line-height: 1.6; margin: 0 0 20px; }

        /* ── FAQ ── */
        .ct-faq-section {
          max-width: 1080px; margin: 0 auto;
          padding: 32px 32px 56px;
        }
        @media (max-width: 768px) { .ct-faq-section { padding: 24px 16px 40px; } }
        .ct-divider {
          height: 1px; background: #e2e8f0; margin-bottom: 32px;
        }
        .ct-faq-grid {
          display: grid; grid-template-columns: 1fr 2fr;
          gap: 40px; align-items: start;
        }
        @media (max-width: 768px) { .ct-faq-grid { grid-template-columns: 1fr; gap: 24px; } }
        .ct-faq-heading-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; font-weight: 500; color: #1d6fd8;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;
        }
        .ct-faq-heading-title {
          font-size: clamp(18px, 2.5vw, 24px); font-weight: 800;
          color: #0a2540; line-height: 1.2; margin: 0 0 10px;
        }
        .ct-faq-heading-sub { font-size: 12px; color: #b0bccf; line-height: 1.65; margin: 0; }

        .faq-item {
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 12px; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .faq-item.open { border-color: rgba(29,111,216,0.3); box-shadow: 0 4px 16px rgba(29,111,216,0.07); }
        .faq-btn {
          width: 100%; background: none; border: none;
          padding: 15px 18px; display: flex; justify-content: space-between;
          align-items: center; cursor: pointer; gap: 12; text-align: left;
        }
        .faq-q { font-size: 13px; font-weight: 600; color: #0a2540; line-height: 1.4; }
        .faq-icon { color: #1d6fd8; font-size: 18px; flex-shrink: 0; transition: transform 0.22s; line-height: 1; }
        .faq-body { overflow: hidden; transition: max-height 0.3s ease; }
        .faq-ans {
          font-size: 12px; color: #b0bccf; line-height: 1.75;
          padding: 0 18px 14px; margin: 0;
        }
      `}</style>

      <Navigation />

      {/* Status bar */}
      <div className="ct-statusbar">
        <div className="ct-statusbar-live">
          <span className="ct-ping">
            <span className="ct-ping-ring" />
            <span className="ct-ping-dot" />
          </span>
          Support team online
        </div>
        <span>Average reply time: under 2 hours</span>
      </div>

      {/* Hero */}
      <div className="ct-hero">
        <div className="ct-eyebrow">
          <span className="ct-eyebrow-line" />
          Get in touch
        </div>
        <h1 className="ct-hero-title">We'd love to hear from you</h1>
        <p className="ct-hero-sub">
          Questions about eSIM plans, activation help, refunds, or partnerships
          — our team is here 24/7.
        </p>
      </div>

      {/* Body */}
      <div
        ref={topRef}
        className="ct-body ct-fade"
        style={{
          opacity: topVis ? 1 : 0,
          transform: topVis ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Channel strip */}
        <div className="ct-channels" style={{ marginTop: 24 }}>
          {channels.map((c) => (
            <a key={c.label} href={c.href} className="ct-channel">
              <div className="ct-channel-icon">{c.icon}</div>
              <div className="ct-channel-label">{c.label}</div>
              <div className="ct-channel-value">{c.value}</div>
              <div className="ct-channel-note">{c.note}</div>
            </a>
          ))}
        </div>

        {/* Main grid: left info + right form */}
        <div className="ct-main-grid">
          {/* Left */}
          <div>
            <div className="ct-panel">
              <div className="ct-panel-head">
                <span className="ct-panel-title">Before you send</span>
              </div>
              <div className="ct-panel-body" style={{ padding: "16px 20px" }}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#b0bccf",
                    lineHeight: 1.7,
                    margin: "0 0 16px",
                  }}
                >
                  Fill in the form and we'll get back to you promptly — whether
                  it's an order issue, activation help, or a partnership
                  enquiry.
                </p>
                {[
                  {
                    icon: "⏱️",
                    t: "2-hour response",
                    d: "During business hours",
                  },
                  {
                    icon: "🌏",
                    t: "Multilingual team",
                    d: "English, Filipino, Mandarin",
                  },
                  {
                    icon: "🔐",
                    t: "Private & secure",
                    d: "Your data is never shared",
                  },
                ].map((item) => (
                  <div key={item.t} className="ct-trust-item">
                    <div className="ct-trust-icon">{item.icon}</div>
                    <div>
                      <div className="ct-trust-title">{item.t}</div>
                      <div className="ct-trust-sub">{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ct-response-badge">
              <div className="ct-response-icon">💬</div>
              <div>
                <div className="ct-response-label">Average reply time</div>
                <div className="ct-response-val">Under 2 hours</div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="ct-form-panel">
            <div className="ct-form-panel-head">
              <div className="ct-form-panel-title">Send a message</div>
              <p className="ct-form-panel-sub">
                Fields marked <span style={{ color: "#1d6fd8" }}>*</span> are
                required.
              </p>
            </div>
            <div className="ct-form-panel-body">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div
        ref={faqRef}
        className="ct-faq-section ct-fade"
        style={{
          opacity: faqVis ? 1 : 0,
          transform: faqVis ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="ct-divider" />
        <div className="ct-faq-grid">
          <div>
            <div className="ct-faq-heading-eyebrow">Support FAQ</div>
            <h2 className="ct-faq-heading-title">Common questions</h2>
            <p className="ct-faq-heading-sub">
              Quick answers before you reach out. Can't find what you need? Send
              us a message above.
            </p>
          </div>
          <Faq />
        </div>
      </div>

      <Footer />
    </main>
  );
}
