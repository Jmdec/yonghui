"use client";

export default function PageBackground() {
  return (
    <>
      <style>{`
        @keyframes float-blob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-18px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>

      {/* Base warm background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: "#f7f4ef",
        }}
      />

      {/* Top center blue glow */}
      <div
        style={{
          position: "fixed",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 650,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse, rgba(0,87,217,.06) 0%, transparent 65%)",
        }}
      />

      {/* Right floating blob */}
      <div
        style={{
          position: "fixed",
          top: "25%",
          right: -80,
          width: 520,
          height: 520,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse, rgba(0,87,217,.05) 0%, transparent 70%)",
          animation: "float-blob 7s ease-in-out infinite",
        }}
      />

      {/* Bottom left floating blob */}
      <div
        style={{
          position: "fixed",
          bottom: "8%",
          left: -80,
          width: 480,
          height: 420,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse, rgba(0,87,217,.04) 0%, transparent 70%)",
          animation: "float-blob 9s ease-in-out infinite 2s",
        }}
      />

      {/* Subtle dot grid */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bg-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#0057d9"
              strokeWidth="0.5"
              opacity="0.05"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid)" />
      </svg>
    </>
  );
}
