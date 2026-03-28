import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { bankFundService } from "../../services/bankFundService";

const PORTFOLIO_TYPES = ["Retail", "MSME", "Housing"];

export default function AddPortfolio() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    portfolio_name: "",
    portfolio_type: "",
    banks: [], // store bank IDs
    is_active: true,
  });

  const [banksList, setBanksList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch banks
  useEffect(() => {
    async function fetchBanks() {
      try {
        const data = await bankFundService.getBanks();
        setBanksList(data); // data has { id, bank_name, ... }
      } catch (err) {
        console.error("Failed to fetch banks:", err);
        alert("Error fetching banks");
      }
    }
    fetchBanks();
  }, []);

  const toggleBank = (bankId) => {
    setForm((prev) => ({
      ...prev,
      banks: prev.banks.includes(bankId)
        ? prev.banks.filter((b) => b !== bankId)
        : [...prev.banks, bankId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bankFundService.createPortfolio(form);
      navigate("/portfolio-management");
    } catch (err) {
      console.error("Failed to create portfolio:", err);
      alert("Error creating portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
          >
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Add Portfolio</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md space-y-6"
        >
          <Input
            label="Portfolio Name"
            value={form.portfolio_name}
            onChange={(e) =>
              setForm({ ...form, portfolio_name: e.target.value })
            }
            required
          />

          <Select
            label="Portfolio Type"
            value={form.portfolio_type}
            onChange={(e) =>
              setForm({ ...form, portfolio_type: e.target.value })
            }
            options={PORTFOLIO_TYPES}
            required
          />

          {/* Bank Mapping */}
          <div>
            <label className="text-sm font-medium mb-2 block">Map Banks</label>
            <div className="grid grid-cols-2 gap-2">
              {banksList.length ? (
                banksList.map((bank) => (
                  <label
                    key={bank.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.banks.includes(bank.id)}
                      onChange={() => toggleBank(bank.id)}
                    />
                    {bank.bank_name}
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Loading banks...</p>
              )}
            </div>
          </div>

          <Checkbox
            label="Active"
            checked={form.is_active}
            onChange={() =>
              setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
            }
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
            >
              <FiSave /> {loading ? "Saving..." : "Save Portfolio"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

/* ---------------- REUSABLE ---------------- */
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
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
);
