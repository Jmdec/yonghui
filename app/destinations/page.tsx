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

const COUNTRY_REGION: Record<string, string> = {
  japan: "Asia",
  "south korea": "Asia",
  korea: "Asia",
  taiwan: "Asia",
  "hong kong": "Asia",
  hongkong: "Asia",
  "hong-kong": "Asia",
  china: "Asia",
  "mainland china": "Asia",
  macau: "Asia",
  singapore: "Asia",
  thailand: "Asia",
  vietnam: "Asia",
  malaysia: "Asia",
  indonesia: "Asia",
  philippines: "Asia",
  cambodia: "Asia",
  myanmar: "Asia",
  brunei: "Asia",
  "timor-leste": "Asia",
  "east timor": "Asia",
  laos: "Asia",
  nepal: "Asia",
  india: "Asia",
  "sri lanka": "Asia",
  bangladesh: "Asia",
  "south east asia": "Asia",
  "southeast asia": "Asia",
  "south-east asia": "Asia",
  "se asia": "Asia",
  "united arab emirates": "Middle East",
  uae: "Middle East",
  dubai: "Middle East",
  turkey: "Middle East",
  israel: "Middle East",
  jordan: "Middle East",
  egypt: "Middle East",
  "saudi arabia": "Middle East",
  qatar: "Middle East",
  kuwait: "Middle East",
  bahrain: "Middle East",
  oman: "Middle East",
  france: "Europe",
  germany: "Europe",
  italy: "Europe",
  spain: "Europe",
  portugal: "Europe",
  netherlands: "Europe",
  switzerland: "Europe",
  austria: "Europe",
  greece: "Europe",
  poland: "Europe",
  sweden: "Europe",
  norway: "Europe",
  denmark: "Europe",
  finland: "Europe",
  "united kingdom": "Europe",
  uk: "Europe",
  ireland: "Europe",
  belgium: "Europe",
  czechia: "Europe",
  hungary: "Europe",
  romania: "Europe",
  croatia: "Europe",
  serbia: "Europe",
  russia: "Europe",
  usa: "North America",
  "united states": "North America",
  canada: "North America",
  mexico: "North America",
  brazil: "South America",
  argentina: "South America",
  colombia: "South America",
  chile: "South America",
  peru: "South America",
  ecuador: "South America",
  venezuela: "South America",
  bolivia: "South America",
  australia: "Oceania",
  "new zealand": "Oceania",
  fiji: "Oceania",
};

function getRegion(name: string): string {
  const key = name.toLowerCase().trim();
  if (COUNTRY_REGION[key]) return COUNTRY_REGION[key];
  for (const [k, v] of Object.entries(COUNTRY_REGION)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return "Other";
}

interface RegionConfig {
  color: string;
  bg: string;
  dots: [number, number][];
}

const REGION_CONFIG: Record<string, RegionConfig> = {
  Asia: {
    color: "#1D9E75",
    bg: "#E1F5EE",
    dots: [
      [25, 2],
      [26, 2],
      [27, 2],
      [28, 2],
      [29, 2],
      [25, 3],
      [26, 3],
      [27, 3],
      [28, 3],
      [29, 3],
      [30, 3],
      [26, 4],
      [27, 4],
      [28, 4],
      [29, 4],
      [30, 4],
      [27, 5],
      [28, 5],
      [29, 5],
      [30, 5],
      [27, 6],
      [28, 6],
      [29, 6],
      [26, 6],
      [26, 7],
      [27, 7],
      [26, 8],
      [29, 7],
      [30, 7],
      [29, 8],
      [30, 8],
      [31, 4],
      [32, 4],
      [31, 5],
      [32, 5],
    ],
  },
  Europe: {
    color: "#378ADD",
    bg: "#E6F1FB",
    dots: [
      [16, 3],
      [16, 4],
      [17, 2],
      [18, 2],
      [19, 2],
      [17, 3],
      [18, 3],
      [19, 3],
      [20, 3],
      [17, 4],
      [18, 4],
      [19, 4],
      [20, 4],
      [18, 5],
      [19, 5],
      [20, 5],
      [21, 5],
      [22, 5],
      [19, 1],
      [20, 1],
      [20, 2],
      [21, 2],
      [21, 3],
    ],
  },
  "Middle East": {
    color: "#D85A30",
    bg: "#FAECE7",
    dots: [
      [21, 5],
      [22, 5],
      [23, 5],
      [21, 6],
      [22, 6],
      [23, 6],
      [22, 7],
      [23, 7],
    ],
  },
  "North America": {
    color: "#7F77DD",
    bg: "#EEEDFE",
    dots: [
      [4, 3],
      [5, 3],
      [6, 3],
      [7, 3],
      [8, 3],
      [4, 4],
      [5, 4],
      [6, 4],
      [7, 4],
      [8, 4],
      [5, 5],
      [6, 5],
      [7, 5],
      [6, 6],
      [7, 6],
      [6, 7],
      [7, 7],
    ],
  },
  "South America": {
    color: "#D4537E",
    bg: "#FBEAF0",
    dots: [
      [7, 8],
      [8, 8],
      [7, 9],
      [8, 9],
      [9, 9],
      [7, 10],
      [8, 10],
      [7, 11],
      [8, 11],
      [7, 12],
      [8, 12],
      [7, 13],
      [8, 14],
    ],
  },
  Oceania: {
    color: "#BA7517",
    bg: "#FAEEDA",
    dots: [
      [29, 11],
      [30, 11],
      [31, 11],
      [29, 12],
      [30, 12],
      [31, 12],
      [30, 13],
      [33, 12],
      [33, 13],
    ],
  },
  Other: { color: "#888780", bg: "#F1EFE8", dots: [] },
};

const LAND_KEYS = new Set([
  "4,3",
  "5,3",
  "6,3",
  "7,3",
  "8,3",
  "4,4",
  "5,4",
  "6,4",
  "7,4",
  "8,4",
  "5,5",
  "6,5",
  "7,5",
  "6,6",
  "7,6",
  "6,7",
  "7,7",
  "7,8",
  "8,8",
  "7,9",
  "8,9",
  "9,9",
  "7,10",
  "8,10",
  "7,11",
  "8,11",
  "7,12",
  "8,12",
  "7,13",
  "8,14",
  "8,1",
  "9,1",
  "9,2",
  "16,3",
  "16,4",
  "17,2",
  "18,2",
  "19,2",
  "17,3",
  "18,3",
  "19,3",
  "20,3",
  "17,4",
  "18,4",
  "19,4",
  "20,4",
  "18,5",
  "19,5",
  "20,5",
  "21,5",
  "22,5",
  "19,1",
  "20,1",
  "20,2",
  "21,2",
  "21,3",
  "17,6",
  "18,6",
  "17,7",
  "18,7",
  "19,7",
  "17,8",
  "18,8",
  "19,8",
  "20,8",
  "17,9",
  "18,9",
  "19,9",
  "18,10",
  "19,10",
  "17,11",
  "18,11",
  "21,5",
  "22,5",
  "23,5",
  "21,6",
  "22,6",
  "23,6",
  "22,7",
  "23,7",
  "22,2",
  "23,2",
  "24,2",
  "25,2",
  "26,2",
  "27,2",
  "28,2",
  "29,2",
  "30,2",
  "31,2",
  "22,3",
  "23,3",
  "24,3",
  "25,3",
  "26,3",
  "27,3",
  "28,3",
  "29,3",
  "30,3",
  "23,4",
  "24,4",
  "25,4",
  "26,4",
  "27,4",
  "28,4",
  "29,4",
  "30,4",
  "24,5",
  "25,5",
  "26,5",
  "27,5",
  "28,5",
  "29,5",
  "30,5",
  "25,6",
  "26,6",
  "27,6",
  "28,6",
  "29,6",
  "30,6",
  "26,7",
  "27,7",
  "26,8",
  "29,7",
  "30,7",
  "29,8",
  "30,8",
  "31,4",
  "32,4",
  "31,5",
  "32,5",
  "30,9",
  "31,9",
  "32,9",
  "33,9",
  "30,10",
  "29,11",
  "30,11",
  "31,11",
  "29,12",
  "30,12",
  "31,12",
  "30,13",
  "33,12",
  "33,13",
]);

const COLS = 36,
  ROWS = 18,
  R = 4,
  GAP = 4;
const MAP_W = COLS * (R * 2 + GAP);
const MAP_H = ROWS * (R * 2 + GAP);

function MiniDotMap({ regionKey }: { regionKey: string }) {
  const cfg = REGION_CONFIG[regionKey] ?? REGION_CONFIG["Other"];
  const hlSet = new Set(cfg.dots.map(([c, r]) => `${c},${r}`));
  const dots: React.ReactNode[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (!LAND_KEYS.has(`${col},${row}`)) continue;
      const cx = col * (R * 2 + GAP) + R + GAP / 2;
      const cy = row * (R * 2 + GAP) + R + GAP / 2;
      const isHl = hlSet.has(`${col},${row}`);
      dots.push(
        <circle
          key={`${col}-${row}`}
          cx={cx}
          cy={cy}
          r={R}
          fill={isHl ? cfg.color : "#D3D1C7"}
          opacity={isHl ? 1 : 0.5}
        />,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "110px", display: "block" }}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}

interface RegionGroup {
  name: string;
  countries: Destination[];
  planCount: number;
}

function RegionCard({
  group,
  onSelect,
}: {
  group: RegionGroup;
  onSelect: (region: string) => void;
}) {
  const cfg = REGION_CONFIG[group.name] ?? REGION_CONFIG["Other"];
  return (
    <button
      className="yh-region-card"
      onClick={() => onSelect(group.name)}
      style={
        {
          "--region-color": cfg.color,
          "--region-bg": cfg.bg,
        } as React.CSSProperties
      }
    >
      <div className="yh-rc-top">
        <div className="yh-rc-left">
          <span className="yh-rc-dot" />
          <span className="yh-rc-name">{group.name}</span>
        </div>
        <i className="ti ti-arrow-right yh-rc-arrow" aria-hidden="true" />
      </div>
      <div className="yh-rc-plans">
        {group.planCount} plan{group.planCount !== 1 ? "s" : ""}
      </div>
      <MiniDotMap regionKey={group.name} />
      <div className="yh-rc-footer">
        {group.countries.length} countr
        {group.countries.length !== 1 ? "ies" : "y"}
      </div>
    </button>
  );
}

type TabType = "popular" | "regional" | "global";

function Tabs({
  active,
  onChange,
}: {
  active: TabType;
  onChange: (t: TabType) => void;
}) {
  return (
    <div className="yh-tabs-wrap">
      <div className="yh-tabs">
        {(["popular", "regional", "global"] as TabType[]).map((t) => (
          <button
            key={t}
            className={`yh-tab${active === t ? " active" : ""}`}
            onClick={() => onChange(t)}
          >
            {t === "popular"
              ? "Popular eSIMs"
              : t === "regional"
                ? "Regional eSIMs"
                : "Global eSIMs"}
          </button>
        ))}
      </div>
    </div>
  );
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  "5g": { bg: "#0066ff", color: "#fff" },
  "5G": { bg: "#0066ff", color: "#fff" },
  popular: { bg: "#1d9e75", color: "#fff" },
  "Most popular": { bg: "#1d9e75", color: "#fff" },
  new: { bg: "#bc6a08", color: "#fff" },
  New: { bg: "#bc6a08", color: "#fff" },
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
              color: BADGE_STYLES[dest.tags[0]]?.color ?? "#fff",
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
  const [activeTab, setActiveTab] = useState<TabType>("popular");

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestinations(d.data ?? d ?? []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-switch to Popular when typing (search only applies there & regional) ──
  function handleSearch(value: string) {
    setSearch(value);
    if (value.trim() && activeTab === "global") {
      setActiveTab("popular");
    }
  }

  // ── Region groups respect search filter ───────────────────────────────────
  const regionGroups = useMemo<RegionGroup[]>(() => {
    const sourceList = search.trim()
      ? destinations.filter((d) =>
          d.name.toLowerCase().includes(search.toLowerCase()),
        )
      : destinations;
    const map = new Map<string, Destination[]>();
    sourceList.forEach((d) => {
      const reg = d.region ?? getRegion(d.name);
      if (!map.has(reg)) map.set(reg, []);
      map.get(reg)!.push(d);
    });
    const order = [
      "Asia",
      "Europe",
      "Middle East",
      "North America",
      "South America",
      "Oceania",
    ];
    if (map.has("Other")) {
      map.set("Asia", [...(map.get("Asia") ?? []), ...map.get("Other")!]);
      map.delete("Other");
    }
    return order
      .filter((r) => map.has(r))
      .map((r) => ({
        name: r,
        countries: map.get(r)!,
        planCount: map.get(r)!.reduce((sum, d) => sum + (d.plan_count ?? 0), 0),
      }));
  }, [destinations, search]);

  const regions = useMemo(() => {
    const set = new Set(destinations.map((d) => d.region ?? getRegion(d.name)));
    return ["All", ...Array.from(set)];
  }, [destinations]);

  const featured = useMemo(() => {
    const flagged = destinations.filter((d) => d.featured);
    return (flagged.length > 0 ? flagged : destinations).slice(0, 5);
  }, [destinations]);

  const filtered = useMemo(() => {
    let list = destinations.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (activeRegion !== "All")
      list = list.filter(
        (d) => (d.region ?? getRegion(d.name)) === activeRegion,
      );
    if (sortBy === "price-asc")
      list = [...list].sort(
        (a, b) => (a.retail_price ?? 0) - (b.retail_price ?? 0),
      );
    else if (sortBy === "price-desc")
      list = [...list].sort(
        (a, b) => (b.retail_price ?? 0) - (a.retail_price ?? 0),
      );
    else if (sortBy === "name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [destinations, search, activeRegion, sortBy]);

  function handleRegionCardClick(region: string) {
    setActiveTab("popular");
    setActiveRegion(region);
    setTimeout(() => {
      document
        .getElementById("yh-dest-grid-anchor")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  // Search is hidden on Global tab (no searchable content there)
  const showSearch = activeTab !== "global";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&family=Noto+Color+Emoji&display=swap');
        @keyframes cardIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

        .yh-page { min-height:100vh; background:#f5f5f0; font-family:'Sora',sans-serif; display:flex; flex-direction:column; }

        /* ── Hero (centered) ── */
        .yh-hero { background:#fff; border-bottom:1px solid #e2e8f0; padding:52px 32px 44px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; text-align:center; }
        .yh-eyebrow { display:inline-flex; align-items:center; gap:6px; font-family:'IBM Plex Mono',monospace; font-size:9px; color:#1d6fd8; letter-spacing:2.5px; text-transform:uppercase; margin-bottom:10px; }
        .yh-eyebrow-line { display:inline-block; width:14px; height:1px; background:#1d6fd8; }
        .yh-hero-title { font-family:'Sora',sans-serif; font-size:clamp(28px,4vw,48px); font-weight:700; color:#0a2540; line-height:1.1; margin:0; }
        .yh-hero-sub { font-family:'Sora',sans-serif; font-size:14px; color:#6b7280; margin:0; max-width:420px; line-height:1.6; }

        /* Search — hidden (not removed) on Global tab so layout stays stable */
        .yh-search-wrap { position:relative; width:100%; max-width:400px; }
        .yh-search-wrap.yh-search-hidden { visibility:hidden; pointer-events:none; }
        .yh-search-input { width:100%; box-sizing:border-box; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 16px 12px 42px; font-family:'Sora',sans-serif; font-size:14px; color:#0a2540; outline:none; transition:border-color .2s,box-shadow .2s; }
        .yh-search-input::placeholder { color:#b0bccf; }
        .yh-search-input:focus { border-color:#0066ff; box-shadow:0 0 0 3px rgba(0,102,255,.08); background:#fff; }
        .yh-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; color:#8a9ab5; pointer-events:none; }

        /* Search hint shown in Regional tab when a query is active */
        .yh-search-hint { display:inline-flex; align-items:center; gap:6px; background:#fff8e6; border:1px solid #f5d87a; border-radius:8px; padding:6px 12px; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#92650a; margin-bottom:12px; }

        /* Stats */
        .yh-stats { background:#fff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; overflow-x:auto; }
        .yh-stat { display:flex; align-items:center; gap:6px; padding:10px 24px; border-right:1px solid #e2e8f0; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8a9ab5; white-space:nowrap; flex-shrink:0; }
        .yh-stat:last-child { border-right:none; }
        .yh-stat b { font-family:'Sora',sans-serif; font-size:13px; font-weight:700; color:#0a2540; }
        .yh-stat-dot { width:6px; height:6px; border-radius:50%; background:#0066ff; flex-shrink:0; }

        /* ── Tabs ── */
        .yh-tabs-wrap { background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 32px; display:flex; justify-content:center; }
        .yh-tabs { display:inline-flex; gap:2px; background:#efefef; border-radius:12px; padding:5px; border:1px solid #e2e8f0; }
        .yh-tab { font-family:"Sora",sans-serif; font-size:13px; font-weight:500; padding:9px 22px; border-radius:8px; border:none; cursor:pointer; background:transparent; color:#6b7280; transition:background .18s,color .18s,box-shadow .18s; white-space:nowrap; }
        .yh-tab.active { background:#6c47ff; color:#fff; box-shadow:0 2px 8px rgba(108,71,255,.25); }
        .yh-tab:hover:not(.active) { background:#e5e7eb; color:#0a2540; }

        /* ── Region cards ── */
        .yh-region-section { padding:24px 32px; background:#f5f5f0; }
        .yh-region-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        @media(max-width:900px) { .yh-region-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:540px) { .yh-region-grid { grid-template-columns:1fr; } }
        .yh-region-card { display:flex; flex-direction:column; background:#fff; border:0.5px solid #e2e8f0; border-radius:14px; padding:16px; cursor:pointer; text-align:left; transition:border-color .15s,box-shadow .15s; position:relative; overflow:hidden; }
        .yh-region-card:hover { border-color:rgba(0,102,255,.3); box-shadow:0 4px 16px rgba(0,102,255,.08); }
        .yh-rc-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:3px; }
        .yh-rc-left { display:flex; align-items:center; gap:8px; }
        .yh-rc-dot { width:10px; height:10px; border-radius:50%; background:var(--region-color); flex-shrink:0; }
        .yh-rc-name { font-family:'Sora',sans-serif; font-size:15px; font-weight:600; color:#0a2540; }
        .yh-rc-arrow { font-size:14px; color:#8a9ab5; }
        .yh-rc-plans { font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8a9ab5; margin-bottom:10px; }
        .yh-rc-footer { font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8a9ab5; margin-top:6px; letter-spacing:.3px; }

        /* Toolbar */
        .yh-toolbar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:16px 32px 0; }
        .yh-chip { font-family:'Sora',sans-serif; font-size:12px; font-weight:500; padding:6px 14px; border-radius:999px; border:1px solid #e2e8f0; background:#fff; color:#0a2540; cursor:pointer; transition:background .15s,border-color .15s,color .15s; }
        .yh-chip:hover { border-color:rgba(0,102,255,.3); }
        .yh-chip.active { background:#0066ff; border-color:#0066ff; color:#fff; }
        .yh-sort-wrap { margin-left:auto; display:flex; align-items:center; gap:6px; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8a9ab5; }
        .yh-sort-select { font-family:'Sora',sans-serif; font-size:12px; font-weight:500; color:#0a2540; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 10px; cursor:pointer; outline:none; }
        .yh-sort-select:focus { border-color:#0066ff; }

        /* Trending */
        .yh-trend-section { padding:14px 32px 0; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .yh-trend-label { display:flex; align-items:center; gap:5px; font-family:'IBM Plex Mono',monospace; font-size:9px; color:#8a9ab5; letter-spacing:1.5px; text-transform:uppercase; flex-shrink:0; }
        .yh-trend-row { display:flex; align-items:center; gap:8px; overflow-x:auto; }
        .yh-trend-pill { display:flex; align-items:center; gap:6px; text-decoration:none; background:#fff; border:1px solid #e2e8f0; border-radius:999px; padding:5px 12px 5px 5px; flex-shrink:0; transition:border-color .15s,background .15s; }
        .yh-trend-pill:hover { border-color:rgba(0,102,255,.3); background:#f0f6ff; }
        .yh-trend-icon { width:22px; height:22px; border-radius:50%; overflow:hidden; flex-shrink:0; background:#f0f4f8; display:flex; align-items:center; justify-content:center; }
        .yh-trend-icon img { width:100%; height:100%; object-fit:cover; }
        .yh-flag-emoji-sm { font-size:13px; }
        .yh-trend-name { font-family:'Sora',sans-serif; font-size:12px; font-weight:600; color:#0a2540; white-space:nowrap; }
        .yh-trend-pill .ti-flame { font-size:13px; color:#f0997b; }

        /* Grid */
        .yh-grid-section { width:100%; padding:24px 32px 48px; box-sizing:border-box; flex:1; }
        .yh-dest-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
        @media(max-width:1280px) { .yh-dest-grid { grid-template-columns:repeat(4,1fr); } }
        @media(max-width:960px)  { .yh-dest-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:640px)  { .yh-dest-grid { grid-template-columns:repeat(2,1fr); } }

        /* Dest card */
        .yh-dest-card { display:block; text-decoration:none; background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; animation:cardIn .4s ease both; transition:border-color .18s,box-shadow .18s,transform .18s; }
        .yh-dest-card:hover { border-color:rgba(0,102,255,.3); box-shadow:0 6px 20px rgba(0,102,255,.09); transform:translateY(-3px); }
        .yh-card-img-wrap { width:100%; aspect-ratio:16/10; overflow:hidden; background:#f0f4f8; flex-shrink:0; position:relative; }
        .yh-card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s ease; }
        .yh-dest-card:hover .yh-card-img { transform:scale(1.05); }
        .yh-card-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
        .yh-flag-emoji { font-family:'Noto Color Emoji','Apple Color Emoji',sans-serif!important; font-size:32px; line-height:1; }
        .yh-card-badge { position:absolute; top:8px; left:8px; font-family:'Sora',sans-serif; font-size:10px; font-weight:600; padding:3px 9px; border-radius:6px; text-transform:capitalize; }
        .yh-card-body { padding:11px 14px; display:flex; align-items:center; justify-content:space-between; gap:8px; border-top:1px solid #e2e8f0; background:#fff; }
        .yh-card-left { display:flex; align-items:center; gap:7px; min-width:0; }
        .yh-card-num { font-family:'IBM Plex Mono',monospace; font-size:9px; color:#b0bccf; flex-shrink:0; }
        .yh-card-name { font-family:'Sora',sans-serif; font-size:12px; font-weight:600; color:#0a2540; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .yh-card-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        .yh-card-price { font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:600; color:#0052cc; white-space:nowrap; background:#eef3fb; padding:2px 6px; border-radius:6px; }
        .yh-card-arrow { width:22px; height:22px; border-radius:50%; background:#eef3fb; border:1px solid #d4dfee; display:flex; align-items:center; justify-content:center; color:#3b7dd8; font-size:11px; transition:background .18s,border-color .18s,color .18s; flex-shrink:0; }
        .yh-dest-card:hover .yh-card-arrow { background:#0066ff; border-color:#0066ff; color:#fff; }
        .yh-card-plans { font-family:'IBM Plex Mono',monospace; font-size:9px; color:#8a9ab5; white-space:nowrap; flex-shrink:0; }

        /* Skeleton */
        .yh-skel { background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; }
        .yh-skel-img { aspect-ratio:16/10; background-image:linear-gradient(90deg,#f0f4f8 25%,#e8eef6 50%,#f0f4f8 75%); background-size:200% 100%; animation:shimmer 1.4s ease-in-out infinite; }
        .yh-skel-body { height:44px; background-image:linear-gradient(90deg,#f8fafc 25%,#f0f4f8 50%,#f8fafc 75%); background-size:200% 100%; animation:shimmer 1.4s ease-in-out infinite .2s; }

        /* Empty / section label */
        .yh-empty { grid-column:1/-1; padding:48px; text-align:center; font-family:'IBM Plex Mono',monospace; font-size:11px; color:#b0bccf; letter-spacing:1px; }
        .yh-section-label { display:flex; align-items:center; gap:6px; font-family:'IBM Plex Mono',monospace; font-size:9px; color:#1d6fd8; letter-spacing:2.5px; text-transform:uppercase; margin-bottom:12px; }

        /* Global coming soon */
        .yh-global-wrap { padding:32px; display:flex; flex-direction:column; align-items:center; gap:32px; }
        .yh-global-hero { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:48px 40px; text-align:center; width:100%; max-width:560px; box-sizing:border-box; }
        .yh-global-icon { width:56px; height:56px; border-radius:16px; background:#f0f4ff; border:1px solid #d4e0ff; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:26px; }
        .yh-global-hero h3 { font-family:'Sora',sans-serif; font-size:22px; font-weight:700; color:#0a2540; margin:0 0 10px; }
        .yh-global-hero p { font-family:'Sora',sans-serif; font-size:14px; color:#6b7280; margin:0 0 24px; line-height:1.6; }
        .yh-global-badge { display:inline-flex; align-items:center; gap:6px; background:#f0f4ff; border:1px solid #d4e0ff; border-radius:999px; padding:6px 14px; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#3b5bdb; letter-spacing:1px; text-transform:uppercase; }
        .yh-global-badge-dot { width:6px; height:6px; border-radius:50%; background:#3b5bdb; }
        .yh-global-perks { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; width:100%; }
        @media(max-width:640px) { .yh-global-perks { grid-template-columns:1fr; } .yh-global-wrap { padding:16px; } }
        .yh-global-perk { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px 16px; text-align:center; }
        .yh-global-perk-icon { font-size:22px; margin-bottom:10px; }
        .yh-global-perk h4 { font-family:'Sora',sans-serif; font-size:13px; font-weight:600; color:#0a2540; margin:0 0 4px; }
        .yh-global-perk p { font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8a9ab5; margin:0; line-height:1.5; }

        /* Mobile */
        @media(max-width:640px) {
          .yh-hero { padding:36px 16px 32px; }
          .yh-tabs-wrap { padding:12px 16px; }
          .yh-tab { padding:8px 16px; font-size:12px; }
          .yh-region-section { padding:16px; }
          .yh-toolbar { padding:12px 16px 0; }
          .yh-trend-section { padding:12px 16px 0; }
          .yh-grid-section { padding:16px 16px 32px; }
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
            <p className="yh-hero-sub">
              Instant eSIMs for {loading ? "—" : destinations.length}+ countries
              — activate before you land.
            </p>
          </div>
          {/* Hidden (not removed) on Global tab so layout height stays stable */}
          <div
            className={`yh-search-wrap${!showSearch ? " yh-search-hidden" : ""}`}
          >
            <span className="yh-search-icon">⌕</span>
            <input
              className="yh-search-input"
              type="text"
              placeholder={
                activeTab === "regional"
                  ? "Search region or country..."
                  : "Search destination..."
              }
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="yh-stats">
          <div className="yh-stat">
            <div className="yh-stat-dot" />
            <b>{loading ? "—" : destinations.length}</b> destinations
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

        {/* Tabs */}
        <Tabs active={activeTab} onChange={setActiveTab} />

        {/* ── Regional tab ── */}
        {activeTab === "regional" && (
          <div className="yh-region-section">
            {search.trim() && (
              <div>
                <span className="yh-search-hint">
                  🔍 Showing regions matching &ldquo;{search}&rdquo; — click a
                  region to see all results
                </span>
              </div>
            )}
            {loading ? (
              <div className="yh-region-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="yh-skel" style={{ height: 160 }} />
                ))}
              </div>
            ) : regionGroups.length === 0 ? (
              <div className="yh-empty">
                No regions match &ldquo;{search}&rdquo;
              </div>
            ) : (
              <div className="yh-region-grid">
                {regionGroups.map((g) => (
                  <RegionCard
                    key={g.name}
                    group={g}
                    onSelect={handleRegionCardClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Global tab ── */}
        {activeTab === "global" && (
          <div className="yh-global-wrap">
            <div className="yh-global-hero">
              <div className="yh-global-icon">🌍</div>
              <h3>Global eSIMs coming soon</h3>
              <p>
                We&apos;re building multi-country plans so you can travel across
                regions with a single eSIM. No swapping, no extra purchases.
              </p>
              <div className="yh-global-badge">
                <span className="yh-global-badge-dot" />
                In development
              </div>
            </div>
            <div className="yh-global-perks">
              <div className="yh-global-perk">
                <div className="yh-global-perk-icon">🗺️</div>
                <h4>Multi-country coverage</h4>
                <p>One plan, multiple countries across Asia, Europe & beyond</p>
              </div>
              <div className="yh-global-perk">
                <div className="yh-global-perk-icon">⚡</div>
                <h4>Instant switch</h4>
                <p>
                  Auto-connects to the best local network as you cross borders
                </p>
              </div>
              <div className="yh-global-perk">
                <div className="yh-global-perk-icon">💸</div>
                <h4>Better value</h4>
                <p>
                  Bundled regional pricing — cheaper than buying per country
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Popular tab ── */}
        {activeTab === "popular" && (
          <>
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

            <div className="yh-grid-section" id="yh-dest-grid-anchor">
              {!loading && filtered.length > 0 && (
                <div className="yh-section-label">
                  <span className="yh-eyebrow-line" />
                  {search.trim()
                    ? `Results for "${search}"`
                    : "All destinations"}
                </div>
              )}
              <div className="yh-dest-grid">
                {loading ? (
                  [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
                ) : filtered.length === 0 ? (
                  <div className="yh-empty">
                    No destinations found for &ldquo;{search}&rdquo;
                  </div>
                ) : (
                  filtered.map((dest, i) => (
                    <DestCard key={dest.id} dest={dest} index={i} />
                  ))
                )}
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>
    </>
  );
}
