"use client";

const REASONS = [
  {
    icon: "ti-world",
    title: "190+ Destinations",
    desc: "Coverage in every major country worldwide",
  },
  {
    icon: "ti-bolt",
    title: "Instant Activation",
    desc: "Connected in under 3 minutes, anywhere",
  },
  {
    icon: "ti-shield-check",
    title: "Secure & Reliable",
    desc: "99.9% uptime with enterprise-grade security",
  },
  {
    icon: "ti-coin",
    title: "Affordable Rates",
    desc: "Best-in-class pricing, no hidden costs",
  },
];

export default function WhyYonghuiSection() {
  return (
    <>
      <style>{`
        @media (max-width: 760px) { .yh-why-row { grid-template-columns: repeat(2, 1fr) !important; } }
        .yh-why-card:hover {
          border-color: rgba(14,99,214,0.35) !important;
          background: rgba(255,255,255,0.85) !important;
          box-shadow: 0 6px 20px rgba(14,99,214,0.1) !important;
          transform: translateY(-2px);
        }
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
            Why choose us
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
            Why Choose YH?
          </div>

          {/* Cards */}
          <div
            className="yh-why-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {REASONS.map((w, i) => (
              <div
                key={i}
                className="yh-why-card"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(14,99,214,0.15)",
                  borderRadius: 8,
                  padding: "16px 14px",
                  textAlign: "center",
                  transition: "all 0.2s",
                  backdropFilter: "blur(6px)",
                }}
              >
                <i
                  className={`ti ${w.icon}`}
                  aria-hidden="true"
                  style={{
                    fontSize: 22,
                    color: "#0D6EFD",
                    marginBottom: 10,
                    display: "block",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#0a2540",
                    marginBottom: 5,
                  }}
                >
                  {w.title}
                </div>
                <div
                  style={{ fontSize: 11, color: "#4a6a8a", lineHeight: 1.5 }}
                >
                  {w.desc}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
