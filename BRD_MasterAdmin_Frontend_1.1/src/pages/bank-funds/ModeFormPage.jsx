import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { bankFundService } from "../../services/bankFundService";

const ModeFormPage = ({ modeType }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    mode_type: "RECEIPT", // RECEIPT | PAYMENT
    mode_name: "",
    is_default: false,
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modeType === "edit" && id) {
      // fetch existing mode
      const fetchMode = async () => {
        setLoading(true);
        try {
          const data = await bankFundService.getTransactionMode(id);
          setForm({
            mode_type: data.mode_type,
            mode_name: data.mode_name,
            is_default: data.is_default,
            status: data.status,
          });
        } catch (err) {
          console.error(err);
          alert("Failed to load mode");
        } finally {
          setLoading(false);
        }
      };
      fetchMode();
    }
  }, [id, modeType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modeType === "add") {
        await bankFundService.createTransactionMode(form);
        alert("Mode added successfully");
      } else {
        await bankFundService.updateTransactionMode(id, form);
        alert("Mode updated successfully");
      }
      navigate("/mode-of-bank");
    } catch (err) {
      console.error(err);
      alert("Failed to save mode");
    } finally {
      setLoading(false);
    }
  };

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
              {modeType === "add" ? "Add Mode" : "Edit Mode"}
            </h1>
            <p className="text-gray-500 text-sm">Configure bank modes</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 gap-4"
          >
            <Select
              label="Mode Type"
              name="mode_type"
              value={form.mode_type}
              onChange={handleChange}
              options={["RECEIPT", "PAYMENT"]}
              required
            />

            <Input
              label="Mode Name"
              name="mode_name"
              value={form.mode_name}
              onChange={handleChange}
              required
            />

            <Checkbox
              label="Set as Default"
              checked={form.is_default}
              name="is_default"
              onChange={handleChange}
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={["ACTIVE", "INACTIVE"]}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700"
            >
              <FiSave />
              {modeType === "add" ? "Add Mode" : "Update Mode"}
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default ModeFormPage;

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

const Checkbox = ({ label, checked, ...props }) => (
  <label className="flex items-center gap-2 text-sm mt-2">
    <input type="checkbox" checked={checked} {...props} />
    {label}
  </label>
);
