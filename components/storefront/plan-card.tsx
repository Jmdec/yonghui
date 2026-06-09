"use client";

import { useRouter } from "next/navigation";

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  data: string;
  features: string[];
  popular?: boolean;
}

export function PlanCard({
  plan,
  destinationName,
  onSelect,
}: {
  plan: Plan;
  destinationName: string;
  onSelect?: (plan: Plan) => void;
}) {
  const router = useRouter();

  const handleGetPlan = () => {
    sessionStorage.setItem(
      "selected_plan",
      JSON.stringify({ ...plan, destinationName }),
    );
    if (onSelect) {
      onSelect(plan);
    } else {
      router.push("/checkout");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800;900&family=Share+Tech+Mono&display=swap');

        .plan-card-wrap {
          --blue:        #0D6EFD;
          --blue-mid:    #1d6fd8;
          --blue-dark:   #0C447C;
          --blue-light:  #60a5fa;
          --blue-pale:   rgba(219,234,254,0.7);
          --border:      rgba(14,99,214,0.15);
          --border-mid:  rgba(14,99,214,0.28);
          --border-hot:  rgba(14,99,214,0.55);
          --text-head:   #0a2540;
          --text-body:   #1e3a5f;
          --text-muted:  #4a6a8a;
          --mono:        'Share Tech Mono', monospace;
          --display:     'Exo 2', sans-serif;
          font-family: var(--mono);
          position: relative;
        }

        .pc-inner {
          position: relative;
          background: rgba(255,255,255,0.65);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
          backdrop-filter: blur(8px);
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s, background 0.25s;
          cursor: default;
        }
        .pc-inner:hover {
          border-color: var(--border-hot);
          box-shadow: 0 10px 32px rgba(13,110,253,0.13), 0 2px 8px rgba(13,110,253,0.06);
          transform: translateY(-3px);
          background: rgba(255,255,255,0.9);
        }
        .pc-inner.featured {
          background: rgba(219,234,254,0.72);
          border: 2px solid var(--blue-mid);
        }
        .pc-inner.featured:hover {
          background: rgba(219,234,254,0.92);
          border-color: var(--blue-dark);
        }

        /* Corner brackets */
        .pc-corner {
          position: absolute;
          width: 10px; height: 10px;
          border-color: var(--blue);
          border-style: solid;
          opacity: 0;
          transition: opacity 0.25s;
          z-index: 4;
        }
        .pc-inner:hover .pc-corner { opacity: 0.5; }
        .pc-corner.tl { top: 5px; left: 5px;  border-width: 1.5px 0 0 1.5px; }
        .pc-corner.tr { top: 5px; right: 5px; border-width: 1.5px 1.5px 0 0; }
        .pc-corner.bl { bottom: 5px; left: 5px;  border-width: 0 0 1.5px 1.5px; }
        .pc-corner.br { bottom: 5px; right: 5px; border-width: 0 1.5px 1.5px 0; }

        /* Top accent bar */
        .pc-accent-bar {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue) 40%, var(--blue-light) 70%, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pc-inner:hover .pc-accent-bar,
        .pc-inner.featured .pc-accent-bar { opacity: 1; }

        /* Popular badge */
        .pc-badge {
          position: absolute;
          top: 12px; right: 12px;
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 700;
          background: var(--blue);
          color: #fff;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: 0.8px;
          z-index: 5;
        }

        /* Header section */
        .pc-header {
          padding: 16px 16px 12px;
          border-bottom: 1px solid var(--border);
        }
        .pc-dest {
          font-size: 9px;
          letter-spacing: 2px;
          color: var(--blue-mid);
          opacity: 0.7;
          margin-bottom: 4px;
        }
        .pc-name {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-head);
          letter-spacing: 0.3px;
        }

        /* Price section */
        .pc-price-wrap {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: flex-end;
          gap: 4px;
        }
        .pc-price {
          font-family: var(--display);
          font-size: 34px;
          font-weight: 900;
          color: var(--text-head);
          line-height: 1;
          letter-spacing: -1px;
        }
        .pc-price-meta {
          display: flex;
          flex-direction: column;
          padding-bottom: 3px;
        }
        .pc-price-unit {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        /* Data highlight */
        .pc-data-chip {
          margin: 0 16px 12px;
          padding: 10px 12px;
          background: rgba(219,234,254,0.5);
          border: 1px solid rgba(14,99,214,0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-data-icon {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }
        .pc-data-label {
          font-family: var(--display);
          font-size: 15px;
          font-weight: 800;
          color: var(--blue-dark);
          letter-spacing: -0.3px;
        }
        .pc-data-sub {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          margin-top: 1px;
        }

        /* Features */
        .pc-features {
          padding: 0 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .pc-feature {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          color: var(--text-body);
          letter-spacing: 0.2px;
        }
        .pc-feature-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--blue-mid);
          flex-shrink: 0;
          opacity: 0.7;
        }

        /* CTA */
        .pc-cta-wrap {
          padding: 12px 16px 14px;
          border-top: 1px solid var(--border);
        }
        .pc-btn {
          width: 100%;
          padding: 11px 0;
          border-radius: 8px;
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s, box-shadow 0.15s, gap 0.15s;
        }
        .pc-btn.primary {
          background: linear-gradient(135deg, #0D6EFD, #0090FF);
          color: #fff;
        }
        .pc-btn.primary:hover {
          background: linear-gradient(135deg, #0C447C, #0D6EFD);
          box-shadow: 0 6px 20px rgba(13,110,253,0.35);
          gap: 10px;
        }
        .pc-btn.secondary {
          background: rgba(219,234,254,0.6);
          color: var(--blue-mid);
          border: 1.5px solid rgba(14,99,214,0.3);
        }
        .pc-btn.secondary:hover {
          background: rgba(219,234,254,0.9);
          box-shadow: 0 4px 12px rgba(13,110,253,0.1);
          gap: 10px;
        }

        /* scan line on hover */
        .pc-scan {
          position: absolute;
          left: 0; right: 0;
          height: 35%;
          background: linear-gradient(180deg, rgba(13,110,253,0.06), transparent);
          top: -35%;
          pointer-events: none;
          z-index: 3;
          transition: none;
        }
        .pc-inner:hover .pc-scan {
          animation: pcScan 0.55s ease forwards;
        }
        @keyframes pcScan {
          from { top: -35%; }
          to   { top: 135%; }
        }
      `}</style>

      <div className="plan-card-wrap">
        <div className={`pc-inner${plan.popular ? " featured" : ""}`}>
          <div className="pc-accent-bar" />
          <div className="pc-scan" />

          {/* corner brackets */}
          <span className="pc-corner tl" />
          <span className="pc-corner tr" />
          <span className="pc-corner bl" />
          <span className="pc-corner br" />

          {plan.popular && <div className="pc-badge">★ TOP PICK</div>}

          {/* Header */}
          <div
            className="pc-header"
            style={{ paddingRight: plan.popular ? 72 : 16 }}
          >
            <div className="pc-dest">{destinationName.toUpperCase()}</div>
            <div className="pc-name">{plan.name}</div>
          </div>

          {/* Price */}
          <div className="pc-price-wrap">
            <div className="pc-price">${plan.price}</div>
            <div className="pc-price-meta">
              <span className="pc-price-unit">USD</span>
              <span className="pc-price-unit">/ {plan.duration}</span>
            </div>
          </div>

          {/* Data chip */}
          <div className="pc-data-chip">
            <span className="pc-data-icon">⚡</span>
            <div>
              <div className="pc-data-label">{plan.data}</div>
              <div className="pc-data-sub">HIGH-SPEED DATA</div>
            </div>
          </div>

          {/* Features */}
          <div className="pc-features">
            {plan.features.map((f, i) => (
              <div key={i} className="pc-feature">
                <span className="pc-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pc-cta-wrap">
            <button
              className={`pc-btn ${plan.popular ? "primary" : "secondary"}`}
              onClick={handleGetPlan}
            >
              GET PLAN <span>›</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
