"use client";

import { useEffect, useRef, useState } from "react";

const API_IMG = process.env.NEXT_PUBLIC_API_IMG ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  price: number;
  images?: string[] | null;
  data_amount?: string | null;
  duration_label?: string | null;
  validity_days?: number | null;
  destination_name?: string | null;
  features?: string[] | null;
  popular: boolean;
  requires_shipping: boolean;
  is_active: boolean;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];
const PRODUCT_TYPES = [
  { value: "physical", label: "Physical" },
  { value: "dongle", label: "Dongle" },
  { value: "addon", label: "Add-on" },
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
function formatPrice(price: number) {
  return price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

// ─── Image strip (table cell) ──────────────────────────────────────────────────
function ImageStrip({ images }: { images?: string[] | null }) {
  const srcs = (images ?? []).map(imgSrc).filter(Boolean) as string[];
  if (srcs.length === 0) {
    return (
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
          fontSize: 16,
          color: "#C5CFE0",
        }}
      >
        📦
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <img
        src={srcs[0]}
        alt=""
        style={{
          width: 52,
          height: 36,
          objectFit: "cover",
          borderRadius: 5,
          border: "1px solid #E2E8F4",
          display: "block",
          flexShrink: 0,
        }}
      />
      {srcs.length > 1 && (
        <span
          style={{
            fontSize: 9,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "#9AAABF",
            background: "#F1F4FA",
            border: "1px solid #E2E8F4",
            borderRadius: 4,
            padding: "2px 5px",
            flexShrink: 0,
          }}
        >
          +{srcs.length - 1}
        </span>
      )}
    </div>
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

// ─── Toggle button group ───────────────────────────────────────────────────────
function ToggleGroup({
  value,
  onChange,
  options,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  options: [string, string];
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {([true, false] as const).map((v) => (
        <button
          key={String(v)}
          onClick={() => onChange(v)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 7,
            fontSize: 11,
            cursor: "pointer",
            border: "1.5px solid",
            fontFamily: "'IBM Plex Mono', monospace",
            borderColor: value === v ? "#3B5BDB" : "#D1D9E6",
            background: value === v ? "#EEF2FF" : "#FFFFFF",
            color: value === v ? "#3B5BDB" : "#9AAABF",
          }}
        >
          {v ? options[0] : options[1]}
        </button>
      ))}
    </div>
  );
}

// ─── Image upload zone (multi) ─────────────────────────────────────────────────
interface PendingImage {
  id: string; // local uuid for keying
  file: File;
  preview: string;
}

function MultiImageUpload({
  existingImages, // paths already on server
  onExistingRemove, // called with path to remove
  pendingImages,
  onPendingAdd,
  onPendingRemove,
}: {
  existingImages: string[];
  onExistingRemove: (path: string) => void;
  pendingImages: PendingImage[];
  onPendingAdd: (imgs: PendingImage[]) => void;
  onPendingRemove: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const totalCount = existingImages.length + pendingImages.length;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming: PendingImage[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
    }));
    onPendingAdd(incoming);
  };

  return (
    <div>
      <label style={labelStyle}>
        Product Images
        <span style={{ color: "#C5CFE0", marginLeft: 6, fontWeight: 400 }}>
          up to 10 · drag & drop or click
        </span>
      </label>

      {/* Thumbnails grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: totalCount > 0 ? 10 : 0,
        }}
      >
        {/* Existing server images */}
        {existingImages.map((path) => (
          <div
            key={path}
            style={{
              position: "relative",
              width: 80,
              height: 60,
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid #E2E8F4",
              flexShrink: 0,
            }}
          >
            <img
              src={imgSrc(path)!}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => onExistingRemove(path)}
              title="Remove"
              style={{
                position: "absolute",
                top: 3,
                right: 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "none",
                background: "rgba(220,38,38,0.85)",
                color: "#fff",
                fontSize: 10,
                lineHeight: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              ✕
            </button>
            <div
              style={{
                position: "absolute",
                bottom: 2,
                left: 3,
                fontSize: 8,
                fontFamily: "'IBM Plex Mono', monospace",
                color: "rgba(255,255,255,0.85)",
                background: "rgba(0,0,0,0.4)",
                padding: "1px 4px",
                borderRadius: 3,
              }}
            >
              saved
            </div>
          </div>
        ))}

        {/* Pending new images */}
        {pendingImages.map((img) => (
          <div
            key={img.id}
            style={{
              position: "relative",
              width: 80,
              height: 60,
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid #BFCFFF",
              flexShrink: 0,
            }}
          >
            <img
              src={img.preview}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => onPendingRemove(img.id)}
              title="Remove"
              style={{
                position: "absolute",
                top: 3,
                right: 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "none",
                background: "rgba(220,38,38,0.85)",
                color: "#fff",
                fontSize: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              ✕
            </button>
            <div
              style={{
                position: "absolute",
                bottom: 2,
                left: 3,
                fontSize: 8,
                fontFamily: "'IBM Plex Mono', monospace",
                color: "rgba(255,255,255,0.9)",
                background: "rgba(59,91,219,0.6)",
                padding: "1px 4px",
                borderRadius: 3,
              }}
            >
              new
            </div>
          </div>
        ))}

        {/* Drop zone — always visible if under limit */}
        {totalCount < 10 && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            style={{
              width: 80,
              height: 60,
              borderRadius: 6,
              border: "1.5px dashed #C5CFE0",
              background: "#F8FAFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              gap: 2,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>＋</span>
            <span
              style={{
                fontSize: 9,
                color: "#9AAABF",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              add
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {totalCount > 0 && (
        <div
          style={{
            fontSize: 10,
            color: "#9AAABF",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {existingImages.length} saved · {pendingImages.length} new ·{" "}
          {totalCount}/10 total
        </div>
      )}
    </div>
  );
}

// ─── Product Modal (Add / Edit) ────────────────────────────────────────────────
function ProductModal({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  initial?: Product;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [type, setType] = useState(initial?.type ?? "dongle");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : "",
  );
  const [dataAmount, setDataAmount] = useState(initial?.data_amount ?? "");
  const [durationLabel, setDurationLabel] = useState(
    initial?.duration_label ?? "",
  );
  const [validityDays, setValidityDays] = useState(
    initial?.validity_days != null ? String(initial.validity_days) : "",
  );
  const [destinationName, setDestinationName] = useState(
    initial?.destination_name ?? "",
  );
  const [featuresText, setFeaturesText] = useState(
    (initial?.features ?? []).join("\n"),
  );
  const [popular, setPopular] = useState(initial?.popular ?? false);
  const [requiresShipping, setRequiresShipping] = useState(
    initial?.requires_shipping ?? true,
  );
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  // Image state
  const [existingImages, setExistingImages] = useState<string[]>(
    initial?.images ?? [],
  );
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (v: string) => {
    setName(v);
    if (mode === "add") setSlug(toSlug(v));
  };

  const handleExistingRemove = (path: string) => {
    setExistingImages((prev) => prev.filter((p) => p !== path));
    setRemovedImages((prev) => [...prev, path]);
  };
  const handlePendingAdd = (imgs: PendingImage[]) => {
    setPendingImages((prev) => {
      const room = 10 - existingImages.length - prev.length;
      return [...prev, ...imgs.slice(0, room)];
    });
  };
  const handlePendingRemove = (id: string) => {
    setPendingImages((prev) => prev.filter((img) => img.id !== id));
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
    if (!price || isNaN(Number(price))) {
      setError("Valid price is required.");
      return;
    }

    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("slug", slug);
    fd.append("type", type);
    fd.append("description", description || "");
    fd.append("price", price);
    fd.append("data_amount", dataAmount || "");
    fd.append("duration_label", durationLabel || "");
    fd.append("validity_days", validityDays || "");
    fd.append("destination_name", destinationName || "");
    const features = featuresText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    fd.append("features", JSON.stringify(features));
    fd.append("popular", popular ? "1" : "0");
    fd.append("requires_shipping", requiresShipping ? "1" : "0");
    fd.append("is_active", isActive ? "1" : "0");

    // New image files
    pendingImages.forEach((img) => fd.append("images[]", img.file));

    if (mode === "edit") {
      fd.append("_method", "PUT");
      fd.append("removed_images", JSON.stringify(removedImages));
    }

    try {
      const url =
        mode === "add" ? "/api/products" : `/api/products/${initial!.id}`;
      const res = await fetch(url, { method: "POST", body: fd });
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
          maxWidth: 640,
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
              {mode === "add" ? "// new product" : "// edit product"}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {mode === "add" ? "Add Product" : `Edit — ${initial?.name}`}
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

        {/* Multi-image upload */}
        <div style={{ marginBottom: 20 }}>
          <MultiImageUpload
            existingImages={existingImages}
            onExistingRemove={handleExistingRemove}
            pendingImages={pendingImages}
            onPendingAdd={handlePendingAdd}
            onPendingRemove={handlePendingRemove}
          />
        </div>

        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Product Name *</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. USB-C Travel Internet Dongle"
            style={inputStyle}
          />
        </div>

        {/* Slug + Type */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              placeholder="usb-c-dongle-50gb"
              style={{
                ...inputStyle,
                fontFamily: "'IBM Plex Mono', monospace",
                color: "#3B5BDB",
                background: "#F5F7FF",
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: "flex", gap: 6 }}>
              {PRODUCT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                    border: "1.5px solid",
                    borderColor: type === t.value ? "#3B5BDB" : "#D1D9E6",
                    background: type === t.value ? "#EEF2FF" : "#FFFFFF",
                    color: type === t.value ? "#3B5BDB" : "#9AAABF",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown on the product page"
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Price (PHP) *</label>
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="3500"
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

        {/* Data amount + Duration label */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Data Amount</label>
            <input
              value={dataAmount}
              onChange={(e) => setDataAmount(e.target.value)}
              placeholder="e.g. 50 GB"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Duration Label</label>
            <input
              value={durationLabel}
              onChange={(e) => setDurationLabel(e.target.value)}
              placeholder="e.g. 365 days"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Validity days + Destination name */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Validity (Days)</label>
            <input
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              placeholder="e.g. 365"
              type="number"
              min="0"
              style={{
                ...inputStyle,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Destination / Coverage</label>
            <input
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              placeholder="e.g. China / HK / Macau"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Features (one per line)</label>
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            placeholder={
              "50 GB data included\nValid for 1 year from first use\nNo VPN required"
            }
            style={{
              ...inputStyle,
              minHeight: 90,
              resize: "vertical",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
            }}
          />
        </div>

        {/* Toggles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <label style={labelStyle}>Top Pick</label>
            <ToggleGroup
              value={popular}
              onChange={setPopular}
              options={["yes", "no"]}
            />
          </div>
          <div>
            <label style={labelStyle}>Ships Physically</label>
            <ToggleGroup
              value={requiresShipping}
              onChange={setRequiresShipping}
              options={["yes", "no"]}
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <ToggleGroup
              value={isActive}
              onChange={setIsActive}
              options={["active", "inactive"]}
            />
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
                ? "Add Product"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({
  product,
  onClose,
  onDeleted,
}: {
  product: Product;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/products/${product.id}`, { method: "DELETE" });
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
          Delete Product
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
          Delete <strong style={{ color: "#1A2540" }}>{product.name}</strong>?
          All images will be permanently removed.
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
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?per_page=1000`);
      const data = await res.json();
      setProducts(data.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, perPage, typeFilter]);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  const typeOptions = [
    "All",
    ...Array.from(new Set(products.map((p) => p.type))),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');
        .prod-row:hover td { background: #F5F7FF !important; }
        .action-btn:hover { border-color: #3B5BDB !important; color: #3B5BDB !important; background: #EEF2FF !important; }
        .del-btn:hover { border-color: #DC2626 !important; color: #DC2626 !important; background: #FEF2F2 !important; }
        .add-btn:hover { background: #2F4AC5 !important; border-color: #2F4AC5 !important; }
        .chip-btn:hover { border-color: #3B5BDB !important; color: #3B5BDB !important; }
        input:focus, textarea:focus { border-color: #3B5BDB !important; box-shadow: 0 0 0 3px rgba(59,91,219,0.1) !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #F1F4FA; }
        ::-webkit-scrollbar-thumb { background: #C5CFE0; border-radius: 3px; }
      `}</style>

      <div style={{ fontFamily: "'Sora', sans-serif", color: "#1A2540" }}>
        {/* Header */}
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
              Admin / Products
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Manage Products
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "#9AAABF",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {products.length} record{products.length !== 1 ? "s" : ""} ·
              physical items sold via checkout
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
            Add Product
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
            <div style={{ display: "flex", gap: 6 }}>
              {typeOptions.map((t) => (
                <button
                  key={t}
                  className="chip-btn"
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: typeFilter === t ? "#3B5BDB" : "#D1D9E6",
                    background: typeFilter === t ? "#EEF2FF" : "#FFFFFF",
                    color: typeFilter === t ? "#3B5BDB" : "#9AAABF",
                    textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
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
                    "Images",
                    "Name",
                    "Type",
                    "Price",
                    "Data / Validity",
                    "Coverage",
                    "Top Pick",
                    "Ships",
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
                      colSpan={11}
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
                      colSpan={11}
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
                        : "no products yet — add one!"}
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => (
                    <tr
                      key={p.id}
                      className="prod-row"
                      style={{ borderTop: "1px solid #F1F4FA" }}
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
                      <td style={{ padding: "12px 16px" }}>
                        <ImageStrip images={p.images} />
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "#0F172A",
                          maxWidth: 220,
                        }}
                      >
                        <div>{p.name}</div>
                        <div
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10,
                            color: "#9AAABF",
                            fontWeight: 400,
                            marginTop: 2,
                          }}
                        >
                          {p.slug}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Tag color="gray">{p.type}</Tag>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#3B5BDB",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₱{formatPrice(p.price)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                        >
                          {p.data_amount && (
                            <Tag color="blue">{p.data_amount}</Tag>
                          )}
                          {p.duration_label ? (
                            <Tag color="purple">{p.duration_label}</Tag>
                          ) : p.validity_days ? (
                            <Tag color="purple">{p.validity_days}d</Tag>
                          ) : null}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 11,
                          color: "#6B7A99",
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.destination_name || "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.popular ? (
                          <Tag color="green">★ yes</Tag>
                        ) : (
                          <Tag color="gray">no</Tag>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.requires_shipping ? (
                          <Tag color="orange">📦 ships</Tag>
                        ) : (
                          <Tag color="gray">digital</Tag>
                        )}
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
                            border: `1px solid ${p.is_active ? "#BFCFFF" : "#FECACA"}`,
                            background: p.is_active ? "#EEF2FF" : "#FEF2F2",
                            color: p.is_active ? "#3B5BDB" : "#DC2626",
                          }}
                        >
                          {p.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            className="action-btn"
                            onClick={() => setEditTarget(p)}
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
                            onClick={() => setDeleteTarget(p)}
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
        <ProductModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSaved={fetchProducts}
        />
      )}
      {editTarget && (
        <ProductModal
          mode="edit"
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={fetchProducts}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={fetchProducts}
        />
      )}
    </>
  );
}
