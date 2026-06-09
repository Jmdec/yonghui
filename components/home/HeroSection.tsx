"use client";

export default function HeroSection() {
  const stats = [
    { n: "190", em: "+", l: "Countries" },
    { n: "95", em: "K", l: "Reviews" },
    { n: "4G", em: "/5G", l: "Network" },
    { n: "24", em: "/7", l: "Support" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes chipblink {
          0%, 100% { border-color: rgba(14,99,214,0.35); }
          50%       { border-color: rgba(14,99,214,0.7); box-shadow: 0 0 8px rgba(14,99,214,0.12); }
        }
        @keyframes dotpulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes underlinepulse {
          0%, 100% { opacity: 0.5; transform: scaleX(0.8); }
          50%       { opacity: 1; transform: scaleX(1); }
        }
        @keyframes orbitSpin { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes chiplineflicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes siglabelfloat {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        .yh-cyan-underline::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 2px; background: rgba(14,99,214,0.5);
          animation: underlinepulse 2s ease-in-out infinite;
          transform-origin: left;
        }
        .yh-search-wrap:focus-within {
          border-color: rgba(14,99,214,0.6) !important;
          box-shadow: 0 0 0 3px rgba(14,99,214,0.08) !important;
        }
        .yh-search-btn:hover { opacity: 0.85 !important; }
        @media (max-width: 720px) {
          .yh-hero-grid { grid-template-columns: 1fr !important; padding: 36px 0 28px !important; }
          .yh-hero-right { display: none !important; }
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
        <div
          className="yh-hero-grid"
          style={{
            padding: "56px 0 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* ── LEFT ── */}
          <div>
            {/* Badge chip */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                border: "1px solid rgba(14,99,214,0.35)",
                borderRadius: 4,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "#0D6EFD",
                marginBottom: 18,
                background: "rgba(14,99,214,0.07)",
                animation: "chipblink 2s ease-in-out infinite",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#0D6EFD",
                  animation: "dotpulse 1.4s ease-in-out infinite",
                }}
              />
              GLOBAL eSIM NETWORK · 190+ COUNTRIES
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px, 4.5vw, 46px)",
                lineHeight: 1.08,
                color: "#0a2540",
                marginBottom: 14,
                letterSpacing: "-0.5px",
              }}
            >
              Stay Connected
              <br />
              Anywhere with
              <br />
              <span
                className="yh-cyan-underline"
                style={{ color: "#0D6EFD", position: "relative" }}
              >
                YH
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 13.5,
                color: "#4a6580",
                lineHeight: 1.7,
                marginBottom: 24,
                maxWidth: 380,
              }}
            >
              Instant digital eSIM activation. No roaming fees, no physical
              cards — pure seamless connectivity from the moment you land.
            </p>

            {/* Search bar */}
            <div
              className="yh-search-wrap"
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(14,99,214,0.25)",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 20,
                transition: "border-color 0.2s, box-shadow 0.2s",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  padding: "0 12px",
                  color: "#4a80c4",
                  fontSize: 15,
                  display: "flex",
                }}
              >
                <i className="ti ti-map-pin" aria-hidden="true" />
              </div>
              <input
                placeholder="Search destination or country..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#0a2540",
                  padding: "11px 0",
                }}
              />
              <button
                className="yh-search-btn"
                style={{
                  background: "linear-gradient(135deg, #0D6EFD, #0090FF)",
                  border: "none",
                  color: "#fff",
                  padding: "11px 18px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s",
                }}
              >
                Find Plans
              </button>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(14,99,214,0.15)",
                borderRadius: 8,
                overflow: "hidden",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    textAlign: "center",
                    borderRight:
                      i < stats.length - 1
                        ? "1px solid rgba(14,99,214,0.1)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#0a2540",
                    }}
                  >
                    {s.n}
                    <em style={{ color: "#0D6EFD", fontStyle: "normal" }}>
                      {s.em}
                    </em>
                  </div>
                  <div style={{ fontSize: 10, color: "#6a8aaa", marginTop: 2 }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: eSIM Visual ── */}
          <div
            className="yh-hero-right"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "relative", width: 260, height: 260 }}>
              {/* Orbit rings */}
              {[
                {
                  size: 220,
                  border: "1px solid rgba(14,99,214,0.18)",
                  dur: "12s",
                  dir: "normal",
                  dotSize: 6,
                  dotColor: "#1d6fd8",
                },
                {
                  size: 170,
                  border: "1px dashed rgba(14,99,214,0.15)",
                  dur: "8s",
                  dir: "reverse",
                  dotSize: 5,
                  dotColor: "#0090FF",
                },
                {
                  size: 125,
                  border: "1px solid rgba(14,99,214,0.22)",
                  dur: "5s",
                  dir: "normal",
                  dotSize: 6,
                  dotColor: "#1d6fd8",
                },
              ].map((o, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    borderRadius: "50%",
                    width: o.size,
                    height: o.size,
                    border: o.border,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    animation: `orbitSpin ${o.dur} linear infinite${o.dir === "reverse" ? " reverse" : ""}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      borderRadius: "50%",
                      width: o.dotSize,
                      height: o.dotSize,
                      background: o.dotColor,
                      top: -o.dotSize / 2,
                      left: "50%",
                      marginLeft: -o.dotSize / 2,
                      boxShadow: `0 0 6px ${o.dotColor}88`,
                    }}
                  />
                </div>
              ))}

              {/* Center chip card */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 84,
                  height: 60,
                  background:
                    "linear-gradient(135deg, #1a4a8a 0%, #0d3060 100%)",
                  border: "1px solid rgba(14,99,214,0.5)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 6,
                  boxShadow: "0 4px 24px rgba(14,99,214,0.2)",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  {[40, 30, 35].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 2,
                        width: w,
                        background: "rgba(147,197,253,0.7)",
                        borderRadius: 1,
                        animation: `chiplineflicker ${[2.1, 1.8, 2.4][i]}s ease-in-out ${[0, 0.3, 0.7][i]}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: "rgba(147,197,253,0.9)",
                    letterSpacing: 1,
                  }}
                >
                  eSIM
                </div>
              </div>

              {/* Signal labels */}
              {[
                {
                  label: "5G · ACTIVE",
                  top: 10,
                  right: 10,
                  left: "auto" as const,
                  dur: "3.2s",
                  del: "0s",
                },
                {
                  label: "190+ NETS",
                  bottom: 20,
                  left: 0,
                  right: "auto" as const,
                  dur: "2.8s",
                  del: "1s",
                },
                {
                  label: "4G/LTE",
                  top: "50%",
                  right: -10,
                  left: "auto" as const,
                  dur: "3.6s",
                  del: "0.5s",
                },
              ].map((sig, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: "#1d6fd8",
                    background: "rgba(219,234,254,0.85)",
                    border: "1px solid rgba(14,99,214,0.25)",
                    padding: "3px 7px",
                    borderRadius: 3,
                    animation: `siglabelfloat ${sig.dur} ease-in-out ${sig.del} infinite`,
                    whiteSpace: "nowrap",
                    top: (sig as any).top,
                    right: sig.right,
                    left: sig.left,
                    ...((sig as any).bottom !== undefined
                      ? { bottom: (sig as any).bottom, top: "auto" }
                      : {}),
                  }}
                >
                  {sig.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
