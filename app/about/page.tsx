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
        background:
          "linear-gradient(160deg, #dff2ff 0%, #c8e8ff 30%, #b0d8ff 60%, #c4eeff 100%)",
      }}
    >
      <style>{`
        @keyframes float-blob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes scan-line  { 0%{top:-4px} 100%{top:100%} }
        @keyframes flow-dash  { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
        @keyframes signal-pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes blink-dot  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes grow-bar   { from{width:0} to{width:var(--w)} }
        @keyframes flow-fill  { from{width:0} to{width:100%} }
        @keyframes fade-up    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btn-pulse  { 0%,100%{box-shadow:0 6px 24px rgba(0,114,255,.3)} 50%{box-shadow:0 6px 36px rgba(0,180,255,.5)} }
        @keyframes orbit      { from{transform:rotate(0deg) translateX(68px) rotate(0deg)} to{transform:rotate(360deg) translateX(68px) rotate(-360deg)} }
        @keyframes orbit2     { from{transform:rotate(120deg) translateX(72px) rotate(-120deg)} to{transform:rotate(480deg) translateX(72px) rotate(-480deg)} }
        @keyframes orbit3     { from{transform:rotate(240deg) translateX(60px) rotate(-240deg)} to{transform:rotate(600deg) translateX(60px) rotate(-600deg)} }
        @keyframes chip-glow  { 0%,100%{box-shadow:0 0 0 0 rgba(0,114,255,0)} 50%{box-shadow:0 0 20px 6px rgba(0,114,255,.25)} }
        @keyframes data-packet{ 0%{left:-8px;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{left:calc(100% + 8px);opacity:0} }
        @keyframes bar-stream { 0%{transform:scaleX(0);transform-origin:left} 40%{transform:scaleX(1);transform-origin:left} 41%{transform:scaleX(1);transform-origin:right} 100%{transform:scaleX(0);transform-origin:right} }
        @keyframes count-up   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping-ring  { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
        @keyframes signal-bar1{ 0%,100%{height:4px} 50%{height:10px} }
        @keyframes signal-bar2{ 0%,100%{height:8px} 50%{height:18px} }
        @keyframes signal-bar3{ 0%,100%{height:14px} 50%{height:26px} }
        @keyframes signal-bar4{ 0%,100%{height:20px} 50%{height:32px} }
        @keyframes profile-slide{ from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lock-unlock { 0%,40%{transform:rotate(-8deg)} 50%,100%{transform:rotate(0deg)} }
        @keyframes wave-pulse  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.5);opacity:0} }
        @media (prefers-reduced-motion: reduce) {
          *{ animation: none !important; transition: none !important; }
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
            "radial-gradient(ellipse, rgba(0,160,255,.18) 0%, transparent 65%)",
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
            "radial-gradient(ellipse, rgba(0,120,255,.1) 0%, transparent 70%)",
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
            "radial-gradient(ellipse, rgba(0,200,255,.12) 0%, transparent 70%)",
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
              stroke="#0080FF"
              strokeWidth="0.5"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {[
          "M 80 120 L 80 220 L 200 220 L 200 320",
          "M 300 80 L 420 80 L 420 180 L 560 180",
          "M 700 200 L 700 340 L 820 340",
          "M 900 100 L 1020 100 L 1020 260 L 1160 260",
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
              animation: `flow-dash ${2.5 + i * 0.4}s linear infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(0,180,255,.22), transparent)",
          animation: "scan-line 6s linear infinite",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

const Divider = () => (
  <div
    style={{
      height: 1,
      background:
        "linear-gradient(90deg, transparent, rgba(0,140,255,.28), transparent)",
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
      color: "#0072FF",
      marginBottom: 10,
    }}
  >
    {text}
  </div>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
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
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,114,255,.1)",
          border: "1px solid rgba(0,114,255,.28)",
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
            background: "#0090FF",
            display: "inline-block",
            animation: "blink-dot 1.6s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#0055cc",
          }}
        >
          About YH ESIM
        </span>
      </div>

      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(2.2rem,5vw,3.6rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#002f6c",
          margin: "0 0 20px",
          letterSpacing: "-0.025em",
          animation: "fade-up .6s ease both .05s",
        }}
      >
        Connecting the world,{" "}
        <span style={{ color: "#0072FF", whiteSpace: "nowrap" }}>
          one eSIM at a time
        </span>
      </h1>

      <p
        style={{
          fontSize: "clamp(.95rem,1.8vw,1.1rem)",
          color: "#2e6a96",
          lineHeight: 1.8,
          maxWidth: 560,
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
          background: "linear-gradient(135deg,#0055ff,#00b8ff)",
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
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginTop: 40,
          paddingTop: 32,
          borderTop: "1px solid rgba(0,140,255,.18)",
          animation: "fade-up .6s ease both .25s",
        }}
      >
        {[
          { value: "200+", label: "Countries Covered" },
          { value: "10K+", label: "Happy Travelers" },
          { value: "99.9%", label: "Uptime" },
          { value: "24/7", label: "Support" },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                color: "#0055cc",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#4a85b0",
                marginTop: 5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── eSIM Technology ──────────────────────────────────────────────────────────

const FLOW_STEPS = [
  { icon: "🛒", label: "Choose a plan", sub: "Pick country & data size" },
  { icon: "📧", label: "Get QR code", sub: "Instant email delivery" },
  { icon: "📷", label: "Scan & install", sub: "Takes under 2 min" },
  { icon: "✈️", label: "Land & connect", sub: "Auto-connects on arrival" },
  { icon: "🌐", label: "Travel freely", sub: "Stay online everywhere" },
];

// ─── FIX: Larger orbit radii + wrapper sized to 200×200 ───────────────────────
function ChipDiagram({ visible }: { visible: boolean }) {
  return (
    <div
      style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}
    >
      {/* Ping rings */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(0,114,255,.4)",
            animation: visible
              ? `ping-ring 2s ease-out infinite ${i * 1}s`
              : "none",
          }}
        />
      ))}
      {/* Chip body */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 64,
          height: 64,
          background: "linear-gradient(135deg, #0044cc, #0088ff)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: visible ? "chip-glow 2.5s ease-in-out infinite" : "none",
          zIndex: 2,
        }}
      >
        <svg width="64" height="64" style={{ position: "absolute", inset: 0 }}>
          {[16, 32, 48].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="8"
              x2={x}
              y2="56"
              stroke="rgba(255,255,255,.15)"
              strokeWidth="0.8"
            />
          ))}
          {[16, 32, 48].map((y) => (
            <line
              key={`h${y}`}
              x1="8"
              y1={y}
              x2="56"
              y2={y}
              stroke="rgba(255,255,255,.15)"
              strokeWidth="0.8"
            />
          ))}
        </svg>
        <span style={{ fontSize: "1.5rem", zIndex: 1 }}>📡</span>
      </div>

      {/* FIX: Orbiting nodes with larger translateX so they clear the chip */}
      {[
        { label: "5G", anim: "orbit", color: "#0072FF" },
        { label: "LTE", anim: "orbit2", color: "#00b8ff" },
        { label: "AES", anim: "orbit3", color: "#0055cc" },
      ].map((node) => (
        <div
          key={node.label}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 32,
            height: 32,
            marginTop: -16,
            marginLeft: -16,
            animation: visible ? `${node.anim} 4s linear infinite` : "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: node.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.55rem",
              fontWeight: 800,
              color: "#fff",
              boxShadow: `0 2px 8px ${node.color}88`,
            }}
          >
            {node.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// Animated signal strength bars
function SignalBars({ visible }: { visible: boolean }) {
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 36 }}
    >
      {[
        { h: 8, anim: "signal-bar1", delay: "0s" },
        { h: 16, anim: "signal-bar2", delay: ".12s" },
        { h: 24, anim: "signal-bar3", delay: ".24s" },
        { h: 32, anim: "signal-bar4", delay: ".36s" },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: b.h,
            borderRadius: 3,
            background: "linear-gradient(180deg,#00C8FF,#0072FF)",
            opacity: visible ? 1 : 0.2,
            animation: visible
              ? `${b.anim} 1.4s ease-in-out infinite ${b.delay}`
              : "none",
            transition: "opacity .4s ease",
          }}
        />
      ))}
    </div>
  );
}

// Animated carrier profile download
function ProfileDownload({ visible }: { visible: boolean }) {
  const profiles = [
    { name: "YH Global 5G", region: "200+ countries", color: "#0072FF" },
    { name: "Asia Unlimited", region: "32 countries", color: "#0099dd" },
    { name: "Europe Plus", region: "48 countries", color: "#00aaff" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {profiles.map((p, i) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            background: "rgba(255,255,255,.7)",
            border: "1px solid rgba(0,140,255,.18)",
            borderRadius: 10,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-16px)",
            transition: `opacity .45s ease ${0.2 + i * 0.15}s, transform .45s ease ${0.2 + i * 0.15}s`,
            animation: visible
              ? `profile-slide .45s ease forwards ${0.2 + i * 0.15}s`
              : "none",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              animation: visible ? "blink-dot 2s ease-in-out infinite" : "none",
              animationDelay: `${i * 0.4}s`,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: "0.8rem", fontWeight: 700, color: "#002f6c" }}
            >
              {p.name}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#4a85b0" }}>
              {p.region}
            </div>
          </div>
          {/* Animated download bar */}
          <div
            style={{
              width: 60,
              height: 4,
              background: "rgba(0,114,255,.12)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: `linear-gradient(90deg, ${p.color}, #00C8FF)`,
                animation: visible
                  ? `bar-stream 2.2s ease-in-out infinite ${i * 0.5}s`
                  : "none",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#1a7a40",
              background: "rgba(0,180,60,.1)",
              padding: "2px 7px",
              borderRadius: 999,
            }}
          >
            OTA
          </span>
        </div>
      ))}
    </div>
  );
}

// Live data packet animation on a "wire"
function DataWire({ visible, label }: { visible: boolean; label: string }) {
  return (
    <div
      style={{
        position: "relative",
        height: 20,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(0,114,255,.15)",
          borderRadius: 1,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            marginTop: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#0072FF",
            boxShadow: "0 0 8px rgba(0,114,255,.6)",
            animation: visible
              ? `data-packet 2.4s linear infinite ${i * 0.8}s`
              : "none",
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          right: 0,
          fontSize: "0.65rem",
          color: "#4a85b0",
          background: "rgba(255,255,255,.8)",
          padding: "1px 6px",
          borderRadius: 999,
          border: "1px solid rgba(0,114,255,.15)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function EsimTech() {
  const { ref, visible } = useFadeIn();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(
      () => setActiveStep((s) => (s + 1) % FLOW_STEPS.length),
      1800,
    );
    return () => clearInterval(id);
  }, [visible]);

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
          color: "#002f6c",
          marginBottom: 10,
        }}
      >
        What makes eSIM different
      </h2>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#3d6e90",
          lineHeight: 1.75,
          maxWidth: 580,
          marginBottom: 36,
        }}
      >
        An eSIM (embedded SIM) is a programmable chip built directly into your
        device. Instead of swapping physical cards, you download a carrier
        profile over the air in seconds — then you're connected.
      </p>

      {/* ── Row 1: Chip diagram + OTA Profile download (2 cols, network panel removed) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 20,
          marginBottom: 20,
          alignItems: "stretch",
        }}
      >
        {/* FIX: overflow:visible so orbiting nodes are never clipped */}
        <div
          style={{
            background: "rgba(255,255,255,.68)",
            border: "1px solid rgba(0,140,255,.2)",
            borderRadius: 20,
            padding: "28px 24px",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            minWidth: 220,
            overflow: "visible",
          }}
        >
          <ChipDiagram visible={visible} />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#002f6c",
                marginBottom: 4,
              }}
            >
              Embedded SIM chip
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#4a85b0",
                lineHeight: 1.5,
                maxWidth: 140,
              }}
            >
              Soldered directly onto your device's motherboard — no slot needed
            </div>
          </div>
          {/* Signal bars */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SignalBars visible={visible} />
            <span
              style={{ fontSize: "0.7rem", color: "#0072FF", fontWeight: 700 }}
            >
              5G Live
            </span>
          </div>
          {/* Data wires */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <DataWire visible={visible} label="Encrypt" />
            <DataWire visible={visible} label="Transmit" />
          </div>
        </div>

        {/* OTA Profile download panel */}
        <div
          style={{
            background: "rgba(255,255,255,.68)",
            border: "1px solid rgba(0,140,255,.2)",
            borderRadius: 20,
            padding: "24px 22px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#4a85b0",
              marginBottom: 6,
            }}
          >
            Over-the-air profile install
          </div>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#002f6c",
              marginBottom: 14,
            }}
          >
            Carrier profiles download in seconds
          </div>
          <ProfileDownload visible={visible} />
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "rgba(0,114,255,.06)",
              border: "1px solid rgba(0,114,255,.15)",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                color: "#0055cc",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              🔒 GSMA SGP.22 RSP — end-to-end encrypted
            </div>
            <div
              style={{ fontSize: "0.7rem", color: "#3d6e90", lineHeight: 1.55 }}
            >
              Every profile transfer is protected with AES-256 encryption. Your
              identity is cryptographically verified before any profile
              activates.
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Animated how-it-works flow ── */}
      <div
        style={{
          background: "rgba(255,255,255,.68)",
          border: "1px solid rgba(0,140,255,.2)",
          borderRadius: 20,
          padding: "28px 24px",
          backdropFilter: "blur(10px)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#4a85b0",
            marginBottom: 20,
          }}
        >
          How it works — 5 steps
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr auto 1fr",
            alignItems: "center",
          }}
        >
          {FLOW_STEPS.map((step, i) => (
            <>
              <div
                key={step.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background:
                      activeStep === i
                        ? "rgba(0,114,255,.18)"
                        : "rgba(0,114,255,.08)",
                    border:
                      activeStep === i
                        ? "2px solid rgba(0,114,255,.7)"
                        : "1.5px solid rgba(0,114,255,.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    transform: activeStep === i ? "scale(1.12)" : "scale(1)",
                    transition: "all .35s ease",
                    boxShadow:
                      activeStep === i
                        ? "0 0 18px rgba(0,114,255,.25)"
                        : "none",
                    opacity: visible ? 1 : 0,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: activeStep === i ? "#0055cc" : "#002f6c",
                    lineHeight: 1.3,
                    maxWidth: 80,
                    transition: "color .35s ease",
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#4a85b0",
                    maxWidth: 80,
                    lineHeight: 1.35,
                  }}
                >
                  {step.sub}
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div
                  key={`arrow-${i}`}
                  style={{
                    padding: "0 6px 28px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 2,
                      background: "rgba(0,114,255,.15)",
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "#0072FF",
                        width: 0,
                        animation: visible
                          ? `flow-fill .7s ease forwards ${0.25 + i * 0.12}s`
                          : "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: -3,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#0072FF",
                        animation: visible
                          ? `data-packet 2s linear infinite ${i * 0.4}s`
                          : "none",
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      {/* ── Row 3: Comparison + Tech specs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Physical SIM */}
        <div
          style={{
            background: "rgba(255,255,255,.55)",
            border: "1px solid rgba(0,140,255,.15)",
            borderRadius: 18,
            padding: "24px 22px",
            backdropFilter: "blur(8px)",
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
                color: "#002f6c",
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
                borderTop: "1px solid rgba(0,140,255,.1)",
                fontSize: "0.82rem",
                color: "#5a7a96",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#cc4444", flexShrink: 0 }}>✕</span>
              {t}
            </div>
          ))}
        </div>

        {/* eSIM */}
        <div
          style={{
            background: "rgba(0,114,255,.07)",
            border: "1.5px solid rgba(0,114,255,.35)",
            borderRadius: 18,
            padding: "24px 22px",
            backdropFilter: "blur(8px)",
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
              borderRadius: "18px 18px 0 0",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>📲</span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#002f6c",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              YH eSIM
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                background: "rgba(0,180,60,.12)",
                color: "#1a7a40",
                padding: "3px 9px",
                borderRadius: 999,
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
                borderTop: "1px solid rgba(0,114,255,.12)",
                fontSize: "0.82rem",
                color: "#1a4a7a",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#1a7a40", flexShrink: 0 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Tech spec cards */}
      <div
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
              background: "rgba(255,255,255,.65)",
              border: "1px solid rgba(0,140,255,.18)",
              borderRadius: 16,
              padding: "20px",
              backdropFilter: "blur(8px)",
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
                color: "#0055cc",
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
                color: "#4a85b0",
                marginBottom: 10,
              }}
            >
              {c.label}
            </div>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#3d6e90",
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
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* Coverage bars */}
        <div>
          <Label text="Global coverage" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#002f6c",
              marginBottom: 10,
            }}
          >
            200+ countries, one account
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#3d6e90",
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
              background: "rgba(255,255,255,.65)",
              border: "1px solid rgba(0,140,255,.18)",
              borderRadius: 16,
              padding: "18px 20px",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
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
                    color: "#3d6e90",
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
                    background: "rgba(0,114,255,.12)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      background: "linear-gradient(90deg,#0072FF,#00C8FF)",
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
                    color: "#0055cc",
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

        {/* Device compatibility */}
        <div>
          <Label text="Compatible devices" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#002f6c",
              marginBottom: 10,
            }}
          >
            Is your phone ready?
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#3d6e90",
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
                  background: "rgba(255,255,255,.65)",
                  border: "1px solid rgba(0,140,255,.15)",
                  borderRadius: 12,
                  backdropFilter: "blur(8px)",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>📱</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#002f6c" }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#4a85b0" }}>
                    {d.detail}
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: d.ok
                      ? "rgba(0,180,60,.12)"
                      : "rgba(200,150,0,.12)",
                    color: d.ok ? "#1a7a40" : "#8a6000",
                    flexShrink: 0,
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
      desc: "Eliminate the friction of international travel by providing instant, reliable, and affordable eSIM connectivity to travelers in 200+ countries — starting from the moment they book a trip.",
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
          color: "#002f6c",
          marginBottom: 36,
        }}
      >
        Why we exist
      </h2>
      <div
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
              background: "rgba(255,255,255,.68)",
              border: "1px solid rgba(0,140,255,.2)",
              borderRadius: 20,
              padding: "32px 26px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,80,200,.07)",
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
                background: `linear-gradient(90deg, hsl(${210 + i * 15},100%,50%), hsl(${220 + i * 15},100%,65%))`,
                borderRadius: "20px 20px 0 0",
              }}
            />
            <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{c.icon}</div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#002f6c",
                marginBottom: 10,
              }}
            >
              {c.title}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#3d6e90",
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
    desc: "YH ESIM surpasses 10K active users. 24/7 live support launched. Plans now cover 200+ destinations.",
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
    desc: "200+ countries, top-tier carrier partners on every continent.",
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        {/* Timeline */}
        <div>
          <Label text="Our story" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#002f6c",
              marginBottom: 10,
            }}
          >
            Built from a traveler's frustration
          </h2>
          <p
            style={{
              fontSize: "0.87rem",
              color: "#3d6e90",
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
                background: "rgba(0,114,255,.25)",
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
                    background: "rgba(0,114,255,.15)",
                    border: "1.5px solid #0072FF",
                  }}
                />
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#0072FF",
                    textTransform: "uppercase",
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
                    color: "#002f6c",
                    marginBottom: 3,
                  }}
                >
                  {t.title}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#3d6e90",
                    lineHeight: 1.65,
                  }}
                >
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why choose */}
        <div>
          <Label text="Why choose YH" />
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 800,
              color: "#002f6c",
              marginBottom: 10,
            }}
          >
            Everything you need, nothing you don't
          </h2>
          <p
            style={{
              fontSize: "0.87rem",
              color: "#3d6e90",
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            Six reasons thousands of travelers keep coming back to YH for every
            trip.
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {WHY.map((w, i) => (
              <div
                key={w.title}
                style={{
                  display: "flex",
                  gap: 12,
                  background: "rgba(255,255,255,.62)",
                  border: "1px solid rgba(0,140,255,.15)",
                  borderRadius: 14,
                  padding: "16px 16px",
                  backdropFilter: "blur(8px)",
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
                      color: "#002f6c",
                      marginBottom: 3,
                    }}
                  >
                    {w.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "#3d6e90",
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
          background:
            "linear-gradient(135deg, rgba(0,100,255,.12), rgba(0,190,255,.1))",
          border: "1px solid rgba(0,150,255,.3)",
          borderRadius: 24,
          padding: "56px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 50px rgba(0,100,255,.1)",
          backdropFilter: "blur(12px)",
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
              "radial-gradient(ellipse, rgba(0,150,255,.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.6rem,3.5vw,2.4rem)",
            fontWeight: 800,
            color: "#002060",
            marginBottom: 12,
          }}
        >
          Ready to travel smarter?
        </h2>
        <p
          style={{
            color: "#2e6a96",
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
              background: "linear-gradient(135deg,#0055ff,#00b8ff)",
              color: "#fff",
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
              background: "rgba(255,255,255,.7)",
              color: "#0055cc",
              padding: "14px 36px",
              borderRadius: 12,
              fontSize: "0.97rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid rgba(0,140,255,.3)",
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
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = document.body.style.background;
    document.body.style.background =
      "linear-gradient(160deg,#dff2ff 0%,#c8e8ff 30%,#b0d8ff 60%,#c4eeff 100%)";
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
