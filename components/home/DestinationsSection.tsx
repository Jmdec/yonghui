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

        @media (max-width: 1024px) { .yh-dest-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 640px)  { .yh-dest-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 400px)  { .yh-dest-grid { grid-template-columns: repeat(2, 1fr) !important; } }

        .yh-dest-card {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(14,99,214,0.15);
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: block;
          overflow: hidden;
          backdrop-filter: blur(6px);
        }
        .yh-dest-card:hover {
          border-color: rgba(14,99,214,0.45) !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 24px rgba(14,99,214,0.12) !important;
          background: rgba(255,255,255,0.85) !important;
        }
        .yh-dest-card:hover .yh-dest-name {
          color: #0D6EFD !important;
        }
        .yh-dest-card:hover .yh-dest-img img {
          transform: scale(1.05);
        }
        .yh-flag-emoji {
          font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif !important;
          font-style: normal;
          line-height: 1;
          display: inline-block;
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
        <section style={{ padding: "48px 0" }}>
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
              marginBottom: 24,
            }}
          >
            Where are you headed?
          </div>

          {loading ? (
            <div
              style={{
                color: "#6a90b4",
                fontSize: 12,
                padding: "32px 0",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              loading destinations…
            </div>
          ) : destinations.length === 0 ? (
            <div
              style={{
                color: "#6a90b4",
                fontSize: 12,
                padding: "32px 0",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              no destinations available.
            </div>
          ) : (
            <div
              className="yh-dest-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 12,
              }}
            >
              {destinations.map((d) => {
                const src = imgSrc(d.image);
                return (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="yh-dest-card"
                  >
                    {src ? (
                      <div
                        className="yh-dest-img"
                        style={{
                          width: "100%",
                          aspectRatio: "16/9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={src}
                          alt={d.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "16/9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(219,234,254,0.5)",
                        }}
                      >
                        <span
                          className="yh-flag-emoji"
                          style={{ fontSize: 36 }}
                        >
                          {d.flag}
                        </span>
                      </div>
                    )}
                    <div
                      className="yh-dest-name"
                      style={{
                        padding: "10px 8px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1a5ca8",
                        fontFamily: "'Sora', sans-serif",
                        letterSpacing: "0.3px",
                        transition: "color 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                      }}
                    >
                      <span className="yh-flag-emoji" style={{ fontSize: 14 }}>
                        {d.flag}
                      </span>
                      {d.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
