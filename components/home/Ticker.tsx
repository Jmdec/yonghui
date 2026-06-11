"use client";

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

export default function Ticker() {
  const [items, setItems] = useState<Destination[]>([]);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => {
        const data: Destination[] = d.data ?? [];
        setItems([...data, ...data]);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes tickerscroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e2e6ef",
          borderBottom: "1px solid #e2e6ef",
          overflow: "hidden",
          height: 40,
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Fade edges */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(90deg, #ffffff 40%, transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(270deg, #ffffff 40%, transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "tickerscroll 60s linear infinite",
            alignItems: "center",
          }}
        >
          {items.map((d, i) => {
            const src = imgSrc(d.image);
            return (
              <span
                key={`${d.slug}-${i}`}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 24px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1a1f2e",
                    letterSpacing: "0.01em",
                  }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={d.name}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <span
                      style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}
                    >
                      {d.flag}
                    </span>
                  )}
                  {d.name}
                </span>
                {/* Separator */}
                <span
                  style={{ color: "#d1d8e8", fontSize: 12, userSelect: "none" }}
                >
                  /
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
