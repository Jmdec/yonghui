"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING NETWORK...");
  const graphicRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
    setFadeOut(false);
    setProgress(0);
    setStatusText("INITIALIZING NETWORK...");

    const steps = [
      { at: 100, val: 15, label: "INITIALIZING NETWORK..." },
      { at: 300, val: 35, label: "SCANNING FREQUENCIES..." },
      { at: 600, val: 58, label: "ESTABLISHING CONNECTION..." },
      { at: 900, val: 78, label: "AUTHENTICATING eSIM..." },
      { at: 1200, val: 95, label: "SYNCING PROFILE..." },
      { at: 1500, val: 100, label: "CONNECTED ✓" },
    ];

    const timers: NodeJS.Timeout[] = steps.map((s) =>
      setTimeout(() => {
        setProgress(s.val);
        setStatusText(s.label);
      }, s.at),
    );

    const t1 = setTimeout(() => setFadeOut(true), 1800);
    const t2 = setTimeout(() => setVisible(false), 2100);
    timers.push(t1, t2);

    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  useEffect(() => {
    if (!loaderRef.current || !visible) return;
    const loader = loaderRef.current;

    // floating particles
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        position:absolute; border-radius:50%;
        background:rgba(0,180,255,0.6);
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 30}%;
        animation: yh-float-up ${4 + Math.random() * 5}s linear ${Math.random() * 4}s infinite;
        pointer-events:none;
      `;
      loader.appendChild(p);
    }

    // data stream lines
    if (graphicRef.current) {
      for (let i = 0; i < 6; i++) {
        const ds = document.createElement("div");
        const h = 20 + Math.random() * 60;
        ds.style.cssText = `
          position:absolute;
          width:1px; height:${h}px;
          left:${10 + Math.random() * 80}%;
          top:-20px;
          background:linear-gradient(180deg,transparent,#00B4FF,transparent);
          animation: yh-stream-fall ${1.2 + Math.random() * 1.5}s linear ${Math.random() * 2}s infinite;
          opacity:0;
        `;
        graphicRef.current.appendChild(ds);
      }
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Space+Mono:wght@400;700&display=swap');

        @keyframes yh-spin-cw  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
        @keyframes yh-spin-ccw { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes yh-bar-pulse {
          0%,100%{filter:brightness(0.6);transform:scaleY(0.7)}
          50%{filter:brightness(1.5);transform:scaleY(1);box-shadow:0 0 8px #00B4FF}
        }
        @keyframes yh-core-pulse {
          0%,100%{box-shadow:inset 0 0 20px rgba(0,180,255,0.08),0 0 20px rgba(0,180,255,0.1)}
          50%{box-shadow:inset 0 0 30px rgba(0,180,255,0.18),0 0 50px rgba(0,180,255,0.35)}
        }
        @keyframes yh-glow-breathe {
          0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)}
          50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}
        }
        @keyframes yh-grid-pan {
          0%{transform:perspective(600px) rotateX(20deg) translateY(0)}
          100%{transform:perspective(600px) rotateX(20deg) translateY(60px)}
        }
        @keyframes yh-ping {
          0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.7}
          100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}
        }
        @keyframes yh-blink {
          0%,100%{opacity:0.8} 50%{opacity:0.3}
        }
        @keyframes yh-float-up {
          0%{transform:translateY(0) scale(0);opacity:0}
          10%{opacity:1}
          90%{opacity:0.6}
          100%{transform:translateY(-120px) scale(1.5);opacity:0}
        }
        @keyframes yh-stream-fall {
          0%{opacity:0;transform:translateY(-20px)}
          10%{opacity:0.8}
          90%{opacity:0.8}
          100%{opacity:0;transform:translateY(140px)}
        }
        @keyframes yh-fade-out {
          to{opacity:0}
        }

        .yh-loader-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #060D1A;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
          transition: opacity 0.35s ease;
        }
        .yh-loader-overlay.out { opacity: 0; pointer-events: none; }

        .yh-loader-overlay::before {
          content:''; position:absolute; inset:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,180,255,0.015) 2px,rgba(0,180,255,0.015) 4px);
          pointer-events:none; z-index:10;
        }

        .yh-grid-bg {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(0,180,255,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,180,255,0.04) 1px,transparent 1px);
          background-size:60px 60px;
          animation:yh-grid-pan 20s linear infinite;
        }

        .yh-glow-center {
          position:absolute;
          width:500px; height:500px; border-radius:50%;
          background:radial-gradient(circle,rgba(0,80,255,0.14) 0%,rgba(0,180,255,0.07) 40%,transparent 70%);
          top:50%; left:50%;
          animation:yh-glow-breathe 3s ease-in-out infinite;
        }

        .yh-corner { position:absolute; width:24px; height:24px; }
        .yh-corner-tl{top:20px;left:20px;border-top:2px solid #00B4FF;border-left:2px solid #00B4FF}
        .yh-corner-tr{top:20px;right:20px;border-top:2px solid #00B4FF;border-right:2px solid #00B4FF}
        .yh-corner-bl{bottom:20px;left:20px;border-bottom:2px solid #00B4FF;border-left:2px solid #00B4FF}
        .yh-corner-br{bottom:20px;right:20px;border-bottom:2px solid #00B4FF;border-right:2px solid #00B4FF}

        .yh-hud { position:absolute; background:rgba(0,180,255,0.15); }
        .yh-hud-h { height:1px; width:80px; top:32px; }
        .yh-hud-hl { left:52px; }
        .yh-hud-hr { right:52px; }
        .yh-hud-v { width:1px; height:80px; }
        .yh-hud-vt { left:32px; top:52px; }
        .yh-hud-vb { right:32px; bottom:52px; }

        .yh-ping {
          position:absolute; border-radius:50%;
          border:1px solid rgba(0,180,255,0.35);
          width:200px; height:200px;
          animation:yh-ping 2.5s ease-out infinite;
          pointer-events:none;
        }

        .yh-loader-content {
          position:relative; z-index:5;
          display:flex; flex-direction:column;
          align-items:center; gap:28px;
        }

        /* ── graphic ── */
        .yh-esim-graphic {
          position:relative; width:140px; height:140px;
        }

        .yh-ring {
          position:absolute; border-radius:50%;
          border:1px solid transparent;
        }
        .yh-ring-1 {
          inset:0;
          border-color:rgba(0,180,255,0.2);
          border-top-color:#00B4FF;
          animation:yh-spin-cw 3s linear infinite;
        }
        .yh-ring-2 {
          inset:10px;
          border-color:rgba(0,255,176,0.12);
          border-right-color:#00FFB0;
          border-bottom-color:rgba(0,255,176,0.35);
          animation:yh-spin-ccw 4s linear infinite;
        }
        .yh-ring-3 {
          inset:22px;
          border-color:rgba(0,180,255,0.1);
          border-left-color:rgba(0,180,255,0.45);
          animation:yh-spin-cw 6s linear infinite;
        }

        .yh-ring-dot {
          position:absolute; width:6px; height:6px; border-radius:50%;
          top:-3px; left:50%; transform:translateX(-50%);
        }
        .yh-ring-1 .yh-ring-dot { background:#00B4FF; box-shadow:0 0 10px #00B4FF,0 0 20px rgba(0,180,255,0.5); }
        .yh-ring-2 .yh-ring-dot { background:#00FFB0; box-shadow:0 0 8px #00FFB0; top:auto; bottom:-3px; }

        .yh-sim-core {
          position:absolute; inset:32px;
          border-radius:10px;
          background:linear-gradient(145deg,#0D1F3C,#060D1A);
          border:1px solid rgba(0,180,255,0.4);
          display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:6px;
          clip-path:polygon(14px 0%,100% 0%,100% 100%,0% 100%,0% 14px);
          animation:yh-core-pulse 2.5s ease-in-out infinite;
        }

        .yh-sim-chip {
          width:28px; height:22px; border-radius:3px;
          background:linear-gradient(135deg,#1A3A5C,#0D2240,#1A3A5C);
          border:1px solid rgba(0,180,255,0.5);
          position:relative; overflow:hidden;
        }
        .yh-sim-chip::after {
          content:''; position:absolute; inset:0;
          background:
            repeating-linear-gradient(0deg,transparent,transparent 6px,rgba(0,180,255,0.15) 6px,rgba(0,180,255,0.15) 7px),
            repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(0,180,255,0.15) 8px,rgba(0,180,255,0.15) 9px);
        }

        .yh-sim-bars { display:flex; gap:3px; align-items:flex-end; }
        .yh-sim-bar {
          width:4px; border-radius:1px 1px 0 0; background:#00B4FF;
          animation:yh-bar-pulse 1s ease-in-out infinite;
        }
        .yh-sim-bar:nth-child(1){height:4px; animation-delay:0s;    opacity:0.5}
        .yh-sim-bar:nth-child(2){height:7px; animation-delay:0.15s; opacity:0.65}
        .yh-sim-bar:nth-child(3){height:10px;animation-delay:0.3s;  opacity:0.8}
        .yh-sim-bar:nth-child(4){height:7px; animation-delay:0.45s; opacity:0.65}
        .yh-sim-bar:nth-child(5){height:4px; animation-delay:0.6s;  opacity:0.5}

        /* ── brand ── */
        .yh-wordmark {
          font-family:'Rajdhani',sans-serif;
          font-weight:700; font-size:36px;
          letter-spacing:8px; color:#FFFFFF; line-height:1;
          text-shadow:0 0 30px rgba(0,180,255,0.3);
        }
        .yh-wordmark span { color:#00B4FF; }

        .yh-tagline {
          font-family:'Space Mono',monospace;
          font-size:10px; color:#00B4FF;
          letter-spacing:4px; opacity:0.9;
          margin-top:4px; text-align:center;
        }

        /* ── progress ── */
        .yh-progress-wrap {
          display:flex; flex-direction:column;
          align-items:center; gap:10px; width:260px;
        }
        .yh-bar-row { display:flex; align-items:center; gap:10px; width:100%; }
        .yh-bar-track {
          flex:1; height:2px;
          background:rgba(0,180,255,0.1);
          border-radius:2px; overflow:visible; position:relative;
        }
        .yh-bar-fill {
          height:100%; border-radius:2px;
          background:linear-gradient(90deg,#0050CC 0%,#00B4FF 60%,#00FFB0 100%);
          box-shadow:0 0 12px rgba(0,180,255,0.9),0 0 24px rgba(0,180,255,0.4);
          transition:width 0.3s cubic-bezier(0.4,0,0.2,1);
          position:relative;
        }
        .yh-bar-fill::after {
          content:''; position:absolute;
          right:-1px; top:-3px;
          width:2px; height:8px; border-radius:2px;
          background:#FFFFFF;
          box-shadow:0 0 10px #00B4FF,0 0 20px rgba(0,180,255,0.8);
        }
        .yh-pct {
          font-family:'Rajdhani',sans-serif;
          font-weight:700; font-size:13px;
          color:#00B4FF; letter-spacing:1px;
          min-width:38px; text-align:right;
        }
        .yh-status {
          font-family:'Space Mono',monospace;
          font-size:10px; color:#FFFFFF;
          letter-spacing:2px; opacity:0.75;
          animation:yh-blink 1.2s step-end infinite;
        }
      `}</style>

      <div
        ref={loaderRef}
        className={`yh-loader-overlay${fadeOut ? " out" : ""}`}
      >
        <div className="yh-grid-bg" />
        <div className="yh-glow-center" />

        <div className="yh-corner yh-corner-tl" />
        <div className="yh-corner yh-corner-tr" />
        <div className="yh-corner yh-corner-bl" />
        <div className="yh-corner yh-corner-br" />
        <div className="yh-hud yh-hud-h yh-hud-hl" />
        <div className="yh-hud yh-hud-h yh-hud-hr" />
        <div className="yh-hud yh-hud-v yh-hud-vt" />
        <div className="yh-hud yh-hud-v yh-hud-vb" />

        {/* ping rings */}
        {[0, 0.8, 1.6].map((delay, i) => (
          <div
            key={i}
            className="yh-ping"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-160px",
              animationDelay: `${delay}s`,
            }}
          />
        ))}

        <div className="yh-loader-content">
          {/* graphic */}
          <div className="yh-esim-graphic" ref={graphicRef}>
            <div className="yh-ring yh-ring-1">
              <div className="yh-ring-dot" />
            </div>
            <div className="yh-ring yh-ring-2">
              <div className="yh-ring-dot" />
            </div>
            <div className="yh-ring yh-ring-3" />
            <div className="yh-sim-core">
              <div className="yh-sim-chip" />
              <div className="yh-sim-bars">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="yh-sim-bar" />
                ))}
              </div>
            </div>
          </div>

          {/* brand */}
          <div style={{ textAlign: "center" }}>
            <div className="yh-wordmark">
              YH<span></span>
            </div>
            <div className="yh-tagline">eSIM · GLOBAL NETWORK</div>
          </div>

          {/* progress */}
          <div className="yh-progress-wrap">
            <div className="yh-bar-row">
              <div className="yh-bar-track">
                <div
                  className="yh-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="yh-pct">{progress}%</div>
            </div>
            <div className="yh-status">{statusText}</div>
          </div>
        </div>
      </div>
    </>
  );
}
