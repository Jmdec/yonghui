"use client";

export default function PageBackground() {
  return (
    <>
      <style>{`
        @keyframes streamfall {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes hpulse {
          0%   { transform: scaleX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes nodeblip {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 4px rgba(29,111,216,0.15); }
          50%       { opacity: 0.9; box-shadow: 0 0 8px rgba(29,111,216,0.35); }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(ellipse 700px 500px at 10% 20%, rgba(99,179,237,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 500px 600px at 90% 60%, rgba(147,197,253,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 800px 400px at 50% 100%, rgba(191,219,254,0.2) 0%, transparent 70%),
            linear-gradient(160deg, #dbeafe 0%, #e0f2fe 40%, #f0f9ff 100%)
          `,
        }}
      />

      {/* Subtle dot grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `radial-gradient(circle, rgba(29,111,216,0.12) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Very faint scanlines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(29,111,216,0.018) 3px, rgba(29,111,216,0.018) 4px
          )`,
        }}
      />

      {/* Data streams */}
      {(
        [
          { left: "8%", h: 80, dur: "3.2s", del: "0s" },
          { left: "15%", h: 120, dur: "4.1s", del: "0.7s" },
          { left: "23%", h: 60, dur: "2.8s", del: "1.4s" },
          { left: "35%", h: 100, dur: "3.7s", del: "0.3s" },
          { left: "48%", h: 140, dur: "5.0s", del: "2.1s" },
          { left: "57%", h: 70, dur: "3.3s", del: "0.9s" },
          { left: "67%", h: 90, dur: "2.6s", del: "1.8s" },
          { left: "78%", h: 110, dur: "4.4s", del: "0.5s" },
          { left: "88%", h: 75, dur: "3.0s", del: "2.7s" },
          { left: "95%", h: 95, dur: "3.9s", del: "1.1s" },
        ] as const
      ).map((s, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 0,
            left: s.left,
            top: -s.h,
            width: 1,
            height: s.h,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(29,111,216,0.5) 50%, transparent 100%)",
            animation: `streamfall ${s.dur} linear ${s.del} infinite`,
            opacity: 0,
          }}
        />
      ))}

      {/* Horizontal pulses */}
      {(
        [
          { top: "28%", dur: "6s", del: "0s" },
          { top: "55%", dur: "8s", del: "2.5s" },
          { top: "80%", dur: "7s", del: "5s" },
        ] as const
      ).map((p, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            height: 1,
            pointerEvents: "none",
            zIndex: 0,
            top: p.top,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(29,111,216,0.2) 40%, rgba(59,130,246,0.4) 50%, rgba(29,111,216,0.2) 60%, transparent 100%)",
            animation: `hpulse ${p.dur} linear ${p.del} infinite`,
            transformOrigin: "left",
          }}
        />
      ))}

      {/* Node blips */}
      {(
        [
          { top: "20%", left: "5%", dur: "2.4s", del: "0s" },
          { top: "45%", left: "22%", dur: "3.1s", del: "0.8s" },
          { top: "65%", left: "70%", dur: "2.8s", del: "1.6s" },
          { top: "30%", left: "88%", dur: "3.5s", del: "0.4s" },
          { top: "78%", left: "42%", dur: "2.2s", del: "2.2s" },
        ] as const
      ).map((n, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 0,
            top: n.top,
            left: n.left,
            width: 4,
            height: 4,
            border: "1px solid rgba(29,111,216,0.5)",
            borderRadius: "50%",
            animation: `nodeblip ${n.dur} ease-in-out ${n.del} infinite`,
          }}
        />
      ))}
    </>
  );
}
