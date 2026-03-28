import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiX,
  FiSave,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import currencyManagementService from "../../../services/currencyManagementService";
import {
  ListView,
  DeleteConfirmButton,
  SearchFilterBar,
  InputField,
  SelectField,
} from "../../../components/master/Controls/SharedUIHelpers";

/* ─────────────────── CONSTANTS ─────────────────── */

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const CURRENCY_OPTIONS = [
  { label: "INR", value: "INR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "AED", value: "AED" },
  { label: "SGD", value: "SGD" },
  { label: "JPY", value: "JPY" },
];

const TIMEZONE_OPTIONS = [
  { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Europe/Paris (CET)", value: "Europe/Paris" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
  { label: "Asia/Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Asia/Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Australia/Sydney (AEST)", value: "Australia/Sydney" },
  { label: "UTC", value: "UTC" },
];

const ROUNDING_RULE_OPTIONS = [
  { label: "Round to Nearest (Standard)", value: "ROUND_NEAREST" },
  { label: "Round Up", value: "ROUND_UP" },
  { label: "Round Down", value: "ROUND_DOWN" },
];

const EMPTY_FORM = {
  currency_code: "",
  currency_name: "",
  currency_symbol: "",
  conversion_value_to_inr: "",
  time_zone: "",
  decimal_places: "",
  rounding_rule: "",
  effective_date: "",
  status: "Active",
};

/* ─────────────────── SECTION LABEL ─────────────────── */
const ModalSection = ({ title }) => (
  <div className="col-span-2 mt-2">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
      {title}
    </p>
    <hr />
  </div>
);

/* ═══════════════════ MODAL ═══════════════════ */
function CurrencyModal({ open, onClose, editUuid, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(editUuid);

  /* load data in edit mode */
  useEffect(() => {
    if (!open) return;
    if (isEdit && editUuid) {
      setLoading(true);
      currencyManagementService
        .getOne(editUuid)
        .then((res) =>
          setForm({
            currency_code:           res.currency_code || "",
            currency_name:           res.currency_name || "",
            currency_symbol:         res.currency_symbol || "",
            conversion_value_to_inr: res.conversion_value_to_inr || "",
            time_zone:               res.time_zone || "",
            decimal_places:          res.decimal_places || "",
            rounding_rule:           res.rounding_rule || "",
            effective_date:          res.effective_date || "",
            status:                  res.status || "Active",
          })
        )
        .catch(() => setError("Failed to load currency details"))
        .finally(() => setLoading(false));
    } else {
      setForm(EMPTY_FORM);
      setError("");
    }
  }, [open, editUuid, isEdit]);

  const handleChange = (name, value) =>
    setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      isEdit
        ? await currencyManagementService.update(editUuid, form)
        : await currencyManagementService.create(form);
      onSaved();
      onClose();
    } catch {
      setError("Failed to save currency. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">

        {/* header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Edit Currency" : "Add Currency"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit
                ? "Update currency conversion values"
                : "Create a new supported currency"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto px-8 py-6 flex-1">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : (
            <form
              id="currency-modal-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-x-6 gap-y-4"
            >
              {/* ── Basic Details ── */}
              <ModalSection title="Basic Currency Details" />

              <SelectField
                label="Currency Code"
                value={form.currency_code}
                onChange={(e) => handleChange("currency_code", e.target.value)}
                options={CURRENCY_OPTIONS}
                placeholder="Select currency"
                required
              />

              <InputField
                label="Currency Name"
                value={form.currency_name}
                onChange={(e) => handleChange("currency_name", e.target.value)}
                placeholder="e.g. Indian Rupee"
                required
              />

              <InputField
                label="Currency Symbol"
                value={form.currency_symbol}
                onChange={(e) => handleChange("currency_symbol", e.target.value)}
                placeholder="₹, $, €"
                required
              />

              <InputField
                label="Conversion Value to INR"
                type="number"
                value={form.conversion_value_to_inr}
                onChange={(e) =>
                  handleChange("conversion_value_to_inr", Number(e.target.value))
                }
                placeholder="0.00"
                required
              />

              {/* ── Globalization ── */}
              <ModalSection title="Globalization & UI Settings" />

              <SelectField
                label="Time Zone"
                value={form.time_zone}
                onChange={(e) => handleChange("time_zone", e.target.value)}
                options={TIMEZONE_OPTIONS}
                placeholder="Select time zone"
                required
              />

              <InputField
                label="Decimal Places"
                type="number"
                value={form.decimal_places}
                onChange={(e) =>
                  handleChange("decimal_places", Number(e.target.value))
                }
                placeholder="e.g. 2"
                required
              />

              <div className="col-span-2">
                <SelectField
                  label="Rounding Rule"
                  value={form.rounding_rule}
                  onChange={(e) => handleChange("rounding_rule", e.target.value)}
                  options={ROUNDING_RULE_OPTIONS}
                  placeholder="Select rounding rule"
                  required
                />
              </div>

              {/* ── System ── */}
              <ModalSection title="System & Audit Fields" />

              <InputField
                label="Effective Date"
                type="date"
                value={form.effective_date}
                onChange={(e) => handleChange("effective_date", e.target.value)}
                required
              />

              <SelectField
                label="Status"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={STATUS_OPTIONS}
                required
              />

              {error && (
                <p className="col-span-2 text-sm text-red-600">{error}</p>
              )}
            </form>
          )}
        </div>

        {/* footer */}
        <div className="px-8 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="currency-modal-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 shadow-sm"
          >
            <FiSave size={14} />
            {loading ? "Saving..." : isEdit ? "Update Currency" : "Save Currency"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ LIST PAGE ═══════════════════ */
export default function CurrencyList() {
  const navigate = useNavigate();

  const [currencies, setCurrencies]   = useState([]);
  const [search, setSearch]           = useState("");
  const [deleteId, setDeleteId]       = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editUuid, setEditUuid]       = useState(null);

  /* ── fetch ── */
  useEffect(() => { fetchCurrencies(); }, []);

  const fetchCurrencies = async () => {
    try {
      const res = await currencyManagementService.getAll();
      setCurrencies(Array.isArray(res) ? res : (res?.results || []));
    } catch (err) {
      console.error("Failed to fetch currencies", err);
    }
  };

  /* ── open modal helpers ── */
  const openAdd  = ()     => { setEditUuid(null); setModalOpen(true); };
  const openEdit = (uuid) => { setEditUuid(uuid); setModalOpen(true); };
  const closeModal = ()   => setModalOpen(false);

  /* ── table config ── */
  const columns = [
    { key: "currency_code",           label: "Code" },
    { key: "currency_name",           label: "Name" },
    { key: "currency_symbol",         label: "Symbol" },
    { key: "conversion_value_to_inr", label: "Conversion (INR)" },
    { key: "time_zone",               label: "Time Zone" },
    { key: "decimal_places",          label: "Decimals" },
    { key: "rounding_rule",           label: "Rounding Rule" },
    { key: "effective_date",          label: "Effective Date" },
    { key: "status",                  label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      onClick: (row) => navigate(`/currency-management/view/${row.uuid}`),
    },
    {
      icon: <FiEdit3 />,
      color: "blue",
      onClick: (row) => openEdit(row.uuid),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteId(row.uuid),
    },
  ];

  /* ── filter ── */
  const filteredData = currencies.filter(
    (c) =>
      c.currency_code?.toLowerCase().includes(search.toLowerCase()) ||
      c.currency_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.currency_symbol?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── delete ── */
  const handleDelete = async () => {
    if (!deleteId) return;
    await currencyManagementService.delete(deleteId);
    setDeleteId(null);
    fetchCurrencies();
  };

  return (
    <>
      {/* ── PAGE HEADER (matches Approval Master spacing) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Currency Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage supported currencies and conversion values
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-blue-700 transition"
        >
          <FiPlus />
          Add Currency
        </button>
      </div>

      {/* ── SEARCH ── */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by code, name or symbol"
      />

      {/* ── LIST ── */}
      <ListView
        data={filteredData}
        columns={columns}
        actions={actions}
        rowKey="uuid"
      />

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <DeleteConfirmButton
          title="Delete Currency"
          message="Are you sure you want to delete this currency?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* ── ADD / EDIT MODAL ── */}
      <CurrencyModal
        open={modalOpen}
        onClose={closeModal}
        editUuid={editUuid}
        onSaved={fetchCurrencies}
      />
    </>
  );
}