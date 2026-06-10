"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_IMG = process.env.NEXT_PUBLIC_API_IMG ?? "";

interface Destination {
  id: number;
  name: string;
  slug: string;
  flag: string;
  image?: string | null;
  retail_price?: number | null;
}

function imgSrc(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_IMG}/${path}`;
}

export default function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestinations(d.data ?? []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&family=Noto+Color+Emoji&display=swap');

        .yh-dest-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px;
          position: relative;
          z-index: 2;
        }

        .yh-dest-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 900px) { .yh-dest-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .yh-dest-grid { grid-template-columns: 1fr; } }

        .yh-dest-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s;
        }

        .yh-dest-card:hover {
          background: #f0f6ff;
          border-color: rgba(0,102,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,102,255,0.09);
        }

        .yh-dest-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .yh-dest-flag-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f4f8;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
        }

        .yh-dest-flag-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .yh-flag-emoji {
          font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif !important;
          font-style: normal;
          line-height: 1;
          font-size: 26px;
        }

        .yh-dest-info {
          min-width: 0;
        }

        .yh-dest-name {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #0a2540;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .yh-dest-price-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 3px;
        }

        .yh-dest-price-from {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
          letter-spacing: 0.3px;
        }

        .yh-dest-price-val {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #0066ff;
        }

        .yh-dest-price-unit {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
          font-weight: 400;
        }

        .yh-dest-right {
          flex-shrink: 0;
        }

        .yh-arrow {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #eef3fb;
          border: 1px solid #d4dfee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b7dd8;
          font-size: 13px;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          flex-shrink: 0;
        }

        .yh-dest-card:hover .yh-arrow {
          background: #0066ff;
          border-color: #0066ff;
          color: #ffffff;
        }

        .yh-empty {
          color: #8a9ab5;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          padding: 32px 0;
          grid-column: 1 / -1;
        }
      `}</style>

      <div className="yh-dest-wrap">
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
            marginBottom: 10,
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
          Popular destinations
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            color: "#0a2540",
            marginBottom: 28,
          }}
        >
          Where are you headed?
        </div>

        {/* Grid */}
        {loading ? (
          <div className="yh-empty">loading destinations…</div>
        ) : destinations.length === 0 ? (
          <div className="yh-empty">no destinations available.</div>
        ) : (
          <div className="yh-dest-grid">
            {destinations.map((d) => {
              const src = imgSrc(d.image);
              return (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="yh-dest-card"
                >
                  <div className="yh-dest-left">
                    <div className="yh-dest-flag-wrap">
                      {src ? (
                        <img src={src} alt={d.name} />
                      ) : (
                        <span className="yh-flag-emoji">{d.flag}</span>
                      )}
                    </div>
                    <div className="yh-dest-info">
                      <div className="yh-dest-name">{d.name}</div>
                      {d.retail_price != null && (
                        <div className="yh-dest-price-row">
                          <span className="yh-dest-price-from">from</span>
                          <span className="yh-dest-price-val">
                            ₱{d.retail_price.toFixed(2)}
                          </span>
                          <span className="yh-dest-price-unit">PHP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="yh-dest-right">
                    <div className="yh-arrow" aria-hidden="true">
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
