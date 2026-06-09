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

function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background:
          "linear-gradient(160deg,#dff2ff 0%,#c8e8ff 35%,#b0d8ff 65%,#c4eeff 100%)",
      }}
    >
      <style>{`
        @keyframes float-blob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes data-flow { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
          height: 600,
          background:
            "radial-gradient(ellipse,rgba(0,160,255,0.16) 0%,transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: -100,
          width: 500,
          height: 500,
          background:
            "radial-gradient(ellipse,rgba(0,120,255,0.09) 0%,transparent 70%)",
          animation: "float-blob 8s ease-in-out infinite",
        }}
      />
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
          <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#0080FF"
              strokeWidth="0.4"
              opacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
        {[
          "M 100 150 L 100 280 L 260 280",
          "M 400 60 L 560 60 L 560 200",
          "M 750 180 L 750 360 L 900 360",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#0072FF"
            strokeWidth="1"
            opacity="0.1"
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{
              animation: `data-flow ${2.8 + i * 0.5}s linear infinite ${i * 0.4}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
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
          const messages = Object.values(
            data.errors as Record<string, string[]>,
          )
            .flat()
            .join(" ");
          setError(messages);
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

  const F = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focused === field ? "#fff" : "rgba(240,248,255,0.85)",
    border: `1.5px solid ${focused === field ? "#0D6EFD" : "rgba(0,130,255,0.22)"}`,
    boxShadow: focused === field ? "0 0 0 3px rgba(13,110,253,0.1)" : "none",
    padding: "11px 14px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    color: "#0a2540",
    outline: "none",
    borderRadius: 10,
    transition: "all 0.18s",
    boxSizing: "border-box" as const,
  });

  const L: React.CSSProperties = {
    display: "block",
    fontSize: 11.5,
    fontWeight: 700,
    color: "#2e6a96",
    marginBottom: 6,
    letterSpacing: "0.04em",
    fontFamily: "'DM Sans',sans-serif",
  };

  if (submitted)
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
        <h3
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 800,
            color: "#002f6c",
            fontSize: "1.4rem",
            marginBottom: 10,
          }}
        >
          Message sent!
        </h3>
        <p style={{ color: "#3d6e90", fontSize: "0.9rem", lineHeight: 1.7 }}>
          Thanks, <strong>{form.full_name}</strong>. We'll reply to{" "}
          <strong>{form.email}</strong> within 2 hours.
        </p>
        <button
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
          style={{
            marginTop: 24,
            background: "linear-gradient(135deg,#0055ff,#00b8ff)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 28px",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Send another
        </button>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {error && (
        <div
          style={{
            background: "rgba(220,38,38,0.07)",
            border: "1px solid rgba(220,38,38,0.25)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: "0.84rem",
            color: "#dc2626",
          }}
        >
          ⚠ {error}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={L}>
            Full Name <span style={{ color: "#0072FF" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Juan Dela Cruz"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            onFocus={() => setFocused("full_name")}
            onBlur={() => setFocused(null)}
            style={F("full_name")}
          />
        </div>
        <div>
          <label style={L}>
            Email <span style={{ color: "#0072FF" }}>*</span>
          </label>
          <input
            type="email"
            placeholder="juan@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            style={F("email")}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={L}>
            Phone{" "}
            <span style={{ color: "#7ab5cc", fontWeight: 400 }}>
              (optional)
            </span>
          </label>
          <input
            type="tel"
            placeholder="+63 9XX XXX XXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused(null)}
            style={F("phone")}
          />
        </div>
        <div>
          <label style={L}>
            Subject <span style={{ color: "#0072FF" }}>*</span>
          </label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            onFocus={() => setFocused("subject")}
            onBlur={() => setFocused(null)}
            style={{
              ...F("subject"),
              appearance: "none" as const,
              cursor: "pointer",
            }}
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
      <div>
        <label style={L}>
          Message <span style={{ color: "#0072FF" }}>*</span>
        </label>
        <textarea
          placeholder="Describe your question or issue in detail…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          rows={5}
          style={{
            ...F("message"),
            resize: "vertical" as const,
            minHeight: 120,
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: "100%",
          padding: "14px",
          background: submitting
            ? "rgba(0,100,255,0.45)"
            : "linear-gradient(135deg,#0055ff 0%,#00b8ff 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: submitting ? "none" : "0 6px 24px rgba(0,85,255,0.32)",
          transition: "all 0.2s",
          letterSpacing: "0.01em",
        }}
      >
        {submitting ? "Sending…" : "Send Message →"}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.73rem",
          color: "#94bdd4",
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
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
      {faqs.map((f, i) => (
        <div
          key={i}
          style={{
            background:
              open === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
            border: `1px solid ${open === i ? "rgba(0,114,255,0.3)" : "rgba(0,114,255,0.14)"}`,
            borderRadius: 12,
            overflow: "hidden",
            transition: "all 0.22s",
            boxShadow: open === i ? "0 4px 16px rgba(0,80,200,0.08)" : "none",
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
              textAlign: "left" as const,
            }}
          >
            <span
              style={{
                color: "#002f6c",
                fontWeight: 600,
                fontSize: "0.9rem",
                lineHeight: 1.4,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {f.q}
            </span>
            <span
              style={{
                color: "#0072FF",
                fontSize: "1.25rem",
                flexShrink: 0,
                transform: open === i ? "rotate(45deg)" : "rotate(0)",
                transition: "transform 0.22s",
                lineHeight: 1,
              }}
            >
              +
            </span>
          </button>
          <div
            style={{
              maxHeight: open === i ? 160 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <p
              style={{
                color: "#3d6e90",
                fontSize: "0.86rem",
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

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background =
      "linear-gradient(160deg,#dff2ff 0%,#c8e8ff 35%,#b0d8ff 65%,#c4eeff 100%)";
    return () => {
      document.body.style.background = prev;
    };
  }, []);

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
        background: "transparent",
        fontFamily: "'DM Sans',sans-serif",
        color: "#002f6c",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <Background />
      <Navigation />

      {/* ── HERO + FORM ── */}
      <div
        ref={topRef}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "52px 28px 48px",
          opacity: topVis ? 1 : 0,
          transform: topVis ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Page header — full width, tight */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,144,255,0.1)",
              border: "1px solid rgba(0,144,255,0.28)",
              borderRadius: 999,
              padding: "5px 18px",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0090FF",
                boxShadow: "0 0 8px #0090FF",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "#0055cc",
                fontWeight: 700,
              }}
            >
              Get in Touch
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#002f6c",
              margin: "0 0 12px",
              letterSpacing: "-0.025em",
            }}
          >
            We'd love to{" "}
            <span
              style={{
                color: "#0072FF",
                position: "relative",
                display: "inline-block",
              }}
            >
              hear from you
              <span
                style={{
                  position: "absolute",
                  bottom: -3,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "linear-gradient(90deg,#0072FF,#00C8FF)",
                  borderRadius: 2,
                }}
              />
            </span>
          </h1>
          <p
            style={{
              color: "#4a7ea0",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 560,
            }}
          >
            Have a question about an eSIM plan, need help with activation, or
            want to explore partnerships? Our team is here 24/7.
          </p>
        </div>

        {/* ── CHANNEL STRIP ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginBottom: 36,
          }}
        >
          {channels.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(0,140,255,0.18)",
                borderRadius: 14,
                padding: "16px 16px 14px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 16px rgba(0,80,200,0.07)",
                position: "relative",
                overflow: "hidden",
                display: "block",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 24px rgba(0,80,200,0.13)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 16px rgba(0,80,200,0.07)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2.5,
                  background: `linear-gradient(90deg,hsl(${208 + i * 10},100%,48%),hsl(${220 + i * 10},100%,64%))`,
                  borderRadius: "14px 14px 0 0",
                }}
              />
              <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>
                {c.icon}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#8ab8d0",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  marginBottom: 3,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#0055cc",
                  marginBottom: 2,
                }}
              >
                {c.value}
              </div>
              <div style={{ fontSize: "0.74rem", color: "#94bdd4" }}>
                {c.note}
              </div>
            </a>
          ))}
        </div>

        {/* ── MAIN CONTENT: info left + form right ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left: trust + mini blurb */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: 14,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(0,140,255,0.16)",
                borderRadius: 16,
                padding: "22px 20px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#002f6c",
                  margin: "0 0 10px",
                }}
              >
                Before you send
              </h3>
              <p
                style={{
                  color: "#4a7ea0",
                  fontSize: "0.84rem",
                  lineHeight: 1.75,
                  margin: "0 0 18px",
                }}
              >
                Whether you need help with an order, eSIM activation, refunds,
                or want to discuss a business partnership — fill in the form and
                we'll respond promptly.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 10,
                }}
              >
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
                  <div
                    key={item.t}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: "rgba(0,114,255,0.07)",
                        border: "1px solid rgba(0,114,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#002f6c",
                          fontSize: "0.84rem",
                        }}
                      >
                        {item.t}
                      </div>
                      <div style={{ color: "#7aadcc", fontSize: "0.75rem" }}>
                        {item.d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time badge */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(0,85,255,0.08),rgba(0,184,255,0.08))",
                border: "1px solid rgba(0,114,255,0.2)",
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#0055ff,#00b8ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  boxShadow: "0 4px 14px rgba(0,85,255,0.25)",
                }}
              >
                💬
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#002f6c",
                    fontSize: "0.85rem",
                  }}
                >
                  Average reply time
                </div>
                <div
                  style={{
                    color: "#0072FF",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  Under 2 hours
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div
            style={{
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(0,140,255,0.2)",
              borderRadius: 20,
              padding: "30px 28px",
              backdropFilter: "blur(14px)",
              boxShadow: "0 8px 40px rgba(0,80,200,0.11)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg,#0072FF,#00C8FF)",
                borderRadius: "20px 20px 0 0",
              }}
            />
            <h2
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 800,
                color: "#002f6c",
                fontSize: "1.1rem",
                margin: "0 0 4px",
              }}
            >
              Send a message
            </h2>
            <p
              style={{
                color: "#7aadcc",
                fontSize: "0.81rem",
                margin: "0 0 22px",
              }}
            >
              All fields marked <span style={{ color: "#0072FF" }}>*</span> are
              required.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div
        ref={faqRef}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 28px 64px",
          opacity: faqVis ? 1 : 0,
          transform: faqVis ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(0,114,255,0.25),transparent)",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#0072FF",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                marginBottom: 10,
              }}
            >
              Support FAQ
            </div>
            <h2
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "clamp(1.4rem,2.5vw,1.9rem)",
                fontWeight: 800,
                color: "#002f6c",
                lineHeight: 1.2,
                margin: "0 0 12px",
              }}
            >
              Common questions
            </h2>
            <p
              style={{
                color: "#4a7ea0",
                fontSize: "0.88rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Quick answers before you reach out. Can't find what you need? Send
              us a message above.
            </p>
          </div>
          <Faq />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(180,220,255,0.5)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,140,255,0.18)",
        }}
      >
        <style>{`footer[style]{background:transparent!important;border-top:none!important}footer p{color:#2a5a8a!important}footer h4{color:#002f6c!important}`}</style>
        <Footer />
      </div>
    </main>
  );
}
