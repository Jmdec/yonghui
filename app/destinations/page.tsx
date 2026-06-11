"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { useState, useEffect, useMemo } from "react";
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
  region?: string | null;
  tags?: string[] | null;
  plan_count?: number | null;
  featured?: boolean | null;
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  "5g": { bg: "#0066ff", color: "#ffffff" },
  "5G": { bg: "#0066ff", color: "#ffffff" },
  popular: { bg: "#1d9e75", color: "#ffffff" },
  "Most popular": { bg: "#1d9e75", color: "#ffffff" },
  new: { bg: "#bc6a08", color: "#ffffff" },
  New: { bg: "#bc6a08", color: "#ffffff" },
};

function formatPrice(price: number) {
  return price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DestCard({ dest, index }: { dest: Destination; index: number }) {
  const src = imgSrc(dest.image);

  return (
    <Link
      href={`/destinations/${dest.slug}`}
      id={`dest-${dest.slug}`}
      className="yh-dest-card"
      style={{ animationDelay: `${index * 40}ms`, scrollMarginTop: "16px" }}
    >
      <div className="yh-card-img-wrap">
        {src ? (
          <img src={src} alt={dest.name} className="yh-card-img" />
        ) : (
          <div className="yh-card-img-fallback">
            <span className="yh-flag-emoji">{dest.flag ?? "🌐"}</span>
          </div>
        )}
        {dest.tags?.[0] && (
          <span
            className="yh-card-badge"
            style={{
              background: BADGE_STYLES[dest.tags[0]]?.bg ?? "#0a2540",
              color: BADGE_STYLES[dest.tags[0]]?.color ?? "#ffffff",
            }}
          >
            {dest.tags[0]}
          </span>
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
              from ₱{formatPrice(dest.retail_price)}
            </span>
          )}
          {dest.plan_count != null && (
            <span className="yh-card-plans">
              {dest.plan_count} plan{dest.plan_count === 1 ? "" : "s"}
            </span>
          )}
          <div className="yh-card-arrow">→</div>
        </div>
      </div>
    </Link>
  );
}

function TrendingPill({ dest }: { dest: Destination }) {
  const src = imgSrc(dest.image);

  return (
    <a href={`#dest-${dest.slug}`} className="yh-trend-pill">
      <span className="yh-trend-icon">
        {src ? (
          <img src={src} alt="" />
        ) : (
          <span className="yh-flag-emoji yh-flag-emoji-sm">
            {dest.flag ?? "🌐"}
          </span>
        )}
      </span>
      <span className="yh-trend-name">{dest.name}</span>
      <i className="ti ti-flame" aria-hidden="true" />
    </a>
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
  const [activeRegion, setActiveRegion] = useState("All");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "name"
  >("default");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestinations(d.data ?? d ?? []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  const regions = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => {
      if (d.region) set.add(d.region);
    });
    return ["All", ...Array.from(set)];
  }, [destinations]);

  const featured = useMemo(() => {
    const flagged = destinations.filter((d) => d.featured);
    return (flagged.length > 0 ? flagged : destinations).slice(0, 3);
  }, [destinations]);

  const filtered = useMemo(() => {
    let list = destinations.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (activeRegion !== "All") {
      list = list.filter((d) => d.region === activeRegion);
    }

    if (sortBy === "price-asc") {
      list = [...list].sort(
        (a, b) => (a.retail_price ?? 0) - (b.retail_price ?? 0),
      );
    } else if (sortBy === "price-desc") {
      list = [...list].sort(
        (a, b) => (b.retail_price ?? 0) - (a.retail_price ?? 0),
      );
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [destinations, search, activeRegion, sortBy]);

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

        /* ── Toolbar (filters + sort) ── */
        .yh-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 16px 32px 0;
        }
        .yh-chip {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #0a2540;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .yh-chip:hover {
          border-color: rgba(0,102,255,0.3);
        }
        .yh-chip.active {
          background: #0066ff;
          border-color: #0066ff;
          color: #ffffff;
        }
        .yh-sort-wrap {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
          letter-spacing: 0.5px;
        }
        .yh-sort-select {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #0a2540;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          outline: none;
        }
        .yh-sort-select:focus {
          border-color: #0066ff;
        }

        /* ── Trending pills ── */
        .yh-trend-section {
          padding: 14px 32px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .yh-trend-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #8a9ab5;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .yh-trend-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }
        .yh-trend-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 5px 12px 5px 5px;
          flex-shrink: 0;
          transition: border-color 0.15s, background 0.15s;
        }
        .yh-trend-pill:hover {
          border-color: rgba(0,102,255,0.3);
          background: #f0f6ff;
        }
        .yh-trend-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f4f8;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .yh-trend-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .yh-flag-emoji-sm {
          font-size: 13px;
        }
        .yh-trend-name {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #0a2540;
          white-space: nowrap;
        }
        .yh-trend-pill .ti-flame {
          font-size: 13px;
          color: #f0997b;
        }

        /* ── Grid ── */
        .yh-grid-section {
          width: 100%;
          padding: 24px 32px 48px;
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
          position: relative;
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

        .yh-card-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 6px;
          text-transform: capitalize;
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
          font-size: 10.5px;
          font-weight: 600;
          color: #0052cc;
          white-space: nowrap;
          background: #eef3fb;
          padding: 2px 6px;
          border-radius: 6px;
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
        .yh-card-plans {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #8a9ab5;
          white-space: nowrap;
          flex-shrink: 0;
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

        /* ── Section label ── */
        .yh-section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #1d6fd8;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
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
            4G / <b>5G</b> speeds
          </div>
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            <b>No</b> roaming fees
          </div>
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            <b>24/7</b> support
          </div>
        </div>

        {/* Toolbar: region filters + sort */}
        {!loading && destinations.length > 0 && (
          <div className="yh-toolbar">
            {regions.map((region) => (
              <button
                key={region}
                className={`yh-chip${activeRegion === region ? " active" : ""}`}
                onClick={() => setActiveRegion(region)}
              >
                {region}
              </button>
            ))}
            <div className="yh-sort-wrap">
              Sort
              <select
                className="yh-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Trending pills */}
        {!loading && featured.length > 0 && (
          <div className="yh-trend-section">
            <span className="yh-trend-label">
              <i className="ti ti-flame" aria-hidden="true" />
              Trending
            </span>
            <div className="yh-trend-row">
              {featured.map((dest) => (
                <TrendingPill key={dest.id} dest={dest} />
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="yh-grid-section">
          {!loading && filtered.length > 0 && (
            <div className="yh-section-label">
              <span className="yh-eyebrow-line" />
              All destinations
            </div>
          )}
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
