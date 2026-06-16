"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

const API_IMG = process.env.NEXT_PUBLIC_API_IMG ?? "";

function imgSrc(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_IMG}/${path}`;
}

interface DongleProduct {
  id: number;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  price: number | string;
  images?: string[] | null;
  data_amount?: string | null;
  duration_label?: string | null;
  validity_days?: number | null;
  destination_name?: string | null;
  features?: string[] | null;
  popular: boolean;
  requires_shipping: boolean;
  is_active: boolean;
}

const STEPS = [
  {
    n: "01",
    title: "Turn off mobile data",
    body: "Disable your Philippine mobile data connection before plugging in.",
    icon: "📵",
  },
  {
    n: "02",
    title: "Plug into USB-C",
    body: "Insert the dongle into your device's USB Type-C port.",
    icon: "🔌",
  },
  {
    n: "03",
    title: "Wait for green light",
    body: "The green indicator light means the dongle is active and connected.",
    icon: "🟢",
  },
  {
    n: "04",
    title: "Browse freely",
    body: "You're online. No VPN, no setup — just fast, open internet.",
    icon: "🌐",
  },
];

const SERVICES = [
  { label: "Gmail", icon: "✉️" },
  { label: "Google Search", icon: "🔍" },
  { label: "YouTube", icon: "▶️" },
  { label: "Viber", icon: "📞" },
  { label: "WhatsApp", icon: "💬" },
  { label: "TikTok", icon: "🎵" },
];

function formatPrice(price: number | string) {
  // Coerce to number first — API may return price as a string.
  const n = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(n)) return "0.00";
  const fixed = n.toFixed(2);
  const [whole, dec] = fixed.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${withCommas}.${dec}`;
}

/** Parse "50 GB" → { num: "50", unit: "GB" }. Falls back to provided defaults. */
function parseAmount(
  raw: string,
  defaultUnit: string,
): { num: string; unit: string } {
  const m = raw.trim().match(/^([\d.]+)\s*(.*)$/);
  const num = m?.[1] ?? raw;
  const unit = (m?.[2] ?? "").trim() || defaultUnit;
  return { num, unit };
}

function Skeleton({
  w,
  h,
  radius = 8,
}: {
  w: number | string;
  h: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background:
          "linear-gradient(90deg,#f0f4f8 25%,#e8eef6 50%,#f0f4f8 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

export default function DonglePage() {
  const [product, setProduct] = useState<DongleProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products/active")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((json) => {
        const dongle = (json.data as DongleProduct[]).find(
          (p) => p.type === "dongle",
        );
        if (!dongle) throw new Error("No dongle product found");
        setProduct(dongle);
      })
      .catch(() => setError("Could not load product."))
      .finally(() => setLoading(false));
  }, []);

  const handleOrderNow = () => {
    if (!product) return;
    sessionStorage.setItem(
      "selected_plan",
      JSON.stringify({
        id: String(product.id),
        name: product.name,
        price: Number(product.price),
        duration:
          product.duration_label ??
          (product.validity_days ? `${product.validity_days} days` : "—"),
        data: product.data_amount ?? "—",
        features: product.features ?? [],
        popular: product.popular,
        destinationName: product.destination_name,
      }),
    );
    window.location.href = "/checkout/dongle";
  };

  const displayPrice = product ? `₱${formatPrice(product.price)}` : "—";
  const displayDest =
    product?.destination_name ?? "Mainland China, Hong Kong & Macau";
  const displayName = product?.name ?? "USB-C Travel Internet Dongle";
  const displayDesc = product?.description ?? null;

  // ── Data amount: could be "50", "50 GB", "50GB", etc. Always show GB.
  const rawData = product?.data_amount ?? "50";
  const { num: dataNum, unit: dataUnit } = parseAmount(rawData, "GB");

  // ── Duration: prefer duration_label, fall back to validity_days
  const rawDur =
    product?.duration_label ??
    (product?.validity_days ? `${product.validity_days}` : "365");
  const { num: durNum, unit: durUnit } = parseAmount(rawDur, "days");

  // Full display strings with guaranteed units
  const displayData = `${dataNum} ${dataUnit}`;
  const displayDuration = `${durNum} ${durUnit}`;

  const features: string[] = product?.features?.length
    ? product.features
    : [
        "50 GB data included",
        "Valid for 1 year from first use",
        "No VPN required",
        "USB-C plug-and-play, no drivers needed",
      ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes ledBlink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .dp-page{min-height:100vh;background:#f0f2f5;font-family:'Sora',sans-serif;color:#0a2540}

        /* ── HERO ── */
        .dp-hero-wrap{background:#fff;border-bottom:1px solid #e2e8f0}
        .dp-hero{
          padding:32px 40px;
          display:grid;
          grid-template-columns:1fr 440px;
          gap:40px;
          align-items:start;
          max-width:1160px;
          margin:0 auto;
          width:100%;
        }

        /* Left col */
        .dp-eyebrow{
          display:inline-flex;align-items:center;gap:8px;
          font-family:'IBM Plex Mono',monospace;font-size:9px;
          letter-spacing:3px;text-transform:uppercase;color:#bc6a08;margin-bottom:12px;
        }
        .dp-eyebrow::before{content:'';display:inline-block;width:16px;height:1px;background:#bc6a08}

        .dp-hero-title{
          font-size:clamp(24px,2.8vw,38px);font-weight:800;line-height:1.08;
          color:#0a2540;margin-bottom:10px;letter-spacing:-0.5px;
        }
        .dp-hero-title em{font-style:normal;color:#bc6a08}

        .dp-hero-tagline{
          font-size:11px;font-weight:600;color:#1d6fd8;
          font-family:'IBM Plex Mono',monospace;letter-spacing:0.3px;margin-bottom:12px;
        }
        .dp-hero-sub{font-size:13px;color:#4b5563;line-height:1.75;margin-bottom:16px;max-width:460px}

        .dp-ph-notice{
          display:inline-flex;align-items:center;gap:6px;
          background:#fffbeb;border:1px solid #fcd34d;border-radius:7px;
          padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:9px;
          color:#92400e;letter-spacing:0.5px;margin-bottom:14px;
        }

        .dp-coverage-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
        .dp-cpill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid}
        .dp-cpill-cn{background:#fef2f2;color:#b91c1c;border-color:#fecaca}
        .dp-cpill-hk{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe}
        .dp-cpill-mo{background:#f0fdf4;color:#15803d;border-color:#bbf7d0}

        /* ── Stats strip ── */
        .dp-stats-strip{
          display:flex;
          background:#f8faff;
          border:1px solid #dde5f0;
          border-radius:12px;
          overflow:hidden;
          margin-bottom:18px;
        }
        .dp-stat{flex:1;padding:14px 18px;border-right:1px solid #dde5f0}
        .dp-stat:last-child{border-right:none}
        .dp-stat-row{display:flex;align-items:baseline;gap:3px}
        .dp-stat-val{font-size:28px;font-weight:800;color:#0a2540;line-height:1}
        .dp-stat-unit{
          font-size:13px;font-weight:700;color:#2563eb;
          font-family:'IBM Plex Mono',monospace;letter-spacing:0.5px;
        }
        .dp-stat-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8a9ab5;letter-spacing:0.5px;margin-top:4px;text-transform:uppercase}

        /* ── Features ── */
        .dp-features-list{display:flex;flex-direction:column;gap:5px;margin-bottom:20px}
        .dp-feature-item{display:flex;align-items:center;gap:8px;font-size:12px;color:#374151}
        .dp-feature-dot{width:5px;height:5px;border-radius:50%;background:#22c55e;flex-shrink:0}

        /* ── Price + CTA ── */
        .dp-price-cta{display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap}
        .dp-price-block{display:flex;flex-direction:column;gap:3px}
        .dp-price-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8a9ab5;letter-spacing:2px;text-transform:uppercase}
        .dp-price-value{font-size:36px;font-weight:800;color:#bc6a08;letter-spacing:-1.5px;line-height:1}
        .dp-price-note{font-size:10px;color:#6b7280;font-family:'IBM Plex Mono',monospace;letter-spacing:0.3px}

        .dp-cta-btn{
          display:inline-flex;align-items:center;gap:8px;
          background:#2563eb;color:#fff;
          font-family:'Sora',sans-serif;font-size:14px;font-weight:700;
          padding:14px 28px;border-radius:10px;border:none;cursor:pointer;
          transition:background 0.15s,transform 0.15s;
          box-shadow:0 2px 10px rgba(37,99,235,0.3);
          white-space:nowrap;
        }
        .dp-cta-btn:hover{background:#1d4ed8;transform:translateY(-2px)}
        .dp-cta-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}

        /* ── Gallery ── */
        .dp-gallery{display:flex;flex-direction:column;gap:10px;animation:fadeUp 0.5s 0.1s ease both}
        .dp-gallery-main{
          background:linear-gradient(160deg,#f4f7fb,#e8eef6);
          border:1px solid #dde3ec;
          border-radius:18px;
          padding:16px;
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;
        }
        .dp-gallery-main img{
          width:100%;
          max-height:320px;
          height:auto;
          object-fit:contain;
          border-radius:10px;
          display:block;
          transition:opacity 0.2s ease;
        }
        .dp-gallery-placeholder{display:flex;flex-direction:column;align-items:center;gap:10px;color:#94a3b8}
        .dp-gallery-placeholder-icon{font-size:40px;opacity:0.5}
        .dp-gallery-placeholder-text{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;text-align:center}
        .dp-gallery-thumbs{display:flex;gap:8px}
        .dp-gallery-thumb{
          flex:1;height:76px;border-radius:10px;object-fit:cover;
          cursor:pointer;border:2px solid transparent;
          transition:border-color 0.15s,opacity 0.15s;opacity:0.6;
        }
        .dp-gallery-thumb:hover{opacity:0.85}
        .dp-gallery-thumb.active{border-color:#2563eb;opacity:1}
        .dp-gallery-cap{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8a9ab5;letter-spacing:1px;text-transform:uppercase;text-align:center}

        /* ── BODY ── */
        .dp-body{max-width:1160px;margin:0 auto;width:100%;padding:32px 40px 56px;display:flex;flex-direction:column;gap:28px}

        .dp-section-label{
          display:flex;align-items:center;gap:8px;
          font-family:'IBM Plex Mono',monospace;font-size:9px;color:#1d6fd8;
          letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;font-weight:600;
        }
        .dp-section-label::before{content:'';display:inline-block;width:14px;height:1px;background:#1d6fd8}

        /* ── Package cards ── */
        .dp-box-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .dp-box-card{
          background:#fff;border:1px solid #e2e8f0;border-radius:14px;
          padding:20px 18px;display:flex;flex-direction:column;gap:10px;
          position:relative;overflow:hidden;
        }
        .dp-box-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:3px;background:#e2e8f0;
        }
        .dp-box-card.accent-blue::before{background:#2563eb}
        .dp-box-card.accent-green::before{background:#22c55e}
        .dp-box-card.accent-orange::before{background:#f59e0b}

        .dp-box-icon{font-size:26px;line-height:1}
        .dp-box-title{font-size:15px;font-weight:700;color:#0a2540}
        .dp-box-value{
          font-size:28px;font-weight:800;color:#0a2540;letter-spacing:-0.5px;line-height:1;
          display:flex;align-items:baseline;gap:4px;
        }
        .dp-box-value-unit{font-size:14px;font-weight:700;color:#2563eb;font-family:'IBM Plex Mono',monospace}
        .dp-box-body{font-size:11px;color:#6b7280;line-height:1.65}
        .dp-box-tag{
          display:inline-flex;align-self:flex-start;padding:3px 10px;border-radius:5px;
          font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:0.5px;
        }
        .dp-box-tag-green{background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d}
        .dp-box-tag-orange{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412}

        /* ── Steps ── */
        .dp-steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .dp-step-card{
          background:#fff;border:1px solid #e2e8f0;border-radius:14px;
          padding:20px 16px;display:flex;flex-direction:column;gap:8px;
        }
        .dp-step-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
        .dp-step-icon{font-size:22px;line-height:1}
        .dp-step-num{
          font-family:'IBM Plex Mono',monospace;font-size:20px;font-weight:600;
          color:#e2e8f0;letter-spacing:-0.5px;line-height:1;
        }
        .dp-step-title{font-size:13px;font-weight:700;color:#0a2540;line-height:1.3}
        .dp-step-body{font-size:11px;color:#6b7280;line-height:1.65}

        /* ── No-VPN ── */
        .dp-novpn-grid{
          background:#fff;border:1px solid #e2e8f0;border-radius:14px;
          padding:24px 28px;display:flex;flex-direction:column;gap:16px;
        }
        .dp-novpn-intro{font-size:13px;color:#4b5563;line-height:1.75;max-width:640px}
        .dp-services-row{display:flex;flex-wrap:wrap;gap:8px}
        .dp-service-chip{
          display:inline-flex;align-items:center;gap:8px;
          background:#f8f9fa;border:1px solid #e2e8f0;border-radius:8px;padding:9px 16px;
          transition:border-color 0.15s,background 0.15s;
        }
        .dp-service-chip:hover{border-color:#bfdbfe;background:#eff6ff}
        .dp-service-icon{font-size:16px}
        .dp-service-name{font-size:12px;font-weight:600;color:#0a2540}
        .dp-novpn-badge{
          display:inline-flex;align-items:center;gap:7px;
          background:#f0fdf4;border:1px solid #bbf7d0;border-radius:7px;
          padding:8px 14px;font-family:'IBM Plex Mono',monospace;
          font-size:9px;color:#15803d;letter-spacing:1px;align-self:flex-start;font-weight:600;
        }
        .dp-novpn-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:ledBlink 2s ease-in-out infinite}

        /* ── Coverage ── */
        .dp-coverage-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .dp-coverage-card{
          background:#fff;border:1px solid #e2e8f0;border-radius:14px;
          padding:22px 20px;display:flex;flex-direction:column;gap:6px;
        }
        .dp-cov-flag{font-size:32px;margin-bottom:4px}
        .dp-cov-name{font-size:15px;font-weight:700;color:#0a2540}
        .dp-cov-note{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#22c55e;letter-spacing:1px;font-weight:600}
        .dp-cov-desc{font-size:11px;color:#6b7280;line-height:1.65;margin-top:2px}

        /* ── Top-up ── */
        .dp-topup-box{
          background:#fff;border:1px solid #e2e8f0;border-radius:14px;
          padding:22px 26px;display:flex;align-items:flex-start;gap:18px;
        }
        .dp-topup-icon{
          width:44px;height:44px;flex-shrink:0;
          background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;
          display:flex;align-items:center;justify-content:center;font-size:20px;
        }
        .dp-topup-title{font-size:14px;font-weight:700;color:#0a2540;margin-bottom:5px}
        .dp-topup-body{font-size:12px;color:#6b7280;line-height:1.7}

        /* ── Bottom CTA ── */
        .dp-cta-band{
          background:#0a2540;border-radius:18px;
          padding:36px 40px;display:flex;align-items:center;
          justify-content:space-between;gap:28px;
        }
        .dp-cta-band-left h2{font-size:clamp(18px,2.2vw,26px);font-weight:800;color:#fff;margin-bottom:6px;letter-spacing:-0.3px}
        .dp-cta-band-left p{font-size:12px;color:#94a3b8;line-height:1.7}
        .dp-cta-band-right{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0}
        .dp-cta-band-price{font-size:30px;font-weight:800;color:#f59e0b;letter-spacing:-1px}
        .dp-cta-band-note{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#64748b;letter-spacing:0.5px;text-align:right}
        .dp-cta-band-btn{
          display:inline-flex;align-items:center;gap:8px;
          background:#2563eb;color:#fff;
          font-family:'Sora',sans-serif;font-size:14px;font-weight:700;
          padding:13px 28px;border-radius:10px;border:none;cursor:pointer;
          white-space:nowrap;transition:background 0.15s,transform 0.15s;
          box-shadow:0 2px 10px rgba(37,99,235,0.35);
        }
        .dp-cta-band-btn:hover{background:#1d4ed8;transform:translateY(-1px)}
        .dp-cta-band-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}

        .dp-error{
          background:#fff5f5;border:1px solid #fecaca;border-radius:10px;
          padding:14px 18px;color:#991b1b;
          font-family:'IBM Plex Mono',monospace;font-size:11px;
          max-width:400px;margin:32px auto;
        }

        /* ── RESPONSIVE ── */
        @media(max-width:960px){
          .dp-hero{grid-template-columns:1fr;padding:24px 20px;gap:28px}
          .dp-body{padding:24px 20px 48px;gap:24px}
          .dp-steps-grid{grid-template-columns:repeat(2,1fr)}
          .dp-coverage-grid,.dp-box-grid{grid-template-columns:1fr}
          .dp-cta-band{flex-direction:column;text-align:center;padding:28px 20px}
          .dp-cta-band-right{align-items:center}
          .dp-cta-band-note{text-align:center}
        }
        @media(max-width:540px){
          .dp-steps-grid{grid-template-columns:1fr}
          .dp-stats-strip{flex-direction:column}
          .dp-stat{border-right:none;border-bottom:1px solid #dde5f0}
          .dp-stat:last-child{border-bottom:none}
          .dp-price-cta{flex-direction:column;align-items:flex-start}
          .dp-gallery-thumb{height:60px}
        }
      `}</style>

      <div className="dp-page">
        <Navigation />

        {error && <div className="dp-error">⚠ {error}</div>}

        {/* ── HERO ── */}
        <div className="dp-hero-wrap">
          <div className="dp-hero">
            {/* LEFT */}
            <div style={{ animation: "fadeUp 0.5s ease both" }}>
              <div className="dp-eyebrow">
                Plug &amp; Play · No SIM · No Registration
              </div>

              {loading ? (
                <div style={{ marginBottom: 10 }}>
                  <Skeleton w={300} h={42} />
                </div>
              ) : (
                <h1 className="dp-hero-title">
                  {(() => {
                    const p = displayName.split(" ");
                    const last = p.pop();
                    return (
                      <>
                        {p.join(" ")}
                        <br />
                        <em>{last}</em>
                      </>
                    );
                  })()}
                </h1>
              )}

              <p className="dp-hero-tagline">
                Portable mobile data — no SIM card or registration required
              </p>

              {displayDesc ? (
                <p className="dp-hero-sub">{displayDesc}</p>
              ) : (
                <p className="dp-hero-sub">
                  Dongle is a portable mobile data device that does not require
                  changing your SIM card. Simply plug it in and start using it
                  instantly. Ideal for business travelers between the
                  Philippines, Mainland China, Hong Kong, and Macau. No VPN
                  required.
                </p>
              )}

              <div className="dp-ph-notice">
                🇵🇭 &nbsp;Available for pick-up or delivery in the Philippines
                only
              </div>

              <div className="dp-coverage-row">
                <span className="dp-cpill dp-cpill-cn">🇨🇳 Mainland China</span>
                <span className="dp-cpill dp-cpill-hk">🇭🇰 Hong Kong</span>
                <span className="dp-cpill dp-cpill-mo">🇲🇴 Macau</span>
              </div>

              {/* Stats strip — always shows units */}
              <div className="dp-stats-strip">
                <div className="dp-stat">
                  {loading ? (
                    <Skeleton w={80} h={28} />
                  ) : (
                    <div className="dp-stat-row">
                      <span className="dp-stat-val">{dataNum}</span>
                      <span className="dp-stat-unit">{dataUnit}</span>
                    </div>
                  )}
                  <div className="dp-stat-label">Data included</div>
                </div>
                <div className="dp-stat">
                  {loading ? (
                    <Skeleton w={80} h={28} />
                  ) : (
                    <div className="dp-stat-row">
                      <span className="dp-stat-val">{durNum}</span>
                      <span className="dp-stat-unit">{durUnit}</span>
                    </div>
                  )}
                  <div className="dp-stat-label">Validity from first use</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-row">
                    <span className="dp-stat-val" style={{ fontSize: 18 }}>
                      No VPN
                    </span>
                  </div>
                  <div className="dp-stat-label">China-ready</div>
                </div>
              </div>

              {!loading && features.length > 0 && (
                <div className="dp-features-list">
                  {features.map((f) => (
                    <div key={f} className="dp-feature-item">
                      <span className="dp-feature-dot" />
                      {f}
                    </div>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div className="dp-price-cta">
                <div className="dp-price-block">
                  <span className="dp-price-label">Suggested Retail Price</span>
                  {loading ? (
                    <Skeleton w={140} h={38} />
                  ) : (
                    <span className="dp-price-value">{displayPrice}</span>
                  )}
                  {!loading && (
                    <span className="dp-price-note">
                      Includes {dataNum} {dataUnit} data · {durNum}-{durUnit}{" "}
                      validity
                    </span>
                  )}
                </div>
                <button
                  onClick={handleOrderNow}
                  className="dp-cta-btn"
                  disabled={loading || !product}
                >
                  Order now →
                </button>
              </div>
            </div>

            {/* RIGHT — Gallery */}
            <ProductGallery
              loading={loading}
              images={product?.images ?? []}
              name={displayName}
            />
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="dp-body">
          {/* Package includes */}
          <div>
            <div className="dp-section-label">Package includes</div>
            <div className="dp-box-grid">
              <div className="dp-box-card accent-blue">
                <span className="dp-box-icon">📶</span>
                <div>
                  <div className="dp-box-value">
                    {loading ? (
                      <Skeleton w={60} h={28} />
                    ) : (
                      <>
                        {dataNum}
                        <span className="dp-box-value-unit">{dataUnit}</span>
                      </>
                    )}
                  </div>
                  <p className="dp-box-title" style={{ marginTop: 4 }}>
                    Mobile Data
                  </p>
                </div>
                <p className="dp-box-body">
                  High-speed data valid across Mainland China, Hong Kong, and
                  Macau. No throttling on standard browsing and streaming.
                </p>
                <span className="dp-box-tag dp-box-tag-green">
                  {loading ? "—" : `${dataNum} ${dataUnit} included`}
                </span>
              </div>
              <div className="dp-box-card accent-green">
                <span className="dp-box-icon">📅</span>
                <div>
                  <div className="dp-box-value">
                    {loading ? (
                      <Skeleton w={60} h={28} />
                    ) : (
                      <>
                        {durNum}
                        <span className="dp-box-value-unit">{durUnit}</span>
                      </>
                    )}
                  </div>
                  <p className="dp-box-title" style={{ marginTop: 4 }}>
                    Validity Period
                  </p>
                </div>
                <p className="dp-box-body">
                  Countdown starts only from first use — not from purchase. Your
                  data stays ready until you need it.
                </p>
                <span className="dp-box-tag dp-box-tag-green">
                  {loading ? "—" : `${durNum} ${durUnit} from first use`}
                </span>
              </div>
              <div className="dp-box-card accent-orange">
                <span className="dp-box-icon">🔌</span>
                <div>
                  <div className="dp-box-value" style={{ fontSize: 20 }}>
                    USB-C
                  </div>
                  <p className="dp-box-title" style={{ marginTop: 4 }}>
                    Dongle Device
                  </p>
                </div>
                <p className="dp-box-body">
                  Compact plug-and-play dongle compatible with any USB Type-C
                  device. No drivers, apps, or configuration required.
                </p>
                <span className="dp-box-tag dp-box-tag-orange">
                  PH pick-up / delivery
                </span>
              </div>
            </div>
          </div>

          {/* How to use */}
          <div>
            <div className="dp-section-label">How to use</div>
            <div className="dp-steps-grid">
              {STEPS.map(({ n, title, body, icon }) => (
                <div key={n} className="dp-step-card">
                  <div className="dp-step-header">
                    <span className="dp-step-icon">{icon}</span>
                    <span className="dp-step-num">{n}</span>
                  </div>
                  <p className="dp-step-title">{title}</p>
                  <p className="dp-step-body">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* No VPN */}
          <div>
            <div className="dp-section-label">Open access — no VPN needed</div>
            <div className="dp-novpn-grid">
              <p className="dp-novpn-intro">
                Services normally restricted in Mainland China work out of the
                box. No configuration, no workarounds — just plug in and use
                what you need.
              </p>
              <div className="dp-services-row">
                {SERVICES.map(({ label, icon }) => (
                  <div key={label} className="dp-service-chip">
                    <span className="dp-service-icon">{icon}</span>
                    <span className="dp-service-name">{label}</span>
                  </div>
                ))}
              </div>
              <div className="dp-novpn-badge">
                <span className="dp-novpn-dot" />
                Works in Mainland China, HK &amp; Macau
              </div>
            </div>
          </div>

          {/* Coverage */}
          <div>
            <div className="dp-section-label">Coverage</div>
            <div className="dp-coverage-grid">
              {[
                {
                  flag: "🇨🇳",
                  name: "Mainland China",
                  note: "Full coverage",
                  desc: "Nationwide coverage including Beijing, Shanghai, Shenzhen, and all major cities. Bypasses the Great Firewall — no VPN required.",
                },
                {
                  flag: "🇭🇰",
                  name: "Hong Kong",
                  note: "Full coverage",
                  desc: "Complete coverage across Hong Kong Island, Kowloon, and the New Territories.",
                },
                {
                  flag: "🇲🇴",
                  name: "Macau",
                  note: "Full coverage",
                  desc: "Full coverage across the Macau Peninsula, Taipa, and the Cotai Strip.",
                },
              ].map(({ flag, name, note, desc }) => (
                <div key={name} className="dp-coverage-card">
                  <span className="dp-cov-flag">{flag}</span>
                  <span className="dp-cov-name">{name}</span>
                  <span className="dp-cov-note">✓ {note}</span>
                  <p className="dp-cov-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top-up */}
          <div>
            <div className="dp-section-label">Data top-up &amp; renewal</div>
            <div className="dp-topup-box">
              <div className="dp-topup-icon">📞</div>
              <div>
                <p className="dp-topup-title">Need more data?</p>
                <p className="dp-topup-body">
                  If you consume all {displayData} or need additional data,
                  please contact our customer service team. We'll walk you
                  through the available top-up and renewal options.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="dp-cta-band">
            <div className="dp-cta-band-left">
              <h2>Ready to travel without limits?</h2>
              <p>
                {displayData} · {displayDuration} · {displayDest}
                <br />
                No VPN · No SIM · No registration required
              </p>
            </div>
            <div className="dp-cta-band-right">
              {loading ? (
                <Skeleton w={140} h={32} />
              ) : (
                <p className="dp-cta-band-price">{displayPrice}</p>
              )}
              <button
                onClick={handleOrderNow}
                className="dp-cta-band-btn"
                disabled={loading || !product}
              >
                Order now →
              </button>
              <p className="dp-cta-band-note">
                🇵🇭 Pick-up or delivery · Philippines only
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

// ─── Product Gallery ───────────────────────────────────────────────────────────
function ProductGallery({
  loading,
  images,
  name,
}: {
  loading: boolean;
  images: string[];
  name: string;
}) {
  const srcs = images.map(imgSrc).filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  return (
    <div className="dp-gallery">
      <div className="dp-gallery-main">
        {loading ? (
          <div style={{ width: "100%", aspectRatio: "4/3" }}>
            <Skeleton w="100%" h={240} radius={10} />
          </div>
        ) : srcs.length > 0 ? (
          <img
            key={srcs[active]}
            src={srcs[active]}
            alt={`${name} – view ${active + 1}`}
          />
        ) : (
          <div className="dp-gallery-placeholder">
            <span className="dp-gallery-placeholder-icon">📷</span>
            <p className="dp-gallery-placeholder-text">
              Product image
              <br />
              coming soon
            </p>
          </div>
        )}
      </div>
      {srcs.length > 1 && (
        <div className="dp-gallery-thumbs">
          {srcs.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${name} – thumbnail ${i + 1}`}
              className={`dp-gallery-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
      <p className="dp-gallery-cap">{name}</p>
    </div>
  );
}
