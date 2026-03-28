import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function EditLoginFee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fee_type: "Flat",
    amount: "",
    status: "Active",
    linked_product: null,
  });

  useEffect(() => {
    const fetchFee = async () => {
      const data = await controlsManagementService.login_fees.retrieve(id);
      if (data) {
        setForm({
          fee_type: data.fee_type || "Flat",
          amount: data.amount || "",
          status: data.status === "INACTIVE" ? "Inactive" : "Active",
          linked_product: data.linked_product || null,
        });
      }
      setLoading(false);
    };

    fetchFee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = {
      fee_type: form.fee_type,
      amount: Number(form.amount) || 0,
      status: form.status.toUpperCase(),
      linked_product: form.linked_product,
    };

    const res = await controlsManagementService.login_fees.update(id, payload);
    setSaving(false);

    if (res?.id) {
      navigate("/controls/login-fees");
    } else if (res?.fee_type || res?.amount) {
      setErrors(res);
    } else {
      alert("Something went wrong!");
    }
  };

  if (loading) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Login Fees</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Select
          label="Fee Type"
          name="fee_type"
          value={form.fee_type}
          onChange={handleChange}
          options={["Flat", "Percentage"]}
          required
        />
        {errors.fee_type && <p className="text-red-600 text-sm">{errors.fee_type}</p>}

        <Input
          label={form.fee_type === "Flat" ? "Amount (₹)" : "Percentage (%)"}
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
        />
        {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}

        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={["Active", "Inactive"]}
        />

        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-3 rounded-xl border">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2"
          >
            <FiSave /> {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-2 w-full p-3 rounded-xl border bg-gray-50" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-2 w-full p-3 rounded-xl border bg-gray-50">
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);
