"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";

function ChipVisual() {
  return (
    <div
      style={{ position: "relative", width: 120, height: 88, marginBottom: 24 }}
    >
      <div
        style={{
          width: 120,
          height: 88,
          background:
            "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #bfdbfe 100%)",
          borderRadius: 10,
          border: "1px solid rgba(13,110,253,0.35)",
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 12px rgba(13,110,253,0.12)",
        }}
      >
        {[20, 44, 68].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              height: 1,
              left: 8,
              right: 8,
              top,
              background: "rgba(13,110,253,0.2)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: 1,
            top: 8,
            bottom: 8,
            left: 28,
            background: "rgba(13,110,253,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 1,
            top: 8,
            bottom: 8,
            right: 28,
            background: "rgba(13,110,253,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 40,
            height: 30,
            background: "linear-gradient(135deg,#93c5fd,#bfdbfe)",
            borderRadius: 4,
            border: "1px solid rgba(13,110,253,0.4)",
          }}
        />
      </div>
    </div>
  );
}

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Share+Tech+Mono&display=swap');
        :root {
          --blue: #0D6EFD; --blue-mid: #1d6fd8; --text-head: #0a2540;
          --text-muted: #4a6a8a; --text-faint: #93b8d8;
          --mono: 'Share Tech Mono', monospace; --display: 'Exo 2', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page { min-height: 100vh; background: linear-gradient(160deg, #dbeafe 0%, #e0f2fe 55%, #f0f9ff 100%); display: flex; flex-direction: column; font-family: var(--mono); }
        .auth-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .auth-card { display: flex; width: 100%; max-width: 820px; min-height: 580px; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 40px rgba(13,110,253,0.1); }

        .auth-left { width: 40%; flex-shrink: 0; background: linear-gradient(160deg, #bfdbfe 0%, #dbeafe 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; position: relative; overflow: hidden; border-right: 1px solid rgba(14,99,214,0.15); }
        .auth-left-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(14,99,214,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(14,99,214,0.07) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; }
        .pulse-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); border-radius: 50%; border: 1px solid rgba(13,110,253,0.22); animation: chipPulse 2.6s ease-out infinite; pointer-events: none; }
        .pulse-ring:nth-child(2) { animation-delay: 0.87s; }
        .pulse-ring:nth-child(3) { animation-delay: 1.74s; }
        @keyframes chipPulse { 0% { width: 80px; height: 80px; opacity: 0.7; } 100% { width: 220px; height: 220px; opacity: 0; } }
        .data-line { position: absolute; top: 52%; left: 0; right: 0; height: 1px; background: rgba(13,110,253,0.1); overflow: visible; pointer-events: none; }
        .data-dot { position: absolute; top: -2px; width: 4px; height: 4px; border-radius: 50%; background: #1d6fd8; animation: dataTrav 2.4s linear infinite; }
        .data-dot:nth-child(2) { animation-delay: 0.8s; background: #3b82f6; }
        .data-dot:nth-child(3) { animation-delay: 1.6s; background: #60a5fa; }
        @keyframes dataTrav { from { left: -4px; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } to { left: 100%; opacity: 0; } }
        .signal-arc { position: absolute; right: 28px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 5px; align-items: center; }
        .arc { border: 2px solid transparent; border-right-color: rgba(13,110,253,0.45); border-top-color: rgba(13,110,253,0.45); border-radius: 50%; animation: arcPulse 1.8s ease-in-out infinite; }
        .arc-1 { width: 14px; height: 14px; }
        .arc-2 { width: 24px; height: 24px; animation-delay: 0.2s; }
        .arc-3 { width: 34px; height: 34px; animation-delay: 0.4s; }
        @keyframes arcPulse { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .auth-left-label { font-size: 9px; letter-spacing: 3px; color: var(--blue-mid); margin-bottom: 6px; position: relative; z-index: 1; }
        .auth-left-title { font-family: var(--display); font-size: 24px; font-weight: 900; color: var(--text-head); letter-spacing: -0.5px; line-height: 1; text-align: center; margin-bottom: 4px; position: relative; z-index: 1; }
        .auth-left-title span { color: var(--blue); }
        .auth-left-sub { font-size: 9px; color: var(--text-muted); letter-spacing: 1.5px; text-align: center; margin-bottom: 22px; position: relative; z-index: 1; }
        .chip-stats { display: flex; gap: 10px; margin-top: 6px; position: relative; z-index: 1; }
        .chip-stat { text-align: center; border: 1px solid rgba(13,110,253,0.18); border-radius: 6px; padding: 8px 10px; background: rgba(255,255,255,0.5); }
        .chip-stat-val { font-family: var(--display); font-size: 13px; font-weight: 700; color: var(--blue); }
        .chip-stat-label { font-size: 8px; color: var(--text-muted); letter-spacing: 1px; }

        .auth-right { flex: 1; background: rgba(255,255,255,0.75); backdrop-filter: blur(12px); display: flex; flex-direction: column; justify-content: center; padding: 36px 32px; position: relative; }
        .auth-scanbar { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--blue), transparent); animation: scanbar 3s ease-in-out infinite; opacity: 0.4; }
        @keyframes scanbar { 0%,100% { transform: translateX(-100%); } 50% { transform: translateX(100%); } }
        .auth-status { position: absolute; top: 10px; right: 14px; display: flex; align-items: center; gap: 5px; font-size: 8px; letter-spacing: 1px; color: var(--text-muted); }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: statusBlink 2s ease-in-out infinite; }
        @keyframes statusBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .auth-eyebrow { font-size: 8px; letter-spacing: 3px; color: var(--blue-mid); display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .eyebrow-line { width: 20px; height: 1px; background: rgba(13,110,253,0.3); }
        .auth-heading { font-family: var(--display); font-size: 22px; font-weight: 900; color: var(--text-head); letter-spacing: -0.3px; margin-bottom: 2px; }
        .auth-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 18px; }
        .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .auth-field { margin-bottom: 13px; }
        .auth-label { display: block; font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.85); border: 1px solid rgba(13,110,253,0.2); border-radius: 5px; padding: 10px 12px; font-family: var(--mono); font-size: 11px; color: var(--text-head); outline: none; transition: border-color 0.18s, box-shadow 0.18s; }
        .auth-input::placeholder { color: var(--text-faint); }
        .auth-input:focus { border-color: rgba(13,110,253,0.5); box-shadow: 0 0 0 3px rgba(13,110,253,0.1); }
        .auth-error { font-size: 10px; color: #dc2626; background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.2); border-radius: 5px; padding: 8px 12px; margin-bottom: 12px; letter-spacing: 0.3px; }
        .auth-agree { display: flex; align-items: flex-start; gap: 8px; font-size: 9px; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 14px; line-height: 1.5; }
        .auth-agree a { color: var(--blue); text-decoration: none; }
        .auth-agree input[type="checkbox"] { margin-top: 2px; flex-shrink: 0; }
        .auth-btn { width: 100%; padding: 11px; background: var(--blue); border: none; border-radius: 5px; color: #fff; font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.18s, opacity 0.18s; }
        .auth-btn:hover:not(:disabled) { background: #1a7aff; }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-divider { border: none; border-top: 1px solid rgba(13,110,253,0.12); margin: 16px 0; }
        .auth-footer-text { text-align: center; font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px; }
        .auth-footer-link { color: var(--blue); text-decoration: none; font-weight: 600; }
        .auth-footer-link:hover { color: #1a7aff; }
        @media (max-width: 640px) { .auth-left { display: none; } .auth-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="auth-page">
        <Navigation />
        <div className="auth-center">
          <div className="auth-card">
            <div className="auth-left">
              <div className="auth-left-grid" />
              <div className="pulse-ring" />
              <div className="pulse-ring" />
              <div className="pulse-ring" />
              <div className="data-line">
                <div className="data-dot" />
                <div className="data-dot" />
                <div className="data-dot" />
              </div>
              <div className="signal-arc">
                <div className="arc arc-3" />
                <div className="arc arc-2" />
                <div className="arc arc-1" />
              </div>
              <div className="auth-left-label">eSIM TECHNOLOGY</div>
              <div className="auth-left-title">
                YONG<span>HUI</span>
              </div>
              <div className="auth-left-sub">GLOBAL CONNECTIVITY</div>
              <ChipVisual />
              <div className="chip-stats">
                <div className="chip-stat">
                  <div className="chip-stat-val">190+</div>
                  <div className="chip-stat-label">COUNTRIES</div>
                </div>
                <div className="chip-stat">
                  <div className="chip-stat-val">5G</div>
                  <div className="chip-stat-label">SPEED</div>
                </div>
                <div className="chip-stat">
                  <div className="chip-stat-val">0s</div>
                  <div className="chip-stat-label">SETUP</div>
                </div>
              </div>
            </div>

            <div className="auth-right">
              <div className="auth-scanbar" />
              <div className="auth-status">
                <span className="status-dot" /> SECURE CONNECTION
              </div>
              <div className="auth-eyebrow">
                <span className="eyebrow-line" /> NEW ACCOUNT
              </div>
              <h1 className="auth-heading">Get started</h1>
              <p className="auth-sub">Create your YH account in seconds</p>

              {error && <div className="auth-error">⚠ {error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label">Full name</label>
                    <input
                      className="auth-input"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Email address</label>
                    <input
                      className="auth-input"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <input
                      className="auth-input"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Confirm password</label>
                    <input
                      className="auth-input"
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="auth-agree">
                  <input type="checkbox" id="agree" required />
                  <label htmlFor="agree">
                    By signing up you agree to our{" "}
                    <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}{" "}
                  {!loading && <span>→</span>}
                </button>
              </form>

              <hr className="auth-divider" />
              <p className="auth-footer-text">
                Already have an account?{" "}
                <Link href="/auth/login" className="auth-footer-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
