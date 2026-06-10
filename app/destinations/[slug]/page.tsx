"use client";

import { useEffect, useState } from "react";
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

function PlanCard({
  plan,
  featured,
  index,
  destinationName,
}: {
  plan: Plan;
  featured?: boolean;
  index: number;
  destinationName: string;
}) {
  const router = useRouter();

  const handleGetPlan = () => {
    sessionStorage.setItem(
      "selected_plan",
      JSON.stringify({
        id: String(plan.id),
        name: plan.name,
        price: plan.retail_price,
        duration: plan.validity_days ? `${plan.validity_days} days` : "—",
        data: plan.data_label,
        features: [
          plan.speed,
          plan.sim_type,
          ...(plan.has_voice ? ["Voice calls included"] : []),
          ...(plan.has_data ? ["Data included"] : []),
          ...(plan.description ? [plan.description] : []),
        ],
        popular: featured ?? false,
        destinationName,
      }),
    );
    router.push("/checkout");
  };

  const specs = [
    plan.data_label,
    plan.validity_days ? `${plan.validity_days} days` : null,
    plan.speed,
    plan.sim_type,
    plan.has_voice ? "Voice" : null,
  ].filter(Boolean) as string[];

  return (
    <div
      className="yh-plan-card"
      style={{
        animationDelay: `${index * 60}ms`,
        border: featured ? "2px solid #0066ff" : "1px solid #e2e8f0",
        background: featured ? "#f0f6ff" : "#ffffff",
      }}
    >
      {featured && <div className="yh-plan-badge">★ Most Popular</div>}

      {/* Plan name */}
      <div className="yh-plan-name">{plan.name}</div>

      {/* Price */}
      <div className="yh-plan-price-block">
        <span className="yh-plan-price">{plan.formatted_price}</span>
        {plan.validity_days && (
          <span className="yh-plan-per">/ {plan.validity_days} days</span>
        )}
      </div>

      {/* Spec chips */}
      <div className="yh-plan-specs">
        {specs.map((s) => (
          <span key={s} className="yh-spec-chip">
            {s}
          </span>
        ))}
      </div>

      {/* Description */}
      {plan.description && <p className="yh-plan-desc">{plan.description}</p>}

      {/* CTA */}
      <button
        onClick={handleGetPlan}
        className={`yh-plan-btn${featured ? " yh-plan-btn-primary" : ""}`}
      >
        Get Plan →
      </button>
    </div>
  );
}

function SkeletonCard() {
  return <div className="yh-skeleton" />;
}

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = (params?.slug ?? params?.id) as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const featuredIndex =
    plans.length >= 3
      ? Math.floor(plans.length / 2)
      : plans.length === 2
        ? 1
        : 0;

  const flagSrc = imgSrc(destination?.image);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&family=Noto+Color+Emoji&display=swap');

        @keyframes fadeslide {
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
          padding: 28px 32px 24px;
        }
        .yh-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .yh-hero-img {
          width: 72px;
          height: 72px;
          border-radius: 16px;
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
          font-size: 38px;
          line-height: 1;
        }
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
          font-size: 30px;
          font-weight: 700;
          color: #0a2540;
          margin: 0 0 12px;
          line-height: 1.1;
        }
        .yh-hero-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
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
        }

        /* ── Main content ── */
        .yh-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 32px 48px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Section header ── */
        .yh-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
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

        /* ── Plans grid ── */
        .yh-plans-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) { .yh-plans-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .yh-plans-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .yh-plans-grid { grid-template-columns: 1fr; } }

        /* ── Plan card ── */
        .yh-plan-card {
          border-radius: 14px;
          padding: 18px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          animation: fadeslide 0.4s ease both;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s;
        }
        .yh-plan-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,102,255,0.09);
          border-color: rgba(0,102,255,0.35) !important;
          background: #f0f6ff !important;
        }

        .yh-plan-badge {
          position: absolute;
          top: -1px;
          right: 14px;
          background: #0066ff;
          color: #ffffff;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 0 0 8px 8px;
          letter-spacing: 0.3px;
        }

        .yh-plan-name {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          color: #6a7f99;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding-top: 4px;
        }

        .yh-plan-price-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .yh-plan-price {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #0a2540;
          line-height: 1;
          letter-spacing: -0.5px;
        }
        .yh-plan-per {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #8a9ab5;
        }

        .yh-plan-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }
        .yh-spec-chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          background: #f0f4f8;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          padding: 3px 7px;
          color: #3b6a9a;
          font-weight: 500;
          white-space: nowrap;
        }

        .yh-plan-desc {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          color: #8a9ab5;
          margin: 0;
          line-height: 1.5;
        }

        .yh-plan-btn {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 10px 0;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: auto;
          background: #f0f4f8;
          color: #1a5ca8;
          border: 1px solid #e2e8f0;
          transition: background 0.15s, border-color 0.15s;
        }
        .yh-plan-btn:hover {
          background: #e0eaff;
          border-color: rgba(0,102,255,0.3);
        }
        .yh-plan-btn-primary {
          background: #0066ff !important;
          color: #ffffff !important;
          border-color: #0066ff !important;
        }
        .yh-plan-btn-primary:hover {
          background: #0052cc !important;
          border-color: #0052cc !important;
        }

        /* ── Skeleton ── */
        .yh-skeleton {
          border-radius: 14px;
          height: 200px;
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
          margin-top: 24px;
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

              <div style={{ flex: 1 }}>
                <div className="yh-hero-eyebrow">
                  <span className="yh-hero-eyebrow-line" />
                  eSIM Plans
                </div>

                {loading ? (
                  <div
                    style={{
                      height: 32,
                      width: 200,
                      background: "#f0f4f8",
                      borderRadius: 8,
                      marginBottom: 12,
                      backgroundImage:
                        "linear-gradient(90deg,#f0f4f8 25%,#e8eef6 50%,#f0f4f8 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.6s ease-in-out infinite",
                    }}
                  />
                ) : (
                  <h1 className="yh-hero-title">{destination?.name}</h1>
                )}

                <div className="yh-hero-pills">
                  {["Instant Activation", "No SIM Swap", "Cancel Anytime"].map(
                    (f) => (
                      <span key={f} className="yh-hero-pill">
                        {f}
                      </span>
                    ),
                  )}
                </div>
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

            {loading && (
              <div className="yh-plans-grid">
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!loading && error && <div className="yh-error">⚠ {error}</div>}

            {!loading && !error && destination && plans.length === 0 && (
              <div className="yh-empty">
                No plans available for this destination yet.
              </div>
            )}

            {!loading && !error && destination && plans.length > 0 && (
              <div className="yh-plans-grid">
                {plans.map((plan, i) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    featured={plans.length > 1 && i === featuredIndex}
                    index={i}
                    destinationName={destination.name}
                  />
                ))}
              </div>
            )}

            {/* Trust strip */}
            {!loading && !error && plans.length > 0 && (
              <div className="yh-trust">
                {[
                  "Secure Checkout",
                  "Instant Delivery",
                  "190+ Countries",
                  "24/7 Support",
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
