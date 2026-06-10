import type React from "react";

// ============================================================
// EVENT HANDLER TYPES
// ============================================================

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type InputClickEvent = React.MouseEvent<HTMLInputElement>;

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  status?: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  message: string;
  meta: PaginationMeta;
  success: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// ============================================================
// ESIM TYPES
// ============================================================

export interface EsimCode {
  id: number;
  code: string;
  status: "available" | "assigned" | "used";
}

// ============================================================
// ORDER TYPES (app/admin/orders)
// ============================================================

export type PaymentStatus =
  | "pending"
  | "pending_receipt"
  | "pending_review"
  | "paid"
  | "confirmed"
  | "completed"
  | "failed";

export interface OrderPlan {
  id: number;
  name: string;
  data_label?: string;
  validity_days?: number;
}

export interface Order {
  id: number;
  reference?: string;
  user?: { name: string; email: string };
  plan?: OrderPlan;
  plan_name?: string;
  plan_data?: string;
  payment_method?: string;
  payment_status: string;
  esim_code?: EsimCode | null;
  esim_code_id?: number | null;
  receipt_path?: string;
  code_sent_at?: string | null;
  created_at: string;
}

export interface OrdersResponse {
  data: Order[];
  message: string;
  meta?: PaginationMeta;
}

// ============================================================
// DESTINATION TYPES (app/admin/destination)
// ============================================================

export interface Destination {
  id: number | string;
  name: string;
  description?: string;
  location?: string;
  price?: number;
  image?: string;
  images?: string[];
  isActive?: boolean;
  added?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DestinationFormData {
  name: string;
  description?: string;
  location?: string;
  price?: number;
  image?: string;
  isActive?: boolean;
}

// ============================================================
// USER / CUSTOMER TYPES
// ============================================================

export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: "admin" | "user" | "moderator";
  avatar?: string;
  createdAt?: string | Date;
}

export interface Customer {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

// ============================================================
// FILE UPLOAD TYPES
// ============================================================

export interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

export interface DragDropEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer & { files: FileList };
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
}

// ============================================================
// TABLE / LIST TYPES
// ============================================================

export interface Column<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

// ============================================================
// MODAL / DIALOG TYPES
// ============================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export interface ConfirmDialogProps extends ModalProps {
  onConfirm: () => void;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

// ============================================================
// NEXT.JS PAGE PROPS
// ============================================================

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// ============================================================
// MISC / UTILITY TYPES
// ============================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface Toast {
  id?: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  isActive?: boolean;
}
