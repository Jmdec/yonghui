"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const API_IMG = process.env.NEXT_PUBLIC_API_IMG ?? "";

interface Destination {
  id: number;
  name: string;
  slug: string;
  flag: string;
  retail_price?: number | null;
  price?: string | null;
  image?: string | null;
}

function formatPrice(d: Destination): string {
  if (d.retail_price != null)
    return `From ${Number(d.retail_price).toFixed(2)} USD`;
  if (d.price) return `From ${d.price}`;
  return "From 2.99 USD";
}

function imgSrc(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_IMG}/${path}`;
}

const POPULAR_TAGS = [
  { flag: "🇯🇵", label: "Japan", slug: "japan" },
  { flag: "🇦🇪", label: "UAE", slug: "united-arab-emirates" },
  { flag: "🇬🇧", label: "UK", slug: "uk" },
  { flag: "🇸🇬", label: "Singapore", slug: "singapore" },
  { flag: "🇺🇸", label: "USA", slug: "usa" },
  { flag: "🇫🇷", label: "France", slug: "france" },
  { flag: "🇩🇪", label: "Germany", slug: "germany" },
  { flag: "🇹🇭", label: "Thailand", slug: "thailand" },
];

export default function HeroSection() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalCountries, setTotalCountries] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => {
        const data: Destination[] = d.data ?? [];
        setDestinations(data);
        setTotalCountries(data.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = destinations
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 6);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [query, destinations]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    const match = destinations.find((d) =>
      d.name.toLowerCase().includes(query.toLowerCase()),
    );
    if (match) router.push(`/destinations/${match.slug}`);
    else router.push(`/destinations?search=${encodeURIComponent(query)}`);
  };

  const stats = [
    { n: totalCountries || "190", em: "+", l: "Countries" },
    { n: "95", em: "K", l: "Reviews" },
    { n: "4G", em: "/5G", l: "Network" },
    { n: "24", em: "/7", l: "Support" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .yh-hero {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .yh-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(8,14,36,0.58) 0%, rgba(8,14,36,0.28) 40%, rgba(8,14,36,0.75) 100%),
            url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1800&q=80&fit=crop') center/cover no-repeat;
        }
        .yh-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%);
          pointer-events: none;
        }
        .yh-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 860px;
          padding: 0 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .yh-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.22);
          backdrop-filter: blur(12px);
          border-radius: 999px;
          padding: 7px 20px;
          margin-bottom: 28px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }
        .yh-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4da6ff;
          flex-shrink: 0;
          box-shadow: 0 0 6px #4da6ff;
        }
        .yh-h1 {
          font-size: clamp(3rem, 7.5vw, 5.8rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 20px;
        }
        .yh-h1 em {
          font-style: normal;
          background: linear-gradient(90deg, #4da6ff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .yh-sub {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.68);
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 40px;
          font-weight: 400;
        }

        /* Search */
        .yh-search-outer {
          position: relative;
          width: 100%;
          max-width: 620px;
          margin-bottom: 18px;
        }
        .yh-search-wrap {
          display: flex;
          align-items: center;
          width: 100%;
          background: rgba(255,255,255,0.97);
          border: 1.5px solid rgba(255,255,255,0.5);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.28);
          transition: box-shadow 0.2s;
        }
        .yh-search-wrap:focus-within {
          box-shadow: 0 8px 40px rgba(0,0,0,0.28), 0 0 0 3px rgba(77,166,255,0.4);
        }
        .yh-search-icon {
          padding: 0 16px;
          font-size: 17px;
          color: #9aa3b2;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .yh-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #1a1f2e;
          padding: 16px 0;
        }
        .yh-search-input::placeholder { color: #9aa3b2; }
        .yh-search-btn {
          background: #0057d9;
          border: none;
          color: #fff;
          padding: 16px 28px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          transition: background 0.2s;
          margin: 5px;
          border-radius: 12px;
        }
        .yh-search-btn:hover { background: #0044bb; }

        /* Suggestions */
        .yh-suggestions {
          position: absolute;
          top: calc(100% + 8px);
          left: 0; right: 0;
          background: #0f1f3d;
          border: 1px solid #1a3a5a;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          overflow: hidden;
          z-index: 100;
        }
        .yh-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e8f0ff;
          font-weight: 600;
          border-bottom: 1px solid #1a3a5a;
          transition: background 0.12s;
        }
        .yh-suggestion-item:last-child { border-bottom: none; }
        .yh-suggestion-item:hover { background: rgba(0,102,255,0.15); color: #4da6ff; }
        .yh-suggestion-flag { font-size: 22px; width: 32px; text-align: center; }
        .yh-suggestion-flag-img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
        .yh-suggestion-price { margin-left: auto; font-size: 12px; color: #7f94b8; font-weight: 500; }

        /* Tags */
        .yh-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          align-items: center;
          margin-bottom: 80px;
          max-width: 620px;
          width: 100%;
        }
        .yh-tags-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
        }
        .yh-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.82);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, border-color 0.15s;
        }
        .yh-tag:hover { background: rgba(0,102,255,0.25); border-color: rgba(77,166,255,0.5); color: #fff; }

        /* Stats bar */
        .yh-stats {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10,22,40,0.7);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.10);
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 3;
        }
        .yh-stat-item {
          flex: 1;
          text-align: center;
          padding: 22px 12px;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .yh-stat-item:last-child { border-right: none; }
        .yh-stat-num {
          font-size: 1.8rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .yh-stat-em { color: #4da6ff; }
        .yh-stat-label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          margin-top: 5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        @media (max-width: 640px) {
          .yh-content { padding: 0 24px; }
          .yh-h1 { font-size: 2.6rem; }
          .yh-stat-num { font-size: 1.4rem; }
          .yh-stat-item { padding: 16px 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <section className="yh-hero">
        <div className="yh-bg" />
        <div className="yh-vignette" />

        <div className="yh-content">
          <div className="yh-badge">
            <span className="yh-badge-dot" />
            Global eSIM Network · {totalCountries > 0 ? totalCountries : "190"}+
            Countries
          </div>

          <h1 className="yh-h1">
            Travel the World,
            <br />
            Stay <em>Connected</em>
          </h1>

          <p className="yh-sub">
            Instant eSIM for every traveller. No roaming fees, no SIM swaps —
            just seamless connectivity the moment you land.
          </p>

          <div className="yh-search-outer" ref={searchRef}>
            <div className="yh-search-wrap">
              <div className="yh-search-icon">🔍</div>
              <input
                className="yh-search-input"
                placeholder="Where are you headed?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
              />
              <button className="yh-search-btn" onClick={handleSearch}>
                Find Plans →
              </button>
            </div>

            {showSuggestions && (
              <div className="yh-suggestions">
                {suggestions.map((d) => {
                  const src = imgSrc(d.image);
                  return (
                    <div
                      key={d.slug}
                      className="yh-suggestion-item"
                      onMouseDown={() => {
                        router.push(`/destinations/${d.slug}`);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="yh-suggestion-flag">
                        {src ? (
                          <img
                            src={src}
                            alt={d.name}
                            className="yh-suggestion-flag-img"
                          />
                        ) : (
                          d.flag
                        )}
                      </span>
                      <span>{d.name}</span>
                      <span className="yh-suggestion-price">
                        {formatPrice(d)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="yh-tags">
            <span className="yh-tags-label">Popular:</span>
            {POPULAR_TAGS.map((t) => (
              <button
                key={t.label}
                className="yh-tag"
                onClick={() => router.push(`/destinations/${t.slug}`)}
              >
                {t.flag} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="yh-stats">
          {stats.map((s, i) => (
            <div key={i} className="yh-stat-item">
              <div className="yh-stat-num">
                {s.n}
                <span className="yh-stat-em">{s.em}</span>
              </div>
              <div className="yh-stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
