import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { bankFundService } from "../../services/bankFundService";

const TAX_TYPES = ["GST", "TDS", "Surcharge"];
const TAX_CATEGORIES = ["Processing Fee", "Interest", "Foreclosure"];
const STATUS = ["ACTIVE", "INACTIVE"]; // Match your backend values

const TaxFormPage = ({ modeType }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    tax_type: "",
    tax_category: "",
    tax_rate: "",
    valid_from: "",
    valid_to: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing tax for editing
  useEffect(() => {
    if (modeType === "edit" && id) {
      setLoading(true);
      bankFundService
        .getTax(id)
        .then((data) => {
          setForm({
            tax_type: data.tax_type,
            tax_category: data.tax_category,
            tax_rate: data.tax_rate,
            valid_from: data.valid_from,
            valid_to: data.valid_to,
            status: data.status,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch tax:", err);
          alert("Error fetching tax details");
        })
        .finally(() => setLoading(false));
    }
  }, [id, modeType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modeType === "add") {
        await bankFundService.createTax(form);
        alert("Tax created successfully");
      } else {
        await bankFundService.updateTax(id, form);
        alert("Tax updated successfully");
      }
      navigate("/taxation-management");
    } catch (err) {
      console.error("Failed to save tax:", err);
      alert("Error saving tax");
    }
  };

  if (loading) return <MainLayout><div className="text-center py-10">Loading...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-md">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {modeType === "add" ? "Add Tax" : "Edit Tax"}
            </h1>
            <p className="text-gray-500 text-sm">Configure taxation details</p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 gap-4"
        >
          <Select label="Tax Type" name="tax_type" value={form.tax_type} onChange={handleChange} options={TAX_TYPES} required />
          <Select label="Category" name="tax_category" value={form.tax_category} onChange={handleChange} options={TAX_CATEGORIES} required />
          <Input label="Rate (%)" name="tax_rate" value={form.tax_rate} onChange={handleChange} type="number" required />

          <div className="grid grid-cols-2 gap-2">
            <Input label="Valid From" name="valid_from" value={form.valid_from} onChange={handleChange} type="date" />
            <Input label="Valid To" name="valid_to" value={form.valid_to} onChange={handleChange} type="date" />
          </div>

          <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700"
          >
            <FiSave /> Save
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default TaxFormPage;

/* ---------------- REUSABLE ---------------- */
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

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
