"use client";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Order {
  id: number;
  reference?: string;
  user?: { name: string; email: string };
  plan?: { name: string; data_label?: string };
  plan_name?: string;
  payment_method?: string;
  payment_status: string;
  amount?: number | string;
  created_at: string;
}

interface Stats {
  total_orders: number;
  completed_orders: number;
  pending_review: number;
  total_revenue: number;
  orders_today: number;
  new_users_today: number;
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ orderDates }: { orderDates: string[] }) {
  const [current, setCurrent] = useState(new Date());
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const activeDays = new Set(
    orderDates
      .map((d) => new Date(d))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate()),
  );

  const monthName = current.toLocaleString("en", {
    month: "long",
    year: "numeric",
  });
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          style={{
            border: "1px solid #E2E8F0",
            background: "#F8FAFC",
            borderRadius: 6,
            width: 28,
            height: 28,
            cursor: "pointer",
            fontSize: 12,
            color: "#64748B",
          }}
        >
          ‹
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
          {monthName}
        </span>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          style={{
            border: "1px solid #E2E8F0",
            background: "#F8FAFC",
            borderRadius: 6,
            width: 28,
            height: 28,
            cursor: "pointer",
            fontSize: 12,
            color: "#64748B",
          }}
        >
          ›
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          marginBottom: 6,
        }}
      >
        {days.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
              color: "#94A3B8",
              padding: "2px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
        }}
      >
        {cells.map((day, i) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasOrder = day !== null && activeDays.has(day);
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "5px 0",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: isToday ? 700 : 400,
                color: isToday
                  ? "#FFFFFF"
                  : day === null
                    ? "transparent"
                    : hasOrder
                      ? "#2563EB"
                      : "#475569",
                background: isToday
                  ? "#2563EB"
                  : hasOrder
                    ? "#EFF6FF"
                    : "transparent",
                border:
                  hasOrder && !isToday
                    ? "1px solid #BFDBFE"
                    : "1px solid transparent",
                cursor: day ? "default" : "default",
              }}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
          }}
        />
        <span style={{ fontSize: 10, color: "#94A3B8" }}>Day with orders</span>
      </div>
    </div>
  );
}

// ── Status Pill ───────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  completed: { label: "Completed", bg: "#F0FDF4", color: "#16A34A" },
  pending_review: { label: "Under Review", bg: "#EEF2FF", color: "#4F46E5" },
  pending_receipt: {
    label: "Awaiting Receipt",
    bg: "#FFF7ED",
    color: "#EA580C",
  },
  confirmed: { label: "Confirmed", bg: "#F0FDF4", color: "#16A34A" },
  failed: { label: "Failed", bg: "#FEF2F2", color: "#DC2626" },
  pending: { label: "Pending", bg: "#FEFCE8", color: "#CA8A04" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS[status] ?? {
    label: status,
    bg: "#F1F5F9",
    color: "#64748B",
  };
  return (
    <span
      style={{
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#94A3B8",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: accent + "15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#0F172A",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11,
              color: "#94A3B8",
              marginTop: 4,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.data ?? data ?? []);
    } catch {
      /* silent */
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin"))
      router.replace("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user, fetchOrders]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: "#94A3B8",
          }}
        >
          loading…
        </div>
      </div>
    );
  }
  if (!user || user.role !== "admin") return null;

  // ── Derived stats ──────────────────────────────────────────────────────────
  const today = new Date().toDateString();
  const stats: Stats = {
    total_orders: orders.length,
    completed_orders: orders.filter(
      (o) =>
        // o.payment_status === "completed" ||
        // o.payment_status === "confirmed" ||
        o.payment_status === "paid",
    ).length,
    pending_review: orders.filter((o) => o.payment_status === "pending_review")
      .length,
    total_revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + parseFloat(String(o.amount ?? 0)), 0),
    orders_today: orders.filter(
      (o) => new Date(o.created_at).toDateString() === today,
    ).length,
    new_users_today: 0,
  };

  // ── Orders by day (last 7 days) ────────────────────────────────────────────
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en", { weekday: "short" });
    const dateStr = d.toDateString();
    const count = orders.filter(
      (o) => new Date(o.created_at).toDateString() === dateStr,
    ).length;
    return { label, count };
  });

  // ── Orders by status ───────────────────────────────────────────────────────
  const statusBreakdown = Object.entries(
    orders.reduce(
      (acc, o) => {
        acc[o.payment_status] = (acc[o.payment_status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([status, count]) => ({
    label: STATUS[status]?.label ?? status,
    count,
  }));

  const orderDates = orders.map((o) => o.created_at);
  const recent = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 6);

  const MONO = "'IBM Plex Mono', monospace";
  const SANS = "'Inter', sans-serif";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
        .dash-section { display: grid; gap: 20px; }
        .recharts-tooltip-wrapper { font-family: 'Inter', sans-serif !important; }
      `}</style>

      <div style={{ fontFamily: SANS, maxWidth: 1200 }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              color: "#94A3B8",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            — admin / dashboard
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
                ? "afternoon"
                : "evening"}
            , {user.name.split(" ")[0]} 👋
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "#94A3B8",
              fontFamily: MONO,
            }}
          >
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* ── KPI Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <KpiCard
            label="Total Orders"
            value={ordersLoading ? "—" : stats.total_orders}
            icon="📦"
            accent="#2563EB"
            sub="all time"
          />
          <KpiCard
            label="Completed"
            value={ordersLoading ? "—" : stats.completed_orders}
            icon="✅"
            accent="#16A34A"
            sub="paid & delivered"
          />
          <KpiCard
            label="Pending Review"
            value={ordersLoading ? "—" : stats.pending_review}
            icon="🔍"
            accent="#F59E0B"
            sub="needs action"
          />
          <KpiCard
            label="Orders Today"
            value={ordersLoading ? "—" : stats.orders_today}
            icon="📅"
            accent="#8B5CF6"
            sub="since midnight"
          />
          <KpiCard
            label="Total Revenue"
            value={
              ordersLoading
                ? "—"
                : `₱${stats.total_revenue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }
            icon="💰"
            accent="#0EA5E9"
            sub="from paid orders"
          />
        </div>

        {/* ── Charts + Calendar row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 280px",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Area chart — orders over 7 days */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: "#94A3B8",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Orders / 7 days
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginTop: 2,
                }}
              >
                {last7.reduce((s, d) => s + d.count, 0)} orders
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart
                data={last7}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#grad)"
                  dot={{ r: 3, fill: "#2563EB" }}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart — by status */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: "#94A3B8",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Orders by status
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginTop: 2,
                }}
              >
                {orders.length} total
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={statusBreakdown}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mini Calendar */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#94A3B8",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Order calendar
            </div>
            <MiniCalendar orderDates={orderDates} />
          </div>
        </div>

        {/* ── Recent Orders table ── */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 22px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: "#94A3B8",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Recent orders
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginTop: 2,
                }}
              >
                Latest activity
              </div>
            </div>
            <a
              href="/admin/orders"
              style={{
                fontSize: 12,
                color: "#2563EB",
                textDecoration: "none",
                fontFamily: MONO,
                letterSpacing: "0.5px",
              }}
            >
              View all →
            </a>
          </div>

          {ordersLoading ? (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                fontFamily: MONO,
                fontSize: 12,
                color: "#94A3B8",
              }}
            >
              loading…
            </div>
          ) : recent.length === 0 ? (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                fontFamily: MONO,
                fontSize: 12,
                color: "#94A3B8",
              }}
            >
              no orders yet
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[
                      "Reference",
                      "Customer",
                      "Plan",
                      "Method",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 20px",
                          textAlign: "left",
                          fontSize: 9,
                          fontFamily: MONO,
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "#94A3B8",
                          fontWeight: 600,
                          borderBottom: "1px solid #F1F5F9",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((order) => (
                    <tr
                      key={order.id}
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                    >
                      <td
                        style={{
                          padding: "12px 20px",
                          fontFamily: MONO,
                          fontSize: 11,
                          color: "#64748B",
                        }}
                      >
                        {order.reference ?? "#" + order.id}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#0F172A",
                            fontSize: 13,
                          }}
                        >
                          {order.user?.name ?? "—"}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#94A3B8",
                            fontFamily: MONO,
                          }}
                        >
                          {order.user?.email ?? ""}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 20px",
                          fontSize: 12,
                          color: "#475569",
                        }}
                      >
                        {order.plan?.name ?? order.plan_name ?? "—"}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span
                          style={{
                            fontFamily: MONO,
                            fontSize: 11,
                            color: "#64748B",
                            textTransform: "capitalize",
                          }}
                        >
                          {order.payment_method ?? "—"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <StatusPill status={order.payment_status} />
                      </td>
                      <td
                        style={{
                          padding: "12px 20px",
                          fontSize: 11,
                          color: "#94A3B8",
                          fontFamily: MONO,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(order.created_at).toLocaleDateString(
                          "en-PH",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
