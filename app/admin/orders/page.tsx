"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Order {
  id: number;
  reference?: string;
  user?: { name: string; email: string };
  plan?: {
    name: string;
    data_label?: string;
    validity_days?: number;
  };
  plan_name?: string;
  plan_data?: string;
  payment_method?: string;
  payment_status: string;
  activation_code?: string;
  receipt_path?: string;
  created_at: string;
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const MONO = "'IBM Plex Mono', monospace";
const SORA = "'Sora', sans-serif";

// Manual payment methods that require admin review
const MANUAL_METHODS = ["gcash", "maya", "bank"];
const ONLINE_METHODS = ["card"];

const STATUS_MAP: Record<
  string,
  { label: string; bg: string; border: string; color: string }
> = {
  pending: {
    label: "Pending",
    bg: "#FFF9E6",
    border: "#FFE47A",
    color: "#B45309",
  },
  pending_receipt: {
    label: "Awaiting Receipt",
    bg: "#FFF4EC",
    border: "#FECDA7",
    color: "#C2410C",
  },
  paid: {
    label: "Paid",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#16A34A",
  },
  confirmed: {
    label: "Confirmed",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#16A34A",
  },
  pending_review: {
    label: "Under Review",
    bg: "#EEF2FF",
    border: "#BFCFFF",
    color: "#3B5BDB",
  },
  completed: {
    label: "Completed",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#16A34A",
  },
  failed: {
    label: "Failed",
    bg: "#FEF2F2",
    border: "#FECACA",
    color: "#DC2626",
  },
};

const METHOD_LABEL: Record<
  string,
  { icon: string; label: string; type: "manual" | "online" }
> = {
  gcash: { icon: "💙", label: "GCash", type: "manual" },
  maya: { icon: "💚", label: "Maya", type: "manual" },
  bank: { icon: "🏦", label: "Bank", type: "manual" },
  card: { icon: "💳", label: "Card", type: "online" },
};

const FILTER_BUTTONS = [
  { key: "all", label: "All" },
  { key: "pending_receipt", label: "Awaiting Receipt" },
  { key: "pending_review", label: "Under Review" },
  { key: "paid", label: "Paid" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function isManualPayment(method?: string) {
  return MANUAL_METHODS.includes(method ?? "");
}
function needsReview(order: Order) {
  return (
    isManualPayment(order.payment_method) &&
    order.payment_status === "pending_review"
  );
}

// ── StatusPill ─────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const sc = STATUS_MAP[status] ?? {
    label: status,
    bg: "#F8FAFF",
    border: "#D1D9E6",
    color: "#6B7A99",
  };
  return (
    <span
      style={{
        display: "inline-block",
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
      {sc.label}
    </span>
  );
}

// ── PaymentTypePill ────────────────────────────────────────────────────────────
function PaymentTypePill({ method }: { method?: string }) {
  const isManual = isManualPayment(method);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        borderRadius: 4,
        fontSize: 9,
        fontFamily: MONO,
        fontWeight: 600,
        letterSpacing: "0.5px",
        background: isManual ? "#FFF4EC" : "#F0FDF4",
        border: `1px solid ${isManual ? "#FECDA7" : "#BBF7D0"}`,
        color: isManual ? "#C2410C" : "#16A34A",
        marginLeft: 6,
      }}
    >
      {isManual ? "manual" : "online"}
    </span>
  );
}

// ── Detail + Approval Modal ────────────────────────────────────────────────────
function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const method = METHOD_LABEL[order.payment_method ?? ""] ?? {
    icon: "💰",
    label: (order.payment_method ?? "—").toUpperCase(),
    type: "online",
  };
  const planName = order.plan?.name ?? order.plan_name ?? "—";
  const planData = order.plan_data ?? order.plan?.data_label ?? "—";

  const canApprove = needsReview(order);
  const canReject =
    isManualPayment(order.payment_method) &&
    ["pending_review", "pending_receipt"].includes(order.payment_status);

  async function handleAction(action: "approve" | "reject") {
    setActionLoading(action);
    setActionError("");
    const newStatus = action === "approve" ? "paid" : "failed";
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setActionError(d.message ?? "Something went wrong.");
        return;
      }
      onStatusChange(order.id, newStatus);
      onClose();
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  const rows: Array<[string, React.ReactNode]> = [
    ["Customer", order.user?.name ?? "—"],
    ["Email", order.user?.email ?? "—"],
    ["Plan", planName],
    ["Data", planData],
    [
      "Validity",
      order.plan?.validity_days ? order.plan.validity_days + " days" : "—",
    ],
    [
      "Payment",
      <span key="pay" style={{ display: "flex", alignItems: "center" }}>
        {method.icon} &nbsp;{method.label}
        <PaymentTypePill method={order.payment_method} />
      </span>,
    ],
    ["Activation", order.activation_code ?? "Not yet assigned"],
    ["Ordered", new Date(order.created_at).toLocaleString("en-PH")],
  ];

  return (
    <>
      {/* Backdrop */}
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

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 1001,
          width: "100%",
          maxWidth: 460,
          background: "#FAFBFE",
          border: "1px solid #D1D9E6",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 8px 40px rgba(30,50,120,0.12)",
          maxHeight: "90vh",
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
              // order detail · {method.label}
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
              {order.reference ?? "#" + order.id}
            </h2>
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
                alignItems: "center",
                gap: 12,
                padding: "7px 0",
                borderBottom: "0.5px solid #F1F4FA",
              }}
            >
              <span
                style={{
                  color: "#6B7A99",
                  fontFamily: MONO,
                  fontSize: 12,
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
                  wordBreak: "break-all",
                }}
              >
                {v}
              </span>
            </div>
          ))}

          {/* Status row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              padding: "7px 0",
              borderBottom: "0.5px solid #F1F4FA",
            }}
          >
            <span
              style={{
                color: "#6B7A99",
                fontFamily: MONO,
                fontSize: 12,
                minWidth: 100,
                flexShrink: 0,
              }}
            >
              Status
            </span>
            <StatusPill status={order.payment_status} />
          </div>

          {/* Receipt row */}
          {order.receipt_path && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "7px 0",
              }}
            >
              <span
                style={{
                  color: "#6B7A99",
                  fontFamily: MONO,
                  fontSize: 12,
                  minWidth: 100,
                  flexShrink: 0,
                }}
              >
                Receipt
              </span>
              <a
                href={
                  process.env.NEXT_PUBLIC_API_URL + "/" + order.receipt_path
                }
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
        </div>

        {/* Error */}
        {actionError && (
          <div
            style={{
              marginTop: 14,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 7,
              padding: "9px 12px",
              fontSize: 12,
              color: "#DC2626",
              fontFamily: MONO,
            }}
          >
            {actionError}
          </div>
        )}

        {/* ── Approval actions (manual payment only) ── */}
        {(canApprove || canReject) && (
          <div
            style={{
              marginTop: 20,
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#92400E",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              // manual payment review
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#78350F",
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              This order was paid via{" "}
              <strong style={{ color: "#92400E" }}>{method.label}</strong>.
              Review the receipt before approving.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {canApprove && (
                <button
                  onClick={() => handleAction("approve")}
                  disabled={!!actionLoading}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 7,
                    border: "1.5px solid #16A34A",
                    background:
                      actionLoading === "approve" ? "#DCFCE7" : "#16A34A",
                    color: actionLoading === "approve" ? "#16A34A" : "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    fontFamily: SORA,
                    opacity:
                      actionLoading && actionLoading !== "approve" ? 0.5 : 1,
                    transition: "all .15s",
                  }}
                >
                  {actionLoading === "approve"
                    ? "Approving…"
                    : "✓ Approve Order"}
                </button>
              )}
              {canReject && (
                <button
                  onClick={() => handleAction("reject")}
                  disabled={!!actionLoading}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 7,
                    border: "1.5px solid #DC2626",
                    background: "#FFFFFF",
                    color: actionLoading === "reject" ? "#DC2626" : "#DC2626",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    fontFamily: SORA,
                    opacity:
                      actionLoading && actionLoading !== "reject" ? 0.5 : 1,
                    transition: "all .15s",
                  }}
                >
                  {actionLoading === "reject" ? "Rejecting…" : "✕ Reject Order"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Online payment notice */}
        {!isManualPayment(order.payment_method) &&
          order.payment_status === "completed" && (
            <div
              style={{
                marginTop: 20,
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 12,
                color: "#15803D",
                fontFamily: MONO,
              }}
            >
              ✓ Auto-approved · online payment confirmed
            </div>
          )}

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
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
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch orders.");
      const data = await res.json();
      setOrders(data.data ?? data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setOrdersLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") fetchOrders();
  }, [isAuthenticated, user, fetchOrders]);

  // Optimistically update status in local state after approval/rejection
  function handleStatusChange(id: number, status: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, payment_status: status } : o)),
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
          }}
        >
          <p style={{ color: "#9AAABF", fontFamily: MONO, fontSize: 12 }}>
            loading…
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  // Counts
  const pendingReviewCount = orders.filter(
    (o) => o.payment_status === "pending_review",
  ).length;
  const completedCount = orders.filter((o) =>
    ["paid"].includes(o.payment_status),
  ).length;
  const todayCount = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString(),
  ).length;

  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      String(o.id).includes(q) ||
      (o.reference ?? "").toLowerCase().includes(q) ||
      (o.user?.name ?? "").toLowerCase().includes(q) ||
      (o.user?.email ?? "").toLowerCase().includes(q) ||
      (o.plan?.name ?? o.plan_name ?? "").toLowerCase().includes(q);
    const matchStatus =
      filterStatus === "all" || o.payment_status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');
        .order-row:hover td { background: #F5F7FF; }
        .filter-pill { border-radius: 999px; padding: 5px 14px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; border: 1px solid #E2E8F4; background: #FFFFFF; color: #6B7A99; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all .15s; }
        .filter-pill:hover:not(.active) { border-color: #C7D2FE; color: #3B5BDB; background: #F5F7FF; }
        .filter-pill.active { border-color: #3B5BDB; background: #3B5BDB; color: #FFFFFF; }
        .icon-btn { padding: 6px 8px; border-radius: 6px; border: 1px solid #D1D9E6; background: #FFFFFF; color: #6B7A99; cursor: pointer; font-size: 13px; transition: all .15s; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { border-color: #3B5BDB; color: #3B5BDB; background: #EEF2FF; }
        .approve-quick { padding: 4px 10px; border-radius: 5px; border: 1px solid #BBF7D0; background: #F0FDF4; color: #16A34A; font-size: 10px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .approve-quick:hover { background: #16A34A; color: #FFFFFF; border-color: #16A34A; }
        .refresh-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 7px; border: 1px solid #D1D9E6; background: #FFFFFF; color: #6B7A99; font-size: 11px; cursor: pointer; font-family: 'IBM Plex Mono', monospace; transition: all .15s; }
        .refresh-btn:hover { border-color: #C7D2FE; color: #3B5BDB; background: #F5F7FF; }
        input:focus { border-color: #3B5BDB !important; box-shadow: 0 0 0 3px rgba(59,91,219,0.1) !important; outline: none; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #F1F4FA; }
        ::-webkit-scrollbar-thumb { background: #C5CFE0; border-radius: 3px; }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#F8FAFF" }}>
        <section style={{ padding: "32px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
                  Admin / Orders
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
                  Manage Orders
                </h1>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 11,
                    color: "#9AAABF",
                    fontFamily: MONO,
                  }}
                >
                  {orders.length} record{orders.length !== 1 ? "s" : ""} total
                </p>
              </div>

              {/* Stat cards */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  {
                    count: pendingReviewCount,
                    label: "Pending Review",
                    bg: "#EEF2FF",
                    border: "#BFCFFF",
                    color: "#3B5BDB",
                  },
                  {
                    count: completedCount,
                    label: "Paid",
                    bg: "#F0FDF4",
                    border: "#BBF7D0",
                    color: "#16A34A",
                  },
                  {
                    count: todayCount,
                    label: "Today",
                    bg: "#F5F3FF",
                    border: "#DDD6FE",
                    color: "#7C3AED",
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
                    placeholder="Search by name, email, reference…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px 9px 30px",
                      borderRadius: 7,
                      border: "1px solid #D1D9E6",
                      background: "#FFFFFF",
                      color: "#1A2540",
                      fontSize: 13,
                      fontFamily: SORA,
                      transition: "border-color 0.15s",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
                      {f.key === "pending_review" && pendingReviewCount > 0 && (
                        <span
                          style={{
                            background:
                              filterStatus === "pending_review"
                                ? "rgba(255,255,255,0.25)"
                                : "#3B5BDB",
                            color: "white",
                            borderRadius: 999,
                            padding: "0 5px",
                            fontSize: 9,
                          }}
                        >
                          {pendingReviewCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <button className="refresh-btn" onClick={fetchOrders}>
                  ↺ Refresh
                </button>
              </div>

              {/* Error banner */}
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
                        "Plan",
                        "Method",
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
                          colSpan={8}
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
                          colSpan={8}
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
                        const method = METHOD_LABEL[
                          order.payment_method ?? ""
                        ] ?? {
                          icon: "💰",
                          label: "—",
                          type: "online" as const,
                        };
                        const planName =
                          order.plan?.name ?? order.plan_name ?? "—";
                        const planData =
                          order.plan_data ?? order.plan?.data_label ?? "—";
                        const date = new Date(
                          order.created_at,
                        ).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        const showApproveQuick = needsReview(order);

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
                              {order.reference ?? "#" + order.id}
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
                                {order.user?.name ?? "—"}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9AAABF",
                                  fontFamily: MONO,
                                  marginTop: 1,
                                }}
                              >
                                {order.user?.email ?? ""}
                              </div>
                            </td>

                            {/* Plan */}
                            <td style={{ padding: "12px 16px" }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#0F172A",
                                  fontSize: 13,
                                }}
                              >
                                {planName}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9AAABF",
                                  fontFamily: MONO,
                                  marginTop: 1,
                                }}
                              >
                                {planData}
                              </div>
                            </td>

                            {/* Method */}
                            <td style={{ padding: "12px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                }}
                              >
                                <span
                                  style={{ fontSize: 16 }}
                                  title={method.label}
                                >
                                  {method.icon}
                                </span>
                                <span
                                  style={{
                                    fontFamily: MONO,
                                    fontSize: 11,
                                    color: "#6B7A99",
                                  }}
                                >
                                  {method.label}
                                </span>
                              </div>
                              <PaymentTypePill method={order.payment_method} />
                            </td>

                            {/* Status */}
                            <td style={{ padding: "12px 16px" }}>
                              <StatusPill status={order.payment_status} />
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
                                  href={
                                    process.env.NEXT_PUBLIC_API_URL +
                                    "/" +
                                    order.receipt_path
                                  }
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
                                  gap: 6,
                                  alignItems: "center",
                                }}
                              >
                                {showApproveQuick && (
                                  <button
                                    className="approve-quick"
                                    onClick={() => setSelected(order)}
                                    title="Review & approve"
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
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
