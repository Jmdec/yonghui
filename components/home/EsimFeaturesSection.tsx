"use client";

const FEATURES = [
  {
    icon: "ti-device-mobile",
    title: "No Physical Card",
    desc: "Completely digital. No swapping SIM cards or visiting a store.",
  },
  {
    icon: "ti-bolt",
    title: "Instant Setup",
    desc: "Activate in minutes. Just scan a QR code and you're ready.",
  },
  {
    icon: "ti-wifi",
    title: "Multiple Plans",
    desc: "Switch between plans and carriers on the same device anytime.",
  },
  {
    icon: "ti-lock",
    title: "Secure & Private",
    desc: "Enterprise-grade encryption protects your data and privacy.",
  },
  {
    icon: "ti-trending-up",
    title: "Better Rates",
    desc: "Competitive pricing with no hidden fees or roaming surprises.",
  },
  {
    icon: "ti-world",
    title: "Global Access",
    desc: "Works in 190+ countries with local 4G/5G network speeds.",
  },
];

export default function EsimFeaturesSection() {
  return (
    <>
      <style>{`
        @media (max-width: 760px) { .yh-feat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 460px) { .yh-feat-grid { grid-template-columns: 1fr !important; } }
        .yh-feat-card:hover {
          border-color: rgba(14,99,214,0.35) !important;
          background: rgba(255,255,255,0.85) !important;
          box-shadow: 0 6px 20px rgba(14,99,214,0.1) !important;
        }
        .yh-feat-card:hover .yh-feat-topline { width: 100% !important; }
      `}</style>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <section id="what-is-esim" style={{ padding: "36px 0" }}>
          {/* Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              color: "#1d6fd8",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 1,
                background: "#1d6fd8",
              }}
            />
            Core technology
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#0a2540",
              marginBottom: 20,
            }}
          >
            What is an eSIM?
          </div>

          {/* Grid */}
          <div
            className="yh-feat-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {FEATURES.map((c, i) => (
              <div
                key={i}
                className="yh-feat-card"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(14,99,214,0.15)",
                  borderRadius: 8,
                  padding: 18,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  backdropFilter: "blur(6px)",
                }}
              >
                {/* Animated top border line */}
                <div
                  className="yh-feat-topline"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "0%",
                    height: 2,
                    background: "linear-gradient(90deg, #0D6EFD, #60a5fa)",
                    transition: "width 0.4s ease",
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(14,99,214,0.08)",
                    border: "1px solid rgba(14,99,214,0.2)",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                    fontSize: 16,
                    color: "#0D6EFD",
                  }}
                >
                  <i className={`ti ${c.icon}`} aria-hidden="true" />
                </div>

                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#0a2540",
                    marginBottom: 5,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{ fontSize: 12, color: "#4a6a8a", lineHeight: 1.6 }}
                >
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
