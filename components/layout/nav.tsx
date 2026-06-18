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
    { href: "/", label: "Home" },
    { href: "/product", label: "Devices" },
    { href: "/destinations", label: "eSIM" },
    { href: "/what-is-esim", label: "What is eSIM" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .yh-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 64px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e6ef;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        .yh-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .yh-logo-img {
          width: 36px; height: 36px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #e2e6ef;
          flex-shrink: 0;
        }

        .yh-logo-name {
          font-weight: 800;
          font-size: 15px;
          color: #1a1f2e;
          letter-spacing: -0.02em;
        }

        .yh-logo-name span { color: #0057d9; }

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
          display: flex; align-items: center;
          font-size: 14px;
          font-weight: 500;
          color: #5a6478;
          padding: 6px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }

        .yh-link:hover {
          color: #1a1f2e;
          background: #f7f8fc;
        }

        .yh-link.active {
          color: #0057d9;
          font-weight: 600;
        }

        .yh-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 14px; right: 14px;
          height: 2px;
          border-radius: 999px;
          background: #0057d9;
        }

        .yh-right {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }

        .yh-dropdown-wrap { position: relative; }

        .yh-btn-account {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px;
          background: #ffffff;
          border: 1px solid #e2e6ef;
          border-radius: 10px;
          color: #1a1f2e;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }

        .yh-btn-account:hover {
          border-color: #c5d9fb;
          box-shadow: 0 2px 8px rgba(0,87,217,0.08);
        }

        .yh-btn-account .avatar {
          width: 24px; height: 24px;
          border-radius: 6px;
          background: #e8f0fd;
          color: #0057d9;
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .yh-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: #ffffff;
          border: 1px solid #e2e6ef;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          z-index: 200;
          overflow: hidden;
        }

        .yh-drop-user {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 16px 14px;
          border-bottom: 1px solid #f0f2f7;
        }

        .yh-drop-avatar {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #e8f0fd;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 15px;
          color: #0057d9;
          flex-shrink: 0;
        }

        .yh-drop-name {
          font-size: 13.5px; font-weight: 700; color: #1a1f2e;
          font-family: 'DM Sans', sans-serif;
        }

        .yh-drop-email {
          font-size: 11.5px; color: #9aa3b2;
          font-family: 'DM Sans', sans-serif;
          margin-top: 1px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .yh-drop-divider {
          height: 1px; background: #f0f2f7; margin: 4px 8px;
        }

        .yh-drop-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 8px;
          margin: 2px 8px; width: calc(100% - 16px);
          font-size: 13.5px; color: #5a6478;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          text-decoration: none;
          background: transparent; border: none;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          text-align: left; box-sizing: border-box;
        }

        .yh-drop-item:hover { background: #f7f8fc; color: #1a1f2e; }

        .yh-drop-logout { color: #9aa3b2; }
        .yh-drop-logout:hover { background: #fff5f5; color: #e03030; }

        .yh-btn-login {
          display: inline-flex; align-items: center;
          padding: 8px 18px;
          background: transparent;
          border: 1px solid #e2e6ef;
          border-radius: 10px;
          color: #5a6478;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }

        .yh-btn-login:hover { border-color: #c5d9fb; color: #0057d9; }

        .yh-btn-cta {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 18px;
          background: #0057d9;
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-size: 13.5px; font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          transition: background 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }

        .yh-btn-cta:hover {
          background: #0044bb;
          box-shadow: 0 4px 16px rgba(0,87,217,0.25);
        }

        .yh-hamburger {
          display: none;
          align-items: center; justify-content: center;
          background: transparent;
          border: 1px solid #e2e6ef;
          color: #5a6478;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          font-size: 18px; line-height: 1;
          transition: border-color 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .yh-hamburger:hover { border-color: #c5d9fb; color: #0057d9; }

        .yh-drawer {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: #ffffff;
          border-bottom: 1px solid #e2e6ef;
          padding: 16px 5% 24px;
          z-index: 99;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .yh-drawer.open { display: block; }

        .yh-drawer-links {
          display: flex; flex-direction: column; gap: 2px;
          margin-bottom: 16px;
        }

        .yh-drawer-link {
          display: flex; align-items: center;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14.5px; font-weight: 500; color: #5a6478;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s, background 0.15s;
        }

        .yh-drawer-link:hover { color: #1a1f2e; background: #f7f8fc; }

        .yh-drawer-link.active {
          color: #0057d9;
          background: #e8f0fd;
          font-weight: 700;
        }

        .yh-drawer-divider {
          height: 1px; background: #f0f2f7; margin: 12px 0;
        }

        .yh-drawer-user {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          border: 1px solid #e2e6ef;
          border-radius: 12px;
          background: #fafbfd;
          margin-bottom: 12px;
        }

        .yh-drawer-avatar {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: #e8f0fd;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 15px;
          color: #0057d9;
          flex-shrink: 0;
        }

        .yh-drawer-user-name {
          font-size: 13.5px; font-weight: 700; color: #1a1f2e;
          font-family: 'DM Sans', sans-serif;
        }

        .yh-drawer-user-email {
          font-size: 11.5px; color: #9aa3b2;
          font-family: 'DM Sans', sans-serif; margin-top: 1px;
        }

        .yh-drawer-actions {
          display: flex; gap: 8px; flex-wrap: wrap;
        }

        .yh-drawer-actions .yh-btn-cta,
        .yh-drawer-actions .yh-btn-login { flex: 1; justify-content: center; }

        .yh-btn-logout-sm {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px;
          background: transparent;
          border: 1px solid #f0f2f7;
          border-radius: 10px;
          color: #9aa3b2;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s;
          width: 100%;
          justify-content: center;
        }

        .yh-btn-logout-sm:hover { border-color: #fecaca; color: #e03030; }

        @media (max-width: 900px) {
          .yh-links     { display: none; }
          .yh-right     { display: none; }
          .yh-hamburger { display: flex; }
        }
      `}</style>

      <nav className="yh-nav">
        {/* Logo */}
        <Link href="/" className="yh-logo">
          <img src="/logo.jpg" alt="YH eSIM" className="yh-logo-img" />
          <div className="yh-logo-name">
            YH <span>eSIM</span>
          </div>
        </Link>

        {/* Desktop centre links */}
        <div className="yh-links">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`yh-link${isActive(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="yh-right">
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
                <div className="avatar">
                  {user!.name.charAt(0).toUpperCase()}
                </div>
                <span>{user!.name.split(" ")[0]}</span>
                <i
                  className={`ti ${dropOpen ? "ti-chevron-up" : "ti-chevron-down"}`}
                  style={{ fontSize: 12, color: "#9aa3b2" }}
                  aria-hidden="true"
                />
              </button>

              {dropOpen && (
                <div className="yh-dropdown">
                  <div className="yh-drop-user">
                    <div className="yh-drop-avatar">
                      {user!.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="yh-drop-name">{user!.name}</div>
                      <div className="yh-drop-email">{user!.email}</div>
                    </div>
                  </div>

                  <div style={{ padding: "6px 0" }}>
                    <button
                      className="yh-drop-item yh-drop-logout"
                      onClick={() => {
                        logout();
                        setDropOpen(false);
                      }}
                    >
                      <i className="ti ti-logout" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="yh-btn-login">
                Log in
              </Link>
              <Link href="/destinations" className="yh-btn-cta">
                Get eSIM →
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
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`yh-drawer-link${isActive(href) ? " active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="yh-drawer-divider" />

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
            <button
              className="yh-btn-logout-sm"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              <i className="ti ti-logout" aria-hidden="true" />
              Log out
            </button>
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
              Get eSIM →
            </Link>
          </div>
        )}
      </div>

      <div style={{ height: 64 }} aria-hidden="true" />
    </>
  );
}
