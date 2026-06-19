"use client";

import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useFadeIn(delay = 0) {
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
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible, delay };
}

function fadeStyle(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  };
}

// ─── Background ─────────────────────────────────────────────────────────────

function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#f7f4ef",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes float-blob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes blink-dot  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes grow-bar   { from{width:0} to{width:var(--w)} }
        @keyframes fade-up    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btn-pulse  { 0%,100%{box-shadow:0 6px 24px rgba(0,87,217,.25)} 50%{box-shadow:0 6px 36px rgba(0,87,217,.4)} }
        @media (prefers-reduced-motion: reduce) {
          *{ animation: none !important; transition: none !important; }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .ab-hero        { grid-template-columns: 1fr !important; }
          .ab-hero-photo  { display: none !important; }
          .ab-stats       { grid-template-columns: repeat(2,1fr) !important; gap: 16px !important; }
          .ab-flow        { grid-template-columns: repeat(2,1fr) !important; }
          .ab-flow-line   { display: none !important; }
          .ab-compare     { grid-template-columns: 1fr !important; }
          .ab-specs       { grid-template-columns: 1fr !important; }
          .ab-coverage    { grid-template-columns: 1fr !important; }
          .ab-mission     { grid-template-columns: 1fr !important; }
          .ab-story       { grid-template-columns: 1fr !important; }
          .ab-why         { grid-template-columns: 1fr !important; }
          .ab-cta-btns    { flex-direction: column !important; align-items: stretch !important; }
          .ab-cta-btns a  { justify-content: center !important; }
          .ab-pills       { gap: 8px !important; }
          .ab-rec-badge   {
            position: static !important;
            margin-left: auto !important;
            margin-top: 0 !important;
          }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 650,
          background:
            "radial-gradient(ellipse, rgba(0,87,217,.06) 0%, transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: -80,
          width: 520,
          height: 520,
          background:
            "radial-gradient(ellipse, rgba(0,87,217,.05) 0%, transparent 70%)",
          animation: "float-blob 7s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: -80,
          width: 480,
          height: 420,
          background:
            "radial-gradient(ellipse, rgba(0,87,217,.04) 0%, transparent 70%)",
          animation: "float-blob 9s ease-in-out infinite 2s",
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
          <pattern
            id="grid"
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
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

const Divider = () => (
  <div
    style={{
      height: 1,
      background: "#e2e6ef",
      position: "relative",
      zIndex: 2,
    }}
  />
);

// ─── Section label ────────────────────────────────────────────────────────────

const Label = ({ text }: { text: string }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      color: "#0057d9",
      marginBottom: 10,
    }}
  >
    {text}
  </div>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ destCount }: { destCount: number | null }) {
  const countLabel = destCount != null ? `${destCount}+` : "190+";

  const stats = [
    { value: countLabel, label: "Countries Covered" },
    { value: "10K+", label: "Happy Travelers" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        padding: "96px 5% 52px",
        maxWidth: 1280,
        margin: "0 auto",
        boxSizing: "border-box" as const,
      }}
    >
      <div
        className="ab-hero"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* ── Left: text ── */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#e8f0fd",
              border: "1px solid #c5d9fb",
              borderRadius: 999,
              padding: "6px 18px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0057d9",
                display: "inline-block",
                animation: "blink-dot 1.6s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase" as const,
                color: "#0057d9",
              }}
            >
              About YH ESIM
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(2.2rem,4vw,3.4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#1a1f2e",
              margin: "0 0 20px",
              letterSpacing: "-0.025em",
              animation: "fade-up .6s ease both .05s",
            }}
          >
            Connecting the world,{" "}
            <span style={{ color: "#0057d9", whiteSpace: "nowrap" }}>
              one eSIM at a time
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(.95rem,1.8vw,1.1rem)",
              color: "#5a6478",
              lineHeight: 1.8,
              maxWidth: 520,
              marginBottom: 36,
              animation: "fade-up .6s ease both .15s",
            }}
          >
            YH ESIM was founded with a single mission — make global connectivity
            effortless, affordable, and instant. No plastic cards. No roaming
            surprises. No borders.
          </p>

          <Link
            href="/destinations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#0057d9",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: 12,
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              animation: "btn-pulse 3s ease-in-out infinite",
            }}
          >
            Browse eSIM Plans →
          </Link>

          {/* Stats row */}
          <div
            className="ab-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
              marginTop: 40,
              paddingTop: 32,
              borderTop: "1px solid #e2e6ef",
              animation: "fade-up .6s ease both .25s",
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#0057d9",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#9aa3b2",
                    marginTop: 5,
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: photo ── */}
        <div
          className="ab-hero-photo"
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            aspectRatio: "4/3",
            animation: "fade-up .6s ease both .1s",
            boxShadow: "0 8px 40px rgba(0,87,217,0.12)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=80"
            alt="Traveler staying connected abroad"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(0,87,217,0.18) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              borderRadius: 14,
              padding: "12px 18px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
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
                background: "#e8f0fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
            >
              ✈️
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#0057d9",
                  lineHeight: 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {countLabel} Countries
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#9aa3b2",
                  marginTop: 4,
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.07em",
                }}
              >
                Instant eSIM coverage
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "#0057d9",
              color: "#fff",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
            }}
          >
            Zero roaming fees
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── eSIM Technology ──────────────────────────────────────────────────────────

const FLOW_STEPS = [
  {
    step: "01",
    icon: "🛒",
    label: "Choose a plan",
    sub: "Pick your destination and data size. Plans start from $1.99.",
  },
  {
    step: "02",
    icon: "📧",
    label: "Get your QR code",
    sub: "Receive it instantly by email — no shipping, no waiting.",
  },
  {
    step: "03",
    icon: "📷",
    label: "Scan & install",
    sub: "Open your phone's camera, scan the QR code. Done in 2 minutes.",
  },
  {
    step: "04",
    icon: "✈️",
    label: "Land & connect",
    sub: "Your eSIM auto-connects the moment you arrive at your destination.",
  },
  {
    step: "05",
    icon: "🌐",
    label: "Travel freely",
    sub: "Browse, call, and navigate without any roaming surprises.",
  },
];

function EsimTech() {
  const { ref, visible } = useFadeIn();

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "64px 5%",
        maxWidth: 1280,
        margin: "0 auto",
        ...fadeStyle(visible),
      }}
    >
      <Label text="eSIM technology" />
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.5rem,3vw,2.2rem)",
          fontWeight: 800,
          color: "#1a1f2e",
          marginBottom: 10,
        }}
      >
        What makes eSIM different
      </h2>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#5a6478",
          lineHeight: 1.75,
          maxWidth: 580,
          marginBottom: 36,
        }}
      >
        An eSIM is a digital SIM built into your phone. Instead of buying a
        plastic card, you download a plan in seconds — and you're connected.
        That's it.
      </p>

      {/* Quick benefit pills */}
      <div
        className="ab-pills"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}
      >
        {[
          { icon: "⚡", text: "Instant activation" },
          { icon: "🔒", text: "AES-256 encrypted" },
          { icon: "📶", text: "5G & LTE ready" },
          { icon: "🌍", text: "190+ countries" },
          { icon: "♻️", text: "Zero plastic" },
        ].map((pill) => (
          <div
            key={pill.text}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#ffffff",
              border: "1px solid #e2e6ef",
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#1a1f2e",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span>{pill.icon}</span>
            {pill.text}
          </div>
        ))}
      </div>

      {/* How it works */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e6ef",
          borderRadius: 20,
          padding: "32px 28px",
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#9aa3b2",
            marginBottom: 24,
          }}
        >
          How it works — 5 simple steps
        </div>
        <div
          className="ab-flow"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
            position: "relative",
          }}
        >
          <div
            className="ab-flow-line"
            style={{
              position: "absolute",
              top: 28,
              left: "10%",
              right: "10%",
              height: 2,
              background: "#e8f0fd",
              zIndex: 0,
            }}
          />
          {FLOW_STEPS.map((step, i) => (
            <div
              key={step.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
                position: "relative",
                zIndex: 1,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#e8f0fd",
                  border: "2px solid #c5d9fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                }}
              >
                {step.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#0057d9",
                    letterSpacing: "0.09em",
                    marginBottom: 3,
                  }}
                >
                  STEP {step.step}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#1a1f2e",
                    marginBottom: 5,
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: "0.74rem",
                    color: "#5a6478",
                    lineHeight: 1.55,
                  }}
                >
                  {step.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div
        className="ab-compare"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Physical SIM card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e6ef",
            borderRadius: 18,
            padding: "24px 22px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>💳</span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#1a1f2e",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Physical SIM
            </span>
          </div>
          {[
            "Must visit airport kiosk or store",
            "Lose your home number while roaming",
            "Plastic waste + eject tool needed",
            "One carrier at a time",
            "Activation can take 30+ minutes",
          ].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 9,
                padding: "6px 0",
                borderTop: "1px solid #f0f2f7",
                fontSize: "0.82rem",
                color: "#5a6478",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#e03030", flexShrink: 0 }}>✕</span>
              {t}
            </div>
          ))}
        </div>

        {/* YH eSIM card — overflow:visible so badge never clips */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #0057d9",
            borderRadius: 18,
            padding: "24px 22px",
            position: "relative",
            overflow: "visible",
            boxShadow: "0 2px 16px rgba(0,87,217,.08)",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "#0057d9",
              borderRadius: "16px 16px 0 0",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>📲</span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#1a1f2e",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              YH eSIM
            </span>
            <span
              className="ab-rec-badge"
              style={{
                marginLeft: "auto",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                background: "#edfaf4",
                color: "#00a86b",
                padding: "3px 9px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              Recommended
            </span>
          </div>
          {[
            "Buy from anywhere, any time online",
            "Keep your home number on dual SIM",
            "Zero plastic — fully digital profile",
            "Store up to 8+ profiles on one device",
            "Live in under 3 minutes after purchase",
          ].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 9,
                padding: "6px 0",
                borderTop: "1px solid #f0f2f7",
                fontSize: "0.82rem",
                color: "#1a1f2e",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#00a86b", flexShrink: 0 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Tech spec cards */}
      <div
        className="ab-specs"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
        }}
      >
        {[
          {
            badge: "GSMA",
            label: "Certified standard",
            desc: "All YH eSIMs follow the GSMA SGP.22 RSP standard — the global benchmark for consumer eSIM profiles and carrier interoperability.",
          },
          {
            badge: "5G / LTE",
            label: "Network support",
            desc: "Where available, plans connect to 5G NR or LTE-A networks. Automatic fallback to 3G ensures coverage even in rural zones.",
          },
          {
            badge: "AES-256",
            label: "Profile encryption",
            desc: "Every eSIM profile is encrypted end-to-end. Your identity and data are protected from the moment of download to activation.",
          },
        ].map((c, i) => (
          <div
            key={c.badge}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e6ef",
              borderRadius: 16,
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: `opacity .5s ease ${0.1 + i * 0.1}s, transform .5s ease ${0.1 + i * 0.1}s`,
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#0057d9",
                marginBottom: 2,
              }}
            >
              {c.badge}
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.09em",
                color: "#9aa3b2",
                marginBottom: 10,
              }}
            >
              {c.label}
            </div>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#5a6478",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Coverage ─────────────────────────────────────────────────────────────────

const REGIONS = [
  { name: "North America", pct: 100 },
  { name: "Europe", pct: 99 },
  { name: "Asia Pacific", pct: 96 },
  { name: "Latin America", pct: 88 },
  { name: "Middle East", pct: 82 },
  { name: "Africa", pct: 74 },
];

const DEVICES = [
  {
    name: "iPhone",
    detail: "XS and later (2018+)",
    status: "Supported",
    ok: true,
  },
  {
    name: "Samsung Galaxy",
    detail: "S20, Z Fold, A54 and newer",
    status: "Supported",
    ok: true,
  },
  {
    name: "Google Pixel",
    detail: "Pixel 3 and later",
    status: "Supported",
    ok: true,
  },
  {
    name: "OnePlus / OPPO",
    detail: "Select 2022+ flagships",
    status: "Check model",
    ok: false,
  },
];

function Coverage() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "64px 5%",
        maxWidth: 1280,
        margin: "0 auto",
        ...fadeStyle(visible),
      }}
    >
      <div
        className="ab-coverage"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div>
          <Label text="Global coverage" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#1a1f2e",
              marginBottom: 10,
            }}
          >
            190+ countries, one account
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#5a6478",
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            Our carrier partnerships span every major region. Whether you're
            landing in Tokyo, Cape Town, or Buenos Aires, a YH plan gets you
            online instantly.
          </p>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e6ef",
              borderRadius: 16,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            {REGIONS.map((r, i) => (
              <div
                key={r.name}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#5a6478",
                    minWidth: 108,
                    fontWeight: 500,
                  }}
                >
                  {r.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 4,
                    background: "#e8f0fd",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      background: "#0057d9",
                      width: 0,
                      ...(visible
                        ? {
                            animation: `grow-bar .9s ease forwards ${0.05 + i * 0.08}s`,
                            ["--w" as string]: `${r.pct}%`,
                          }
                        : {}),
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#0057d9",
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {r.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label text="Compatible devices" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#1a1f2e",
              marginBottom: 10,
            }}
          >
            Is your phone ready?
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#5a6478",
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            Most flagship phones from 2019 onward include eSIM support. Check
            your brand below, or visit our compatibility checker for a full
            device list.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEVICES.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "#ffffff",
                  border: "1px solid #e2e6ef",
                  borderRadius: 12,
                  fontSize: "0.85rem",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                }}
              >
                <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>📱</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#1a1f2e" }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9aa3b2" }}>
                    {d.detail}
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.07em",
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: d.ok ? "#edfaf4" : "#fef9e7",
                    color: d.ok ? "#00a86b" : "#8a6000",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────

function Mission() {
  const { ref, visible } = useFadeIn();
  const cards = [
    {
      icon: "🎯",
      title: "Mission",
      desc: "Eliminate the friction of international travel by providing instant, reliable, and affordable eSIM connectivity to travelers in 190+ countries — starting from the moment they book a trip.",
    },
    {
      icon: "👁️",
      title: "Vision",
      desc: "A world where staying connected while traveling is as simple as boarding a plane — no SIM swaps, no roaming surprises, no wasted time at airport counters or carrier stores.",
    },
    {
      icon: "💙",
      title: "Values",
      desc: "Transparency, simplicity, and travelers first. Every product decision begins with one question: does this make the travel experience meaningfully easier and more affordable?",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "64px 5%",
        maxWidth: 1280,
        margin: "0 auto",
        ...fadeStyle(visible),
      }}
    >
      <Label text="Our mission" />
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.5rem,3vw,2.2rem)",
          fontWeight: 800,
          color: "#1a1f2e",
          marginBottom: 36,
        }}
      >
        Why we exist
      </h2>
      <div
        className="ab-mission"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {cards.map((c, i) => (
          <div
            key={c.title}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e6ef",
              borderRadius: 20,
              padding: "32px 26px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .5s ease ${i * 0.12}s, transform .5s ease ${i * 0.12}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `hsl(${215 + i * 12}, 85%, ${50 + i * 5}%)`,
                borderRadius: "20px 20px 0 0",
              }}
            />
            <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{c.icon}</div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#1a1f2e",
                marginBottom: 10,
              }}
            >
              {c.title}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#5a6478",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Story + Why ──────────────────────────────────────────────────────────────

const TIMELINE = [
  {
    year: "2020",
    title: "The idea",
    desc: "Founders experience connectivity failures across 5 countries in two weeks. The concept for YH ESIM is born.",
  },
  {
    year: "2021",
    title: "First launch",
    desc: "Beta platform launches covering 30 countries in Asia. First 500 travelers onboarded within two months.",
  },
  {
    year: "2022",
    title: "Regional expansion",
    desc: "Coverage expands to Europe, the Americas, and the Middle East. Carrier partnerships grow to 80+ operators globally.",
  },
  {
    year: "2023",
    title: "10,000 travelers",
    desc: "YH ESIM surpasses 10K active users. 24/7 live support launched. Plans now cover 190+ destinations.",
  },
  {
    year: "2024–25",
    title: "5G & beyond",
    desc: "5G plan rollout begins. New features: usage alerts, auto-renew, and multi-device management.",
  },
];

const WHY = [
  {
    icon: "⚡",
    title: "Instant activation",
    desc: "Connected in under 3 min from purchase. No shipping, no waiting.",
  },
  {
    icon: "💰",
    title: "Transparent pricing",
    desc: "No hidden fees, no surprise roaming. What you see is what you pay.",
  },
  {
    icon: "🌐",
    title: "Global reach",
    desc: "190+ countries, top-tier carrier partners on every continent.",
  },
  {
    icon: "🔒",
    title: "Secure & reliable",
    desc: "AES-256 encryption, 99.9% uptime, enterprise-grade infrastructure.",
  },
  {
    icon: "💬",
    title: "24/7 human support",
    desc: "Real people, not bots — around the clock wherever you are.",
  },
  {
    icon: "♻️",
    title: "Eco-friendly",
    desc: "Zero plastic SIM cards. A cleaner choice for the modern traveler.",
  },
];

function StoryAndWhy() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "64px 5%",
        maxWidth: 1280,
        margin: "0 auto",
        ...fadeStyle(visible),
      }}
    >
      <div
        className="ab-story"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}
      >
        <div>
          <Label text="Our story" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#1a1f2e",
              marginBottom: 10,
            }}
          >
            Built from a traveler's frustration
          </h2>
          <p
            style={{
              fontSize: "0.87rem",
              color: "#5a6478",
              lineHeight: 1.75,
              marginBottom: 24,
            }}
          >
            From a missed connection in Bangkok to a company serving thousands
            across Southeast Asia and beyond — here's how we got here.
          </p>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div
              style={{
                position: "absolute",
                left: 5,
                top: 0,
                bottom: 0,
                width: 1,
                background: "#e2e6ef",
              }}
            />
            {TIMELINE.map((t, i) => (
              <div
                key={t.year}
                style={{
                  position: "relative",
                  paddingLeft: 18,
                  paddingBottom: i < TIMELINE.length - 1 ? 22 : 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -13,
                    top: 4,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#e8f0fd",
                    border: "1.5px solid #0057d9",
                  }}
                />
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#0057d9",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.09em",
                    marginBottom: 2,
                  }}
                >
                  {t.year}
                </div>
                <div
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#1a1f2e",
                    marginBottom: 3,
                  }}
                >
                  {t.title}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#5a6478",
                    lineHeight: 1.65,
                  }}
                >
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label text="Why choose YH" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#1a1f2e",
              marginBottom: 10,
            }}
          >
            Everything you need, nothing you don't
          </h2>
          <p
            style={{
              fontSize: "0.87rem",
              color: "#5a6478",
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            Six reasons thousands of travelers keep coming back to YH for every
            trip.
          </p>
          <div
            className="ab-why"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {WHY.map((w, i) => (
              <div
                key={w.title}
                style={{
                  display: "flex",
                  gap: 12,
                  background: "#ffffff",
                  border: "1px solid #e2e6ef",
                  borderRadius: 14,
                  padding: "16px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity .45s ease ${i * 0.07}s, transform .45s ease ${i * 0.07}s`,
                }}
              >
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                  {w.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#1a1f2e",
                      marginBottom: 3,
                    }}
                  >
                    {w.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "#5a6478",
                      lineHeight: 1.6,
                    }}
                  >
                    {w.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        padding: "64px 5% 88px",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "#0057d9",
          borderRadius: 24,
          padding: "56px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 50px rgba(0,87,217,.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 350,
            background:
              "radial-gradient(ellipse, rgba(255,255,255,.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.6rem,3.5vw,2.4rem)",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 12,
          }}
        >
          Ready to travel smarter?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.97rem",
            lineHeight: 1.75,
            maxWidth: 460,
            margin: "0 auto 32px",
          }}
        >
          Join thousands of travelers who trust YH for seamless global
          connectivity. Your next adventure starts with an eSIM.
        </p>
        <div
          className="ab-cta-btns"
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/destinations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#ffffff",
              color: "#0057d9",
              padding: "14px 36px",
              borderRadius: 12,
              fontSize: "0.97rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              animation: "btn-pulse 3s ease-in-out infinite",
            }}
          >
            Browse Plans →
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,.15)",
              color: "#ffffff",
              padding: "14px 36px",
              borderRadius: 12,
              fontSize: "0.97rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid rgba(255,255,255,.3)",
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [destCount, setDestCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestCount((d.data ?? []).length))
      .catch(() => {});

    if (typeof window === "undefined") return;
    const prev = document.body.style.background;
    document.body.style.background = "#f7f4ef";
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <main
      style={{
        background: "transparent",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1a1f2e",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Background />
      <Navigation />
      <Hero destCount={destCount} />
      <Divider />
      <EsimTech />
      <Divider />
      <Coverage />
      <Divider />
      <Mission />
      <Divider />
      <StoryAndWhy />
      <CtaBanner />
      <Footer />
    </main>
  );
}
