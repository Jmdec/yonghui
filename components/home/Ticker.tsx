"use client";

const ITEMS = [
  { text: "190+ Countries", icon: "signal", color: "#3b82f6" },
  { text: "Instant Activation", icon: "ping", color: "#22d3ee" },
  { text: "4G / 5G Ready", icon: "badge", label: "5G", color: "#60a5fa" },
  { text: "No Roaming Fees", icon: "signal", color: "#34d399" },
  { text: "eSIM Technology", icon: "badge", label: "eSIM", color: "#a78bfa" },
  { text: "Secure Encryption", icon: "ping", color: "#f472b6" },
  { text: "24/7 Support", icon: "signal", color: "#fb923c" },
  { text: "QR Code Setup", icon: "badge", label: "QR", color: "#34d399" },
] as const;

const ALL = [...ITEMS, ...ITEMS];

function SignalBars({ color, delays }: { color: string; delays: number[] }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap: 1,
        height: 12,
      }}
    >
      {[5, 8, 11].map((h, i) => (
        <span
          key={i}
          style={{
            width: 2,
            height: h,
            background: color,
            borderRadius: 1,
            animation: `signalpulse 1.2s ease-in-out ${delays[i]}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function PingDot({ color, delay }: { color: string; delay: number }) {
  return (
    <span
      style={{
        position: "relative",
        width: 8,
        height: 8,
        display: "inline-block",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          animation: `dotping 1.8s ease-out ${delay}s infinite`,
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 1.5,
          borderRadius: "50%",
          background: color,
        }}
      />
    </span>
  );
}

function TechBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9,
        fontWeight: 700,
        color,
        background: `${color}26`,
        border: `1px solid ${color}4D`,
        borderRadius: 3,
        padding: "1px 4px",
        letterSpacing: 1,
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
        @keyframes signalpulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.6); }
          50%       { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes dotping {
          0%   { transform: scale(1);   opacity: 1; }
          60%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(1);   opacity: 0; }
        }
      `}</style>

      <div
        style={{
          background: "#0a2540",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          height: 38,
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
            width: 60,
            background: "linear-gradient(90deg, #0a2540 40%, transparent)",
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
            width: 60,
            background: "linear-gradient(270deg, #0a2540 40%, transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "tickerscroll 32s linear infinite",
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
                  padding: "0 28px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.5px",
                }}
              >
                {item.icon === "signal" && (
                  <SignalBars color={item.color} delays={[0, 0.15, 0.3]} />
                )}
                {item.icon === "ping" && (
                  <PingDot color={item.color} delay={i * 0.2} />
                )}
                {item.icon === "badge" && (
                  <TechBadge label={(item as any).label} color={item.color} />
                )}
                {item.text}
              </span>
              <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 10 }}>
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
