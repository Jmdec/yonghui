"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Order {
  id: number;
  product_id: number;
  reference_number?: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "completed";
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  delivery_method: "pickup" | "delivery";
  delivery_address?: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  notes?: string | null;
  admin_notes?: string | null;
  receipt_path?: string | null;
  confirmed_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const MONO = "'IBM Plex Mono', monospace";
const SORA = "'Sora', sans-serif";

const STATUS_MAP: Record<
  string,
  { label: string; bg: string; border: string; color: string; icon: string }
> = {
  pending: {
    label: "Pending",
    bg: "#FFF9E6",
    border: "#FFE47A",
    color: "#B45309",
    icon: "⏳",
  },
  confirmed: {
    label: "Confirmed",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#16A34A",
    icon: "✓",
  },
  processing: {
    label: "Processing",
    bg: "#EEF2FF",
    border: "#BFCFFF",
    color: "#3B5BDB",
    icon: "⚙️",
  },
  shipped: {
    label: "Shipped",
    bg: "#F0F9FF",
    border: "#BAE6FD",
    color: "#0369A1",
    icon: "🚚",
  },
  delivered: {
    label: "Delivered",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#16A34A",
    icon: "✅",
  },
  completed: {
    label: "Completed",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#16A34A",
    icon: "✅",
  },
  cancelled: {
    label: "Cancelled",
    bg: "#FEF2F2",
    border: "#FECACA",
    color: "#DC2626",
    icon: "✕",
  },
};

const STATUS_FLOW: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "completed",
];

const FILTER_BUTTONS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
// FIX: Accept string | number so API responses that return numeric fields as
// strings (e.g. PostgreSQL Decimal columns) don't throw "toFixed is not a function".
function fmt(n: number | string) {
  return (
    "₱" +
    Number(n)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

function StatusPill({ status }: { status: string }) {
  const sc = STATUS_MAP[status] ?? {
    label: status,
    bg: "#F8FAFF",
    border: "#D1D9E6",
    color: "#6B7A99",
    icon: "•",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 9,
        fontFamily: MONO,
        fontWeight: 600,
        letterSpacing: "1.5px",
        background: sc.bg,
        border: `1px solid ${sc.border}`,
        color: sc.color,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 10 }}>{sc.icon}</span> {sc.label.toUpperCase()}
    </span>
  );
}

// ── Update Status Modal ────────────────────────────────────────────────────────
function UpdateStatusModal({
  order,
  onClose,
  onUpdated,
}: {
  order: Order;
  onClose: () => void;
  onUpdated: (updated: Order) => void;
}) {
  const [newStatus, setNewStatus] = useState<Order["status"]>(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/product-orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      });
      if (!res.ok) {
        const d: any = await res.json().catch(() => ({}));
        setError(d.message ?? "Failed to update status.");
        return;
      }
      const data: any = await res.json();
      onUpdated(
        data.order ?? { ...order, status: newStatus, admin_notes: adminNotes },
      );
      onClose();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,25,60,0.5)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAFBFE",
          border: "1px solid #D1D9E6",
          borderRadius: 14,
          padding: 28,
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 8px 40px rgba(30,50,120,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#3B5BDB",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              // update order status
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {order.reference_number ?? "#" + order.id}
            </h2>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: 11,
                color: "#9AAABF",
                fontFamily: MONO,
              }}
            >
              {order.customer_name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F1F4FA",
              border: "1px solid #D1D9E6",
              color: "#6B7A99",
              width: 30,
              height: 30,
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Status selector */}
        <label
          style={{
            display: "block",
            fontFamily: MONO,
            fontSize: 10,
            color: "#6B7A99",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          New Status
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 18,
          }}
        >
          {STATUS_FLOW.map((s) => {
            const sc = STATUS_MAP[s];
            const active = newStatus === s;
            return (
              <button
                key={s}
                onClick={() => setNewStatus(s)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: MONO,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1.5px solid",
                  transition: "all .15s",
                  borderColor: active ? sc.color : "#D1D9E6",
                  background: active ? sc.bg : "#FFFFFF",
                  color: active ? sc.color : "#6B7A99",
                }}
              >
                {sc.icon} {sc.label}
              </button>
            );
          })}
          {/* Cancelled separate */}
          {(["cancelled"] as Order["status"][]).map((s) => {
            const sc = STATUS_MAP[s];
            const active = newStatus === s;
            return (
              <button
                key={s}
                onClick={() => setNewStatus(s)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: MONO,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1.5px solid",
                  transition: "all .15s",
                  borderColor: active ? sc.color : "#D1D9E6",
                  background: active ? sc.bg : "#FFFFFF",
                  color: active ? sc.color : "#6B7A99",
                }}
              >
                {sc.icon} {sc.label}
              </button>
            );
          })}
        </div>

        {/* Admin notes */}
        <label
          style={{
            display: "block",
            fontFamily: MONO,
            fontSize: 10,
            color: "#6B7A99",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Admin Notes (optional)
        </label>
        <textarea
          value={adminNotes}
          onChange={(e: any) => setAdminNotes(e.target.value)}
          placeholder="Internal notes, tracking info, remarks…"
          rows={3}
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: 7,
            border: "1px solid #D1D9E6",
            background: "#FFFFFF",
            color: "#1A2540",
            fontSize: 12,
            fontFamily: MONO,
            boxSizing: "border-box",
            resize: "vertical",
            marginBottom: 16,
          }}
        />

        {error && (
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 12,
              color: "#DC2626",
              fontFamily: MONO,
            }}
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 7,
              border: "1px solid #D1D9E6",
              background: "#FFFFFF",
              color: "#6B7A99",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: SORA,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || newStatus === order.status}
            style={{
              padding: "9px 20px",
              borderRadius: 7,
              border: `1.5px solid ${STATUS_MAP[newStatus]?.color ?? "#3B5BDB"}`,
              background: STATUS_MAP[newStatus]?.color ?? "#3B5BDB",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor:
                loading || newStatus === order.status
                  ? "not-allowed"
                  : "pointer",
              opacity: loading || newStatus === order.status ? 0.6 : 1,
              fontFamily: SORA,
            }}
          >
            {loading
              ? "Saving…"
              : `Set to ${STATUS_MAP[newStatus]?.label ?? newStatus}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Detail Modal ─────────────────────────────────────────────────────────
function OrderDetailModal({
  order,
  onClose,
  onOrderUpdate,
}: {
  order: Order;
  onClose: () => void;
  onOrderUpdate: (updated: Order) => void;
}) {
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  const rows: Array<[string, React.ReactNode]> = [
    ["Customer", order.customer_name],
    ["Email", order.customer_email],
    ["Phone", order.customer_phone ?? "—"],
    ["Product", order.product_name],
    ["Qty", `${order.quantity}x`],
    ["Unit Price", fmt(order.unit_price)],
    [
      "Total",
      <strong key="t" style={{ color: "#0F172A" }}>
        {fmt(order.total_price)}
      </strong>,
    ],
    [
      "Delivery",
      order.delivery_method === "delivery" ? "🚚 Delivery" : "🏪 Pickup",
    ],
    ["Address", order.delivery_address ?? "—"],
    ["Notes", order.notes ?? "—"],
    ["Admin Notes", order.admin_notes ?? "—"],
    [
      "Ordered",
      order.created_at
        ? new Date(order.created_at).toLocaleString("en-PH")
        : "—",
    ],
    ...(order.confirmed_at
      ? [
          [
            "Confirmed",
            new Date(order.confirmed_at).toLocaleString("en-PH"),
          ] as [string, React.ReactNode],
        ]
      : []),
    ...(order.completed_at
      ? [
          [
            "Completed",
            new Date(order.completed_at).toLocaleString("en-PH"),
          ] as [string, React.ReactNode],
        ]
      : []),
    ...(order.cancelled_at
      ? [
          [
            "Cancelled",
            new Date(order.cancelled_at).toLocaleString("en-PH"),
          ] as [string, React.ReactNode],
        ]
      : []),
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,25,60,0.45)",
          backdropFilter: "blur(5px)",
          zIndex: 1000,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 1001,
          width: "100%",
          maxWidth: 520,
          background: "#FAFBFE",
          border: "1px solid #D1D9E6",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 8px 40px rgba(30,50,120,0.12)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#3B5BDB",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              // order detail · 🔌 dongle
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: "#0F172A",
                fontFamily: SORA,
              }}
            >
              {order.reference_number ?? "#" + order.id}
            </h2>
            <div style={{ marginTop: 6 }}>
              <StatusPill status={order.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F1F4FA",
              border: "1px solid #D1D9E6",
              color: "#6B7A99",
              width: 30,
              height: 30,
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Data rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rows.map(([k, v]) => (
            <div
              key={k as string}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                padding: "7px 0",
                borderBottom: "0.5px solid #F1F4FA",
              }}
            >
              <span
                style={{
                  color: "#6B7A99",
                  fontFamily: MONO,
                  fontSize: 11,
                  minWidth: 100,
                  flexShrink: 0,
                }}
              >
                {k}
              </span>
              <span
                style={{
                  color: "#0F172A",
                  fontSize: 13,
                  textAlign: "right",
                  wordBreak: "break-word",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Receipt */}
        {order.receipt_path && (
          <div
            style={{
              marginTop: 16,
              background: "#F8FAFF",
              border: "1px solid #E2E8F4",
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#6B7A99",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Receipt
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/${order.receipt_path}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3B5BDB",
                fontSize: 13,
                textDecoration: "underline",
              }}
            >
              View Receipt ↗
            </a>
          </div>
        )}

        {/* Update Status Button */}
        <button
          onClick={() => setShowUpdateStatus(true)}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 0",
            borderRadius: 7,
            border: "1.5px solid #3B5BDB",
            background: "#3B5BDB",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: SORA,
          }}
        >
          ✏️ Update Status
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "9px 0",
            borderRadius: 7,
            border: "1px solid #D1D9E6",
            background: "#FFFFFF",
            color: "#6B7A99",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: SORA,
          }}
        >
          Close
        </button>
      </div>

      {showUpdateStatus && (
        <UpdateStatusModal
          order={order}
          onClose={() => setShowUpdateStatus(false)}
          onUpdated={(updated) => {
            onOrderUpdate(updated);
            setShowUpdateStatus(false);
          }}
        />
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminDongleOrdersPage() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDelivery, setFilterDelivery] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user as any)?.role !== "admin"))
      router.push("/auth/login");
  }, [loading, isAuthenticated, user, router]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setError("");
    try {
      const res = await fetch("/api/product-orders", {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch orders.");
      const data: any = await res.json();
      const raw: Order[] = data.data ?? data ?? [];

      // FIX: Coerce numeric fields that PostgreSQL/Prisma may return as strings
      // (e.g. Decimal columns come back as "123.00" rather than 123).
      setOrders(
        raw.map((o) => ({
          ...o,
          unit_price: Number(o.unit_price),
          total_price: Number(o.total_price),
          quantity: Number(o.quantity),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setOrdersLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && (user as any)?.role === "admin") fetchOrders();
  }, [isAuthenticated, user, fetchOrders]);

  function handleOrderUpdate(updated: Order) {
    // Coerce numeric fields on update responses too
    const coerced: Order = {
      ...updated,
      unit_price: Number(updated.unit_price),
      total_price: Number(updated.total_price),
      quantity: Number(updated.quantity),
    };
    setOrders((prev) =>
      prev.map((o) => (o.id === coerced.id ? { ...o, ...coerced } : o)),
    );
    setSelected((prev) =>
      prev?.id === coerced.id ? { ...prev, ...coerced } : prev,
    );
  }

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#9AAABF", fontFamily: MONO, fontSize: 12 }}>
          loading…
        </p>
      </main>
    );
  if (!isAuthenticated || (user as any)?.role !== "admin") return null;

  // Stats
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const processingCount = orders.filter((o) =>
    ["confirmed", "processing"].includes(o.status),
  ).length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const todayCount = orders.filter(
    (o) =>
      o.created_at &&
      new Date(o.created_at).toDateString() === new Date().toDateString(),
  ).length;

  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      String(o.id).includes(q) ||
      (o.reference_number ?? "").toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      o.product_name.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchDelivery =
      filterDelivery === "all" || o.delivery_method === filterDelivery;
    return matchSearch && matchStatus && matchDelivery;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');
        .order-row:hover td { background: #F5F7FF; }
        .filter-pill { border-radius: 999px; padding: 5px 14px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; border: 1px solid #E2E8F4; background: #FFFFFF; color: #6B7A99; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all .15s; white-space: nowrap; }
        .filter-pill:hover:not(.active) { border-color: #C7D2FE; color: #3B5BDB; background: #F5F7FF; }
        .filter-pill.active { border-color: #3B5BDB; background: #3B5BDB; color: #FFFFFF; }
        .icon-btn { padding: 6px 8px; border-radius: 6px; border: 1px solid #D1D9E6; background: #FFFFFF; color: #6B7A99; cursor: pointer; font-size: 13px; transition: all .15s; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { border-color: #3B5BDB; color: #3B5BDB; background: #EEF2FF; }
        .quick-action { padding: 4px 10px; border-radius: 5px; font-size: 10px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; cursor: pointer; transition: all .15s; white-space: nowrap; border: 1px solid #BFCFFF; background: #EEF2FF; color: #3B5BDB; }
        .quick-action:hover { background: #3B5BDB; color: #FFFFFF; border-color: #3B5BDB; }
        .refresh-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 7px; border: 1px solid #D1D9E6; background: #FFFFFF; color: #6B7A99; font-size: 11px; cursor: pointer; font-family: 'IBM Plex Mono', monospace; transition: all .15s; }
        .refresh-btn:hover { border-color: #C7D2FE; color: #3B5BDB; background: #F5F7FF; }
        input:focus, textarea:focus { border-color: #3B5BDB !important; box-shadow: 0 0 0 3px rgba(59,91,219,0.1) !important; outline: none; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #F1F4FA; }
        ::-webkit-scrollbar-thumb { background: #C5CFE0; border-radius: 3px; }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#F8FAFF" }}>
        <section style={{ padding: "32px 24px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            {/* ── Page Header ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 28,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: "#3B5BDB",
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 1.5,
                      background: "#3B5BDB",
                    }}
                  />
                  Admin / Dongle Orders
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#0F172A",
                    fontFamily: SORA,
                  }}
                >
                  🔌 Dongle Orders
                </h1>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 11,
                    color: "#9AAABF",
                    fontFamily: MONO,
                  }}
                >
                  {orders.length} record{orders.length !== 1 ? "s" : ""} total ·
                  physical fulfillment required
                </p>
              </div>

              {/* Stat cards */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  {
                    count: pendingCount,
                    label: "Pending",
                    bg: "#FFF9E6",
                    border: "#FFE47A",
                    color: "#B45309",
                  },
                  {
                    count: processingCount,
                    label: "In Progress",
                    bg: "#EEF2FF",
                    border: "#BFCFFF",
                    color: "#3B5BDB",
                  },
                  {
                    count: shippedCount,
                    label: "Shipped",
                    bg: "#F0F9FF",
                    border: "#BAE6FD",
                    color: "#0369A1",
                  },
                  {
                    count: todayCount,
                    label: "Today",
                    bg: "#F0FDF4",
                    border: "#BBF7D0",
                    color: "#16A34A",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      border: `1px solid ${s.border}`,
                      borderRadius: 10,
                      padding: "12px 18px",
                      textAlign: "center",
                      background: s.bg,
                      minWidth: 88,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: s.color,
                        fontFamily: MONO,
                      }}
                    >
                      {s.count}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: s.color,
                        fontFamily: MONO,
                        marginTop: 2,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Table Card ── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F4",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(30,50,120,0.06)",
              }}
            >
              {/* Toolbar */}
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid #EEF2FA",
                  background: "#FAFBFE",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 13,
                      color: "#9AAABF",
                    }}
                  >
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, email, reference, product…"
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px 9px 30px",
                      borderRadius: 7,
                      border: "1px solid #D1D9E6",
                      background: "#FFFFFF",
                      color: "#1A2540",
                      fontSize: 13,
                      fontFamily: SORA,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Status filter */}
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: "#9AAABF",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Status:
                  </span>
                  {FILTER_BUTTONS.map((f) => (
                    <button
                      key={f.key}
                      className={
                        "filter-pill" +
                        (filterStatus === f.key ? " active" : "")
                      }
                      onClick={() => setFilterStatus(f.key)}
                    >
                      {f.label}
                      {f.key === "pending" && pendingCount > 0 && (
                        <span
                          style={{
                            background:
                              filterStatus === "pending"
                                ? "rgba(255,255,255,0.3)"
                                : "#B45309",
                            color: "white",
                            borderRadius: 999,
                            padding: "0 5px",
                            fontSize: 9,
                          }}
                        >
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Delivery filter */}
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: "#9AAABF",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Type:
                  </span>
                  {[
                    { key: "all", label: "All" },
                    { key: "delivery", label: "🚚 Delivery" },
                    { key: "pickup", label: "🏪 Pickup" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      className={
                        "filter-pill" +
                        (filterDelivery === f.key ? " active" : "")
                      }
                      onClick={() => setFilterDelivery(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <button className="refresh-btn" onClick={fetchOrders}>
                  ↺ Refresh
                </button>
              </div>

              {error && (
                <div
                  style={{
                    margin: "12px 20px 0",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 7,
                    padding: "10px 14px",
                    fontSize: 12,
                    color: "#DC2626",
                    fontFamily: MONO,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#F8FAFF" }}>
                      {[
                        "Reference",
                        "Customer",
                        "Product",
                        "Total",
                        "Delivery",
                        "Address",
                        "Status",
                        "Receipt",
                        "Date",
                        "",
                      ].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "10px 16px",
                            textAlign: "left",
                            fontSize: 9,
                            fontFamily: MONO,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            color: "#9AAABF",
                            fontWeight: 600,
                            borderBottom: "1px solid #EEF2FA",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr>
                        <td
                          colSpan={10}
                          style={{
                            padding: "48px 0",
                            textAlign: "center",
                            color: "#9AAABF",
                            fontFamily: MONO,
                            fontSize: 12,
                          }}
                        >
                          loading orders…
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          style={{
                            padding: "48px 0",
                            textAlign: "center",
                            color: "#9AAABF",
                            fontFamily: MONO,
                            fontSize: 12,
                          }}
                        >
                          {searchQuery
                            ? `no results for "${searchQuery}"`
                            : "no orders found"}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((order) => {
                        const date = order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "en-PH",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—";

                        return (
                          <tr
                            key={order.id}
                            className="order-row"
                            style={{ borderTop: "1px solid #F1F4FA" }}
                          >
                            {/* Reference */}
                            <td
                              style={{
                                padding: "12px 16px",
                                fontFamily: MONO,
                                fontSize: 11,
                                color: "#6B7A99",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {order.reference_number ?? "#" + order.id}
                            </td>
                            {/* Customer */}
                            <td style={{ padding: "12px 16px" }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#0F172A",
                                  fontSize: 13,
                                }}
                              >
                                {order.customer_name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9AAABF",
                                  fontFamily: MONO,
                                  marginTop: 1,
                                }}
                              >
                                {order.customer_email}
                              </div>
                              {order.customer_phone && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#C5CFE0",
                                    fontFamily: MONO,
                                    marginTop: 1,
                                  }}
                                >
                                  📞 {order.customer_phone}
                                </div>
                              )}
                            </td>
                            {/* Product */}
                            <td style={{ padding: "12px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                }}
                              >
                                <span style={{ fontSize: 14 }}>🔌</span>
                                <div>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      color: "#0F172A",
                                      fontSize: 13,
                                    }}
                                  >
                                    {order.product_name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: "#9AAABF",
                                      fontFamily: MONO,
                                      marginTop: 1,
                                    }}
                                  >
                                    ×{order.quantity}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {/* Total */}
                            <td
                              style={{
                                padding: "12px 16px",
                                fontFamily: MONO,
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#0F172A",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {fmt(order.total_price)}
                            </td>
                            {/* Delivery method */}
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "3px 9px",
                                  borderRadius: 999,
                                  fontSize: 9,
                                  fontFamily: MONO,
                                  fontWeight: 600,
                                  letterSpacing: "1px",
                                  background:
                                    order.delivery_method === "delivery"
                                      ? "#EEF2FF"
                                      : "#F0FDF4",
                                  border: `1px solid ${order.delivery_method === "delivery" ? "#BFCFFF" : "#BBF7D0"}`,
                                  color:
                                    order.delivery_method === "delivery"
                                      ? "#3B5BDB"
                                      : "#16A34A",
                                }}
                              >
                                {order.delivery_method === "delivery"
                                  ? "🚚"
                                  : "🏪"}{" "}
                                {order.delivery_method.toUpperCase()}
                              </span>
                            </td>
                            {/* Address */}
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 11,
                                color: "#6B7A99",
                                maxWidth: 160,
                              }}
                            >
                              <div
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {order.delivery_address ?? (
                                  <span style={{ color: "#C5CFE0" }}>—</span>
                                )}
                              </div>
                            </td>
                            {/* Status */}
                            <td style={{ padding: "12px 16px" }}>
                              <StatusPill status={order.status} />
                            </td>
                            {/* Receipt */}
                            <td
                              style={{
                                padding: "12px 16px",
                                textAlign: "center",
                              }}
                            >
                              {order.receipt_path ? (
                                <a
                                  href={`${process.env.NEXT_PUBLIC_API_URL}/${order.receipt_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: 11,
                                    color: "#3B5BDB",
                                    textDecoration: "underline",
                                    fontFamily: MONO,
                                  }}
                                >
                                  View
                                </a>
                              ) : (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "#C5CFE0",
                                    fontFamily: MONO,
                                  }}
                                >
                                  —
                                </span>
                              )}
                            </td>
                            {/* Date */}
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 11,
                                color: "#9AAABF",
                                fontFamily: MONO,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {date}
                            </td>
                            {/* Actions */}
                            <td style={{ padding: "12px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 5,
                                  alignItems: "center",
                                }}
                              >
                                {order.status === "pending" && (
                                  <button
                                    className="quick-action"
                                    onClick={() => setSelected(order)}
                                    title="Review order"
                                  >
                                    Review
                                  </button>
                                )}
                                <button
                                  className="icon-btn"
                                  onClick={() => setSelected(order)}
                                  title="View details"
                                >
                                  👁
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid #EEF2FA",
                  background: "#FAFBFE",
                }}
              >
                <span
                  style={{ fontSize: 11, color: "#9AAABF", fontFamily: MONO }}
                >
                  {filtered.length === 0
                    ? "No records"
                    : `Showing ${filtered.length} of ${orders.length} orders`}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selected !== null && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
    </>
  );
}
