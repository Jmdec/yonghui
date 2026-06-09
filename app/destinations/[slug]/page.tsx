"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

interface Destination {
  id: number;
  name: string;
  slug: string;
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

function EsimBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "12px 20px",
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(14,99,214,0.15)",
        borderRadius: 14,
        marginBottom: 16,
        overflow: "hidden",
        position: "relative",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Signal tower */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="14" y="16" width="4" height="12" rx="1" fill="#0C447C" />
          <rect x="10" y="20" width="2" height="8" rx="1" fill="#1d6fd8" />
          <rect x="20" y="20" width="2" height="8" rx="1" fill="#1d6fd8" />
          <circle cx="16" cy="14" r="2.5" fill="#0C447C" />
          <circle
            cx="16"
            cy="14"
            r="5"
            fill="none"
            stroke="#1d6fd8"
            strokeWidth="1.2"
            className="ring1"
            style={{ transformOrigin: "16px 14px" }}
          />
          <circle
            cx="16"
            cy="14"
            r="5"
            fill="none"
            stroke="#1d6fd8"
            strokeWidth="1.2"
            className="ring2"
            style={{ transformOrigin: "16px 14px" }}
          />
          <circle
            cx="16"
            cy="14"
            r="5"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1"
            className="ring3"
            style={{ transformOrigin: "16px 14px" }}
          />
        </svg>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 8,
            color: "#1d6fd8",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          TOWER
        </span>
      </div>

      {/* Arrow 1 */}
      <div
        style={{
          flex: 1,
          maxWidth: 80,
          position: "relative",
          height: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg
          width="100%"
          height="20"
          viewBox="0 0 80 20"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="10"
            x2="80"
            y2="10"
            stroke="rgba(14,99,214,0.15)"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="10"
            x2="80"
            y2="10"
            stroke="#1d6fd8"
            strokeWidth="1.5"
            strokeDasharray="12 8"
            className="data-flow"
          />
          <polygon points="76,6 80,10 76,14" fill="#0C447C" />
        </svg>
      </div>

      {/* eSIM chip */}
      <div
        className="chip-float"
        style={{ flexShrink: 0, position: "relative", width: 44, height: 36 }}
      >
        <svg width="44" height="36" viewBox="0 0 44 36">
          <rect x="0" y="0" width="44" height="36" rx="6" fill="#0C447C" />
          <rect
            x="4"
            y="4"
            width="36"
            height="28"
            rx="4"
            fill="none"
            stroke="#1d6fd8"
            strokeWidth="1"
          />
          <rect
            x="8"
            y="8"
            width="12"
            height="10"
            rx="2"
            fill="#1d6fd8"
            opacity={0.7}
          />
          <rect
            x="8"
            y="20"
            width="8"
            height="7"
            rx="1"
            fill="#60a5fa"
            opacity={0.5}
          />
          <rect
            x="18"
            y="20"
            width="8"
            height="7"
            rx="1"
            fill="#60a5fa"
            opacity={0.5}
          />
          <rect
            x="28"
            y="20"
            width="8"
            height="7"
            rx="1"
            fill="#60a5fa"
            opacity={0.5}
          />
          <rect
            x="22"
            y="8"
            width="14"
            height="4"
            rx="1"
            fill="#60a5fa"
            opacity={0.4}
          />
          <rect
            x="22"
            y="14"
            width="14"
            height="4"
            rx="1"
            fill="#60a5fa"
            opacity={0.4}
          />
          <rect
            x="4"
            y="0"
            width="36"
            height="3"
            rx="2"
            fill="white"
            opacity={0.12}
            className="chip-scan"
          />
        </svg>
      </div>

      {/* Arrow 2 */}
      <div
        style={{
          flex: 1,
          maxWidth: 80,
          position: "relative",
          height: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg
          width="100%"
          height="20"
          viewBox="0 0 80 20"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="10"
            x2="80"
            y2="10"
            stroke="rgba(14,99,214,0.15)"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="10"
            x2="80"
            y2="10"
            stroke="#1d6fd8"
            strokeWidth="1.5"
            strokeDasharray="12 8"
            className="data-flow-2"
          />
          <polygon points="76,6 80,10 76,14" fill="#0C447C" />
        </svg>
      </div>

      {/* Phone */}
      <div
        style={{
          flexShrink: 0,
          position: "relative",
          width: 36,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="28" height="44" viewBox="0 0 28 44">
          <rect
            x="0"
            y="0"
            width="28"
            height="44"
            rx="6"
            fill="rgba(255,255,255,0.9)"
            stroke="#1d6fd8"
            strokeWidth="1.5"
          />
          <rect x="6" y="6" width="16" height="24" rx="2" fill="#dbeafe" />
          <circle cx="14" cy="37" r="2.5" fill="#0D6EFD" />
          <rect
            x="9"
            y="3"
            width="10"
            height="2"
            rx="1"
            fill="#1d6fd8"
            opacity={0.4}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
          }}
        >
          <div
            className="orbit1"
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1d6fd8",
              marginLeft: -3,
              marginTop: -3,
            }}
          />
          <div
            className="orbit2"
            style={{
              position: "absolute",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#60a5fa",
              marginLeft: -2.5,
              marginTop: -2.5,
            }}
          />
          <div
            className="orbit3"
            style={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#0C447C",
              marginLeft: -2,
              marginTop: -2,
            }}
          />
        </div>
      </div>

      {/* Signal bars */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg width="28" height="20" viewBox="0 0 28 20">
          <rect
            className="sbar sbar1"
            x="0"
            y="14"
            width="5"
            height="6"
            rx="1"
            fill="#60a5fa"
          />
          <rect
            className="sbar sbar2"
            x="7"
            y="10"
            width="5"
            height="10"
            rx="1"
            fill="#60a5fa"
          />
          <rect
            className="sbar sbar3"
            x="14"
            y="6"
            width="5"
            height="14"
            rx="1"
            fill="#1d6fd8"
          />
          <rect
            className="sbar sbar4"
            x="21"
            y="2"
            width="5"
            height="18"
            rx="1"
            fill="#0C447C"
          />
        </svg>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 8,
            color: "#1d6fd8",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          LIVE
        </span>
      </div>
    </div>
  );
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
    { label: plan.data_label },
    { label: plan.validity_days ? `${plan.validity_days}d` : "—" },
    { label: plan.speed },
    { label: plan.sim_type },
    ...(plan.has_voice ? [{ label: "Voice" }] : []),
  ];

  return (
    <div
      className="plan-card"
      style={{
        animation: `fadeslide 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
        background: featured
          ? "rgba(219,234,254,0.7)"
          : "rgba(255,255,255,0.65)",
        border: featured
          ? "2px solid #1d6fd8"
          : "1px solid rgba(14,99,214,0.15)",
        borderRadius: 16,
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(6px)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = featured ? "#0C447C" : "rgba(14,99,214,0.4)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 8px 24px rgba(13,110,253,0.12)";
        el.style.background = featured
          ? "rgba(219,234,254,0.9)"
          : "rgba(255,255,255,0.88)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = featured ? "#1d6fd8" : "rgba(14,99,214,0.15)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.background = featured
          ? "rgba(219,234,254,0.7)"
          : "rgba(255,255,255,0.65)";
      }}
    >
      {/* Name + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "1px",
            color: featured ? "#0C447C" : "#4a6a8a",
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {plan.name.toUpperCase()}
        </span>
        {featured && (
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              background: "#0D6EFD",
              color: "#fff",
              padding: "2px 7px",
              borderRadius: 20,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            ★ TOP
          </span>
        )}
      </div>

      {/* Price */}
      <div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#0a2540",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          {plan.formatted_price}
        </div>
        {plan.validity_days && (
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: featured ? "#1d6fd8" : "#6a90b4",
              letterSpacing: "0.5px",
              marginTop: 2,
            }}
          >
            / {plan.validity_days} DAYS
          </div>
        )}
      </div>

      {/* Spec chips */}
      <div
        style={{
          borderTop: `1px solid ${featured ? "rgba(14,99,214,0.2)" : "rgba(14,99,214,0.1)"}`,
          paddingTop: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {specs.map((s) => (
          <span
            key={s.label}
            className="spec-chip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              background: "rgba(219,234,254,0.6)",
              border: "1px solid rgba(14,99,214,0.2)",
              borderRadius: 5,
              padding: "2px 6px",
              color: "#0C447C",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* CTA — button using router.push instead of Link */}
      <button
        onClick={handleGetPlan}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          width: "100%",
          padding: "9px 0",
          borderRadius: 9,
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.4px",
          cursor: "pointer",
          textDecoration: "none",
          transition: "background 0.15s, box-shadow 0.15s",
          marginTop: "auto",
          border: "none",
          ...(featured
            ? { background: "#0D6EFD", color: "#fff" }
            : {
                background: "rgba(219,234,254,0.5)",
                color: "#1d6fd8",
                border: "1.5px solid rgba(14,99,214,0.3)",
              }),
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = featured ? "#0C447C" : "rgba(219,234,254,0.9)";
          el.style.boxShadow = featured
            ? "0 4px 16px rgba(13,110,253,0.3)"
            : "none";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = featured ? "#0D6EFD" : "rgba(219,234,254,0.5)";
          el.style.boxShadow = "none";
        }}
      >
        GET PLAN →
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(14,99,214,0.12)",
        borderRadius: 16,
        height: 180,
        backgroundImage:
          "linear-gradient(90deg, rgba(219,234,254,0.5) 25%, rgba(191,219,254,0.4) 50%, rgba(219,234,254,0.5) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

function DotGrid() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.35,
      }}
    >
      <defs>
        <pattern
          id="dots"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.8" fill="rgba(14,99,214,0.25)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');

        @keyframes fadeslide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.6); opacity: .7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes signal-bar {
          0%, 100% { opacity: .3; }
          50%       { opacity: 1; }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg)   translateX(38px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(38px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(38px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(38px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(38px) rotate(-600deg); }
        }
        @keyframes data-flow {
          0%   { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes chip-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes chip-scan {
          0%   { top: 0; opacity: .5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes glow-chip {
          0%, 100% { border-color: rgba(14,99,214,0.2); }
          50%       { border-color: rgba(14,99,214,0.45); }
        }

        .ring1 { animation: pulse-ring 2s ease-out infinite 0s; }
        .ring2 { animation: pulse-ring 2s ease-out infinite .65s; }
        .ring3 { animation: pulse-ring 2s ease-out infinite 1.3s; }
        .chip-float { animation: chip-float 3s ease-in-out infinite; }
        .chip-scan  { animation: chip-scan 1.8s linear infinite; }
        .data-flow   { animation: data-flow .8s linear infinite; }
        .data-flow-2 { animation: data-flow .8s linear infinite .4s; }
        .orbit1 { animation: orbit1 4s linear infinite; }
        .orbit2 { animation: orbit2 4s linear infinite; }
        .orbit3 { animation: orbit3 4s linear infinite; }
        .sbar1 { animation: signal-bar 1.2s ease-in-out infinite 0s; }
        .sbar2 { animation: signal-bar 1.2s ease-in-out infinite .2s; }
        .sbar3 { animation: signal-bar 1.2s ease-in-out infinite .4s; }
        .sbar4 { animation: signal-bar 1.2s ease-in-out infinite .6s; }
        .spec-chip { animation: glow-chip 2.5s ease-in-out infinite; }
        .plan-card { cursor: default; }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        @media (max-width: 1024px) { .plans-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .plans-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .plans-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `
            radial-gradient(ellipse 700px 500px at 10% 20%, rgba(99,179,237,0.2) 0%, transparent 70%),
            radial-gradient(ellipse 500px 600px at 90% 70%, rgba(147,197,253,0.18) 0%, transparent 70%),
            linear-gradient(160deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)
          `,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        <Navigation />

        <main style={{ flex: 1 }}>
          {/* Breadcrumb */}
          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(14,99,214,0.12)",
              padding: "10px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/destinations"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                letterSpacing: "1.2px",
                color: "#4a6a8a",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#0D6EFD")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#4a6a8a")
              }
            >
              ← DESTINATIONS
            </Link>
            <span
              style={{
                fontSize: 9,
                color: "rgba(14,99,214,0.4)",
                letterSpacing: "1.5px",
              }}
            >
              DESTINATIONS
              {destination ? ` / ${destination.name.toUpperCase()}` : ""}
            </span>
          </div>

          {/* Hero */}
          <div
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(14,99,214,0.12)",
              padding: "24px 32px 20px",
              overflow: "hidden",
            }}
          >
            <DotGrid />
            <svg
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                pointerEvents: "none",
              }}
              width="220"
              height="130"
              viewBox="0 0 220 130"
            >
              <circle
                cx="220"
                cy="0"
                r="180"
                fill="none"
                stroke="rgba(14,99,214,0.08)"
                strokeWidth="0.8"
              />
              <circle
                cx="220"
                cy="0"
                r="130"
                fill="none"
                stroke="rgba(14,99,214,0.08)"
                strokeWidth="0.8"
              />
              <circle
                cx="220"
                cy="0"
                r="80"
                fill="none"
                stroke="rgba(14,99,214,0.1)"
                strokeWidth="0.8"
              />
            </svg>

            <div
              style={{
                position: "relative",
                maxWidth: 1100,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* Destination image */}
              <div
                style={{
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  border: "1.5px solid rgba(14,99,214,0.2)",
                  background: "rgba(219,234,254,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "rgba(191,219,254,0.6)",
                      animation: "shimmer 1.6s ease-in-out infinite",
                      backgroundSize: "200% 100%",
                    }}
                  />
                ) : destination?.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${destination.image}`}
                    alt={destination?.name}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 36 }}>🌐</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 6,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="0"
                      y="8"
                      width="3"
                      height="6"
                      rx="1"
                      fill="#60a5fa"
                    />
                    <rect
                      x="4"
                      y="5"
                      width="3"
                      height="9"
                      rx="1"
                      fill="#1d6fd8"
                    />
                    <rect
                      x="8"
                      y="2"
                      width="3"
                      height="12"
                      rx="1"
                      fill="#0D6EFD"
                    />
                    <rect
                      x="12"
                      y="0"
                      width="2"
                      height="14"
                      rx="1"
                      fill="#0C447C"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "2.5px",
                      color: "#1d6fd8",
                      fontWeight: 700,
                    }}
                  >
                    ESIM PLANS
                  </span>
                </div>

                {loading ? (
                  <div
                    style={{
                      height: 34,
                      width: 180,
                      background: "rgba(191,219,254,0.5)",
                      borderRadius: 8,
                      animation: "shimmer 1.6s ease-in-out infinite",
                      backgroundSize: "200% 100%",
                      marginBottom: 12,
                    }}
                  />
                ) : (
                  <h1
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 30,
                      fontWeight: 800,
                      color: "#0a2540",
                      lineHeight: 1.05,
                      margin: "0 0 10px",
                      letterSpacing: -1,
                    }}
                  >
                    {destination?.name}
                  </h1>
                )}

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    "✓ INSTANT ACTIVATION",
                    "✓ NO SIM SWAP",
                    "✓ CANCEL ANYTIME",
                  ].map((f) => (
                    <span
                      key={f}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "rgba(219,234,254,0.7)",
                        border: "1px solid rgba(14,99,214,0.2)",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: "#0C447C",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Plans section */}
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "20px 32px 40px",
            }}
          >
            {!loading && !error && plans.length > 0 && <EsimBanner />}

            {!loading && !error && destination && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(14,99,214,0.12)",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "2px",
                    color: "#4a6a8a",
                  }}
                >
                  CHOOSE YOUR PLAN
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: "rgba(14,99,214,0.4)",
                    letterSpacing: "1px",
                  }}
                >
                  {plans.length} PLAN{plans.length !== 1 ? "S" : ""} AVAILABLE
                </span>
              </div>
            )}

            {loading && (
              <div className="plans-grid">
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div
                style={{
                  background: "rgba(254,226,226,0.7)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(252,165,165,0.5)",
                  borderRadius: 12,
                  padding: "16px 20px",
                  color: "#991b1b",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                }}
              >
                ⚠ {error}
              </div>
            )}

            {!loading && !error && destination && plans.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#6a90b4",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "1px",
                }}
              >
                NO PLANS AVAILABLE FOR THIS DESTINATION YET.
              </div>
            )}

            {!loading && !error && destination && plans.length > 0 && (
              <div className="plans-grid">
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
              <div
                style={{
                  marginTop: 20,
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(14,99,214,0.12)",
                  borderRadius: 12,
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {[
                  { icon: "🔒", text: "SECURE CHECKOUT" },
                  { icon: "⚡", text: "INSTANT DELIVERY" },
                  { icon: "🌐", text: "190+ COUNTRIES" },
                  { icon: "💬", text: "24/7 SUPPORT" },
                ].map((t) => (
                  <div
                    key={t.text}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span style={{ fontSize: 14 }}>{t.icon}</span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: "#4a6a8a",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      {t.text}
                    </span>
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
