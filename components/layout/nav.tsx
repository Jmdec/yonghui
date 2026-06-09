"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useState, useRef } from "react";

export function Navigation() {
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropOpen(false), 150);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = [
    { href: "/", label: "Home", icon: "ti-home" },
    { href: "/destinations", label: "Destinations", icon: "ti-world" },
    { href: "/what-is-esim", label: "What is eSIM", icon: "ti-cpu" },
    { href: "/about", label: "About", icon: "ti-users" },
    { href: "/contact", label: "Contact", icon: "ti-mail" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500&family=Space+Mono:wght@400;700&display=swap');

        .yh-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 100;
          height: 64px;
          background: rgba(5, 12, 26, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          background-image: repeating-linear-gradient(
            90deg,
            rgba(0,180,255,0.012) 0px,
            rgba(0,180,255,0.012) 1px,
            transparent 1px,
            transparent 80px
          );
        }

        .yh-nav::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%, #00B4FF 25%, #00FFB0 75%, transparent 100%
          );
          opacity: 0.55;
        }

        .yh-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .yh-logo-img {
          width: 40px; height: 40px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid rgba(0,180,255,0.3);
          box-shadow: 0 0 12px rgba(0,180,255,0.2);
          flex-shrink: 0;
        }

        .yh-logo-wordmark { display: flex; flex-direction: column; gap: 1px; }

        .yh-logo-top {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700; font-size: 16px;
          letter-spacing: 4px; color: #E8F4FF; line-height: 1;
        }

        .yh-logo-sub {
          font-family: 'Space Mono', monospace;
          font-size: 8.5px; letter-spacing: 1.5px;
          color: #00B4FF; opacity: 0.75; line-height: 1;
        }

        .yh-links {
          display: flex;
          align-items: center;
          gap: 2px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .yh-link {
          position: relative;
          display: flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 500; color: #6A8BAA;
          padding: 6px 12px; border-radius: 6px;
          text-decoration: none; cursor: pointer;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap; letter-spacing: 0.3px;
          font-family: 'Inter', sans-serif;
          background: transparent; border: none;
        }

        .yh-link i { font-size: 13px; }
        .yh-link:hover { color: #E8F4FF; }

        .yh-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 12px; right: 12px;
          height: 1px; background: #00B4FF;
          transform: scaleX(0);
          transition: transform 0.2s ease;
          transform-origin: center;
        }

        .yh-link:hover::after { transform: scaleX(1); }

        .yh-link.active {
          color: #00B4FF;
          background: rgba(0, 180, 255, 0.08);
        }

        .yh-link.active::before {
          content: '';
          position: absolute;
          top: 0; left: 12px; right: 12px;
          height: 1px;
          background: rgba(0, 180, 255, 0.35);
        }

        .yh-link.active::after {
          transform: scaleX(1);
        }

        .yh-active-dot {
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #00B4FF;
          box-shadow: 0 0 5px rgba(0, 180, 255, 0.8);
        }

        .yh-right {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }

        .yh-signal {
          display: flex; align-items: flex-end; gap: 2px;
          padding: 6px 10px;
          border: 1px solid rgba(0,255,176,0.2);
          border-radius: 6px;
          background: rgba(0,255,176,0.04);
        }

        .yh-signal-bar { width: 3px; border-radius: 1px; background: rgba(0,255,176,0.2); }
        .yh-signal-bar.on { background: #00FFB0; animation: signalpulse 2s ease-in-out infinite; }
        .yh-signal-bar:nth-child(1) { height: 6px;  animation-delay: 0s; }
        .yh-signal-bar:nth-child(2) { height: 10px; animation-delay: 0.15s; }
        .yh-signal-bar:nth-child(3) { height: 13px; animation-delay: 0.3s; }
        .yh-signal-bar:nth-child(4) { height: 16px; animation-delay: 0.45s; }

        @keyframes signalpulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .yh-signal-label {
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: #00FFB0;
          letter-spacing: 1px; margin-left: 5px; line-height: 1;
        }

        .yh-dropdown-wrap { position: relative; }

        .yh-btn-account {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px;
          background: transparent;
          border: 1px solid rgba(0,180,255,0.25);
          border-radius: 6px;
          color: #A8C4E0;
          font-size: 12.5px; font-weight: 500;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .yh-btn-account:hover { border-color: #00B4FF; color: #E8F4FF; }

        .yh-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 224px;
          padding: 18px 8px 8px;
          background: #070F20;
          border: 1px solid rgba(0,180,255,0.18);
          border-radius: 10px;
          z-index: 200;
          box-shadow: 0 16px 40px rgba(0,0,0,0.7);
          animation: dropfade 0.15s ease;
        }

        @keyframes dropfade {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .yh-drop-user {
          display: flex; align-items: center; gap: 10px;
          padding: 0 10px 12px;
        }

        .yh-drop-avatar {
          width: 34px; height: 34px;
          border-radius: 7px;
          background: linear-gradient(135deg, #0050CC, #00B4FF);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700; font-size: 14px; color: #fff;
          flex-shrink: 0;
        }

        .yh-drop-name {
          font-size: 13px; font-weight: 500; color: #E8F4FF;
          font-family: 'Inter', sans-serif; line-height: 1.3;
        }

        .yh-drop-email {
          font-size: 10px; color: #4A6A8A;
          font-family: 'Space Mono', monospace;
          margin-top: 2px; word-break: break-all; line-height: 1.4;
        }

        .yh-drop-divider {
          height: 1px; background: rgba(0,180,255,0.1); margin: 4px 0;
        }

        .yh-drop-item {
          display: flex; align-items: center; gap: 9px;
          width: 100%; padding: 9px 10px; border-radius: 6px;
          font-size: 13px; color: #7A9CC0;
          font-family: 'Inter', sans-serif; font-weight: 500;
          text-decoration: none;
          background: transparent; border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: left; box-sizing: border-box;
        }

        .yh-drop-item i { font-size: 14px; }
        .yh-drop-item:hover { background: rgba(0,180,255,0.08); color: #E8F4FF; }
        .yh-drop-logout { color: #4A6A8A; }
        .yh-drop-logout:hover { background: rgba(255,80,80,0.08); color: #ff6060; }

        .yh-btn-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px;
          background: transparent;
          border: 1px solid #00B4FF;
          border-radius: 6px;
          color: #00B4FF;
          font-size: 12.5px; font-weight: 500;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          overflow: hidden;
          transition: color 0.25s;
          white-space: nowrap;
        }

        .yh-btn-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: #00B4FF;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }

        .yh-btn-cta:hover { color: #050C1A; }
        .yh-btn-cta:hover::before { transform: translateX(0); }
        .yh-btn-cta span, .yh-btn-cta i { position: relative; z-index: 1; }

        .yh-btn-login {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          background: transparent;
          border: 1px solid rgba(0,180,255,0.25);
          border-radius: 6px;
          color: #6A8BAA;
          font-size: 12.5px; font-weight: 500;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .yh-btn-login:hover { border-color: #00B4FF; color: #00B4FF; }

        .yh-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 13px;
          background: transparent;
          border: 1px solid rgba(0,180,255,0.15);
          border-radius: 6px;
          color: #6A8BAA;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .yh-btn-ghost:hover { border-color: rgba(0,180,255,0.4); color: #E8F4FF; }

        .yh-btn-logout {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 13px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: #4A6A8A;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }

        .yh-btn-logout:hover { border-color: rgba(255,80,80,0.4); color: #ff6060; }

        .yh-hamburger {
          display: none;
          align-items: center; justify-content: center;
          background: transparent;
          border: 1px solid rgba(0,180,255,0.2);
          color: #6A8BAA;
          border-radius: 6px;
          padding: 7px 9px;
          cursor: pointer;
          font-size: 18px; line-height: 1;
          transition: border-color 0.2s, color 0.2s;
        }

        .yh-hamburger:hover { border-color: #00B4FF; color: #00B4FF; }

        .yh-drawer {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: rgba(5,12,26,0.99);
          border-bottom: 1px solid rgba(0,180,255,0.15);
          padding: 20px 24px 28px;
          z-index: 99;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .yh-drawer.open { display: block; }

        .yh-drawer-links {
          display: flex; flex-direction: column; gap: 2px;
          margin-bottom: 20px;
        }

        .yh-drawer-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 7px;
          font-size: 14px; font-weight: 500; color: #6A8BAA;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          border: 1px solid transparent;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }

        .yh-drawer-link:hover {
          color: #00B4FF;
          background: rgba(0,180,255,0.06);
          border-color: rgba(0,180,255,0.15);
        }

        .yh-drawer-link.active {
          color: #00B4FF;
          background: rgba(0, 180, 255, 0.08);
          border-color: rgba(0, 180, 255, 0.25);
        }

        .yh-drawer-user {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px;
          border: 1px solid rgba(0,180,255,0.15);
          border-radius: 8px;
          background: rgba(0,180,255,0.04);
          margin-bottom: 12px;
        }

        .yh-drawer-avatar {
          width: 34px; height: 34px;
          border-radius: 7px;
          background: linear-gradient(135deg, #0050CC, #00B4FF);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700; font-size: 14px; color: #fff;
          flex-shrink: 0;
        }

        .yh-drawer-user-name {
          font-size: 13px; font-weight: 500; color: #E8F4FF;
          font-family: 'Inter', sans-serif;
        }

        .yh-drawer-user-email {
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: #4A6A8A;
          letter-spacing: 0.5px; margin-top: 2px;
        }

        .yh-drawer-actions {
          display: flex; gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(0,180,255,0.1);
          flex-wrap: wrap;
        }

        .yh-drawer-actions .yh-btn-cta,
        .yh-drawer-actions .yh-btn-login { flex: 1; justify-content: center; }

        @media (max-width: 900px) {
          .yh-links     { display: none; }
          .yh-right     { display: none; }
          .yh-hamburger { display: flex; }
        }
      `}</style>

      <nav className="yh-nav">
        {/* Logo */}
        <Link href="/" className="yh-logo">
          <img src="/logo.jpg" alt="YH" className="yh-logo-img" />
          <div className="yh-logo-wordmark">
            <div className="yh-logo-top">YH ESIM</div>
            <div className="yh-logo-sub">GLOBAL NETWORK</div>
          </div>
        </Link>

        {/* Desktop centre links */}
        <div className="yh-links">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`yh-link${isActive(href) ? " active" : ""}`}
            >
              <i className={`ti ${icon}`} aria-hidden="true" />
              {label}
              {isActive(href) && <span className="yh-active-dot" />}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="yh-right">
          <div className="yh-signal" aria-label="Network live">
            <div className="yh-signal-bar on" />
            <div className="yh-signal-bar on" />
            <div className="yh-signal-bar on" />
            <div className="yh-signal-bar on" />
            <span className="yh-signal-label">LIVE</span>
          </div>

          {loading ? null : isAuthenticated ? (
            <div
              className="yh-dropdown-wrap"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="yh-btn-account"
                onClick={() => setDropOpen((o) => !o)}
              >
                <i className="ti ti-user" aria-hidden="true" />
                <span>My Account</span>
                <i
                  className={`ti ${dropOpen ? "ti-chevron-up" : "ti-chevron-down"}`}
                  style={{ fontSize: 11 }}
                  aria-hidden="true"
                />
              </button>

              {dropOpen && (
                <div className="yh-dropdown">
                  <div className="yh-drop-user">
                    <div className="yh-drop-avatar">
                      {user!.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="yh-drop-name">{user!.name}</div>
                      <div className="yh-drop-email">{user!.email}</div>
                    </div>
                  </div>

                  <div className="yh-drop-divider" />

                  <div className="yh-drop-divider" />

                  <button
                    className="yh-drop-item yh-drop-logout"
                    onClick={() => {
                      logout();
                      setDropOpen(false);
                    }}
                  >
                    <i className="ti ti-logout" aria-hidden="true" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="yh-btn-login">
                Log in
              </Link>
              <Link href="/destinations" className="yh-btn-cta">
                <i className="ti ti-sim-card" aria-hidden="true" />
                <span>Get eSIM</span>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="yh-hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <i
            className={`ti ${isOpen ? "ti-x" : "ti-menu-2"}`}
            aria-hidden="true"
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`yh-drawer ${isOpen ? "open" : ""}`}>
        <div className="yh-drawer-links">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`yh-drawer-link${isActive(href) ? " active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <i className={`ti ${icon}`} aria-hidden="true" /> {label}
            </Link>
          ))}
        </div>

        {loading ? null : isAuthenticated ? (
          <>
            <div className="yh-drawer-user">
              <div className="yh-drawer-avatar">
                {user!.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="yh-drawer-user-name">{user!.name}</div>
                <div className="yh-drawer-user-email">{user!.email}</div>
              </div>
            </div>

            <div className="yh-drawer-actions">
              <button
                className="yh-btn-logout"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                <i className="ti ti-logout" aria-hidden="true" /> Log out
              </button>
            </div>
          </>
        ) : (
          <div className="yh-drawer-actions">
            <Link
              href="/auth/login"
              className="yh-btn-login"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/destinations"
              className="yh-btn-cta"
              onClick={() => setIsOpen(false)}
            >
              <i className="ti ti-sim-card" aria-hidden="true" />
              <span>Get eSIM</span>
            </Link>
          </div>
        )}
      </div>

      {/* Spacer so page content clears the fixed nav */}
      <div style={{ height: 64 }} aria-hidden="true" />
    </>
  );
}
