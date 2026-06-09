"use client";

import { useEffect, useState, useMemo } from "react";
import { toast, Toaster } from "sonner";

interface Plan {
  id: number;
  destination_id: number;
  destination_name: string;
  name: string;
  data_label: string;
  retail_price: number;
  formatted_price: string;
  stock: number;
  speed: string;
  sim_type: string;
}

interface EditDialogState {
  planId: number;
  destinationId: number;
  planName: string;
  currentStock: number;
  newStock: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Edit Dialog ───────────────────────────────────────────────────────────────
function EditStockDialog({
  state,
  onSave,
  onClose,
  saving,
}: {
  state: EditDialogState;
  onSave: (newStock: number) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(state.newStock);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, saving]);

  return (
    <div
      onClick={() => !saving && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 28,
          width: "100%",
          maxWidth: 420,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
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
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#1F2937",
              }}
            >
              Update Stock
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7A99" }}>
              {state.planName}
            </p>
          </div>
          <button
            onClick={() => !saving && onClose()}
            style={{
              background: "none",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              color: "#9CA3AF",
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
              borderRadius: 4,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Current stock */}
        <div
          style={{
            backgroundColor: "#F8FAFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
          }}
        >
          <span style={{ color: "#6B7A99" }}>Current stock</span>
          <span style={{ fontWeight: 700, color: "#1F2937" }}>
            {state.currentStock} units
          </span>
        </div>

        {/* Input */}
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 6,
          }}
        >
          New stock quantity
        </label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !saving) onSave(Number(value));
          }}
          autoFocus
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #C7D2FE",
            borderRadius: 8,
            fontSize: 15,
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            color: "#1F2937",
          }}
        />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => !saving && onClose()}
            disabled={saving}
            style={{
              padding: "9px 18px",
              backgroundColor: "#F3F4F6",
              color: "#374151",
              border: "1px solid #D1D9E6",
              borderRadius: 7,
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => !saving && onSave(Number(value))}
            disabled={saving}
            style={{
              padding: "9px 22px",
              backgroundColor: saving ? "#A5B4FC" : "#3B5BDB",
              color: "white",
              border: "none",
              borderRadius: 7,
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<EditDialogState | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"stock-low" | "stock-high" | "name">(
    "stock-low",
  );

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/plans`);
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();

      const allPlans: Plan[] = (data.data || []).map((plan: any) => ({
        id: plan.id,
        destination_id: plan.destination_id,
        destination_name: plan.destination?.name ?? "",
        name: plan.name,
        data_label: plan.data_label,
        retail_price: plan.retail_price,
        formatted_price: plan.formatted_price,
        stock: plan.stock || 0,
        speed: plan.speed,
        sim_type: plan.sim_type,
      }));

      setPlans(allPlans);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch inventory",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(newStock: number) {
    if (!editDialog) return;

    // Close dialog immediately so the toast is visible (not hidden behind the overlay)
    const snapshot = { ...editDialog };
    setEditDialog(null);
    setSaving(true);

    const toastId = toast.loading("Updating stock…");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/destinations/${snapshot.destinationId}/plans/${snapshot.planId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: newStock }),
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message ?? `HTTP ${response.status}`);
      }

      setPlans((prev) =>
        prev.map((p) =>
          p.id === snapshot.planId ? { ...p, stock: newStock } : p,
        ),
      );

      toast.success(`Stock updated to ${newStock} units`, { id: toastId });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update stock",
        { id: toastId },
      );
    } finally {
      setSaving(false);
    }
  }

  // Filter
  const filteredPlans = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destination_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort: group by destination first, then apply secondary sort within each group
  const sortedPlans = useMemo(() => {
    const grouped: Record<string, Plan[]> = {};
    filteredPlans.forEach((plan) => {
      const key = plan.destination_name || "Unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(plan);
    });
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (sortBy === "stock-low") return a.stock - b.stock;
        if (sortBy === "stock-high") return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
    });
    return Object.keys(grouped)
      .sort()
      .flatMap((key) => grouped[key]);
  }, [filteredPlans, sortBy]);

  // Build rowSpan map
  const rowSpanMap = useMemo(() => {
    const map: Record<number, number> = {};
    const seen = new Set<string>();
    sortedPlans.forEach((plan) => {
      const dest = plan.destination_name;
      if (!seen.has(dest)) {
        seen.add(dest);
        map[plan.id] = sortedPlans.filter(
          (p) => p.destination_name === dest,
        ).length;
      } else {
        map[plan.id] = 0;
      }
    });
    return map;
  }, [sortedPlans]);

  const totalStock = plans.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = plans.filter((p) => p.stock < 10).length;

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#F8FAFF", padding: 20 }}
    >
      {/* Toaster lives here so it's always mounted with this page */}
      <Toaster position="top-right" richColors closeButton />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: "0 0 8px 0",
              color: "#1F2937",
            }}
          >
            Inventory Management
          </h1>
          <p style={{ fontSize: 14, color: "#6B7A99", margin: 0 }}>
            Track and manage stock levels across all plans
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard label="Total Stock" value={totalStock.toLocaleString()} />
          <StatCard label="Plans" value={plans.length} color="#7C3AED" />
          <StatCard
            label="Low Stock (<10)"
            value={lowStockCount}
            color="#DC2626"
          />
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search plans or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: "10px 12px",
              border: "1px solid #D1D9E6",
              borderRadius: 6,
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "stock-low" | "stock-high" | "name")
            }
            style={{
              padding: "10px 12px",
              border: "1px solid #D1D9E6",
              borderRadius: 6,
              fontSize: 14,
              fontFamily: "inherit",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option value="stock-low">Sort: Low Stock First</option>
            <option value="stock-high">Sort: High Stock First</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          <button
            onClick={fetchPlans}
            disabled={loading}
            style={{
              padding: "10px 16px",
              backgroundColor: "#3B5BDB",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6B7A99" }}>
            Loading inventory...
          </div>
        ) : sortedPlans.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6B7A99" }}>
            No plans found
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#F8FAFF",
                      borderBottom: "2px solid #E5E7EB",
                    }}
                  >
                    {[
                      "Destination",
                      "Plan Name",
                      "Data",
                      "Type",
                      "Price",
                      "Stock",
                      "Action",
                    ].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign:
                            i >= 4 && i <= 5
                              ? "right"
                              : i === 6
                                ? "center"
                                : "left",
                          fontWeight: 600,
                          color: "#1F2937",
                          width: i === 0 ? 140 : undefined,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPlans.map((plan) => {
                    const span = rowSpanMap[plan.id];
                    const isFirstInGroup = span > 0;

                    return (
                      <tr
                        key={plan.id}
                        style={{
                          borderBottom: "1px solid #E5E7EB",
                          backgroundColor: "white",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLTableRowElement
                          ).style.backgroundColor = "#F3F4F6";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLTableRowElement
                          ).style.backgroundColor = "white";
                        }}
                      >
                        {isFirstInGroup && (
                          <td
                            rowSpan={span}
                            style={{
                              padding: "12px 16px",
                              color: "#3B5BDB",
                              fontWeight: 700,
                              fontSize: 13,
                              verticalAlign: "middle",
                              textAlign: "center",
                              backgroundColor: "#F0F4FF",
                              borderRight: "2px solid #C7D2FE",
                              borderBottom: "2px solid #C7D2FE",
                            }}
                          >
                            {plan.destination_name}
                          </td>
                        )}
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#1F2937",
                            fontWeight: 500,
                          }}
                        >
                          {plan.name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#6B7A99" }}>
                          {plan.data_label}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#6B7A99",
                            fontSize: 12,
                          }}
                        >
                          {plan.sim_type} / {plan.speed}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#1F2937",
                            textAlign: "right",
                            fontWeight: 500,
                          }}
                        >
                          {plan.formatted_price}
                        </td>
                        <td
                          style={{ padding: "12px 16px", textAlign: "right" }}
                        >
                          <StockBadge stock={plan.stock} />
                        </td>
                        <td
                          style={{ padding: "12px 16px", textAlign: "center" }}
                        >
                          <button
                            onClick={() =>
                              setEditDialog({
                                planId: plan.id,
                                destinationId: plan.destination_id,
                                planName: plan.name,
                                currentStock: plan.stock,
                                newStock: String(plan.stock),
                              })
                            }
                            style={{
                              padding: "6px 14px",
                              backgroundColor: "#EEF2FF",
                              color: "#3B5BDB",
                              border: "1px solid #C7D2FE",
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: "#F8FAFF",
            borderRadius: 6,
            border: "1px solid #D1D9E6",
            fontSize: 13,
            color: "#6B7A99",
            textAlign: "center",
          }}
        >
          Showing {sortedPlans.length} of {plans.length} plans
        </div>
      </div>

      {/* Edit Dialog */}
      {editDialog && (
        <EditStockDialog
          state={editDialog}
          onSave={handleSave}
          onClose={() => setEditDialog(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "#3B5BDB",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#6B7A99",
          marginBottom: 8,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  let bgColor = "#F0FDF4";
  let textColor = "#16A34A";

  if (stock < 10) {
    bgColor = "#FEE2E2";
    textColor = "#DC2626";
  } else if (stock < 50) {
    bgColor = "#FFF7ED";
    textColor = "#EA580C";
  }

  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: bgColor,
        color: textColor,
        padding: "6px 12px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {stock} units
    </div>
  );
}
