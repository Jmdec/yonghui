"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [destCount, setDestCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestCount((d.data ?? []).length))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const countLabel = destCount != null ? `${destCount}+` : "190+";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes float-blob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes blink-dot  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fade-up    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btn-pulse  { 0%,100%{box-shadow:0 6px 24px rgba(0,87,217,.25)} 50%{box-shadow:0 6px 36px rgba(0,87,217,.4)} }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-page {
          min-height: 100vh;
          background: #f7f4ef;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .lp-bg-blob-1 {
          position: fixed;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 1100px;
          height: 650px;
          background: radial-gradient(ellipse, rgba(0,87,217,.06) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .lp-bg-blob-2 {
          position: fixed;
          top: 25%;
          right: -80px;
          width: 520px;
          height: 520px;
          background: radial-gradient(ellipse, rgba(0,87,217,.05) 0%, transparent 70%);
          animation: float-blob 7s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .lp-bg-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .lp-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px 64px;
          position: relative;
          z-index: 2;
        }

        .lp-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          width: 100%;
          max-width: 860px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,87,217,0.12);
          animation: fade-up .55s ease both .05s;
        }

        /* LEFT — photo panel */
        .lp-left {
          position: relative;
          overflow: hidden;
          min-height: 520px;
        }
        .lp-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .lp-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(0,87,217,0.45) 0%, rgba(0,30,80,0.55) 100%);
        }
        .lp-left-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 32px;
        }
        .lp-left-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
          padding: 5px 14px;
          margin-bottom: 16px;
          width: fit-content;
        }
        .lp-left-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: blink-dot 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .lp-left-badge span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
        }
        .lp-left-heading {
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .lp-left-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.65;
          margin-bottom: 20px;
        }
        .lp-left-stats {
          display: flex;
          gap: 8px;
        }
        .lp-left-stat {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 8px 12px;
          text-align: center;
        }
        .lp-left-stat-val {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .lp-left-stat-label {
          font-size: 0.62rem;
          color: rgba(255,255,255,0.65);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 3px;
          font-weight: 600;
        }

        /* RIGHT — form panel */
        .lp-right {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 44px 40px;
        }
        .lp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e8f0fd;
          border: 1px solid #c5d9fb;
          border-radius: 999px;
          padding: 5px 14px;
          margin-bottom: 20px;
          width: fit-content;
        }
        .lp-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0057d9;
          animation: blink-dot 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .lp-eyebrow span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0057d9;
        }
        .lp-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 800;
          color: #1a1f2e;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
          line-height: 1.15;
        }
        .lp-sub {
          font-size: 0.88rem;
          color: #5a6478;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .lp-error {
          font-size: 0.82rem;
          color: #c0392b;
          background: #fdf0ef;
          border: 1px solid #f5c6c1;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .lp-field { margin-bottom: 16px; }
        .lp-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #1a1f2e;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .lp-input {
          width: 100%;
          background: #f7f8fb;
          border: 1px solid #e2e6ef;
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: #1a1f2e;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .lp-input::placeholder { color: #b0bac8; }
        .lp-input:focus {
          border-color: #0057d9;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,87,217,0.1);
        }

        .lp-btn {
          width: 100%;
          padding: 13px;
          background: #0057d9;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.97rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          animation: btn-pulse 3s ease-in-out infinite;
          transition: background 0.18s, opacity 0.18s;
        }
        .lp-btn:hover:not(:disabled) { background: #1a6aff; }
        .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; }

        .lp-divider {
          border: none;
          border-top: 1px solid #e2e6ef;
          margin: 22px 0;
        }
        .lp-footer {
          text-align: center;
          font-size: 0.85rem;
          color: #5a6478;
        }
        .lp-footer a {
          color: #0057d9;
          font-weight: 700;
          text-decoration: none;
        }
        .lp-footer a:hover { color: #1a6aff; }

        @media (max-width: 640px) {
          .lp-left { display: none; }
          .lp-wrap { grid-template-columns: 1fr; max-width: 420px; }
          .lp-right { padding: 36px 28px; }
        }
      `}</style>

      <div className="lp-page">
        <div className="lp-bg-blob-1" />
        <div className="lp-bg-blob-2" />
        <svg className="lp-bg-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="lgrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#0057d9"
                strokeWidth="0.5"
                opacity="0.05"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lgrid)" />
        </svg>

        <Navigation />

        <div className="lp-center">
          <div className="lp-wrap">
            {/* LEFT — photo */}
            <div className="lp-left">
              <img
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&auto=format&fit=crop&q=80"
                alt="Traveler exploring abroad"
              />
              <div className="lp-left-overlay" />
              <div className="lp-left-content">
                <div className="lp-left-badge">
                  <div className="lp-left-badge-dot" />
                  <span>YH eSIM</span>
                </div>
                <div className="lp-left-heading">
                  The world is waiting.
                  <br />
                  Stay connected.
                </div>
                <div className="lp-left-sub">
                  Instant eSIM coverage in {countLabel} countries. No roaming
                  fees, no plastic cards — just seamless travel.
                </div>
                <div className="lp-left-stats">
                  <div className="lp-left-stat">
                    <div className="lp-left-stat-val">{countLabel}</div>
                    <div className="lp-left-stat-label">Countries</div>
                  </div>
                  <div className="lp-left-stat">
                    <div className="lp-left-stat-val">10K+</div>
                    <div className="lp-left-stat-label">Travelers</div>
                  </div>
                  <div className="lp-left-stat">
                    <div className="lp-left-stat-val">24/7</div>
                    <div className="lp-left-stat-label">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="lp-right">
              <div className="lp-eyebrow">
                <div className="lp-eyebrow-dot" />
                <span>Welcome back</span>
              </div>
              <h1 className="lp-heading">Sign in to your account</h1>
              <p className="lp-sub">
                Pick up right where your last adventure left off.
              </p>

              <form onSubmit={handleSubmit}>
                {error && <div className="lp-error">⚠ {error}</div>}

                <div className="lp-field">
                  <label className="lp-label">Email address</label>
                  <input
                    className="lp-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="lp-field">
                  <label className="lp-label">Password</label>
                  <input
                    className="lp-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="lp-btn" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in →"}
                </button>
              </form>

              <hr className="lp-divider" />
              <p className="lp-footer">
                Don't have an account?{" "}
                <Link href="/auth/signup">Create one free</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
