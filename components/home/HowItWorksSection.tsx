"use client";

const STEPS = [
  {
    n: "01",
    title: "Choose Destination",
    desc: "Pick your country or region and browse available plans.",
  },
  {
    n: "02",
    title: "Select a Plan",
    desc: "Choose data amount and duration that fits your trip.",
  },
  {
    n: "03",
    title: "Activate eSIM",
    desc: "Scan the QR code on your device — done in minutes.",
  },
  {
    n: "04",
    title: "Stay Connected",
    desc: "Enjoy fast local 4G/5G data from the moment you land.",
  },
];

export default function HowItWorksSection() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) { .yh-steps-row { grid-template-columns: repeat(2, 1fr) !important; } }
        .yh-step { transition: all 0.2s; }
        .yh-step:hover {
          border-color: rgba(14,99,214,0.35) !important;
          background: rgba(255,255,255,0.85) !important;
          box-shadow: 0 6px 20px rgba(14,99,214,0.1) !important;
        }
        .yh-step:hover .yh-step-bar { transform: scaleX(1) !important; }
      `}</style>

      <div
        style={{
          width: "100%",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <section style={{ padding: "36px 0" }}>
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
            Getting started
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
            How it works
          </div>

          {/* Steps */}
          <div
            className="yh-steps-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="yh-step"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(14,99,214,0.15)",
                  borderRadius: 8,
                  padding: 16,
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div
                  className="yh-step-bar"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "linear-gradient(90deg, #0D6EFD, #60a5fa)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.3s",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: 24,
                    color: "rgba(14,99,214,0.18)",
                    marginBottom: 10,
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: 12.5,
                    color: "#0a2540",
                    marginBottom: 5,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{ fontSize: 11.5, color: "#4a6a8a", lineHeight: 1.55 }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
