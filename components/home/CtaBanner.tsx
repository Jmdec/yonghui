"use client";

import Link from "next/link";

export default function CtaBanner() {
  return (
    <>
      <style>{`
        @keyframes tracemove {
          0%   { transform: scaleX(0) translateX(-50%); opacity: 0; }
          50%  { transform: scaleX(1) translateX(0);    opacity: 1; }
          100% { transform: scaleX(0) translateX(50%);  opacity: 0; }
        }
        .yh-btn-primary:hover {
          box-shadow: 0 6px 24px rgba(13,110,253,0.4) !important;
          transform: translateY(-1px) !important;
        }
      `}</style>

      <div style={{ width: "100%", position: "relative", zIndex: 2 }}>
        <div
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(14,99,214,0.2)",
            borderRadius: 10,
            padding: "36px 32px",
            textAlign: "center",
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Top trace */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(14,99,214,0.6) 50%, transparent)",
              animation: "tracemove 3s ease-in-out infinite",
            }}
          />
          {/* Bottom trace */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(96,165,250,0.6) 50%, transparent)",
              animation: "tracemove 3s ease-in-out infinite reverse",
            }}
          />

          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: "#0a2540",
              marginBottom: 8,
            }}
          >
            Ready to Connect?
          </h2>
          <p style={{ color: "#4a6a8a", fontSize: 13, marginBottom: 22 }}>
            Choose your destination and activate your eSIM today. No contracts,
            no hassle.
          </p>
          <Link
            href="/destinations"
            className="yh-btn-primary"
            style={{
              background: "linear-gradient(135deg, #0D6EFD, #0090FF)",
              border: "none",
              color: "#ffffff",
              padding: "11px 28px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(13,110,253,0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <i className="ti ti-sim-card" aria-hidden="true" /> Browse Plans
          </Link>
        </div>
      </div>
    </>
  );
}
