import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiEye, FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { bankFundService } from "../../../services/bankFundService";

const TAX_TYPES = ["GST", "TDS", "TCS", "Service Tax", "Stamp Duty"];
const TAX_CATEGORIES = ["Direct", "Indirect", "Withholding", "Surcharge"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

const TaxationManagement = () => {
  const navigate = useNavigate();
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // "list" | "add"

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const data = await bankFundService.getTaxes();
      setTaxes(Array.isArray(data) ? data : (data?.results || []));
    } catch (err) {
      console.error("Failed to fetch taxes:", err);
      alert("Error fetching taxes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tax entry?")) return;
    try {
      await bankFundService.deleteTax(id);
      setTaxes(taxes.filter((t) => t.id !== id));
      alert("Tax deleted successfully");
    } catch (err) {
      console.error("Failed to delete tax:", err);
      alert("Error deleting tax");
    }
  };

  const filteredTaxes = (Array.isArray(taxes) ? taxes : []).filter(
    (t) =>
      (t?.tax_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (t?.tax_category || "").toLowerCase().includes(search.toLowerCase())
  );

  if (view === "add") {
    return (
      <AddTax
        onBack={() => setView("list")}
        onSaved={(newTax) => {
          setTaxes((prev) => [...prev, newTax]);
          setView("list");
        }}
      />
    );
  }

  if (loading)
    return <div className="text-center py-10">Loading taxes...</div>;

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Taxation Management</h1>
          <p className="text-sm text-gray-500">
            Manage tax types, categories, and rates
          </p>
        </div>

        <button
          onClick={() => setView("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Tax
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tax type or category..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-7 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Tax Type</div>
          <div>Category</div>
          <div>Rate (%)</div>
          <div>Valid From</div>
          <div>Valid To</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredTaxes.map((tax) => (
          <div
            key={tax.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-7 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">{tax.tax_type}</div>
            <div className="text-gray-600">{tax.tax_category}</div>
            <div className="text-gray-600">{tax.tax_rate}%</div>
            <div className="text-gray-600">{tax.valid_from}</div>
            <div className="text-gray-600">{tax.valid_to}</div>

            <span
              className={`inline-flex items-center justify-center
                px-3 py-0.5 text-xs font-medium
                rounded-full whitespace-nowrap leading-none w-fit
                ${tax.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {tax.status}
            </span>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton
                color="gray"
                onClick={() => navigate(`/taxation-management/view/${tax.id}`)}
              >
                <FiEye />
              </IconButton>
              <IconButton
                color="blue"
                onClick={() => navigate(`/taxation-management/edit/${tax.id}`)}
              >
                <FiEdit3 />
              </IconButton>
              <IconButton color="red" onClick={() => handleDelete(tax.id)}>
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaxationManagement;

/* ---------------- ADD TAX FORM ---------------- */
const AddTax = ({ onBack, onSaved }) => {
  const [form, setForm] = useState({
    tax_type: "",
    tax_category: "",
    tax_rate: "",
    valid_from: "",
    valid_to: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newTax = await bankFundService.createTax({ ...form });
      onSaved(newTax);
    } catch (err) {
      console.error("Failed to create tax:", err);
      alert("Error creating tax");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Add Tax</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TAX DETAILS CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b pb-2">
            Tax Details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label={<>Tax Type <span style={{ color: "red" }}>*</span></>}
              value={form.tax_type}
              onChange={(e) => setForm({ ...form, tax_type: e.target.value })}
              options={TAX_TYPES}
              required
            />

            <Select
              label={<>Tax Category <span style={{ color: "red" }}>*</span></>}
              value={form.tax_category}
              onChange={(e) => setForm({ ...form, tax_category: e.target.value })}
              options={TAX_CATEGORIES}
              required
            />

            <Input
              label={<>Rate (%) <span style={{ color: "red" }}>*</span></>}
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="e.g. 18.00"
              value={form.tax_rate}
              onChange={(e) => setForm({ ...form, tax_rate: e.target.value })}
              required
            />

            <Select
              label={<>Status <span style={{ color: "red" }}>*</span></>}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS}
              required
            />

            <Input
              label={<>Valid From <span style={{ color: "red" }}>*</span></>}
              type="date"
              value={form.valid_from}
              onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
              required
            />

            <Input
              label={<>Valid To <span style={{ color: "red" }}>*</span></>}
              type="date"
              value={form.valid_to}
              onChange={(e) => setForm({ ...form, valid_to: e.target.value })}
              required
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl border hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 text-sm"
          >
            <FiSave /> {loading ? "Saving..." : "Save Tax"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------------- HELPERS ---------------- */
const IconButton = ({ children, onClick, color }) => {
  const colors = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red:  "bg-red-100 hover:bg-red-200 text-red-600",
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-full ${colors[color]}`}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);