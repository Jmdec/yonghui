"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/footer";

const API_IMG = process.env.NEXT_PUBLIC_API_IMG ?? "";

function imgSrc(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_IMG}/${path}`;
}

interface Destination {
  id: number;
  name: string;
  slug: string;
  flag?: string;
  image?: string | null;
  retail_price?: number | null;
}

function DestCard({ dest, index }: { dest: Destination; index: number }) {
  const src = imgSrc(dest.image);

  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className="yh-dest-card"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="yh-card-img-wrap">
        {src ? (
          <img src={src} alt={dest.name} className="yh-card-img" />
        ) : (
          <div className="yh-card-img-fallback">
            <span className="yh-flag-emoji">{dest.flag ?? "🌐"}</span>
          </div>
        )}
      </div>

      <div className="yh-card-body">
        <div className="yh-card-left">
          <span className="yh-card-num">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="yh-card-name">{dest.name}</span>
        </div>
        <div className="yh-card-right">
          {dest.retail_price != null && (
            <span className="yh-card-price">
              from ₱{dest.retail_price.toFixed(2)}
            </span>
          )}
          <div className="yh-card-arrow">→</div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="yh-skel">
      <div className="yh-skel-img" />
      <div className="yh-skel-body" />
    </div>
  );
}

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestinations(d.data ?? d ?? []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&family=Noto+Color+Emoji&display=swap');

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .yh-page {
          min-height: 100vh;
          background: #f5f5f0;
          font-family: 'Sora', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Hero ── */
        .yh-hero {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 28px 32px 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .yh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #1d6fd8;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .yh-eyebrow-line {
          display: inline-block;
          width: 14px; height: 1px;
          background: #1d6fd8;
        }
        .yh-hero-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 700;
          color: #0a2540;
          line-height: 1.1;
          margin: 0;
        }

        /* Search */
        .yh-search-wrap { position: relative; }
        .yh-search-input {
          width: 260px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px 10px 38px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #0a2540;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .yh-search-input::placeholder { color: #b0bccf; }
        .yh-search-input:focus {
          border-color: #0066ff;
          box-shadow: 0 0 0 3px rgba(0,102,255,0.08);
          background: #ffffff;
        }
        .yh-search-icon {
          position: absolute;
          left: 12px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          color: #8a9ab5;
          pointer-events: none;
        }

        /* ── Stats strip ── */
        .yh-stats {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          overflow-x: auto;
        }
        .yh-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          border-right: 1px solid #e2e8f0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }
        .yh-stat b {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0a2540;
        }
        .yh-stat-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #0066ff;
          flex-shrink: 0;
        }

        /* ── Grid ── */
        .yh-grid-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 32px 48px;
          width: 100%;
          box-sizing: border-box;
          flex: 1;
        }
        .yh-dest-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        @media (max-width: 1280px) { .yh-dest-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 960px)  { .yh-dest-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .yh-dest-grid { grid-template-columns: repeat(2, 1fr); } }

        /* ── Card ── */
        .yh-dest-card {
          display: block;
          text-decoration: none;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          animation: cardIn 0.4s ease both;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .yh-dest-card:hover {
          border-color: rgba(0,102,255,0.3);
          box-shadow: 0 6px 20px rgba(0,102,255,0.09);
          transform: translateY(-3px);
        }

        .yh-card-img-wrap {
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: #f0f4f8;
          flex-shrink: 0;
        }
        .yh-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .yh-dest-card:hover .yh-card-img { transform: scale(1.05); }
        .yh-card-img-fallback {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }
        .yh-flag-emoji {
          font-family: 'Noto Color Emoji', 'Apple Color Emoji', sans-serif !important;
          font-size: 32px;
          line-height: 1;
        }

        .yh-card-body {
          padding: 11px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
        }
        .yh-card-left {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
        }
        .yh-card-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #b0bccf;
          flex-shrink: 0;
        }
        .yh-card-name {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #0a2540;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .yh-card-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .yh-card-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #0066ff;
          white-space: nowrap;
        }
        .yh-card-arrow {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #eef3fb;
          border: 1px solid #d4dfee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b7dd8;
          font-size: 11px;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          flex-shrink: 0;
        }
        .yh-dest-card:hover .yh-card-arrow {
          background: #0066ff;
          border-color: #0066ff;
          color: #ffffff;
        }

        /* ── Skeleton ── */
        .yh-skel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }
        .yh-skel-img {
          aspect-ratio: 16/10;
          background: #f0f4f8;
          background-image: linear-gradient(90deg, #f0f4f8 25%, #e8eef6 50%, #f0f4f8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .yh-skel-body {
          height: 44px;
          background-image: linear-gradient(90deg, #f8fafc 25%, #f0f4f8 50%, #f8fafc 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite 0.2s;
        }

        /* ── Empty ── */
        .yh-empty {
          grid-column: 1 / -1;
          padding: 48px;
          text-align: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #b0bccf;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="yh-page">
        <Navigation />

        {/* Hero */}
        <div className="yh-hero">
          <div>
            <div className="yh-eyebrow">
              <span className="yh-eyebrow-line" />
              Popular destinations
            </div>
            <h1 className="yh-hero-title">Where are you headed?</h1>
          </div>
          <div className="yh-search-wrap">
            <span className="yh-search-icon">⌕</span>
            <input
              className="yh-search-input"
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="yh-stats">
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            <b>{loading ? "—" : filtered.length}</b> destinations
          </div>
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            Instant <b>activation</b>
          </div>
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            <b>190+</b> countries
          </div>
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            4G / <b>5G</b> speeds
          </div>
        </div>

        {/* Grid */}
        <div className="yh-grid-section">
          <div className="yh-dest-grid">
            {loading ? (
              [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div className="yh-empty">No destinations found</div>
            ) : (
              filtered.map((dest, i) => (
                <DestCard key={dest.id} dest={dest} index={i} />
              ))
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
