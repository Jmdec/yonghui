"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/footer";
interface Destination {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
}

function GridBg() {
  return (
    <div className="grid-bg" aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(14,99,214,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function PingDot() {
  return (
    <span className="ping-wrap">
      <span className="ping-ring" />
      <span className="ping-dot" />
    </span>
  );
}

function DestCard({ dest, index }: { dest: Destination; index: number }) {
  const imgSrc = dest.image
    ? `${process.env.NEXT_PUBLIC_API_URL}/${dest.image}`
    : null;

  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className="dest-card"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="card-inner">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        <div className="card-img-wrap">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={dest.name}
              className="card-img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="card-img-fallback">🌐</div>
          )}
          <div className="img-overlay" />
          <div className="img-scan" />
        </div>

        <div className="card-body">
          <div className="card-num">{String(index + 1).padStart(2, "0")}</div>
          <div className="card-name">{dest.name}</div>
          <div className="card-cta">
            <span>VIEW PLANS</span>
            <span className="cta-arrow">›</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestinations(d.data ?? d ?? []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const now = new Date();
  const timeStr = now.toUTCString().slice(17, 25);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Share+Tech+Mono&display=swap');

        :root {
          --bg-page:     #dbeafe;
          --bg-surface:  rgba(255,255,255,0.65);
          --bg-deep:     rgba(255,255,255,0.85);
          --border:      rgba(14,99,214,0.15);
          --border-mid:  rgba(14,99,214,0.25);
          --border-hover:rgba(14,99,214,0.5);
          --blue:        #0D6EFD;
          --blue-mid:    #1d6fd8;
          --blue-light:  #60a5fa;
          --blue-pale:   #bfdbfe;
          --text-head:   #0a2540;
          --text-body:   #1e3a5f;
          --text-muted:  #4a6a8a;
          --text-faint:  #93b8d8;
          --mono:        'Share Tech Mono', monospace;
          --display:     'Exo 2', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 700px 500px at 10% 20%, rgba(99,179,237,0.2) 0%, transparent 70%),
            radial-gradient(ellipse 500px 600px at 90% 70%, rgba(147,197,253,0.18) 0%, transparent 70%),
            linear-gradient(160deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%);
          font-family: var(--mono);
          color: var(--text-body);
          position: relative;
          overflow-x: hidden;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* Floating dots */
        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%);
          top: -80px; left: -80px;
        }
        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(147,197,253,0.15) 0%, transparent 70%);
          bottom: 80px; right: -60px;
          animation-delay: -6s;
        }
        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(24px, 16px) scale(1.06); }
        }

        .content { position: relative; z-index: 2; }

        /* ── Top bar ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 28px;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          font-size: 10px;
          letter-spacing: 1.5px;
          color: var(--text-muted);
        }
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .topbar-status { display: flex; align-items: center; gap: 6px; color: var(--blue-mid); font-weight: 600; }

        .ping-wrap { position: relative; display: inline-flex; width: 8px; height: 8px; }
        .ping-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          background: var(--blue-mid);
          opacity: 0.4;
          animation: ping 1.5s ease-out infinite;
        }
        .ping-dot {
          position: relative;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--blue-mid);
        }
        @keyframes ping {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* ── Hero ── */
        .hero {
          padding: 28px 28px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .hero-eyebrow {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--blue-mid);
          letter-spacing: 3px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .eyebrow-line {
          width: 32px; height: 1px;
          background: var(--blue-mid);
          opacity: 0.5;
        }

        .hero-title {
          font-family: var(--display);
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -1px;
          color: var(--text-head);
        }
        .hero-title .accent {
          display: block;
          color: var(--blue);
        }

        /* Search */
        .search-wrap { position: relative; }
        .search-input {
          width: 240px;
          background: rgba(255,255,255,0.8);
          border: 1px solid var(--border-mid);
          padding: 9px 14px 9px 38px;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text-head);
          outline: none;
          letter-spacing: 0.5px;
          transition: border-color 0.2s, box-shadow 0.2s;
          border-radius: 4px;
          backdrop-filter: blur(6px);
        }
        .search-input::placeholder { color: var(--text-faint); }
        .search-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
        }
        .search-icon {
          position: absolute;
          left: 12px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: var(--blue-mid);
          opacity: 0.6;
          pointer-events: none;
        }

        /* ── Stats strip ── */
        .stats-strip {
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(8px);
          overflow-x: auto;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-right: 1px solid var(--border);
          font-size: 10px;
          letter-spacing: 1px;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .stat-item b {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-head);
        }
        .stat-icon { font-size: 12px; color: var(--blue); opacity: 0.8; }

        /* ── Grid ── */
        .grid-section { padding: 16px 28px 28px; }

        .dest-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }
        @media (max-width: 1280px) { .dest-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 960px)  { .dest-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .dest-grid { grid-template-columns: repeat(2, 1fr); } }

        /* ── Destination card ── */
        .dest-card {
          display: block;
          text-decoration: none;
          animation: cardIn 0.4s ease both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-inner {
          position: relative;
          background: rgba(255,255,255,0.65);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          height: 100%;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(6px);
        }
        .dest-card:hover .card-inner {
          border-color: var(--border-hover);
          box-shadow: 0 8px 28px rgba(13,110,253,0.12), 0 2px 8px rgba(13,110,253,0.06);
          transform: translateY(-2px);
          background: rgba(255,255,255,0.88);
        }

        /* Corner brackets */
        .corner {
          position: absolute;
          width: 10px; height: 10px;
          border-color: var(--blue);
          border-style: solid;
          opacity: 0;
          transition: opacity 0.25s;
          z-index: 4;
        }
        .dest-card:hover .corner { opacity: 0.5; }
        .corner.tl { top: 4px; left: 4px;  border-width: 1px 0 0 1px; }
        .corner.tr { top: 4px; right: 4px; border-width: 1px 1px 0 0; }
        .corner.bl { bottom: 4px; left: 4px;  border-width: 0 0 1px 1px; }
        .corner.br { bottom: 4px; right: 4px; border-width: 0 1px 1px 0; }

        /* Image */
        .card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: rgba(219,234,254,0.5);
          flex-shrink: 0;
        }
        .card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease, filter 0.4s ease;
          filter: brightness(0.9) saturate(0.85);
        }
        .dest-card:hover .card-img {
          transform: scale(1.07);
          filter: brightness(1) saturate(1.05);
        }
        .card-img-fallback {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          background: rgba(219,234,254,0.6);
        }

        .img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(14,99,214,0.08) 100%);
          z-index: 1;
        }

        .img-scan {
          position: absolute;
          left: 0; right: 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(13,110,253,0.07), transparent);
          top: -40%;
          z-index: 2;
        }
        .dest-card:hover .img-scan {
          animation: imgScan 0.6s ease forwards;
        }
        @keyframes imgScan {
          from { top: -40%; }
          to   { top: 140%; }
        }

        /* Card body */
        .card-body {
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid var(--border);
          background: rgba(255,255,255,0.4);
          flex: 1;
          min-width: 0;
        }
        .card-num {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--blue-mid);
          opacity: 0.5;
          flex-shrink: 0;
          letter-spacing: 1px;
        }
        .card-name {
          font-family: var(--display);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-head);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.2px;
        }
        .card-cta {
          display: flex;
          align-items: center;
          gap: 3px;
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-muted);
          opacity: 0;
          transition: opacity 0.2s;
          flex-shrink: 0;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .dest-card:hover .card-cta { opacity: 1; color: var(--blue); }
        .cta-arrow {
          display: inline-block;
          transition: transform 0.2s;
          font-size: 14px;
        }
        .dest-card:hover .cta-arrow { transform: translateX(3px); }

        /* ── Skeleton ── */
        .skel-card {
          background: rgba(255,255,255,0.6);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
        }
        .skel-img {
          aspect-ratio: 16/10;
          background: linear-gradient(90deg, rgba(219,234,254,0.6) 25%, rgba(191,219,254,0.4) 50%, rgba(219,234,254,0.6) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .skel-body {
          height: 38px;
          background: linear-gradient(90deg, rgba(255,255,255,0.5) 25%, rgba(219,234,254,0.4) 50%, rgba(255,255,255,0.5) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite 0.2s;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Empty ── */
        .empty-state {
          grid-column: 1 / -1;
          padding: 48px;
          text-align: center;
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--text-faint);
          text-transform: uppercase;
        }

        /* ── Footer CTA ── */
        .footer-band {
          margin: 0 28px 28px;
          border: 1px solid var(--border-mid);
          border-radius: 8px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }
        .footer-band::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue) 50%, transparent);
          opacity: 0.4;
        }
        .footer-text-title {
          font-family: var(--display);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-head);
          margin-bottom: 3px;
        }
        .footer-text-sub {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0D6EFD, #0090FF);
          color: #fff;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          transition: box-shadow 0.2s, gap 0.2s;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .footer-btn:hover {
          box-shadow: 0 6px 20px rgba(13,110,253,0.35);
          gap: 12px;
        }

        .data-stream {
          position: fixed;
          top: 0; bottom: 0;
          right: 16px;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(14,99,214,0.2), transparent);
          opacity: 0.4;
          pointer-events: none;
          z-index: 1;
          animation: streamPulse 3s ease-in-out infinite;
        }
        @keyframes streamPulse {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.5; }
        }
      `}</style>

      <div className="page">
        <GridBg />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="data-stream" />

        <div className="content">
          <Navigation />

          {/* Top system bar */}
          <div className="topbar">
            <div className="topbar-left">
              <span className="topbar-status">
                <PingDot /> NETWORK ONLINE
              </span>
              <span>SYS.UTC {timeStr}</span>
            </div>
            <span>
              ESIM GLOBAL COVERAGE // {loading ? "—" : destinations.length}{" "}
              NODES
            </span>
          </div>

          {/* Hero */}
          <div className="hero">
            <div>
              <div className="hero-eyebrow">
                <span className="eyebrow-line" />
                DESTINATION REGISTRY
              </div>
              <h1 className="hero-title">
                GLOBAL
                <span className="accent">NETWORK</span>
              </h1>
            </div>
            <div>
              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search destination..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="stats-strip">
            <div className="stat-item">
              <span className="stat-icon">◈</span>
              <span>
                <b>{loading ? "—" : filtered.length}</b> DESTINATIONS
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⚡</span>
              <span>
                INSTANT <b>ACTIVATION</b>
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">◉</span>
              <span>
                <b>190+</b> COUNTRIES
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">▸</span>
              <span>
                4G / <b>5G</b> SPEEDS
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid-section">
            <div className="dest-grid">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <div key={i} className="skel-card">
                    <div className="skel-img" />
                    <div className="skel-body" />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="empty-state">No destinations found</div>
              ) : (
                filtered.map((dest, i) => (
                  <DestCard key={dest.id} dest={dest} index={i} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
