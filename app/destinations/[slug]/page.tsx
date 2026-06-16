"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
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
}

interface Plan {
  id: number;
  name: string;
  description?: string | null;
  data_gb?: number | null;
  data_label: string;
  validity_days?: number | null;
  speed: string;
  sim_type: string;
  has_voice: boolean;
  has_data: boolean;
  retail_price: number;
  formatted_price: string;
  is_active: boolean;
}

function SkeletonBlock() {
  return <div className="yh-skeleton" />;
}

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = (params?.slug ?? params?.id) as string;
  const router = useRouter();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    fetch(`/api/destinations/${slug}/plans`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        setDestination(d.destination);
        setPlans(d.plans ?? []);
      })
      .catch(() => setError("Could not load plans for this destination."))
      .finally(() => setLoading(false));
  }, [slug]);

  // Sort by validity_days first, then by data_gb so same-duration plans go small → large
  const sortedPlans = useMemo(
    () =>
      [...plans].sort(
        (a, b) =>
          (a.validity_days ?? 0) - (b.validity_days ?? 0) ||
          (a.data_gb ?? 0) - (b.data_gb ?? 0),
      ),
    [plans],
  );

  const featuredId =
    sortedPlans.length >= 3
      ? sortedPlans[Math.floor(sortedPlans.length / 2)]?.id
      : sortedPlans.length === 2
        ? sortedPlans[1]?.id
        : sortedPlans[0]?.id;

  useEffect(() => {
    if (sortedPlans.length > 0 && activeId === null) {
      setActiveId(featuredId ?? sortedPlans[0].id);
    }
  }, [sortedPlans, featuredId, activeId]);

  const activePlan =
    sortedPlans.find((p) => p.id === activeId) ?? sortedPlans[0];

  const handleGetPlan = () => {
    if (!activePlan || !destination) return;
    sessionStorage.setItem(
      "selected_plan",
      JSON.stringify({
        id: String(activePlan.id),
        name: activePlan.name,
        price: activePlan.retail_price,
        duration: activePlan.validity_days
          ? `${activePlan.validity_days} days`
          : "—",
        data: activePlan.data_label,
        features: [
          activePlan.speed,
          activePlan.sim_type,
          ...(activePlan.has_voice ? ["Voice calls included"] : []),
          ...(activePlan.has_data ? ["Data included"] : []),
          ...(activePlan.description ? [activePlan.description] : []),
        ],
        popular: activePlan.id === featuredId,
        destinationName: destination.name,
      }),
    );
    router.push("/checkout");
  };

  const flagSrc = imgSrc(destination?.image);

  const specs = activePlan
    ? ([
        activePlan.speed,
        activePlan.sim_type,
        activePlan.has_voice ? "Voice" : null,
      ].filter(Boolean) as string[])
    : [];

  // Build a tab label that includes GB so duplicate durations are distinguishable
  function tabLabel(p: Plan): string {
    const duration = p.validity_days
      ? `${p.validity_days} day${p.validity_days === 1 ? "" : "s"}`
      : p.name;
    return `${duration} · ${p.data_label}`;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&family=Noto+Color+Emoji&display=swap');

        @keyframes fadeslide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .yh-page {
          min-height: 100vh;
          background: #f5f5f0;
          display: flex;
          flex-direction: column;
          font-family: 'Sora', sans-serif;
        }

        /* ── Breadcrumb ── */
        .yh-breadcrumb {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .yh-breadcrumb-back {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          color: #6a7f99;
          text-decoration: none;
          transition: color 0.15s;
        }
        .yh-breadcrumb-back:hover { color: #0066ff; }
        .yh-breadcrumb-trail {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #b0bccf;
          letter-spacing: 1px;
        }

        /* ── Hero ── */
        .yh-hero {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 32px;
        }
        .yh-hero-inner {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .yh-hero-img {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #f0f4f8;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .yh-hero-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .yh-hero-flag {
          font-family: 'Noto Color Emoji', 'Apple Color Emoji', sans-serif;
          font-size: 32px;
          line-height: 1;
        }
        .yh-hero-text { flex: 1; min-width: 200px; }
        .yh-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #1d6fd8;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .yh-hero-eyebrow-line {
          display: inline-block;
          width: 14px;
          height: 1px;
          background: #1d6fd8;
        }
        .yh-hero-title {
          font-family: 'Sora', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #0a2540;
          margin: 0;
          line-height: 1.1;
        }
        .yh-hero-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .yh-hero-pill {
          padding: 4px 12px;
          border-radius: 20px;
          background: #f0f4f8;
          border: 1px solid #e2e8f0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #3b6a9a;
          font-weight: 500;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* ── Main content ── */
        .yh-main {
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 32px 48px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Section header ── */
        .yh-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .yh-section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          color: #8a9ab5;
          text-transform: uppercase;
        }
        .yh-section-count {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #b0bccf;
        }

        /* ── Duration tabs ── */
        .yh-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .yh-tab {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-family: 'Sora', sans-serif;
          color: #0a2540;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 14px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          min-width: 72px;
          text-align: center;
        }
        .yh-tab:hover {
          border-color: rgba(0,102,255,0.3);
        }
        .yh-tab.active {
          background: #0066ff;
          border-color: #0066ff;
          color: #ffffff;
        }
        .yh-tab-duration {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
        }
        .yh-tab-gb {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.3px;
          opacity: 0.65;
          white-space: nowrap;
        }
        .yh-tab.active .yh-tab-gb {
          opacity: 0.8;
        }
        .yh-tab-star {
          position: absolute;
          top: -7px;
          right: -7px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f0997b;
          color: #4a1b0c;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Plan display ── */
        .yh-plan-display {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          animation: fadeslide 0.3s ease both;
        }
        .yh-plan-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 16px;
        }
        .yh-plan-data-val {
          font-family: 'Sora', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #0a2540;
          line-height: 1.1;
        }
        .yh-plan-data-unit {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .yh-plan-name {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          color: #6a7f99;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .yh-plan-price-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.2;
        }
        .yh-plan-price {
          font-family: 'Sora', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #0066ff;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }
        .yh-plan-per {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
          white-space: nowrap;
        }

        .yh-plan-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .yh-spec-chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          background: #f0f4f8;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 5px 10px;
          color: #3b6a9a;
          font-weight: 500;
          white-space: nowrap;
        }

        .yh-plan-desc {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #6a7f99;
          margin: 0 0 20px;
          line-height: 1.6;
        }

        .yh-plan-btn {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 13px 0;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: #0066ff;
          color: #ffffff;
          transition: background 0.15s;
        }
        .yh-plan-btn:hover {
          background: #0052cc;
        }

        /* ── Skeleton ── */
        .yh-skeleton {
          border-radius: 16px;
          height: 240px;
          background: #f0f4f8;
          background-image: linear-gradient(90deg, #f0f4f8 25%, #e8eef6 50%, #f0f4f8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }

        /* ── Error ── */
        .yh-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 16px 20px;
          color: #991b1b;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
        }

        /* ── Empty ── */
        .yh-empty {
          text-align: center;
          padding: 60px 0;
          color: #8a9ab5;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
        }

        /* ── Trust strip ── */
        .yh-trust {
          margin-top: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 12px;
        }
        .yh-trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #6a7f99;
          letter-spacing: 0.5px;
        }
        .yh-trust-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0066ff;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .yh-plan-top { flex-direction: column; }
          .yh-plan-price-block { align-items: flex-start; }
        }
      `}</style>

      <div className="yh-page">
        <Navigation />

        <main style={{ flex: 1 }}>
          {/* Breadcrumb */}
          <div className="yh-breadcrumb">
            <Link href="/destinations" className="yh-breadcrumb-back">
              ← Destinations
            </Link>
            <span className="yh-breadcrumb-trail">
              DESTINATIONS
              {destination ? ` / ${destination.name.toUpperCase()}` : ""}
            </span>
          </div>

          {/* Hero */}
          <div className="yh-hero">
            <div className="yh-hero-inner">
              <div className="yh-hero-img">
                {loading ? null : flagSrc ? (
                  <img src={flagSrc} alt={destination?.name} />
                ) : (
                  <span className="yh-hero-flag">
                    {destination?.flag ?? "🌐"}
                  </span>
                )}
              </div>

              <div className="yh-hero-text">
                <div className="yh-hero-eyebrow">
                  <span className="yh-hero-eyebrow-line" />
                  eSIM plans
                </div>

                {loading ? (
                  <div
                    style={{
                      height: 28,
                      width: 180,
                      background: "#f0f4f8",
                      borderRadius: 8,
                      backgroundImage:
                        "linear-gradient(90deg,#f0f4f8 25%,#e8eef6 50%,#f0f4f8 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.6s ease-in-out infinite",
                    }}
                  />
                ) : (
                  <h1 className="yh-hero-title">{destination?.name}</h1>
                )}
              </div>

              <div className="yh-hero-pills">
                {["Instant activation", "No SIM swap", "Cancel anytime"].map(
                  (f) => (
                    <span key={f} className="yh-hero-pill">
                      {f}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="yh-main">
            {!loading && !error && destination && (
              <div className="yh-section-header">
                <span className="yh-section-label">Choose your plan</span>
                <span className="yh-section-count">
                  {plans.length} plan{plans.length !== 1 ? "s" : ""} available
                </span>
              </div>
            )}

            {loading && <SkeletonBlock />}

            {!loading && error && <div className="yh-error">⚠ {error}</div>}

            {!loading && !error && destination && plans.length === 0 && (
              <div className="yh-empty">
                No plans available for this destination yet.
              </div>
            )}

            {!loading && !error && destination && sortedPlans.length > 0 && (
              <>
                {/* Duration + GB tabs */}
                <div className="yh-tabs">
                  {sortedPlans.map((p) => (
                    <button
                      key={p.id}
                      className={`yh-tab${p.id === activeId ? " active" : ""}`}
                      onClick={() => setActiveId(p.id)}
                    >
                      <span className="yh-tab-duration">
                        {p.validity_days
                          ? `${p.validity_days} day${p.validity_days === 1 ? "" : "s"}`
                          : p.name}
                      </span>
                      <span className="yh-tab-gb">{p.data_label}</span>
                      {p.id === featuredId && (
                        <span className="yh-tab-star">★</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Active plan display */}
                {activePlan && (
                  <div className="yh-plan-display">
                    <div className="yh-plan-top">
                      <div>
                        <div className="yh-plan-name">{activePlan.name}</div>
                        <div className="yh-plan-data-val">
                          {activePlan.data_label}
                        </div>
                        <div className="yh-plan-data-unit">data</div>
                      </div>
                      <div className="yh-plan-price-block">
                        <span className="yh-plan-price">
                          {activePlan.formatted_price}
                        </span>
                        {activePlan.validity_days && (
                          <span className="yh-plan-per">
                            valid for {activePlan.validity_days} day
                            {activePlan.validity_days === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="yh-plan-specs">
                      {specs.map((s) => (
                        <span key={s} className="yh-spec-chip">
                          {s}
                        </span>
                      ))}
                    </div>

                    {activePlan.description && (
                      <p className="yh-plan-desc">{activePlan.description}</p>
                    )}

                    <button onClick={handleGetPlan} className="yh-plan-btn">
                      Get this plan →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Trust strip */}
            {!loading && !error && plans.length > 0 && (
              <div className="yh-trust">
                {[
                  "Secure checkout",
                  "Instant delivery",
                  "190+ countries",
                  "24/7 support",
                ].map((t) => (
                  <div key={t} className="yh-trust-item">
                    <div className="yh-trust-dot" />
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
