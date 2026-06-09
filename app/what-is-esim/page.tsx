"use client";

import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// ─── Scroll fade-in ───────────────────────────────────────────────────────────
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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

const Divider = () => (
  <div
    style={{
      height: 1,
      background:
        "linear-gradient(90deg, transparent, rgba(0,140,255,0.35), transparent)",
      position: "relative",
      zIndex: 2,
    }}
  />
);

// ─── Tech Background with circuit lines + floating nodes ──────────────────────
function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #dff2ff 0%, #c8e8ff 30%, #b0d8ff 60%, #c4eeff 100%)",
      }}
    >
      <style>{`
        @keyframes pulse-node { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        @keyframes data-flow { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
        @keyframes scan-line { 0%{top:-4px} 100%{top:100%} }
        @keyframes float-blob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
        @keyframes spin-ring { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* Gradient blobs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 650,
          background:
            "radial-gradient(ellipse, rgba(0,160,255,0.2) 0%, transparent 65%)",
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
            "radial-gradient(ellipse, rgba(0,120,255,0.12) 0%, transparent 70%)",
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
            "radial-gradient(ellipse, rgba(0,200,255,0.14) 0%, transparent 70%)",
          animation: "float-blob 9s ease-in-out infinite 2s",
        }}
      />

      {/* Circuit SVG */}
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
              stroke="#0080FF"
              strokeWidth="0.5"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Circuit traces */}
        {[
          "M 80 120 L 80 220 L 200 220 L 200 320",
          "M 300 80 L 420 80 L 420 180 L 560 180",
          "M 700 200 L 700 340 L 820 340",
          "M 900 100 L 1020 100 L 1020 260 L 1160 260",
          "M 160 500 L 290 500 L 290 420 L 440 420",
          "M 600 480 L 740 480 L 740 580",
          "M 1050 440 L 1050 560 L 880 560",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#0072FF"
            strokeWidth="1.2"
            opacity="0.13"
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{
              animation: `data-flow ${2.5 + i * 0.4}s linear infinite ${i * 0.3}s`,
            }}
          />
        ))}

        {/* Circuit nodes */}
        {[
          [80, 120],
          [80, 220],
          [200, 220],
          [200, 320],
          [300, 80],
          [420, 80],
          [420, 180],
          [560, 180],
          [700, 200],
          [700, 340],
          [820, 340],
          [900, 100],
          [1020, 100],
          [1020, 260],
          [160, 500],
          [290, 500],
          [440, 420],
          [600, 480],
          [740, 480],
          [740, 580],
          [1050, 440],
          [880, 560],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#0090FF"
            opacity="0.25"
            style={{
              animation: `pulse-node ${1.8 + (i % 4) * 0.5}s ease-in-out infinite ${(i * 0.2) % 2}s`,
            }}
          />
        ))}
      </svg>

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(0,180,255,0.25), transparent)",
          animation: "scan-line 6s linear infinite",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ─── Animated stat card ───────────────────────────────────────────────────────
function StatCard({
  value,
  suffix,
  label,
  started,
}: {
  value: number | null;
  suffix?: string;
  label: string;
  started: boolean;
}) {
  const count = useCounter(value ?? 0, 1600, value !== null && started);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(0,140,255,0.28)",
        borderRadius: 16,
        padding: "20px 32px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 6px 28px rgba(0,100,255,0.1)",
        minWidth: 130,
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
          height: 2,
          background: "linear-gradient(90deg, #0072FF, #00C8FF)",
          borderRadius: "16px 16px 0 0",
        }}
      />
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          color: "#0055cc",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value === null
          ? "—"
          : value === 0 && !started
            ? "0"
            : value !== null
              ? count
              : "—"}
        {suffix}
      </div>
      <div
        style={{
          fontSize: "0.73rem",
          color: "#4a85b0",
          marginTop: 5,
          letterSpacing: "0.07em",
          fontWeight: 600,
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        padding: "110px 24px 90px",
        textAlign: "center",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes eyebrow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,144,255,0.3)} 50%{box-shadow:0 0 0 8px rgba(0,144,255,0)} }
        @keyframes hero-title-in { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hero-sub-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btn-glow { 0%,100%{box-shadow:0 8px 28px rgba(0,114,255,0.35)} 50%{box-shadow:0 8px 44px rgba(0,180,255,0.55)} }
        @keyframes orbit { 0%{transform:rotate(0deg) translateX(32px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(32px) rotate(-360deg)} }
      `}</style>

      {/* Eyebrow */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,144,255,0.1)",
          border: "1px solid rgba(0,144,255,0.3)",
          borderRadius: 999,
          padding: "7px 22px",
          marginBottom: 36,
          animation: "eyebrow-pulse 3s ease-in-out infinite",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#0090FF",
            display: "inline-block",
            boxShadow: "0 0 10px #0090FF",
            animation: "pulse-node 1.5s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "#0055cc",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          eSIM Explained
        </span>
      </div>

      {/* Title — solid color to avoid webkit clip box bug */}
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
          fontWeight: 800,
          lineHeight: 1.08,
          color: "#002f6c",
          margin: "0 0 24px",
          letterSpacing: "-0.025em",
          animation: "hero-title-in 0.7s ease both 0.1s",
        }}
      >
        What is an{" "}
        <span
          style={{
            color: "#0072FF",
            position: "relative",
            display: "inline-block",
          }}
        >
          eSIM?
          {/* underline accent */}
          <span
            style={{
              position: "absolute",
              bottom: -4,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #0072FF, #00C8FF)",
              borderRadius: 2,
            }}
          />
        </span>
      </h1>

      <p
        style={{
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          color: "#2e6a96",
          lineHeight: 1.8,
          maxWidth: 600,
          margin: "0 auto 52px",
          animation: "hero-sub-in 0.7s ease both 0.25s",
        }}
      >
        An eSIM (embedded SIM) is a digital SIM built directly into your device
        — no physical card needed. Activate a data plan instantly, anywhere in
        the world, straight from your phone.
      </p>

      {/* Animated stat cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 16,
          justifyContent: "center",
          marginBottom: 52,
        }}
      >
        <StatCard value={200} suffix="+" label="Countries" started={started} />
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(0,140,255,0.28)",
            borderRadius: 16,
            padding: "20px 32px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 6px 28px rgba(0,100,255,0.1)",
            minWidth: 130,
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
              height: 2,
              background: "linear-gradient(90deg, #0072FF, #00C8FF)",
              borderRadius: "16px 16px 0 0",
            }}
          />
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0055cc",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {started ? (
              <span>
                <span style={{ marginLeft: -8 }}>Instant</span>
              </span>
            ) : (
              "—"
            )}
          </div>
          <div
            style={{
              fontSize: "0.73rem",
              color: "#4a85b0",
              marginTop: 5,
              letterSpacing: "0.07em",
              fontWeight: 600,
              textTransform: "uppercase" as const,
            }}
          >
            Activation
          </div>
        </div>
        <StatCard
          value={0}
          suffix=" SIM swaps"
          label="Required"
          started={started}
        />
      </div>

      <Link
        href="/destinations"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, #0055ff, #00b8ff)",
          color: "#fff",
          padding: "16px 40px",
          borderRadius: 14,
          fontSize: "1rem",
          fontWeight: 700,
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.01em",
          animation: "btn-glow 3s ease-in-out infinite",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.8)",
            display: "inline-block",
            animation: "pulse-node 1.5s infinite",
          }}
        />
        Browse eSIM Plans →
      </Link>
    </section>
  );
}

// ─── PHYSICAL vs eSIM ─────────────────────────────────────────────────────────
function PhysicalVsEsim() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 800,
          color: "#002f6c",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Physical SIM vs eSIM
      </h2>
      <p
        style={{
          color: "#4a85b0",
          textAlign: "center",
          marginBottom: 52,
          fontSize: "0.97rem",
        }}
      >
        See exactly how they compare
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {/* Physical SIM card */}
        <div
          style={{
            background: "rgba(255,255,255,0.62)",
            border: "1px solid rgba(0,120,255,0.15)",
            borderRadius: 22,
            padding: "40px 36px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(0,80,180,0.07)",
          }}
        >
          <div style={{ fontSize: "2.6rem", marginBottom: 18 }}>💳</div>
          <h3
            style={{
              color: "#002f6c",
              fontWeight: 700,
              fontSize: "1.2rem",
              marginBottom: 26,
            }}
          >
            Physical SIM
          </h3>
          {[
            "Requires a physical card",
            "Visit store or wait for shipping",
            "Must swap cards per country",
            "One carrier at a time",
            "Risk of losing or damage",
            "Days to activate",
          ].map((item, i) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 14,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.4s ease ${0.1 + i * 0.06}s, transform 0.4s ease ${0.1 + i * 0.06}s`,
              }}
            >
              <span
                style={{
                  color: "#ef4444",
                  flexShrink: 0,
                  marginTop: 1,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </span>
              <span
                style={{
                  color: "#3d6e90",
                  fontSize: "0.9rem",
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* eSIM card */}
        <div
          style={{
            background:
              "linear-gradient(145deg, rgba(0,100,255,0.1), rgba(0,200,255,0.07))",
            border: "1px solid rgba(0,140,255,0.35)",
            borderRadius: 22,
            padding: "40px 36px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 48px rgba(0,100,255,0.14)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -70,
              right: -70,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(0,160,255,0.1)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
          {/* animated corner circuit */}
          <svg
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 60,
              height: 60,
              opacity: 0.2,
            }}
            viewBox="0 0 60 60"
          >
            <path
              d="M 50 10 L 50 30 L 30 30 L 30 50"
              fill="none"
              stroke="#0072FF"
              strokeWidth="2"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{ animation: "data-flow 2s linear infinite" }}
            />
            <circle
              cx="50"
              cy="10"
              r="3"
              fill="#0090FF"
              style={{ animation: "pulse-node 1.5s infinite" }}
            />
            <circle
              cx="30"
              cy="50"
              r="3"
              fill="#0090FF"
              style={{ animation: "pulse-node 1.5s infinite 0.5s" }}
            />
          </svg>
          <div style={{ fontSize: "2.6rem", marginBottom: 18 }}>📱</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 26,
            }}
          >
            <h3
              style={{
                color: "#002f6c",
                fontWeight: 700,
                fontSize: "1.2rem",
                margin: 0,
              }}
            >
              eSIM
            </h3>
            <span
              style={{
                background: "linear-gradient(90deg,#0060ff,#00b8ff)",
                borderRadius: 999,
                padding: "3px 13px",
                fontSize: "0.68rem",
                color: "#fff",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              RECOMMENDED
            </span>
          </div>
          {[
            "Built into your device",
            "Activate via QR code in minutes",
            "Multiple profiles, one device",
            "Switch carriers without swapping",
            "Nothing to lose or damage",
            "Live instantly after purchase",
          ].map((item, i) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 14,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(12px)",
                transition: `opacity 0.4s ease ${0.1 + i * 0.06}s, transform 0.4s ease ${0.1 + i * 0.06}s`,
              }}
            >
              <span
                style={{
                  color: "#0072FF",
                  flexShrink: 0,
                  marginTop: 1,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                ✓
              </span>
              <span
                style={{
                  color: "#1a4f78",
                  fontSize: "0.9rem",
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const { ref, visible } = useFadeIn();
  const steps = [
    {
      num: "01",
      icon: "🌍",
      title: "Choose Destination",
      desc: "Browse data plans for 200+ countries. Pick coverage, data size, and duration.",
    },
    {
      num: "02",
      icon: "💳",
      title: "Purchase Instantly",
      desc: "Checkout in seconds. No shipping — your eSIM is ready the moment payment clears.",
    },
    {
      num: "03",
      icon: "📲",
      title: "Scan QR Code",
      desc: "Open Settings, scan the QR code we send, and your plan installs in under a minute.",
    },
    {
      num: "04",
      icon: "✈️",
      title: "Travel & Connect",
      desc: "Land and auto-connect. Your home SIM stays active for calls — no juggling needed.",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 800,
          color: "#002f6c",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        How eSIM Works
      </h2>
      <p
        style={{
          color: "#4a85b0",
          textAlign: "center",
          marginBottom: 52,
          fontSize: "0.97rem",
        }}
      >
        From purchase to connected in 4 simple steps
      </p>

      {/* connector line */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "12%",
            right: "12%",
            height: 2,
            background: "linear-gradient(90deg, #0072FF, #00C8FF)",
            opacity: 0.2,
            borderRadius: 1,
            display: "none",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(0,140,255,0.2)",
                borderRadius: 20,
                padding: "34px 28px",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 22px rgba(0,80,200,0.08)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              {/* top accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, hsl(${210 + i * 12},100%,50%), hsl(${210 + i * 12 + 20},100%,65%))`,
                  borderRadius: "20px 20px 0 0",
                }}
              />
              {/* step number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: 2,
                  fontSize: "5rem",
                  fontWeight: 900,
                  color: "rgba(0,100,255,0.06)",
                  fontFamily: "monospace",
                  lineHeight: 1,
                  userSelect: "none" as const,
                }}
              >
                {step.num}
              </div>
              {/* circuit mini decoration */}
              <svg
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  width: 40,
                  height: 40,
                  opacity: 0.12,
                }}
                viewBox="0 0 40 40"
              >
                <path
                  d="M 35 5 L 20 5 L 20 20 L 5 20"
                  fill="none"
                  stroke="#0072FF"
                  strokeWidth="1.5"
                  strokeDasharray="40"
                  strokeDashoffset="40"
                  style={{
                    animation: `data-flow ${2 + i * 0.3}s linear infinite`,
                  }}
                />
                <circle
                  cx="35"
                  cy="5"
                  r="2.5"
                  fill="#0090FF"
                  style={{ animation: "pulse-node 1.5s infinite" }}
                />
                <circle
                  cx="5"
                  cy="20"
                  r="2.5"
                  fill="#0090FF"
                  style={{ animation: "pulse-node 1.5s infinite 0.4s" }}
                />
              </svg>
              <div style={{ fontSize: "2rem", marginBottom: 16 }}>
                {step.icon}
              </div>
              <div
                style={{
                  width: 30,
                  height: 3,
                  background: "linear-gradient(90deg, #0072FF, #00C8FF)",
                  marginBottom: 14,
                  borderRadius: 2,
                }}
              />
              <h3
                style={{
                  color: "#002f6c",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: 9,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "#3d6e90",
                  fontSize: "0.87rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── eSIM TECH VISUAL ─────────────────────────────────────────────────────────
function EsimTechVisual() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 800,
          color: "#002f6c",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Inside the Technology
      </h2>
      <p
        style={{
          color: "#4a85b0",
          textAlign: "center",
          marginBottom: 52,
          fontSize: "0.97rem",
        }}
      >
        How eSIM connects you to the world
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* SVG tech diagram */}
        <div
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(0,140,255,0.2)",
            borderRadius: 22,
            padding: "32px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 24px rgba(0,80,200,0.08)",
          }}
        >
          <svg
            viewBox="0 0 320 260"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto" }}
          >
            {/* Device outline */}
            <rect
              x="110"
              y="10"
              width="100"
              height="170"
              rx="14"
              fill="rgba(0,100,255,0.07)"
              stroke="#0072FF"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <rect
              x="120"
              y="22"
              width="80"
              height="120"
              rx="6"
              fill="rgba(0,150,255,0.06)"
              stroke="#00A0FF"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle
              cx="160"
              cy="163"
              r="8"
              fill="none"
              stroke="#0072FF"
              strokeWidth="1.2"
              opacity="0.5"
            />

            {/* eSIM chip */}
            <rect
              x="143"
              y="52"
              width="34"
              height="26"
              rx="4"
              fill="rgba(0,100,255,0.15)"
              stroke="#0060FF"
              strokeWidth="1.5"
            />
            <rect
              x="149"
              y="58"
              width="22"
              height="14"
              rx="2"
              fill="rgba(0,100,255,0.2)"
              stroke="#0080FF"
              strokeWidth="1"
            />
            {/* chip lines */}
            {[60, 65, 70].map((y) => (
              <line
                key={y}
                x1="143"
                y1={y}
                x2="140"
                y2={y}
                stroke="#0080FF"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            {[60, 65, 70].map((y) => (
              <line
                key={y + "r"}
                x1="177"
                y1={y}
                x2="180"
                y2={y}
                stroke="#0080FF"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            <text
              x="160"
              y="68"
              textAnchor="middle"
              fill="#0055cc"
              fontSize="6"
              fontWeight="bold"
              opacity="0.8"
            >
              eSIM
            </text>

            {/* Signal waves from device */}
            {[1, 2, 3].map((n) => (
              <path
                key={n}
                d={`M ${160 - n * 18} ${10 - n * 8} Q 160 ${-5 - n * 8} ${160 + n * 18} ${10 - n * 8}`}
                fill="none"
                stroke="#0090FF"
                strokeWidth="1.2"
                opacity={0.4 - n * 0.1}
                strokeDasharray="30"
                strokeDashoffset="30"
                style={{
                  animation: `data-flow ${1.5 + n * 0.3}s linear infinite ${n * 0.2}s`,
                }}
              />
            ))}

            {/* Tower left */}
            <line
              x1="30"
              y1="200"
              x2="30"
              y2="100"
              stroke="#0060FF"
              strokeWidth="2"
              opacity="0.4"
            />
            <line
              x1="20"
              y1="100"
              x2="40"
              y2="100"
              stroke="#0060FF"
              strokeWidth="2"
              opacity="0.4"
            />
            <line
              x1="24"
              y1="115"
              x2="36"
              y2="115"
              stroke="#0060FF"
              strokeWidth="1.5"
              opacity="0.35"
            />
            {[1, 2].map((n) => (
              <path
                key={n}
                d={`M ${30 - n * 12} ${100 - n * 10} Q 30 ${90 - n * 10} ${30 + n * 12} ${100 - n * 10}`}
                fill="none"
                stroke="#00A0FF"
                strokeWidth="1"
                opacity={0.35}
                style={{
                  animation: `pulse-node ${1.5 + n * 0.4}s ease-in-out infinite`,
                }}
              />
            ))}

            {/* Tower right */}
            <line
              x1="290"
              y1="200"
              x2="290"
              y2="100"
              stroke="#0060FF"
              strokeWidth="2"
              opacity="0.4"
            />
            <line
              x1="280"
              y1="100"
              x2="300"
              y2="100"
              stroke="#0060FF"
              strokeWidth="2"
              opacity="0.4"
            />
            <line
              x1="284"
              y1="115"
              x2="296"
              y2="115"
              stroke="#0060FF"
              strokeWidth="1.5"
              opacity="0.35"
            />
            {[1, 2].map((n) => (
              <path
                key={n}
                d={`M ${290 - n * 12} ${100 - n * 10} Q 290 ${90 - n * 10} ${290 + n * 12} ${100 - n * 10}`}
                fill="none"
                stroke="#00A0FF"
                strokeWidth="1"
                opacity={0.35}
                style={{
                  animation: `pulse-node ${1.5 + n * 0.4}s ease-in-out infinite 0.3s`,
                }}
              />
            ))}

            {/* Connection lines tower → device */}
            <path
              d="M 42 110 Q 100 65 110 65"
              fill="none"
              stroke="#0090FF"
              strokeWidth="1.2"
              strokeDasharray="80"
              strokeDashoffset="80"
              opacity="0.4"
              style={{ animation: "data-flow 2s linear infinite" }}
            />
            <path
              d="M 278 110 Q 220 65 210 65"
              fill="none"
              stroke="#0090FF"
              strokeWidth="1.2"
              strokeDasharray="80"
              strokeDashoffset="80"
              opacity="0.4"
              style={{ animation: "data-flow 2s linear infinite 0.5s" }}
            />

            {/* Cloud/internet */}
            <ellipse
              cx="160"
              cy="230"
              rx="45"
              ry="16"
              fill="rgba(0,150,255,0.1)"
              stroke="#0080FF"
              strokeWidth="1"
              opacity="0.5"
            />
            <text
              x="160"
              y="234"
              textAnchor="middle"
              fill="#0055cc"
              fontSize="7"
              opacity="0.7"
            >
              INTERNET
            </text>
            <line
              x1="160"
              y1="181"
              x2="160"
              y2="214"
              stroke="#0090FF"
              strokeWidth="1.2"
              strokeDasharray="20"
              strokeDashoffset="20"
              opacity="0.5"
              style={{ animation: "data-flow 1.5s linear infinite" }}
            />

            {/* Data packets */}
            {[0, 0.7, 1.4].map((delay, i) => (
              <circle key={i} cx="0" cy="0" r="3" fill="#0090FF" opacity="0.6">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                  path="M 42 110 Q 100 65 110 65"
                />
              </circle>
            ))}
          </svg>
        </div>

        {/* Features list */}
        <div
          style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}
        >
          {[
            {
              icon: "🔐",
              title: "Secure Encryption",
              desc: "Same AES-128 encryption as physical SIMs. Your identity and data are protected at hardware level.",
            },
            {
              icon: "⚡",
              title: "Remote Provisioning",
              desc: "Plans are downloaded over-the-air directly to your device's secure element — no physical contact needed.",
            },
            {
              icon: "🔄",
              title: "Profile Switching",
              desc: "Store multiple carrier profiles simultaneously and switch between them instantly from Settings.",
            },
            {
              icon: "🌐",
              title: "Global Standards",
              desc: "eSIM follows GSMA SGP.22 spec — the same global standard used by carriers in 200+ countries.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              style={{
                display: "flex",
                gap: 16,
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(0,140,255,0.18)",
                borderRadius: 14,
                padding: "18px 20px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 14px rgba(0,80,200,0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(20px)",
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>
                {f.icon}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#002f6c",
                    fontSize: "0.95rem",
                    marginBottom: 4,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    color: "#3d6e90",
                    fontSize: "0.83rem",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DEVICE COMPATIBILITY ─────────────────────────────────────────────────────
function DeviceCompatibility() {
  const { ref, visible } = useFadeIn();
  const brands = [
    { name: "Apple", models: "iPhone XS and later" },
    { name: "Samsung", models: "Galaxy S20 and later" },
    { name: "Google", models: "Pixel 3 and later" },
    { name: "Motorola", models: "Razr 2019 and later" },
    { name: "Huawei", models: "P40 series and later" },
    { name: "Microsoft", models: "Surface Duo series" },
  ];
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 800,
          color: "#002f6c",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Compatible Devices
      </h2>
      <p
        style={{
          color: "#4a85b0",
          textAlign: "center",
          marginBottom: 48,
          fontSize: "0.97rem",
        }}
      >
        eSIM is supported across all major smartphone brands
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
          gap: 14,
        }}
      >
        {brands.map((b, i) => (
          <div
            key={b.name}
            style={{
              background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(0,140,255,0.18)",
              borderRadius: 14,
              padding: "22px 20px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 14px rgba(0,80,200,0.06)",
              position: "relative",
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, #0060ff, #00c0ff)",
                borderRadius: "14px 14px 0 0",
              }}
            />
            <div
              style={{
                fontWeight: 700,
                color: "#0055cc",
                fontSize: "1rem",
                marginBottom: 5,
              }}
            >
              {b.name}
            </div>
            <div
              style={{ color: "#3d6e90", fontSize: "0.8rem", lineHeight: 1.5 }}
            >
              {b.models}
            </div>
            {/* mini circuit dot */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 12,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0090FF",
                opacity: 0.3,
                animation: "pulse-node 2s infinite",
              }}
            />
          </div>
        ))}
      </div>
      <p
        style={{
          color: "#7ab5cc",
          textAlign: "center",
          marginTop: 24,
          fontSize: "0.78rem",
        }}
      >
        * Check your device spec sheet to confirm eSIM support. Some
        carrier-locked devices may have restrictions.
      </p>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqSection() {
  const { ref, visible } = useFadeIn();
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Do I need to remove my physical SIM to use an eSIM?",
      a: "No. eSIM works alongside your physical SIM. Keep your regular number active for calls and texts while using eSIM for data — ideal for international travel.",
    },
    {
      q: "Can I use an eSIM on multiple devices?",
      a: "Each eSIM plan is tied to one device at a time. However, many devices support multiple eSIM profiles stored simultaneously, so you can switch between them easily.",
    },
    {
      q: "Is my data secure with an eSIM?",
      a: "Yes. eSIM uses the same encryption and security standards as physical SIM cards, and is actually more secure since it cannot be physically removed or cloned.",
    },
    {
      q: "What happens to my eSIM if I factory reset my phone?",
      a: "Factory resetting typically erases all eSIM profiles. Always note your eSIM details before resetting. Some carriers allow re-download of a previously installed profile.",
    },
    {
      q: "Will my eSIM data plan work automatically on arrival?",
      a: "Once installed, most eSIM plans auto-connect when you land. Some require enabling 'data roaming' in your phone's Settings — a quick one-tap action.",
    },
    {
      q: "Can I top up or extend my eSIM plan?",
      a: "Yes. You can purchase additional plans or top-ups directly through our platform, which install instantly onto your device without any swapping.",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 760,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 800,
          color: "#002f6c",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        Frequently Asked Questions
      </h2>
      <div
        style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}
      >
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              background:
                open === i ? "rgba(0,140,255,0.07)" : "rgba(255,255,255,0.62)",
              border: `1px solid ${open === i ? "rgba(0,140,255,0.35)" : "rgba(0,120,255,0.15)"}`,
              borderRadius: 14,
              overflow: "hidden",
              backdropFilter: "blur(8px)",
              transition: "all 0.22s ease",
              boxShadow: "0 2px 14px rgba(0,80,200,0.05)",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                gap: 14,
                textAlign: "left" as const,
              }}
            >
              <span
                style={{
                  color: "#002f6c",
                  fontWeight: 600,
                  fontSize: "0.94rem",
                  lineHeight: 1.4,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {faq.q}
              </span>
              <span
                style={{
                  color: "#0072FF",
                  fontSize: "1.3rem",
                  flexShrink: 0,
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  transition: "transform 0.22s ease",
                  lineHeight: 1,
                  fontWeight: 300,
                }}
              >
                +
              </span>
            </button>
            <div
              style={{
                maxHeight: open === i ? 200 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <p
                style={{
                  color: "#2e6a96",
                  fontSize: "0.89rem",
                  lineHeight: 1.75,
                  padding: "0 24px 20px",
                  margin: 0,
                }}
              >
                {faq.a}
              </p>
            </div>
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
      style={{
        position: "relative",
        zIndex: 2,
        padding: "72px 24px 88px",
        margin: "0 auto",
        maxWidth: 900,
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(0,100,255,0.12), rgba(0,190,255,0.1))",
          border: "1px solid rgba(0,150,255,0.3)",
          borderRadius: 26,
          padding: "64px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 14px 60px rgba(0,100,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* animated circuit corners */}
        {[
          { t: 0, l: 0, r: "rotate(0)" },
          { t: 0, r: 0, tr: "rotate(90deg)" },
          { b: 0, r: 0, tr: "rotate(180deg)" },
          { b: 0, l: 0, tr: "rotate(270deg)" },
        ].map((pos, i) => (
          <svg
            key={i}
            style={{
              position: "absolute",
              width: 70,
              height: 70,
              opacity: 0.15,
              ...pos,
            }}
            viewBox="0 0 70 70"
          >
            <path
              d="M 5 65 L 5 5 L 65 5"
              fill="none"
              stroke="#0072FF"
              strokeWidth="1.5"
              strokeDasharray="120"
              strokeDashoffset="120"
              style={{
                animation: `data-flow ${2.5 + i * 0.3}s linear infinite ${i * 0.4}s`,
              }}
            />
            <circle
              cx="5"
              cy="65"
              r="3"
              fill="#0090FF"
              style={{ animation: "pulse-node 1.5s infinite" }}
            />
            <circle
              cx="65"
              cy="5"
              r="3"
              fill="#0090FF"
              style={{ animation: "pulse-node 1.5s infinite 0.5s" }}
            />
          </svg>
        ))}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 350,
            background:
              "radial-gradient(ellipse, rgba(0,150,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            color: "#002060",
            marginBottom: 14,
          }}
        >
          Ready to go borderless?
        </h2>
        <p
          style={{
            color: "#2e6a96",
            fontSize: "1rem",
            marginBottom: 36,
            maxWidth: 480,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          Get connected in minutes. Browse our eSIM plans for 200+ countries
          with instant activation.
        </p>
        <Link
          href="/destinations"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, #0055ff, #00b8ff)",
            color: "#fff",
            padding: "16px 42px",
            borderRadius: 14,
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(0,100,255,0.38)",
            fontFamily: "'DM Sans', sans-serif",
            animation: "btn-glow 3s ease-in-out infinite",
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
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background =
      "linear-gradient(160deg, #dff2ff 0%, #c8e8ff 30%, #b0d8ff 60%, #c4eeff 100%)";
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <main
      style={{
        background: "transparent",
        fontFamily: "'DM Sans', sans-serif",
        color: "#002f6c",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <Background />
      <Navigation />
      <Hero />
      <Divider />
      <PhysicalVsEsim />
      <Divider />
      <HowItWorks />
      <Divider />
      <EsimTechVisual />
      <Divider />
      <DeviceCompatibility />
      <Divider />
      <FaqSection />
      <CtaBanner />
      <div
        style={{
          background: "rgba(180,220,255,0.6)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,140,255,0.2)",
        }}
      >
        <style>{`
          .yh-footer-link { color: #2a5a8a !important; }
          .yh-footer-link:hover { color: #0055cc !important; }
          footer[style] { background: transparent !important; border-top: none !important; }
          footer p { color: #2a5a8a !important; }
          footer h4 { color: #002f6c !important; }
          footer span[style] { color: #2a5a8a !important; border-color: rgba(0,100,200,0.2) !important; }
          footer div[style*="3A6080"] { color: #2a5a8a !important; }
        `}</style>
        <Footer />
      </div>
    </main>
  );
}
