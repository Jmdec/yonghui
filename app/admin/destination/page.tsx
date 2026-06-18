"use client";

import { useEffect, useRef, useState } from "react";

const API_IMG = process.env.NEXT_PUBLIC_API_IMG ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Destination {
  id: number;
  name: string;
  slug: string;
  flag: string;
  image?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface Plan {
  id: number;
  destination_id: number;
  name: string;
  description?: string | null;
  data_gb?: number | null;
  data_label: string;
  validity_days?: number | null;
  speed: string;
  sim_type: string;
  has_voice: boolean;
  has_data: boolean;
  retail_price: number;
  formatted_price: string;
  sort_order: number;
  is_active: boolean;
  // inventory summary from backend
  codes_available: number;
  codes_assigned: number;
  codes_used: number;
  codes_total: number;
}

interface EsimCode {
  id: number;
  plan_id: number;
  code: string;
  status: "available" | "assigned" | "used";
  created_at: string;
  order_id?: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];
const EMOJI_FONT =
  "'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";

const COMMON_FLAGS = [
  { emoji: "🇵🇭", label: "PH" },
  { emoji: "🇯🇵", label: "JP" },
  { emoji: "🇺🇸", label: "US" },
  { emoji: "🇨🇳", label: "CN" },
  { emoji: "🇭🇰", label: "HK" },
  { emoji: "🇰🇷", label: "KR" },
  { emoji: "🇸🇬", label: "SG" },
  { emoji: "🇹🇼", label: "TW" },
  { emoji: "🇻🇳", label: "VN" },
  { emoji: "🇹🇭", label: "TH" },
  { emoji: "🇮🇩", label: "ID" },
  { emoji: "🇲🇾", label: "MY" },
  { emoji: "🇧🇷", label: "BR" },
  { emoji: "🇨🇦", label: "CA" },
  { emoji: "🇬🇧", label: "GB" },
  { emoji: "🇫🇷", label: "FR" },
  { emoji: "🇩🇪", label: "DE" },
  { emoji: "🇮🇹", label: "IT" },
  { emoji: "🇪🇸", label: "ES" },
  { emoji: "🇦🇺", label: "AU" },
  { emoji: "🇮🇳", label: "IN" },
  { emoji: "🇦🇪", label: "AE" },
  { emoji: "🇸🇦", label: "SA" },
  { emoji: "🇶🇦", label: "QA" },
  { emoji: "🇰🇼", label: "KW" },
  { emoji: "🇧🇭", label: "BH" },
  { emoji: "🇴🇲", label: "OM" },
  { emoji: "🇯🇴", label: "JO" },
  { emoji: "🇱🇧", label: "LB" },
  { emoji: "🇹🇷", label: "TR" },
  { emoji: "🇲🇽", label: "MX" },
  { emoji: "🇦🇷", label: "AR" },
  { emoji: "🇨🇱", label: "CL" },
  { emoji: "🇵🇪", label: "PE" },
  { emoji: "🇳🇿", label: "NZ" },
  { emoji: "🇿🇦", label: "ZA" },
  { emoji: "🇷🇺", label: "RU" },
  { emoji: "🇵🇱", label: "PL" },
  { emoji: "🇳🇱", label: "NL" },
  { emoji: "🇧🇪", label: "BE" },
  { emoji: "🇨🇭", label: "CH" },
  { emoji: "🇸🇪", label: "SE" },
  { emoji: "🇳🇴", label: "NO" },
  { emoji: "🇩🇰", label: "DK" },
  { emoji: "🇫🇮", label: "FI" },
  { emoji: "🇵🇹", label: "PT" },
  { emoji: "🇬🇷", label: "GR" },
  { emoji: "🇨🇿", label: "CZ" },
  { emoji: "🇭🇺", label: "HU" },
  { emoji: "🇷🇴", label: "RO" },
  { emoji: "🌍", label: "GLB" },
  { emoji: "🌏", label: "AS" },
  { emoji: "🌎", label: "AM" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function imgSrc(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_IMG}/${path}`;
}
function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
function adminFetch(url: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 7,
  border: "1px solid #D1D9E6",
  background: "#FFFFFF",
  color: "#1A2540",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Sora', sans-serif",
  transition: "border-color 0.15s",
};
const labelStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#6B7A99",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom: 5,
  display: "block",
  fontFamily: "'IBM Plex Mono', monospace",
  fontWeight: 500,
};
const selectSm: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 5,
  border: "1px solid #D1D9E6",
  background: "#FFFFFF",
  color: "#4A5A7A",
  fontSize: 11,
  outline: "none",
  fontFamily: "'IBM Plex Mono', monospace",
};

// ─── Tag ──────────────────────────────────────────────────────────────────────
function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "blue" | "purple" | "cyan" | "gray" | "green" | "orange" | "red";
}) {
  const colors = {
    blue: { bg: "#EEF2FF", border: "#C7D2FE", text: "#3B5BDB" },
    purple: { bg: "#F5F3FF", border: "#DDD6FE", text: "#7C3AED" },
    cyan: { bg: "#ECFEFF", border: "#A5F3FC", text: "#0891B2" },
    gray: { bg: "#F8FAFF", border: "#D1D9E6", text: "#6B7A99" },
    green: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A" },
    orange: { bg: "#FFF7ED", border: "#FEDBA8", text: "#EA580C" },
    red: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626" },
  };
  const c = colors[color];
  return (
    <span
      style={{
        padding: "2px 7px",
        borderRadius: 4,
        fontSize: 9,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        letterSpacing: "0.5px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {children}
    </span>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({
  total,
  perPage,
  currentPage,
  onPageChange,
  onPerPageChange,
}: {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
}) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const pages: (number | "…")[] = [];
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(lastPage - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < lastPage - 2) pages.push("…");
    pages.push(lastPage);
  }
  const from = Math.min((currentPage - 1) * perPage + 1, total);
  const to = Math.min(currentPage * perPage, total);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        padding: "14px 0 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 11,
            color: "#6B7A99",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {total === 0 ? "No records" : `${from}–${to} of ${total}`}
        </span>
        <select
          value={perPage}
          onChange={(e) => {
            onPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          style={selectSm}
        >
          {ROWS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <PageBtn
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </PageBtn>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              style={{
                color: "#9AAABF",
                padding: "0 4px",
                lineHeight: "28px",
                fontSize: 13,
              }}
            >
              …
            </span>
          ) : (
            <PageBtn
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </PageBtn>
          ),
        )}
        <PageBtn
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </PageBtn>
      </div>
    </div>
  );
}
function PageBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 28,
        height: 28,
        padding: "0 6px",
        border: "1px solid",
        borderColor: active ? "#3B5BDB" : "#D1D9E6",
        borderRadius: 5,
        background: active ? "#EEF2FF" : "#FFFFFF",
        color: active ? "#3B5BDB" : disabled ? "#C5CFE0" : "#4A5A7A",
        fontSize: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {children}
    </button>
  );
}

// ─── Inventory Badge ───────────────────────────────────────────────────────────
function InventoryBadge({
  available,
  assigned,
  used,
  total,
}: {
  available: number;
  assigned: number;
  used: number;
  total: number;
}) {
  if (total === 0)
    return (
      <span
        style={{
          fontSize: 10,
          color: "#C5CFE0",
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        no codes
      </span>
    );
  const pctAvail = total > 0 ? (available / total) * 100 : 0;
  const pctAssign = total > 0 ? (assigned / total) * 100 : 0;
  const pctUsed = total > 0 ? (used / total) * 100 : 0;
  return (
    <div style={{ minWidth: 120 }}>
      <div
        style={{
          height: 5,
          borderRadius: 3,
          background: "#EEF2FA",
          overflow: "hidden",
          display: "flex",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            width: `${pctAvail}%`,
            background: "#22C55E",
            transition: "width .3s",
          }}
        />
        <div style={{ width: `${pctAssign}%`, background: "#3B5BDB" }} />
        <div style={{ width: `${pctUsed}%`, background: "#E2E8F4" }} />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 9,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "#16A34A",
          }}
        >
          {available} avail
        </span>
        <span
          style={{
            fontSize: 9,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "#3B5BDB",
          }}
        >
          {assigned} assigned
        </span>
        <span
          style={{
            fontSize: 9,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "#9AAABF",
          }}
        >
          {used} used
        </span>
      </div>
    </div>
  );
}

// ─── eSIM Codes Modal (per plan) ───────────────────────────────────────────────
function EsimCodesModal({
  plan,
  destination,
  onClose,
}: {
  plan: Plan;
  destination: Destination;
  onClose: () => void;
}) {
  const [codes, setCodes] = useState<EsimCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkText, setBulkText] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "available" | "assigned" | "used"
  >("all");

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/plans/${plan.id}/esim-codes?per_page=500`,
      );
      const data = await res.json();
      setCodes(data.data ?? []);
    } catch {
      setCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [plan.id]);

  const handleBulkAdd = async () => {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      setAddError("Paste at least one code.");
      return;
    }
    setAdding(true);
    setAddError("");
    setAddSuccess("");
    try {
      const res = await adminFetch(
        `/api/admin/plans/${plan.id}/esim-codes/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codes: lines }),
        },
      );
      const d = await res.json();
      if (!res.ok) {
        setAddError(d.message ?? "Failed to add codes.");
        return;
      }
      setAddSuccess(`${d.added ?? lines.length} codes added successfully.`);
      setBulkText("");
      fetchCodes();
    } catch {
      setAddError("Network error.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (codeId: number) => {
    if (!confirm("Delete this code?")) return;
    await adminFetch(`/api/admin/esim-codes/${codeId}`, { method: "DELETE" });
    fetchCodes();
  };

  const filtered = codes.filter(
    (c) => filterStatus === "all" || c.status === filterStatus,
  );
  const availCount = codes.filter((c) => c.status === "available").length;
  const assignedCount = codes.filter((c) => c.status === "assigned").length;
  const usedCount = codes.filter((c) => c.status === "used").length;

  const statusColor = (s: string) =>
    ({
      available: { bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
      assigned: { bg: "#EEF2FF", border: "#BFCFFF", color: "#3B5BDB" },
      used: { bg: "#F8FAFF", border: "#D1D9E6", color: "#9AAABF" },
    })[s] ?? { bg: "#F8FAFF", border: "#D1D9E6", color: "#6B7A99" };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,25,60,0.5)",
          zIndex: 1100,
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(640px, 100vw)",
          background: "#FAFBFE",
          borderLeft: "1px solid #D1D9E6",
          boxShadow: "-8px 0 40px rgba(30,50,120,0.14)",
          zIndex: 1150,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #EEF2FA",
            background: "#FFFFFF",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "#7C3AED",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                // esim code inventory
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {destination.flag} {plan.name}
              </h2>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 11,
                  color: "#9AAABF",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {availCount} available · {assignedCount} assigned · {usedCount}{" "}
                used
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#F1F4FA",
                border: "1px solid #D1D9E6",
                color: "#6B7A99",
                width: 32,
                height: 32,
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

          {/* Bulk add */}
          <div
            style={{
              marginTop: 16,
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <label style={{ ...labelStyle, color: "#7C3AED" }}>
              Bulk Add Codes (one per line)
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"QRCODE-ABC123\nQRCODE-DEF456\nQRCODE-GHI789"}
              style={{
                ...inputStyle,
                minHeight: 80,
                resize: "vertical",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
              }}
            />
            {addError && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 11,
                  color: "#DC2626",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {addError}
              </p>
            )}
            {addSuccess && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 11,
                  color: "#16A34A",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {addSuccess}
              </p>
            )}
            <button
              onClick={handleBulkAdd}
              disabled={adding}
              style={{
                marginTop: 10,
                padding: "8px 18px",
                borderRadius: 7,
                border: "1.5px solid #7C3AED",
                background: "#7C3AED",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                cursor: adding ? "not-allowed" : "pointer",
                opacity: adding ? 0.7 : 1,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {adding
                ? "Adding…"
                : `+ Add ${bulkText.split("\n").filter((l) => l.trim()).length || ""} Codes`}
            </button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {(["all", "available", "assigned", "used"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "all .15s",
                  borderColor: filterStatus === s ? "#7C3AED" : "#D1D9E6",
                  background: filterStatus === s ? "#7C3AED" : "#FFFFFF",
                  color: filterStatus === s ? "#FFFFFF" : "#9AAABF",
                }}
              >
                {s}{" "}
                {s !== "all" &&
                  `(${codes.filter((c) => c.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Code list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px" }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#9AAABF",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
              }}
            >
              loading codes…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <div
                style={{
                  color: "#9AAABF",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                }}
              >
                {filterStatus === "all"
                  ? "No codes yet — paste some above"
                  : `No ${filterStatus} codes`}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.map((code) => {
                const sc = statusColor(code.status);
                return (
                  <div
                    key={code.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F4",
                      borderRadius: 8,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12,
                        color: "#0F172A",
                        flex: 1,
                        wordBreak: "break-all",
                      }}
                    >
                      {code.code}
                    </span>
                    {code.order_id && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#9AAABF",
                          fontFamily: "'IBM Plex Mono', monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        order #{code.order_id}
                      </span>
                    )}
                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: 9,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 600,
                        letterSpacing: "1px",
                        background: sc.bg,
                        border: `1px solid ${sc.border}`,
                        color: sc.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {code.status}
                    </span>
                    {code.status === "available" && (
                      <button
                        onClick={() => handleDelete(code.id)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 5,
                          fontSize: 10,
                          border: "1px solid #FECACA",
                          background: "#FFFFFF",
                          color: "#DC2626",
                          cursor: "pointer",
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        del
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Plan Modal ────────────────────────────────────────────────────────────────
function PlanModal({
  mode,
  destination,
  initial,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  destination: Destination;
  initial?: Plan;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dataGb, setDataGb] = useState(
    initial?.data_gb != null ? String(initial.data_gb) : "",
  );
  const [unlimited, setUnlimited] = useState(
    initial?.data_gb == null && mode === "edit",
  );
  const [validityDays, setValidityDays] = useState(
    initial?.validity_days != null ? String(initial.validity_days) : "",
  );
  const [speed, setSpeed] = useState(initial?.speed ?? "4G/5G");
  const [simType, setSimType] = useState(initial?.sim_type ?? "eSIM");
  const [hasVoice, setHasVoice] = useState(initial?.has_voice ?? false);
  const [retailPrice, setRetailPrice] = useState(
    initial?.retail_price != null ? String(initial.retail_price) : "",
  );
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!retailPrice || isNaN(Number(retailPrice))) {
      setError("Valid retail price is required.");
      return;
    }
    setLoading(true);
    setError("");
    const body = {
      name,
      description: description || null,
      data_gb: unlimited ? null : dataGb ? Number(dataGb) : null,
      validity_days: validityDays ? Number(validityDays) : null,
      speed,
      sim_type: simType,
      has_voice: hasVoice,
      has_data: true,
      retail_price: Number(retailPrice),
      sort_order: sortOrder,
      is_active: isActive,
    };
    try {
      const url =
        mode === "add"
          ? `/api/admin/destinations/${destination.id}/plans`
          : `/api/admin/destinations/${destination.id}/plans/${initial!.id}`;
      const res = await adminFetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message ?? "Something went wrong.");
        return;
      }
      onSaved();
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
        zIndex: 1200,
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
          maxWidth: 560,
          boxShadow: "0 8px 40px rgba(30,50,120,0.12)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "#3B5BDB",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {mode === "add" ? "// new plan" : "// edit plan"} ·{" "}
              {destination.flag} {destination.name}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {mode === "add" ? "Add Plan" : `Edit — ${initial?.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F1F4FA",
              border: "1px solid #D1D9E6",
              color: "#6B7A99",
              fontSize: 14,
              cursor: "pointer",
              width: 30,
              height: 30,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 7,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 12,
              color: "#DC2626",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Plan Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Japan 7-Day 10GB eSIM"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional short description"
            style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Data (GB)</label>
            <input
              value={unlimited ? "" : dataGb}
              onChange={(e) => setDataGb(e.target.value)}
              disabled={unlimited}
              placeholder="e.g. 10"
              type="number"
              min="0"
              step="0.5"
              style={{
                ...inputStyle,
                fontFamily: "'IBM Plex Mono', monospace",
                opacity: unlimited ? 0.4 : 1,
              }}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "'IBM Plex Mono', monospace",
                color: "#6B7A99",
              }}
            >
              <input
                type="checkbox"
                checked={unlimited}
                onChange={(e) => setUnlimited(e.target.checked)}
              />
              Unlimited
            </label>
          </div>
          <div>
            <label style={labelStyle}>Validity (Days)</label>
            <input
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              placeholder="e.g. 7"
              type="number"
              min="1"
              style={{
                ...inputStyle,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Speed</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["4G/5G", "4G", "5G", "3G"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                    border: "1.5px solid",
                    borderColor: speed === s ? "#3B5BDB" : "#D1D9E6",
                    background: speed === s ? "#EEF2FF" : "#FFFFFF",
                    color: speed === s ? "#3B5BDB" : "#9AAABF",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>SIM Type</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["eSIM", "Physical"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimType(s)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                    border: "1.5px solid",
                    borderColor: simType === s ? "#3B5BDB" : "#D1D9E6",
                    background: simType === s ? "#EEF2FF" : "#FFFFFF",
                    color: simType === s ? "#3B5BDB" : "#9AAABF",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Voice Calls</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setHasVoice(v)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 7,
                  fontSize: 11,
                  cursor: "pointer",
                  border: "1.5px solid",
                  fontFamily: "'IBM Plex Mono', monospace",
                  borderColor: hasVoice === v ? "#3B5BDB" : "#D1D9E6",
                  background: hasVoice === v ? "#EEF2FF" : "#FFFFFF",
                  color: hasVoice === v ? "#3B5BDB" : "#9AAABF",
                }}
              >
                {v ? "Voice + Data" : "Data Only"}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <label style={labelStyle}>Retail Price (PHP) *</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9AAABF",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                }}
              >
                ₱
              </span>
              <input
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                placeholder="660"
                type="number"
                min="0"
                step="0.01"
                style={{
                  ...inputStyle,
                  paddingLeft: 24,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Sort</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              style={{
                ...inputStyle,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setIsActive(v)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 7,
                    fontSize: 10,
                    cursor: "pointer",
                    border: "1.5px solid",
                    fontFamily: "'IBM Plex Mono', monospace",
                    borderColor:
                      isActive === v ? (v ? "#3B5BDB" : "#DC2626") : "#D1D9E6",
                    background:
                      isActive === v ? (v ? "#EEF2FF" : "#FEF2F2") : "#FFFFFF",
                    color:
                      isActive === v ? (v ? "#3B5BDB" : "#DC2626") : "#9AAABF",
                  }}
                >
                  {v ? "active" : "inactive"}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 24px",
              borderRadius: 7,
              border: "1.5px solid #3B5BDB",
              background: "#3B5BDB",
              color: "#FFFFFF",
              fontSize: 13,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {loading ? "Saving…" : mode === "add" ? "Add Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Plan Modal ─────────────────────────────────────────────────────────
function DeletePlanModal({
  plan,
  destination,
  onClose,
  onDeleted,
}: {
  plan: Plan;
  destination: Destination;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await adminFetch(
        `/api/admin/destinations/${destination.id}/plans/${plan.id}`,
        { method: "DELETE" },
      );
      onDeleted();
      onClose();
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
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAFBFE",
          border: "1px solid #FECACA",
          borderRadius: 14,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 40px rgba(30,50,120,0.1)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            margin: "0 auto 14px",
          }}
        >
          ⚠️
        </div>
        <h3
          style={{
            margin: "0 0 8px",
            textAlign: "center",
            color: "#DC2626",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Delete Plan
        </h3>
        <p
          style={{
            textAlign: "center",
            color: "#6B7A99",
            fontSize: 13,
            margin: "0 0 6px",
            lineHeight: 1.6,
          }}
        >
          Delete <strong style={{ color: "#1A2540" }}>{plan.name}</strong>?
        </p>
        <p
          style={{
            textAlign: "center",
            color: "#DC2626",
            fontSize: 12,
            margin: "0 0 24px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          ⚠️ All {plan.codes_total} eSIM codes in this plan will also be
          deleted.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
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
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "9px 20px",
              borderRadius: 7,
              border: "1.5px solid #DC2626",
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Plans Drawer ──────────────────────────────────────────────────────────────
function PlansDrawer({
  destination,
  onClose,
}: {
  destination: Destination;
  onClose: () => void;
}) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Plan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [codesTarget, setCodesTarget] = useState<Plan | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/destinations/${destination.id}/plans?per_page=100`,
      );
      const data = await res.json();
      setPlans(data.data ?? []);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [destination.id]);

  const totalAvailable = plans.reduce(
    (s, p) => s + (p.codes_available ?? 0),
    0,
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,25,60,0.4)",
          zIndex: 900,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(720px, 100vw)",
          background: "#FAFBFE",
          borderLeft: "1px solid #D1D9E6",
          boxShadow: "-8px 0 40px rgba(30,50,120,0.12)",
          zIndex: 950,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #EEF2FA",
            background: "#FFFFFF",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "#3B5BDB",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                // destination plans
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontFamily: EMOJI_FONT, fontSize: 24 }}>
                  {destination.flag}
                </span>
                {destination.name}
              </h2>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 11,
                  color: "#9AAABF",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {plans.length} plan{plans.length !== 1 ? "s" : ""} ·{" "}
                {totalAvailable} codes available total
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 7,
                  border: "1.5px solid #3B5BDB",
                  background: "#3B5BDB",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                + Add Plan
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "#F1F4FA",
                  border: "1px solid #D1D9E6",
                  color: "#6B7A99",
                  fontSize: 14,
                  cursor: "pointer",
                  width: 34,
                  height: 34,
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Plans list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {loading ? (
            <div
              style={{
                color: "#9AAABF",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                padding: "32px 0",
                textAlign: "center",
              }}
            >
              loading plans…
            </div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <div
                style={{
                  color: "#9AAABF",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  marginBottom: 16,
                }}
              >
                no plans yet
              </div>
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  padding: "9px 20px",
                  borderRadius: 7,
                  border: "1.5px solid #3B5BDB",
                  background: "#EEF2FF",
                  color: "#3B5BDB",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                }}
              >
                + Add First Plan
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F4",
                    borderRadius: 10,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Price */}
                  <div
                    style={{
                      minWidth: 72,
                      textAlign: "center",
                      background: "#F0F4FF",
                      border: "1px solid #C7D2FE",
                      borderRadius: 8,
                      padding: "8px 6px",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#3B5BDB",
                        lineHeight: 1,
                      }}
                    >
                      {plan.formatted_price}
                    </div>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 8,
                        color: "#9AAABF",
                        marginTop: 3,
                      }}
                    >
                      PHP
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0F172A",
                        fontSize: 13,
                        marginBottom: 5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {plan.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                        marginBottom: 6,
                      }}
                    >
                      <Tag color="blue">{plan.data_label}</Tag>
                      {plan.validity_days && (
                        <Tag color="purple">{plan.validity_days}d</Tag>
                      )}
                      <Tag color="cyan">{plan.speed}</Tag>
                      <Tag color="gray">{plan.sim_type}</Tag>
                      {plan.has_voice && <Tag color="green">Voice</Tag>}
                    </div>
                    {/* Inventory bar */}
                    <InventoryBadge
                      available={plan.codes_available ?? 0}
                      assigned={plan.codes_assigned ?? 0}
                      used={plan.codes_used ?? 0}
                      total={plan.codes_total ?? 0}
                    />
                  </div>

                  {/* Status */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 9px",
                      borderRadius: 20,
                      fontSize: 8,
                      fontFamily: "'IBM Plex Mono', monospace",
                      letterSpacing: "1.5px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      border: `1px solid ${plan.is_active ? "#BFCFFF" : "#FECACA"}`,
                      background: plan.is_active ? "#EEF2FF" : "#FEF2F2",
                      color: plan.is_active ? "#3B5BDB" : "#DC2626",
                    }}
                  >
                    {plan.is_active ? "ACTIVE" : "OFF"}
                  </span>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    <button
                      onClick={() => setCodesTarget(plan)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 5,
                        fontSize: 11,
                        cursor: "pointer",
                        border: "1px solid #DDD6FE",
                        background: "#F5F3FF",
                        color: "#7C3AED",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 600,
                        transition: "all .15s",
                      }}
                    >
                      codes{" "}
                      {plan.codes_available > 0
                        ? `(${plan.codes_available})`
                        : ""}
                    </button>
                    <button
                      onClick={() => setEditTarget(plan)}
                      className="action-btn"
                      style={{
                        padding: "5px 10px",
                        borderRadius: 5,
                        border: "1px solid #D1D9E6",
                        background: "#FFFFFF",
                        color: "#6B7A99",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(plan)}
                      className="del-btn"
                      style={{
                        padding: "5px 10px",
                        borderRadius: 5,
                        border: "1px solid #FECACA",
                        background: "#FFFFFF",
                        color: "#9AAABF",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <PlanModal
          mode="add"
          destination={destination}
          onClose={() => setShowAdd(false)}
          onSaved={fetchPlans}
        />
      )}
      {editTarget && (
        <PlanModal
          mode="edit"
          destination={destination}
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={fetchPlans}
        />
      )}
      {deleteTarget && (
        <DeletePlanModal
          plan={deleteTarget}
          destination={destination}
          onClose={() => setDeleteTarget(null)}
          onDeleted={fetchPlans}
        />
      )}
      {codesTarget && (
        <EsimCodesModal
          plan={codesTarget}
          destination={destination}
          onClose={() => {
            setCodesTarget(null);
            fetchPlans();
          }}
        />
      )}
    </>
  );
}

// ─── Destination Modal ─────────────────────────────────────────────────────────
function DestinationModal({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  initial?: Destination;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");

  const [flag, setFlag] = useState(initial?.flag ?? "🌍");
  const [customFlag, setCustomFlag] = useState("");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    imgSrc(initial?.image) ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (v: string) => {
    setName(v);
    if (mode === "add") setSlug(toSlug(v));
  };
  const handleFile = (f: File) => {
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("slug", slug);
    fd.append("flag", customFlag || flag);
    fd.append("sort_order", String(sortOrder));
    fd.append("is_active", isActive ? "1" : "0");
    if (imageFile) fd.append("image", imageFile);
    try {
      const url =
        mode === "add"
          ? "/api/destinations"
          : `/api/destinations/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message ?? "Something went wrong.");
        return;
      }
      onSaved();
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
        background: "rgba(15,25,60,0.45)",
        zIndex: 1000,
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
          maxWidth: 560,
          boxShadow: "0 8px 40px rgba(30,50,120,0.12)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "#3B5BDB",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {mode === "add" ? "// new record" : "// edit record"}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {mode === "add" ? "Add Destination" : `Edit — ${initial?.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F1F4FA",
              border: "1px solid #D1D9E6",
              color: "#6B7A99",
              fontSize: 14,
              cursor: "pointer",
              width: 30,
              height: 30,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 7,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 12,
              color: "#DC2626",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Cover Image</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            style={{
              border: "1.5px dashed #C5CFE0",
              borderRadius: 8,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              background: "#F8FAFF",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ textAlign: "center", color: "#9AAABF" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>📷</div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  click or drag to upload
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Destination Name *</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Japan"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(toSlug(e.target.value))}
            placeholder="e.g. japan"
            style={{
              ...inputStyle,
              fontFamily: "'IBM Plex Mono', monospace",
              color: "#3B5BDB",
              background: "#F5F7FF",
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Flag Emoji</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
              gap: 6,
              marginBottom: 10,
              maxHeight: 180,
              overflowY: "auto",
              padding: "4px 2px",
            }}
          >
            {COMMON_FLAGS.map((f) => {
              const isSelected = flag === f.emoji && !customFlag;
              return (
                <button
                  key={f.emoji}
                  onClick={() => {
                    setFlag(f.emoji);
                    setCustomFlag("");
                  }}
                  title={f.label}
                  style={{
                    width: "100%",
                    height: 46,
                    borderRadius: 7,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: isSelected ? "#3B5BDB" : "#D1D9E6",
                    background: isSelected ? "#EEF2FF" : "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      lineHeight: 1,
                      fontFamily: EMOJI_FONT,
                    }}
                  >
                    {f.emoji}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: isSelected ? "#3B5BDB" : "#9AAABF",
                      fontWeight: 600,
                    }}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            value={customFlag}
            onChange={(e) => setCustomFlag(e.target.value)}
            placeholder="Or type custom emoji / text"
            style={{ ...inputStyle, fontSize: 16, fontFamily: EMOJI_FONT }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <label style={labelStyle}>Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              style={{
                ...inputStyle,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setIsActive(v)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 7,
                    fontSize: 11,
                    cursor: "pointer",
                    border: "1.5px solid",
                    fontFamily: "'IBM Plex Mono', monospace",
                    borderColor:
                      isActive === v ? (v ? "#3B5BDB" : "#DC2626") : "#D1D9E6",
                    background:
                      isActive === v ? (v ? "#EEF2FF" : "#FEF2F2") : "#FFFFFF",
                    color:
                      isActive === v ? (v ? "#3B5BDB" : "#DC2626") : "#9AAABF",
                  }}
                >
                  {v ? "active" : "inactive"}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 24px",
              borderRadius: 7,
              border: "1.5px solid #3B5BDB",
              background: "#3B5BDB",
              color: "#FFFFFF",
              fontSize: 13,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {loading
              ? "Saving…"
              : mode === "add"
                ? "Add Destination"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Destination Modal ──────────────────────────────────────────────────
function DeleteModal({
  destination,
  onClose,
  onDeleted,
}: {
  destination: Destination;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/destinations/${destination.id}`, { method: "DELETE" });
      onDeleted();
      onClose();
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
        background: "rgba(15,25,60,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAFBFE",
          border: "1px solid #FECACA",
          borderRadius: 14,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 40px rgba(30,50,120,0.1)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            margin: "0 auto 14px",
          }}
        >
          ⚠️
        </div>
        <h3
          style={{
            margin: "0 0 8px",
            textAlign: "center",
            color: "#DC2626",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Delete Destination
        </h3>
        <p
          style={{
            textAlign: "center",
            color: "#6B7A99",
            fontSize: 13,
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          Delete{" "}
          <strong style={{ color: "#1A2540" }}>
            {destination.flag} {destination.name}
          </strong>
          ? All plans and their eSIM codes will also be deleted.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
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
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "9px 20px",
              borderRadius: 7,
              border: "1.5px solid #DC2626",
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Destination | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  const [plansTarget, setPlansTarget] = useState<Destination | null>(null);

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase()),
  );
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/destinations?per_page=1000`);
      const data = await res.json();
      setDestinations(data.data ?? []);
      setMeta(
        data.meta ?? {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: data.data?.length ?? 0,
        },
      );
    } catch {
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, perPage]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&family=Noto+Color+Emoji&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .dest-row:hover td { background: #F5F7FF !important; }
        .action-btn:hover { border-color: #3B5BDB !important; color: #3B5BDB !important; background: #EEF2FF !important; }
        .del-btn:hover { border-color: #DC2626 !important; color: #DC2626 !important; background: #FEF2F2 !important; }
        .plans-btn:hover { border-color: #0891B2 !important; color: #0891B2 !important; background: #ECFEFF !important; }
        .codes-btn:hover { border-color: #7C3AED !important; color: #7C3AED !important; background: #F5F3FF !important; }
        .add-btn:hover { background: #2F4AC5 !important; border-color: #2F4AC5 !important; }
        input:focus, textarea:focus { border-color: #3B5BDB !important; box-shadow: 0 0 0 3px rgba(59,91,219,0.1) !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #F1F4FA; }
        ::-webkit-scrollbar-thumb { background: #C5CFE0; border-radius: 3px; }
      `}</style>

      <div style={{ fontFamily: "'Sora', sans-serif", color: "#1A2540" }}>
        {/* Page Header */}
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
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "#3B5BDB",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginBottom: 6,
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
              Admin / Destinations
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Manage Destinations
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "#9AAABF",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {meta.total} record{meta.total !== 1 ? "s" : ""} · click "plans"
              to manage plans + eSIM codes
            </p>
          </div>
          <button
            className="add-btn"
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1.5px solid #3B5BDB",
              background: "#3B5BDB",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              boxShadow: "0 2px 8px rgba(59,91,219,0.2)",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 400 }}>
              +
            </span>
            Add Destination
          </button>
        </div>

        {/* Table Card */}
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
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              background: "#FAFBFE",
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or slug…"
                style={{
                  ...inputStyle,
                  paddingLeft: 32,
                  background: "#FFFFFF",
                }}
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9AAABF",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                clear ×
              </button>
            )}
          </div>

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
                    "#",
                    "Flag",
                    "Image",
                    "Name",
                    "Slug",
                    "Order",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 9,
                        fontFamily: "'IBM Plex Mono', monospace",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#9AAABF",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #EEF2FA",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: "48px 0",
                        textAlign: "center",
                        color: "#9AAABF",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12,
                      }}
                    >
                      loading…
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: "48px 0",
                        textAlign: "center",
                        color: "#9AAABF",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12,
                      }}
                    >
                      {search
                        ? `no results for "${search}"`
                        : "no destinations yet — add one!"}
                    </td>
                  </tr>
                ) : (
                  paginated.map((d, i) => (
                    <tr
                      key={d.id}
                      className="dest-row"
                      onClick={() => setPlansTarget(d)}
                      style={{
                        borderTop: "1px solid #F1F4FA",
                        cursor: "pointer",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#C5CFE0",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 11,
                        }}
                      >
                        {String((currentPage - 1) * perPage + i + 1).padStart(
                          2,
                          "0",
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 22,
                          fontFamily: EMOJI_FONT,
                        }}
                      >
                        {d.flag}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {imgSrc(d.image) ? (
                          <img
                            src={imgSrc(d.image)!}
                            alt={d.name}
                            style={{
                              width: 52,
                              height: 36,
                              objectFit: "cover",
                              borderRadius: 5,
                              border: "1px solid #E2E8F4",
                              display: "block",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 52,
                              height: 36,
                              borderRadius: 5,
                              background: "#F1F4FA",
                              border: "1px solid #E2E8F4",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                              fontFamily: EMOJI_FONT,
                            }}
                          >
                            {d.flag}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "#0F172A",
                        }}
                      >
                        {d.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 11,
                          color: "#3B5BDB",
                          background: "#F8FAFF",
                        }}
                      >
                        {d.slug}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#9AAABF",
                          textAlign: "center",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 12,
                        }}
                      >
                        {d.sort_order}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 9,
                            fontFamily: "'IBM Plex Mono', monospace",
                            letterSpacing: "1.5px",
                            fontWeight: 600,
                            border: `1px solid ${d.is_active ? "#BFCFFF" : "#FECACA"}`,
                            background: d.is_active ? "#EEF2FF" : "#FEF2F2",
                            color: d.is_active ? "#3B5BDB" : "#DC2626",
                          }}
                        >
                          {d.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            className="plans-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlansTarget(d);
                            }}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 5,
                              border: "1px solid #A5F3FC",
                              background: "#ECFEFF",
                              color: "#0891B2",
                              fontSize: 11,
                              cursor: "pointer",
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontWeight: 600,
                            }}
                          >
                            plans
                          </button>
                          <button
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditTarget(d);
                            }}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 5,
                              border: "1px solid #D1D9E6",
                              background: "#FFFFFF",
                              color: "#6B7A99",
                              fontSize: 11,
                              cursor: "pointer",
                              fontFamily: "'IBM Plex Mono', monospace",
                            }}
                          >
                            edit
                          </button>
                          <button
                            className="del-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(d);
                            }}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 5,
                              border: "1px solid #FECACA",
                              background: "#FFFFFF",
                              color: "#9AAABF",
                              fontSize: 11,
                              cursor: "pointer",
                              fontFamily: "'IBM Plex Mono', monospace",
                            }}
                          >
                            del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "0 20px 16px",
              borderTop: "1px solid #EEF2FA",
              background: "#FAFBFE",
            }}
          >
            <Pagination
              total={filtered.length}
              perPage={perPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPerPageChange={setPerPage}
            />
          </div>
        </div>
      </div>

      {showAdd && (
        <DestinationModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSaved={fetchDestinations}
        />
      )}
      {editTarget && (
        <DestinationModal
          mode="edit"
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={fetchDestinations}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          destination={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={fetchDestinations}
        />
      )}
      {plansTarget && (
        <PlansDrawer
          destination={plansTarget}
          onClose={() => setPlansTarget(null)}
        />
      )}
    </>
  );
}
