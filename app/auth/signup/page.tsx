"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export default function SignupPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [destCount, setDestCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/destinations/active")
      .then((r) => r.json())
      .then((d) => setDestCount((d.data ?? []).length))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
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

        .sp-page {
          min-height: 100vh;
          background: #f7f4ef;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .sp-bg-blob-1 {
          position: fixed;
          top: -100px; left: 50%;
          transform: translateX(-50%);
          width: 1100px; height: 650px;
          background: radial-gradient(ellipse, rgba(0,87,217,.06) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .sp-bg-blob-2 {
          position: fixed;
          bottom: 5%; right: -80px;
          width: 480px; height: 420px;
          background: radial-gradient(ellipse, rgba(0,87,217,.04) 0%, transparent 70%);
          animation: float-blob 9s ease-in-out infinite 2s;
          pointer-events: none; z-index: 0;
        }
        .sp-bg-grid {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
        }

        .sp-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px 64px;
          position: relative;
          z-index: 2;
        }

        .sp-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 880px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,87,217,0.12);
          animation: fade-up .55s ease both .05s;
        }

        /* LEFT — photo panel */
        .sp-left {
          position: relative;
          overflow: hidden;
          min-height: 580px;
        }
        .sp-left img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .sp-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(0,87,217,0.45) 0%, rgba(0,30,80,0.55) 100%);
        }
        .sp-left-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 32px;
        }
        .sp-left-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px; padding: 5px 14px;
          margin-bottom: 16px; width: fit-content;
        }
        .sp-left-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #fff;
          animation: blink-dot 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .sp-left-badge span {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #fff;
        }
        .sp-left-heading {
          font-size: clamp(1.4rem, 2.2vw, 1.9rem);
          font-weight: 800; color: #fff;
          line-height: 1.15; margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .sp-left-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.75);
          line-height: 1.65; margin-bottom: 20px;
        }
        .sp-left-perks {
          display: flex; flex-direction: column; gap: 8px;
        }
        .sp-left-perk {
          display: flex; align-items: center; gap: 10px;
        }
        .sp-left-perk-icon {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; flex-shrink: 0;
        }
        .sp-left-perk-text {
          font-size: 0.78rem; color: rgba(255,255,255,0.85);
          font-weight: 500; line-height: 1.4;
        }

        /* RIGHT — form panel */
        .sp-right {
          background: #ffffff;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 44px 40px;
        }
        .sp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: #e8f0fd; border: 1px solid #c5d9fb;
          border-radius: 999px; padding: 5px 14px;
          margin-bottom: 20px; width: fit-content;
        }
        .sp-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0057d9;
          animation: blink-dot 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .sp-eyebrow span {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #0057d9;
        }
        .sp-heading {
          font-size: clamp(1.4rem, 2vw, 1.75rem);
          font-weight: 800; color: #1a1f2e;
          letter-spacing: -0.02em; margin-bottom: 4px; line-height: 1.15;
        }
        .sp-sub {
          font-size: 0.88rem; color: #5a6478;
          margin-bottom: 24px; line-height: 1.6;
        }

        .sp-error {
          font-size: 0.82rem; color: #c0392b;
          background: #fdf0ef; border: 1px solid #f5c6c1;
          border-radius: 8px; padding: 10px 14px;
          margin-bottom: 16px; line-height: 1.5;
        }

        .sp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .sp-field { margin-bottom: 14px; }
        .sp-label {
          display: block; font-size: 0.75rem; font-weight: 700;
          color: #1a1f2e; margin-bottom: 6px; letter-spacing: 0.02em;
        }
        .sp-input {
          width: 100%;
          background: #f7f8fb; border: 1px solid #e2e6ef;
          border-radius: 10px; padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem; color: #1a1f2e; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .sp-input::placeholder { color: #b0bac8; }
        .sp-input:focus {
          border-color: #0057d9; background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,87,217,0.1);
        }

        .sp-agree {
          display: flex; align-items: flex-start; gap: 9px;
          font-size: 0.78rem; color: #5a6478;
          margin-bottom: 16px; line-height: 1.55;
        }
        .sp-agree input[type="checkbox"] {
          margin-top: 2px; flex-shrink: 0;
          accent-color: #0057d9;
        }
        .sp-agree a { color: #0057d9; text-decoration: none; font-weight: 600; }
        .sp-agree a:hover { color: #1a6aff; }

        .sp-btn {
          width: 100%; padding: 13px;
          background: #0057d9; border: none; border-radius: 12px;
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 0.97rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          animation: btn-pulse 3s ease-in-out infinite;
          transition: background 0.18s, opacity 0.18s;
        }
        .sp-btn:hover:not(:disabled) { background: #1a6aff; }
        .sp-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; }

        .sp-divider { border: none; border-top: 1px solid #e2e6ef; margin: 20px 0; }
        .sp-footer { text-align: center; font-size: 0.85rem; color: #5a6478; }
        .sp-footer a { color: #0057d9; font-weight: 700; text-decoration: none; }
        .sp-footer a:hover { color: #1a6aff; }

        @media (max-width: 660px) {
          .sp-left { display: none; }
          .sp-wrap { grid-template-columns: 1fr; max-width: 440px; }
          .sp-right { padding: 36px 28px; }
          .sp-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sp-page">
        <div className="sp-bg-blob-1" />
        <div className="sp-bg-blob-2" />
        <svg className="sp-bg-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="sgrid"
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
          <rect width="100%" height="100%" fill="url(#sgrid)" />
        </svg>

        <Navigation />

        <div className="sp-center">
          <div className="sp-wrap">
            {/* LEFT — photo */}
            <div className="sp-left">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80"
                alt="Traveler exploring a new destination"
              />
              <div className="sp-left-overlay" />
              <div className="sp-left-content">
                <div className="sp-left-badge">
                  <div className="sp-left-badge-dot" />
                  <span>Join YH eSIM</span>
                </div>
                <div className="sp-left-heading">
                  Your next adventure
                  <br />
                  starts here.
                </div>
                <div className="sp-left-sub">
                  Create your free account and get connected in {countLabel}{" "}
                  countries — no roaming fees, no plastic cards.
                </div>
                <div className="sp-left-perks">
                  {[
                    { icon: "⚡", text: "Activate in under 3 minutes" },
                    { icon: "🌍", text: `Coverage in ${countLabel} countries` },
                    { icon: "💰", text: "No hidden fees or surprises" },
                    { icon: "💬", text: "24/7 support wherever you are" },
                  ].map((p) => (
                    <div className="sp-left-perk" key={p.text}>
                      <div className="sp-left-perk-icon">{p.icon}</div>
                      <div className="sp-left-perk-text">{p.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="sp-right">
              <div className="sp-eyebrow">
                <div className="sp-eyebrow-dot" />
                <span>Create account</span>
              </div>
              <h1 className="sp-heading">Start traveling smarter</h1>
              <p className="sp-sub">Free to join. Ready in seconds.</p>

              <form onSubmit={handleSubmit}>
                {error && <div className="sp-error">⚠ {error}</div>}

                <div className="sp-row">
                  <div className="sp-field">
                    <label className="sp-label">Full name</label>
                    <input
                      className="sp-input"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Email address</label>
                    <input
                      className="sp-input"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="sp-row">
                  <div className="sp-field">
                    <label className="sp-label">Password</label>
                    <input
                      className="sp-input"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Confirm password</label>
                    <input
                      className="sp-input"
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="sp-agree">
                  <input type="checkbox" id="agree" required />
                  <label htmlFor="agree">
                    By creating an account you agree to our{" "}
                    <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="sp-btn" disabled={loading}>
                  {loading ? "Creating your account…" : "Create my account →"}
                </button>
              </form>

              <hr className="sp-divider" />
              <p className="sp-footer">
                Already have an account? <Link href="/auth/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
