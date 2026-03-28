// src/componants/Controls/SharedUIHelpers
import React from "react";

/**
 * Shared Button Component
 * Usage:
 * <Button
 *   label="Add Product"
 *   icon={<FiPlus />}
 *   onClick={() => navigate("/product-management/add")}
 * />
 */

export const Button = ({
  label,
  children,
  onClick,
  icon,
  type = "button",
  fullWidth = false,
  size = "md", // sm | md | lg
  variant = "primary", // primary | secondary | danger | outline
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";
  const disabledStyle = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`
      }
    >
      {icon && <span className="text-base">{icon}</span>}
      {label || children}
    </button>
  );
};

/**
 * Shared Page Header Component
 * Uses shared Button
 */
export const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  showAction = true,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {showAction && actionLabel && (
        <Button
          label={actionLabel}
          icon={actionIcon}
          onClick={onAction}
          variant="primary"
        />
      )}
    </div>
  );
};

/**
 * Shared Sub Page Header
 * Used for Add / Edit / Detail pages
 */
export const SubPageHeader = ({
  title,
  subtitle,
  onBack,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
      >
        <FiArrowLeft className="text-gray-700 text-xl" />
      </button>

      {/* Title Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};


/** ================= FORM COMPONENTS ================= */

export const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
}) => (
  <div className="flex flex-col gap-2 w-full">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
    )}

    <input
      type={type}
      name={name}
      value={value ?? ""}  
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-xl border border-gray-200 px-4 py-2 text-sm
        focus:ring-2 focus:ring-indigo-500 focus:outline-none ${className}`}
    />
  </div>
);


export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
  disabled = false,
  error = "",
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full p-3 text-sm rounded-xl border
          bg-gray-50 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition
          ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};


export const MultiSelectField = ({
  label,
  values = [],
  onChange,
  options = [],
}) => {
  const toggleValue = (val) => {
    onChange(values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val]
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="border border-gray-200 rounded-xl p-3 space-y-2">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={values.includes(opt.value)}
              onChange={() => toggleValue(opt.value)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export const CheckboxGroup = ({
  label,
  options = [],
  values = [],
  onChange,
}) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <div className="flex flex-wrap gap-4">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.includes(opt.value)}
            onChange={() => onChange(opt.value)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);

export function ListView({
  data = [],
  columns = [],
  actions = [],
  rowKey = "uuid",
}) {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden md:grid bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10"
        style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
      >
        {columns.map((col) => (
          <div key={col.key}>{col.label}</div>
        ))}
        <div className="text-right">Actions</div>
      </div>

      {data.map((row) => (
        <React.Fragment key={row[rowKey]}>

          {/* ================= DESKTOP ROW ================= */}
          <div
            className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm items-center text-sm"
            style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
          >
            {columns.map((col) => (
              <div key={col.key} className="truncate">
                {col.type === "status" ? (
                  <StatusBadge status={row[col.key]} />
                ) : (
                  row[col.key] ?? "-"
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2">
              {actions.map((action, i) => (
                <IconButton
                  key={i}
                  color={action.color || "gray"}
                  onClick={() => action.onClick(row)}
                >
                  {action.icon}
                </IconButton>
              ))}
            </div>
          </div>

          {/* ================= MOBILE CARD ================= */}
          <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">

            {/* TOP */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-semibold text-sm">
                {columns[0] ? row[columns[0].key] : "—"}
              </span>

              <div className="flex items-center gap-3 text-gray-600">
                {actions.map((action, i) => (
                  <IconButton
                  key={i}
                  color={action.color || "gray"}
                  onClick={() => action.onClick(row)}
                >
                  {action.icon}
                </IconButton>
                ))}
              </div>
            </div>

            {/* BODY */}
            <div className="px-4 py-3 space-y-3 text-sm">
              {columns.slice(1).map((col) => (
                <MobileRow
                  key={col.key}
                  label={col.label}
                  value={
                    col.type === "status"
                      ? <StatusBadge status={row[col.key]} />
                      : row[col.key]
                  }
                />
              ))}
            </div>
          </div>

        </React.Fragment>
      ))}
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

const MobileRow = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="font-medium text-gray-800 text-right">
      {value || "-"}
    </span>
  </div>
);

export const StatusBadge = ({ status }) => {
  const isActive =
    status === true ||
    status === 1 ||
    String(status).toLowerCase() === "active";

  return (
    <span
      className={`inline-flex items-center justify-center
        px-3 py-1 text-xs font-medium rounded-full
        ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};


export const IconButton = ({ children, color, onClick }) => {
  const map = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition ${map[color]}`}
    >
      {children}
    </button>
  );
};


export function DeleteConfirmButton({
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
  confirmText = "Delete",
  loading = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown, FiArrowDown, FiAlignLeft, FiArrowLeft } from "react-icons/fi";

export function SearchFilterBar({
  search = "",
  onSearchChange,
  filter = "",
  onFilterChange,
  filters = [],
  placeholder = "Search...",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center bg-white rounded-2xl shadow-sm px-4 py-3 gap-3">

        {/* SEARCH ICON */}
        <FiSearch className="text-gray-400 shrink-0" />

        {/* SEARCH INPUT */}
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
        />

        {/* FILTER DROPDOWN */}
        {filters.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2"
            >
              {filter || "All"}
              <FiChevronDown className="text-xs" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onFilterChange("");
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100
                    ${!filter ? "bg-gray-100 font-medium" : ""}
                  `}
                >
                  All
                </button>

                {filters.map((f) => (
                  <button
                    key={f.value ?? f}
                    onClick={() => {
                      onFilterChange(f.value ?? f);
                      setOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100
                      ${filter === (f.value ?? f) ? "bg-gray-100 font-medium" : ""}
                    `}
                  >
                    {f.label ?? f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  disabled = false,
  error = "",
  helperText = "",
  maxLength,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {/* LABEL */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* TEXTAREA */}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full rounded-xl border px-4 py-3 text-sm resize-none
          transition-all duration-150
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-300 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500"
          }
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed text-gray-400"
              : "bg-white"
          }
        `}
      />

      {/* FOOTER */}
      <div className="flex justify-between mt-1">
        <div>
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-xs text-gray-400">{helperText}</p>
          )}
        </div>

        {maxLength && (
          <p className="text-xs text-gray-400">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export const FormCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);



export default {
  Button,
  PageHeader,
  SubPageHeader,
  InputField,
  SelectField,
  MultiSelectField,
  CheckboxGroup,
  ListView,
  DeleteConfirmButton,
  FormCard,
  StatusBadge,
  IconButton
};