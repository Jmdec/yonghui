"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { icon: "▦", label: "Dashboard", href: "/admin/dashboard" },
      // { icon: "↗", label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: "⊕", label: "Destinations", href: "/admin/destination" },
      { icon: "≡", label: "Inventory", href: "/admin/inventory" },
      { icon: "◫", label: "Orders", href: "/admin/orders" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: "✉", label: "Inquiries", href: "/admin/contact" },
      // { icon: "⊙", label: "Users", href: "/admin/users" },
      // { icon: "⚙", label: "Settings", href: "/admin/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        .sb-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          font-family: 'Inter', sans-serif;
          transition: all 0.14s ease;
          border: 1px solid transparent;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
        }
        .sb-item:hover {
          color: #0F172A;
          background: #F1F5F9;
          border-color: #E2E8F0;
        }
        .sb-item.active {
          color: #2563EB;
          background: #EFF6FF;
          border-color: #BFDBFE;
          font-weight: 600;
        }
        .sb-item.active .sb-icon {
          color: #2563EB;
        }
        .sb-collapse:hover {
          background: #F1F5F9 !important;
          border-color: #CBD5E1 !important;
          color: #0F172A !important;
        }
        .sb-logout:hover {
          background: #FFF1F2 !important;
          border-color: #FECDD3 !important;
          color: #E11D48 !important;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <aside
        style={{
          width: collapsed ? 58 : 220,
          minHeight: "100vh",
          background: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* ── Logo ── */}
        <div
          style={{
            padding: collapsed ? "18px 0" : "18px 16px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10,
            minHeight: 64,
          }}
        >
          {/* Signal icon */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              flexShrink: 0,
              background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 1px 6px rgba(37,99,235,0.25)",
            }}
          >
            eSIM
          </div>

          {!collapsed && (
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0F172A",
                  lineHeight: 1.2,
                }}
              >
                HY
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "#94A3B8",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginTop: 1,
                }}
              >
                Admin Panel
              </div>
            </div>
          )}
        </div>

        {/* ── Status pill ── */}
        {!collapsed && (
          <div style={{ padding: "10px 14px 0" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 20,
                padding: "4px 10px",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#22C55E",
                  flexShrink: 0,
                  animation: "blink 2.5s infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "#16A34A",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Network Active
              </span>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav
          style={{
            flex: 1,
            padding: collapsed ? "14px 6px" : "14px 10px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 18 }}>
              {!collapsed ? (
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8,
                    color: "#CBD5E1",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    padding: "0 10px",
                    marginBottom: 4,
                  }}
                >
                  {group.label}
                </div>
              ) : (
                <div
                  style={{
                    height: 1,
                    background: "#F1F5F9",
                    margin: "4px 6px 8px",
                  }}
                />
              )}

              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sb-item${isActive(item.href) ? " active" : ""}`}
                  title={collapsed ? item.label : undefined}
                  style={{
                    justifyContent: collapsed ? "center" : "flex-start",
                    marginBottom: 1,
                  }}
                >
                  <span
                    className="sb-icon"
                    style={{
                      fontSize: 14,
                      flexShrink: 0,
                      lineHeight: 1,
                      fontFamily: "monospace",
                      color: isActive(item.href) ? "#2563EB" : "#94A3B8",
                      minWidth: 16,
                      textAlign: "center",
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}

                  {/* Active dot when collapsed */}
                  {collapsed && isActive(item.href) && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 6,
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "#2563EB",
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Bottom ── */}
        <div
          style={{
            borderTop: "1px solid #F1F5F9",
            padding: collapsed ? "10px 6px" : "10px",
          }}
        >
          {/* User row */}
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 10px",
                borderRadius: 7,
                marginBottom: 6,
                background: "#F8FAFC",
                border: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#0F172A",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {user?.name ?? "Admin"}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8,
                    color: "#94A3B8",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {user?.role ?? "admin"}
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          {!collapsed && (
            <button
              className="sb-logout"
              onClick={() => logout()}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 6,
                border: "1px solid #FEE2E2",
                background: "transparent",
                color: "#F87171",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 6,
                transition: "all 0.14s",
              }}
            >
              <span style={{ fontSize: 11 }}>⎋</span>
              Sign out
            </button>
          )}

          {/* Collapse toggle */}
          <button
            className="sb-collapse"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: "100%",
              padding: "7px 0",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              background: "transparent",
              color: "#94A3B8",
              cursor: "pointer",
              fontSize: 11,
              transition: "all 0.14s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.5px",
            }}
          >
            <span
              style={{
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
                display: "inline-block",
                fontSize: 10,
              }}
            >
              ◀
            </span>
            {!collapsed && (
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Collapse
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
