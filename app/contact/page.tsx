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
        setError(
          data.errors
            ? Object.values(data.errors as Record<string, string[]>)
                .flat()
                .join(" ")
            : (data.error ?? "Something went wrong. Please try again."),
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted)
    return (
      <div style={{ textAlign: "center", padding: "48px 20px" }}>
        <div style={{ fontSize: "2.8rem", marginBottom: 16 }}>✅</div>
        <h3
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#1a1f2e",
            marginBottom: 8,
          }}
        >
          Message sent!
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#5a6478",
            lineHeight: 1.7,
            marginBottom: 24,
          }}
        >
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
          Send another message →
        </button>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && (
        <div
          style={{
            background: "#fdf0ef",
            border: "1px solid #f5c6c1",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: "0.82rem",
            color: "#c0392b",
            lineHeight: 1.5,
          }}
        >
          ⚠ {error}
        </div>
      )}

      <div className="ct-row">
        <div className="ct-field">
          <label className="ct-label">
            Full Name <span style={{ color: "#0057d9" }}>*</span>
          </label>
          <input
            className="ct-input"
            type="text"
            placeholder="Juan Dela Cruz"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
        <div className="ct-field">
          <label className="ct-label">
            Email <span style={{ color: "#0057d9" }}>*</span>
          </label>
          <input
            className="ct-input"
            type="email"
            placeholder="juan@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="ct-row">
        <div className="ct-field">
          <label className="ct-label">
            Phone{" "}
            <span
              style={{ fontSize: "0.72rem", color: "#9aa3b2", fontWeight: 400 }}
            >
              (optional)
            </span>
          </label>
          <input
            className="ct-input"
            type="tel"
            placeholder="+63 9XX XXX XXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="ct-field">
          <label className="ct-label">
            Subject <span style={{ color: "#0057d9" }}>*</span>
          </label>
          <select
            className="ct-input ct-select"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
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

      <div className="ct-field">
        <label className="ct-label">
          Message <span style={{ color: "#0057d9" }}>*</span>
        </label>
        <textarea
          className="ct-input ct-textarea"
          placeholder="Describe your question or issue in detail…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
        />
      </div>

      <button className="ct-btn" disabled={submitting} onClick={handleSubmit}>
        {submitting ? "Sending…" : "Send Message →"}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#9aa3b2",
          margin: 0,
        }}
      >
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {faqs.map((f, i) => (
        <div
          key={i}
          style={{
            background: "#ffffff",
            border: `1px solid ${open === i ? "#c5d9fb" : "#e2e6ef"}`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: open === i ? "0 4px 16px rgba(0,87,217,0.07)" : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              gap: 12,
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#1a1f2e",
                lineHeight: 1.4,
              }}
            >
              {f.q}
            </span>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: open === i ? "#0057d9" : "#e8f0fd",
                color: open === i ? "#fff" : "#0057d9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0,
                transform: open === i ? "rotate(45deg)" : "rotate(0)",
                transition: "transform 0.22s, background 0.22s, color 0.22s",
              }}
            >
              +
            </span>
          </button>
          <div
            style={{
              overflow: "hidden",
              maxHeight: open === i ? 200 : 0,
              transition: "max-height 0.3s ease",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                color: "#5a6478",
                lineHeight: 1.75,
                padding: "0 20px 16px",
                margin: 0,
              }}
            >
              {f.a}
            </p>
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
    <main
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#f7f4ef",
        minHeight: "100vh",
        color: "#1a1f2e",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes float-blob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes blink-dot  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fade-up    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btn-pulse  { 0%,100%{box-shadow:0 6px 24px rgba(0,87,217,.25)} 50%{box-shadow:0 6px 36px rgba(0,87,217,.4)} }
        @keyframes grow-bar   { from{width:0} to{width:var(--w)} }

        *, *::before, *::after { box-sizing: border-box; }

        .ct-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .ct-blob-1 {
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 1100px; height: 650px;
          background: radial-gradient(ellipse, rgba(0,87,217,.06) 0%, transparent 65%);
        }
        .ct-blob-2 {
          position: absolute; top: 25%; right: -80px;
          width: 520px; height: 520px;
          background: radial-gradient(ellipse, rgba(0,87,217,.05) 0%, transparent 70%);
          animation: float-blob 7s ease-in-out infinite;
        }

        /* ── Hero ── */
        .ct-hero {
          position: relative; z-index: 2;
          padding: 64px 5% 52px;
          max-width: 1280px; margin: 0 auto;
        }
        .ct-hero-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center;
        }
        @media (max-width: 768px) { .ct-hero-inner { grid-template-columns: 1fr; } }

        .ct-eyebrow-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: #e8f0fd; border: 1px solid #c5d9fb;
          border-radius: 999px; padding: 5px 16px; margin-bottom: 22px;
        }
        .ct-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #0057d9;
          animation: blink-dot 1.6s ease-in-out infinite; flex-shrink: 0;
        }
        .ct-eyebrow-pill span {
          font-size: 10px; font-weight: 700; letter-spacing: 0.13em;
          text-transform: uppercase; color: #0057d9;
        }
        .ct-hero-title {
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
          color: #1a1f2e; line-height: 1.1; letter-spacing: -0.025em;
          margin: 0 0 16px; animation: fade-up .6s ease both .05s;
        }
        .ct-hero-title em { color: #0057d9; font-style: normal; }
        .ct-hero-sub {
          font-size: 1rem; color: #5a6478; line-height: 1.8;
          max-width: 460px; margin: 0 0 28px;
          animation: fade-up .6s ease both .15s;
        }

        /* ── Hero photo ── */
        .ct-hero-photo {
          position: relative; border-radius: 24px; overflow: hidden;
          aspect-ratio: 4/3; box-shadow: 0 8px 40px rgba(0,87,217,0.12);
          animation: fade-up .6s ease both .1s;
        }
        .ct-hero-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ct-hero-photo-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,87,217,0.18) 0%, transparent 55%);
          pointer-events: none;
        }
        .ct-hero-photo-badge {
          position: absolute; bottom: 20px; left: 20px;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
          border-radius: 14px; padding: 12px 18px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
          display: flex; align-items: center; gap: 12px;
        }
        .ct-badge-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: #e8f0fd; display: flex; align-items: center;
          justify-content: center; font-size: 1.2rem; flex-shrink: 0;
        }
        .ct-badge-val { font-size: 1rem; font-weight: 800; color: #0057d9; line-height: 1; }
        .ct-badge-label {
          font-size: 0.68rem; color: #9aa3b2; margin-top: 3px;
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
        }

        /* ── Divider ── */
        .ct-divider { height: 1px; background: #e2e6ef; position: relative; z-index: 2; }

        /* ── Body ── */
        .ct-body {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 52px 5%;
        }

        /* ── Channel strip ── */
        .ct-channels {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 14px; margin-bottom: 48px;
        }
        @media (max-width: 900px) { .ct-channels { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .ct-channels { grid-template-columns: 1fr; } }

        .ct-channel {
          display: block; text-decoration: none;
          background: #ffffff; border: 1px solid #e2e6ef;
          border-radius: 18px; padding: 22px 20px;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .ct-channel:hover {
          border-color: #c5d9fb; box-shadow: 0 6px 24px rgba(0,87,217,0.1);
          transform: translateY(-3px);
        }
        .ct-channel-icon { font-size: 1.7rem; margin-bottom: 12px; }
        .ct-channel-label {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #9aa3b2; margin-bottom: 4px;
        }
        .ct-channel-value { font-size: 0.88rem; font-weight: 700; color: #0057d9; margin-bottom: 3px; }
        .ct-channel-note { font-size: 0.75rem; color: #9aa3b2; }

        /* ── Main grid ── */
        .ct-main-grid {
          display: grid; grid-template-columns: 1fr 1.6fr;
          gap: 24px; align-items: start;
        }
        @media (max-width: 860px) { .ct-main-grid { grid-template-columns: 1fr; } }

        /* ── Info cards ── */
        .ct-info-card {
          background: #ffffff; border: 1px solid #e2e6ef;
          border-radius: 18px; padding: 24px 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          margin-bottom: 14px;
        }
        .ct-section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.13em;
          text-transform: uppercase; color: #0057d9; margin-bottom: 14px;
        }
        .ct-trust-item {
          display: flex; align-items: center; gap: 14px;
          padding: 10px 0; border-top: 1px solid #f0f2f7;
        }
        .ct-trust-item:first-of-type { border-top: none; }
        .ct-trust-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: #e8f0fd; border: 1px solid #c5d9fb;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; flex-shrink: 0;
        }
        .ct-trust-title { font-size: 0.85rem; font-weight: 700; color: #1a1f2e; margin-bottom: 2px; }
        .ct-trust-sub { font-size: 0.75rem; color: #9aa3b2; }

        .ct-response-row {
          display: flex; align-items: center; gap: 14px;
          background: #ffffff; border: 1px solid #e2e6ef;
          border-radius: 18px; padding: 18px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .ct-response-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: #e8f0fd; border: 1px solid #c5d9fb;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; flex-shrink: 0;
        }
        .ct-response-label { font-size: 0.82rem; font-weight: 700; color: #1a1f2e; margin-bottom: 2px; }
        .ct-response-val { font-size: 0.78rem; color: #0057d9; font-weight: 600; }

        /* ── Form card ── */
        .ct-form-card {
          background: #ffffff; border: 1px solid #e2e6ef;
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .ct-form-head {
          padding: 22px 28px; border-bottom: 1px solid #e2e6ef;
          background: #f7f8fb;
        }
        .ct-form-head-title {
          font-size: 1.1rem; font-weight: 800; color: #1a1f2e; margin-bottom: 4px;
        }
        .ct-form-head-sub { font-size: 0.82rem; color: #5a6478; margin: 0; }
        .ct-form-body { padding: 28px; }

        /* ── Form inputs ── */
        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 520px) { .ct-row { grid-template-columns: 1fr; } }
        .ct-field { display: flex; flex-direction: column; }
        .ct-label {
          font-size: 0.75rem; font-weight: 700; color: #1a1f2e;
          margin-bottom: 6px; letter-spacing: 0.02em;
        }
        .ct-input {
          background: #f7f8fb; border: 1px solid #e2e6ef;
          border-radius: 10px; padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem; color: #1a1f2e; outline: none; width: 100%;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .ct-input::placeholder { color: #b0bac8; }
        .ct-input:focus {
          border-color: #0057d9; background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,87,217,0.1);
        }
        .ct-select { appearance: none; cursor: pointer; }
        .ct-textarea { resize: vertical; min-height: 130px; }

        /* ── Button ── */
        .ct-btn {
          width: 100%; padding: 13px 20px;
          background: #0057d9; color: #fff; border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.97rem; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; animation: btn-pulse 3s ease-in-out infinite;
          transition: background 0.18s, opacity 0.18s;
        }
        .ct-btn:hover:not(:disabled) { background: #1a6aff; }
        .ct-btn:disabled { opacity: 0.55; cursor: not-allowed; animation: none; }

        /* ── FAQ ── */
        .ct-faq-section {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 0 5% 72px;
        }
        .ct-faq-grid {
          display: grid; grid-template-columns: 1fr 2fr;
          gap: 48px; align-items: start;
        }
        @media (max-width: 768px) { .ct-faq-grid { grid-template-columns: 1fr; gap: 28px; } }
        .ct-faq-title {
          font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 800;
          color: #1a1f2e; margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .ct-faq-sub { font-size: 0.88rem; color: #5a6478; line-height: 1.75; margin: 0; }
      `}</style>

      {/* Background */}
      <div className="ct-bg">
        <div className="ct-blob-1" />
        <div className="ct-blob-2" />
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ctgrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#0057d9"
                strokeWidth="0.5"
                opacity="0.05"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctgrid)" />
        </svg>
      </div>

      <Navigation />

      {/* ── Hero ── */}
      <section className="ct-hero">
        <div className="ct-hero-inner">
          {/* Left text */}
          <div>
            <div className="ct-eyebrow-pill">
              <div className="ct-eyebrow-dot" />
              <span>Get in touch</span>
            </div>
            <h1 className="ct-hero-title">
              We'd love to
              <br />
              <em>hear from you</em>
            </h1>
            <p className="ct-hero-sub">
              Questions about plans, activation help, refunds, or partnerships —
              our team is here 24/7, wherever you are in the world.
            </p>
            {/* Live status pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#edfaf4",
                border: "1px solid #a7f3d0",
                borderRadius: 999,
                padding: "8px 18px",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#00a86b",
                  display: "inline-block",
                  animation: "blink-dot 1.6s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#065f46",
                  letterSpacing: "0.05em",
                }}
              >
                Support team online · avg. reply under 2 hrs
              </span>
            </div>
          </div>

          {/* Right photo */}
          <div className="ct-hero-photo">
            <img
              src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&auto=format&fit=crop&q=80"
              alt="Traveler getting support"
            />
            <div className="ct-hero-photo-overlay" />
            <div className="ct-hero-photo-badge">
              <div className="ct-badge-icon">💬</div>
              <div>
                <div className="ct-badge-val">24/7 Support</div>
                <div className="ct-badge-label">Always here for you</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ct-divider" />

      {/* ── Body ── */}
      <div
        ref={topRef}
        className="ct-body"
        style={{
          opacity: topVis ? 1 : 0,
          transform: topVis ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }}
      >
        {/* Channel strip */}
        <div className="ct-channels">
          {channels.map((c) => (
            <a key={c.label} href={c.href} className="ct-channel">
              <div className="ct-channel-icon">{c.icon}</div>
              <div className="ct-channel-label">{c.label}</div>
              <div className="ct-channel-value">{c.value}</div>
              <div className="ct-channel-note">{c.note}</div>
            </a>
          ))}
        </div>

        {/* Main grid */}
        <div className="ct-main-grid">
          {/* Left — info */}
          <div>
            <div className="ct-info-card">
              <div className="ct-section-label">Before you send</div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#5a6478",
                  lineHeight: 1.75,
                  marginBottom: 16,
                  marginTop: 0,
                }}
              >
                Fill in the form and we'll get back to you promptly — whether
                it's an order issue, activation help, or a partnership enquiry.
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

            <div className="ct-response-row">
              <div className="ct-response-icon">⚡</div>
              <div>
                <div className="ct-response-label">Average reply time</div>
                <div className="ct-response-val">Under 2 hours</div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="ct-form-card">
            <div className="ct-form-head">
              <div className="ct-form-head-title">Send us a message</div>
              <p className="ct-form-head-sub">
                Fields marked <span style={{ color: "#0057d9" }}>*</span> are
                required.
              </p>
            </div>
            <div className="ct-form-body">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <div className="ct-divider" />

      {/* ── FAQ ── */}
      <div
        ref={faqRef}
        className="ct-faq-section"
        style={{
          paddingTop: 52,
          opacity: faqVis ? 1 : 0,
          transform: faqVis ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }}
      >
        <div className="ct-faq-grid">
          <div>
            <div className="ct-eyebrow-pill" style={{ marginBottom: 16 }}>
              <div className="ct-eyebrow-dot" />
              <span>FAQ</span>
            </div>
            <h2 className="ct-faq-title">Common questions</h2>
            <p className="ct-faq-sub">
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
