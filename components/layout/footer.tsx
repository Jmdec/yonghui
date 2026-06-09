"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const NAV_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Destinations", href: "/destinations" },
      { label: "What is eSIM?", href: "/what-is-esim" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0,
      h = 0;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const NUM = 28;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const init = () => {
      nodes.length = 0;
      for (let i = 0; i < NUM; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 180, 255, 0.35)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500&family=Space+Mono:wght@400;700&display=swap');

        .yh-footer {
          position: relative;
          background: #030A18;
          border-top: 1px solid rgba(0, 180, 255, 0.25);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .yh-footer-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.5;
        }

        .yh-footer-inner {
          position: relative;
          z-index: 2;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .yh-footer-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr;
          gap: 32px;
          padding: 40px 0 32px;
          border-bottom: 1px solid rgba(0, 180, 255, 0.12);
        }

        /* ── Brand ── */
        .yh-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          text-decoration: none;
        }

        .yh-brand-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #0050CC, #00B4FF);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700; font-size: 13px;
          color: #fff;
          border: 1px solid rgba(0, 180, 255, 0.5);
          flex-shrink: 0;
        }

        .yh-brand-name {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 3px;
          color: #FFFFFF;
          line-height: 1;
        }

        .yh-brand-name span { color: #00B4FF; }

        .yh-brand-sub {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          color: #00B4FF;
          letter-spacing: 2px;
          opacity: 0.85;
          margin-top: 2px;
        }

        .yh-brand-tagline {
          font-size: 13px;
          color: #B8D4EE;
          line-height: 1.7;
          max-width: 240px;
          margin-bottom: 20px;
        }

        /* ── Signal pill ── */
        .yh-footer-signal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid rgba(0, 255, 176, 0.3);
          border-radius: 20px;
          background: rgba(0, 255, 176, 0.06);
          margin-bottom: 18px;
        }

        .yh-footer-signal-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00FFB0;
          animation: fpulse 2s ease-in-out infinite;
        }

        @keyframes fpulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #00FFB0; }
          50%       { opacity: 0.5; box-shadow: none; }
        }

        .yh-footer-signal-text {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #00FFB0;
          letter-spacing: 1.5px;
        }

        /* ── Socials ── */
        .yh-socials { display: flex; gap: 8px; }

        .yh-social-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(0, 180, 255, 0.3);
          background: rgba(0, 180, 255, 0.05);
          display: flex; align-items: center; justify-content: center;
          color: #9DC4E0;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .yh-social-btn:hover {
          border-color: #00B4FF;
          color: #00B4FF;
          background: rgba(0, 180, 255, 0.12);
        }

        /* ── Nav column headings — fully white + glow so they always pop ── */
       .yh-col-heading {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #FFFFFF !important;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: none !important;
}
        .yh-col-heading::before {
          content: '';
          display: block;
          width: 14px; height: 2px;
          background: #00B4FF;
          box-shadow: 0 0 6px #00B4FF;
          flex-shrink: 0;
        }

        /* ── Nav links ── */
        .yh-col-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .yh-footer-link {
          font-size: 13.5px;
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          line-height: 1;
        }

        .yh-footer-link::before {
          content: '';
          display: block;
          width: 0; height: 1px;
          background: #00B4FF;
          transition: width 0.2s ease;
          flex-shrink: 0;
        }

        .yh-footer-link:hover { color: #00B4FF; }
        .yh-footer-link:hover::before { width: 10px; }

        /* ── Bottom bar ── */
        .yh-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          flex-wrap: wrap;
          gap: 14px;
        }

        .yh-copyright {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #7AAAC8;
          letter-spacing: 0.5px;
        }

        .yh-copyright span { color: #A8C8E8; }

        /* ── Payment badges ── */
        .yh-payment-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        .yh-pay-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid rgba(0, 180, 255, 0.25);
          background: rgba(0, 180, 255, 0.06);
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          color: #A8C8E8;
          letter-spacing: 0.5px;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .yh-pay-badge i { font-size: 12px; }

        .yh-pay-badge:hover {
          border-color: rgba(0, 180, 255, 0.5);
          color: #FFFFFF;
        }

        /* ── Decorative overlays ── */
        .yh-footer-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 3px,
            rgba(0, 0, 0, 0.04) 3px, rgba(0, 0, 0, 0.04) 4px
          );
          pointer-events: none;
          z-index: 1;
        }

        .yh-footer-glow {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00B4FF 40%, #00FFB0 60%, transparent);
          opacity: 0.5;
          animation: glowshift 4s ease-in-out infinite alternate;
        }

        @keyframes glowshift {
          from { left: 10%; right: 30%; opacity: 0.3; }
          to   { left: 30%; right: 10%; opacity: 0.6; }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .yh-footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
        }

        @media (max-width: 560px) {
          .yh-footer-grid { grid-template-columns: 1fr; }
          .yh-footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="yh-footer">
        <canvas ref={canvasRef} className="yh-footer-canvas" />
        <div className="yh-footer-scanlines" />
        <div className="yh-footer-glow" />

        <div className="yh-footer-inner">
          <div className="yh-footer-grid">
            {/* Brand */}
            <div>
              <Link href="/" className="yh-brand-logo">
                <img
                  src="/logo.jpg"
                  alt="YH"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    objectFit: "cover",
                    border: "1px solid rgba(0,180,255,0.3)",
                  }}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.style.display = "none";
                    (t.nextSibling as HTMLElement).style.display = "flex";
                  }}
                />
                <div className="yh-brand-icon" style={{ display: "none" }}>
                  YH
                </div>
                <div>
                  <div className="yh-brand-name">
                    YH<span></span>
                  </div>
                  <div className="yh-brand-sub">eSIM · GLOBAL NETWORK</div>
                </div>
              </Link>

              <p className="yh-brand-tagline">
                Global eSIM connectivity for modern travelers. Instant
                activation, no physical SIM required. Stay connected in 190+
                countries.
              </p>

              <div className="yh-footer-signal" style={{ marginBottom: 16 }}>
                <div className="yh-footer-signal-dot" />
                <span className="yh-footer-signal-text">
                  NETWORK LIVE · 5G READY
                </span>
              </div>

              <div className="yh-socials">
                <a href="#" className="yh-social-btn" aria-label="Twitter/X">
                  <i className="ti ti-brand-x" aria-hidden="true" />
                </a>
                <a href="#" className="yh-social-btn" aria-label="Facebook">
                  <i className="ti ti-brand-facebook" aria-hidden="true" />
                </a>
                <a href="#" className="yh-social-btn" aria-label="Instagram">
                  <i className="ti ti-brand-instagram" aria-hidden="true" />
                </a>
                <a href="#" className="yh-social-btn" aria-label="LinkedIn">
                  <i className="ti ti-brand-linkedin" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Nav columns */}
            {NAV_COLS.map((col) => (
              <div key={col.heading}>
                <h4 className="yh-col-heading">{col.heading}</h4>
                <ul className="yh-col-links">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className="yh-footer-link">
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} className="yh-footer-link">
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="yh-footer-bottom">
            <div className="yh-copyright">
              © 2025 <span>YH eSIM</span> · All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
