"use client";

import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { useState } from "react";
import Link from "next/link";

// ─── TOKENS — cream/white palette with blue accents ───────────────────────────
const T = {
  // Backgrounds
  pageBg: "#f7f4ef", // warm cream page base
  surface: "#ffffff", // white cards / panels
  surfaceHigh: "#f7f4ef", // raised elements on cards (cream)
  infoBg: "#e8f0fd", // blue-tinted inset
  greenBg: "#edfaf4", // green-tinted inset

  // Borders
  border: "#e2e6ef",
  borderAccent: "#0057d9",

  // Brand colours
  primary: "#0057d9",
  primaryLight: "#e8f0fd",
  cyan: "#3b7cf6",
  green: "#00a86b",
  red: "#e03030",

  // Text
  textPrimary: "#1a1f2e",
  textSecondary: "#5a6478",
  textMuted: "#9aa3b2",
};

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ height: 1, background: T.border, margin: "0 32px" }} />
);

// ─── SECTION HEADING ──────────────────────────────────────────────────────────
function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)",
          fontWeight: 700,
          color: T.textPrimary,
          margin: "0 0 5px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ color: T.textSecondary, fontSize: 13, margin: 0 }}>{sub}</p>
      )}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        padding: "40px 32px 32px",
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 32,
        alignItems: "center",
      }}
    >
      {/* Left: text */}
      <div>
        <span
          style={{
            display: "inline-block",
            background: T.infoBg,
            color: T.primary,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            padding: "4px 12px",
            borderRadius: 999,
            border: `1px solid #c5d9fb`,
            marginBottom: 14,
          }}
        >
          Travel smarter
        </span>

        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 700,
            color: T.textPrimary,
            lineHeight: 1.2,
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          What's an eSIM?{" "}
          <span style={{ color: T.primary }}>Why do travellers love it?</span>
        </h1>

        <p
          style={{
            fontSize: "0.97rem",
            color: T.textSecondary,
            lineHeight: 1.7,
            margin: "0 0 20px",
            maxWidth: 500,
          }}
        >
          An eSIM is a chip already inside your phone. Download a data plan
          before you even pack — no swapping, no airport queues, no scissors
          needed.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 8,
            marginBottom: 20,
          }}
        >
          {[
            { icon: "🌍", text: "200+ countries" },
            { icon: "⚡", text: "Ready in minutes" },
            { icon: "📱", text: "No physical SIM" },
          ].map((item) => (
            <span
              key={item.text}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: T.surface,
                border: `1px solid ${T.border}`,
                color: T.textSecondary,
                fontSize: 13,
                fontWeight: 500,
                padding: "5px 14px",
                borderRadius: 999,
              }}
            >
              {item.icon} {item.text}
            </span>
          ))}
        </div>

        <Link
          href="/destinations"
          style={{
            display: "inline-block",
            background: T.primary,
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 10,
            fontSize: "0.95rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Browse eSIM Plans →
        </Link>
      </div>

      {/* Right: phone status card */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: "20px 18px",
          minWidth: 190,
          maxWidth: 210,
          textAlign: "center" as const,
          boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 14 }}>📱</div>
        {[
          {
            label: "Status",
            value: "✓ Connected",
            color: T.primary,
            bg: T.infoBg,
          },
          {
            label: "Home SIM",
            value: "📞 Still active",
            color: T.textPrimary,
            bg: T.surfaceHigh,
          },
          {
            label: "Data",
            value: "🌐 4.2 GB left",
            color: T.green,
            bg: T.greenBg,
          },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              background: row.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 6,
            }}
          >
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>
              {row.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: row.color }}>
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PHYSICAL vs eSIM ─────────────────────────────────────────────────────────
function PhysicalVsEsim() {
  return (
    <section style={{ padding: "32px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeading title="Old way vs the new way" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        {/* Physical SIM */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 20 }}>💳</span>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: T.textPrimary,
                margin: 0,
              }}
            >
              Physical SIM
            </h3>
          </div>
          {[
            "Queue at an airport kiosk",
            "Tiny card — easy to lose",
            "Need a paperclip to swap it",
            "One country, one card",
            "Your home number goes dark",
            "Days to arrive by post",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  color: T.red,
                  fontWeight: 700,
                  fontSize: 13,
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                ✕
              </span>
              <span
                style={{
                  color: T.textSecondary,
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* eSIM */}
        <div
          style={{
            background: T.surface,
            border: `2px solid ${T.primary}`,
            borderRadius: 14,
            padding: "18px 20px",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%)",
              background: T.primary,
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "3px 12px",
              borderRadius: 999,
              textTransform: "uppercase" as const,
              whiteSpace: "nowrap" as const,
            }}
          >
            Recommended
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 20 }}>📱</span>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: T.textPrimary,
                margin: 0,
              }}
            >
              eSIM
            </h3>
          </div>
          {[
            "Buy from your sofa, use abroad",
            "Nothing to lose or break",
            "Scan a QR code — done",
            "Switch countries instantly",
            "Your home number stays active",
            "Ready in under 2 minutes",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  color: T.primary,
                  fontWeight: 700,
                  fontSize: 13,
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span
                style={{
                  color: T.textSecondary,
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div
        style={{
          background: T.infoBg,
          border: `1px solid #c5d9fb`,
          borderRadius: 10,
          padding: "12px 16px",
          marginTop: 14,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
        <p
          style={{
            fontSize: 13,
            color: T.textSecondary,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          <strong style={{ color: T.textPrimary }}>Good to know:</strong> your
          regular SIM stays in your phone the whole time. Calls and texts from
          home still work — the eSIM just handles data abroad.
        </p>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "1",
      icon: "🌍",
      title: "Pick your destination",
      desc: "Browse plans for the country (or countries) you're visiting. Choose data size and duration.",
    },
    {
      num: "2",
      icon: "💳",
      title: "Buy instantly online",
      desc: "Pay in seconds. A QR code lands in your email straight away — no delivery needed.",
    },
    {
      num: "3",
      icon: "📲",
      title: "Scan the QR code",
      desc: "Go to Settings → Mobile data → Add eSIM. Point your camera at the code. Done in 2 minutes.",
    },
    {
      num: "4",
      icon: "✈️",
      title: "Land and connect",
      desc: "Your eSIM kicks in the moment you land. Step off the plane and you're already online.",
    },
  ];

  return (
    <section style={{ padding: "32px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeading title="How it works in 4 easy steps" />
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step.num}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: "16px 20px",
              borderBottom:
                i < steps.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: T.infoBg,
                border: `1px solid #c5d9fb`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: T.primary,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {step.num}
            </div>
            <div>
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: T.textPrimary,
                  margin: "0 0 3px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{step.icon}</span> {step.title}
              </h3>
              <p
                style={{
                  color: T.textSecondary,
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── DEVICE COMPATIBILITY ─────────────────────────────────────────────────────
function DeviceCompatibility() {
  const brands = [
    { name: "Apple", icon: "🍎", models: "iPhone XS and newer" },
    { name: "Samsung", icon: "📱", models: "Galaxy S20 and newer" },
    { name: "Google", icon: "🔍", models: "Pixel 3 and newer" },
    { name: "Motorola", icon: "📡", models: "Razr 2019 and newer" },
    { name: "Huawei", icon: "📶", models: "P40 series and newer" },
    { name: "Microsoft", icon: "💻", models: "Surface Duo series" },
  ];

  return (
    <section style={{ padding: "32px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeading
        title="Does my phone support eSIM?"
        sub="Most phones sold after 2019 do. Check yours below."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 10,
        }}
      >
        {brands.map((b) => (
          <div
            key={b.name}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: T.textPrimary,
                  fontSize: "0.85rem",
                }}
              >
                {b.name}
              </div>
              <div
                style={{
                  color: T.textSecondary,
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                {b.models}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: T.textMuted, fontSize: 12, margin: "10px 0 0" }}>
        💡 Not sure? Go to{" "}
        <strong style={{ color: T.textSecondary }}>
          Settings → About phone
        </strong>{" "}
        and look for "eSIM" or "digital SIM".
      </p>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Will my family still be able to call me?",
      a: "Yes! Your regular SIM card stays in your phone and handles calls and texts as normal. The eSIM just handles your data connection abroad.",
    },
    {
      q: "Do I need to set it up at the airport?",
      a: "Nope. You can install your eSIM days before you travel. The plan activates automatically when you arrive in the destination country.",
    },
    {
      q: "What if I visit multiple countries in one trip?",
      a: "We have regional plans that cover multiple countries. You can also install several eSIMs and switch between them from your phone settings.",
    },
    {
      q: "Is it safe? Could someone steal my data?",
      a: "eSIMs are actually more secure than physical SIMs — they can't be removed or cloned. They use the same encryption that banks rely on.",
    },
    {
      q: "What if I run out of data mid-trip?",
      a: "Buy a top-up from our website in seconds. It installs straight onto your phone — no new QR code, no hassle.",
    },
    {
      q: "What happens if I factory reset my phone?",
      a: "Factory resetting removes eSIM profiles. Note your details before resetting. Contact us and we can help you re-download your plan.",
    },
  ];

  return (
    <section style={{ padding: "32px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeading title="Travellers often ask…" />
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              borderBottom:
                i < faqs.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                background: open === i ? T.infoBg : "none",
                border: "none",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                textAlign: "left" as const,
              }}
            >
              <span
                style={{
                  color: T.textPrimary,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  lineHeight: 1.4,
                }}
              >
                {faq.q}
              </span>
              <span
                style={{
                  color: T.primary,
                  fontSize: "1.2rem",
                  flexShrink: 0,
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  transition: "transform 0.2s ease",
                  lineHeight: 1,
                  display: "inline-block",
                }}
              >
                +
              </span>
            </button>
            {open === i && (
              <p
                style={{
                  color: T.textSecondary,
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  padding: "0 20px 14px",
                  margin: 0,
                  background: T.infoBg,
                }}
              >
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section
      style={{ padding: "24px 32px 48px", maxWidth: 1200, margin: "0 auto" }}
    >
      <div
        style={{
          background: T.primary,
          borderRadius: 16,
          padding: "32px",
          textAlign: "center" as const,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: 10,
        }}
      >
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          Get connected before you pack
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.92rem",
            margin: 0,
            maxWidth: 380,
            lineHeight: 1.65,
          }}
        >
          Browse eSIM plans for 200+ countries. Buy now, use when you land.
        </p>
        <Link
          href="/destinations"
          style={{
            display: "inline-block",
            background: "#ffffff",
            color: T.primary,
            padding: "11px 26px",
            borderRadius: 10,
            fontSize: "0.93rem",
            fontWeight: 700,
            textDecoration: "none",
            marginTop: 4,
          }}
        >
          Browse eSIM Plans →
        </Link>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function WhatIsEsimPage() {
  return (
    <main
      style={{
        background: "#f7f4ef",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        a:hover { opacity: 0.88; }
      `}</style>
      <Navigation />
      <Hero />
      <Divider />
      <PhysicalVsEsim />
      <Divider />
      <HowItWorks />
      <Divider />
      <DeviceCompatibility />
      <Divider />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
