"use client";

const ITEMS = [
  { text: "190+ Countries", icon: "dot", color: "#0057d9" },
  { text: "Instant Activation", icon: "check", color: "#00a86b" },
  { text: "4G / 5G Ready", icon: "pill", label: "5G", color: "#0057d9" },
  { text: "No Roaming Fees", icon: "check", color: "#00a86b" },
  { text: "eSIM Technology", icon: "pill", label: "eSIM", color: "#0057d9" },
  { text: "Secure Encryption", icon: "dot", color: "#0057d9" },
  { text: "24/7 Support", icon: "check", color: "#00a86b" },
  { text: "QR Code Setup", icon: "pill", label: "QR", color: "#0057d9" },
] as const;

const ALL = [...ITEMS, ...ITEMS];

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function Check({ color }: { color: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      ✓
    </span>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        color,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        borderRadius: 999,
        padding: "1px 7px",
        letterSpacing: "0.06em",
        flexShrink: 0,
        fontFamily: "inherit",
      }}
    >
      {label}
    </span>
  );
}

export default function Ticker() {
  return (
    <>
      <style>{`
        @keyframes tickerscroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e2e6ef",
          borderBottom: "1px solid #e2e6ef",
          overflow: "hidden",
          height: 40,
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Fade edges */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(90deg, #ffffff 40%, transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(270deg, #ffffff 40%, transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "tickerscroll 36s linear infinite",
            alignItems: "center",
          }}
        >
          {ALL.map((item, i) => (
            <span
              key={i}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 24px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1a1f2e",
                  letterSpacing: "0.01em",
                }}
              >
                {item.icon === "dot" && <Dot color={item.color} />}
                {item.icon === "check" && <Check color={item.color} />}
                {item.icon === "pill" && (
                  <Pill label={(item as any).label} color={item.color} />
                )}
                {item.text}
              </span>
              {/* Separator */}
              <span
                style={{
                  color: "#d1d8e8",
                  fontSize: 12,
                  userSelect: "none",
                }}
              >
                /
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
