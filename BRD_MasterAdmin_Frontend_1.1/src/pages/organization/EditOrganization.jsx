import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { organizationService } from "../../services/organizationService";

export default function EditOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    business_name: "",
    email: "",
    mobile_number: "",
    contact_person: "",
    gst_number: "",
    pan_number: "",
    cin_number: "",
    full_address: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await organizationService.getOrganization(id);

        setForm({
          business_name: data.business_name || "",
          email: data.email || "",
          mobile_number: data.mobile_number || "",
          contact_person: data.contact_person || "",
          gst_number: data.gst_number || "",
          pan_number: data.pan_number || "",
          cin_number: data.cin_number || "",
          full_address: data.full_address || "",
        });
      } catch (err) {
        setError("Failed to load organization details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await organizationService.updateOrganization(id, form);
      navigate("/organizations/list");
    } catch (err) {
      setError("Failed to update organization.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-gray-500">
          Loading organization details...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">Edit Organization</h1>
          <p className="text-gray-500 text-sm">
            Update organization details
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Business Name *"
              name="business_name"
              placeholder="ABC Finance Pvt Ltd"
              value={form.business_name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email *"
              type="email"
              name="email"
              placeholder="info@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Mobile Number *"
              name="mobile_number"
              placeholder="9988778866"
              value={form.mobile_number}
              onChange={handleChange}
              required
            />

            <InputField
              label="Contact Person"
              name="contact_person"
              placeholder="John Doe"
              value={form.contact_person}
              onChange={handleChange}
            />

            <InputField
              label="GST Number"
              name="gst_number"
              placeholder="24ABCDE1234F1Z5"
              value={form.gst_number}
              onChange={handleChange}
            />

            <InputField
              label="PAN Number"
              name="pan_number"
              placeholder="ABCDE1234F"
              value={form.pan_number}
              onChange={handleChange}
            />

            <InputField
              label="CIN Number"
              name="cin_number"
              placeholder="U65990GJ2020PTC112345"
              value={form.cin_number}
              onChange={handleChange}
            />
          </div>

          <TextAreaField
            label="Full Address"
            name="full_address"
            placeholder="2nd Floor, Shree Complex, Alkapuri, Vadodara..."
            value={form.full_address}
            onChange={handleChange}
            rows={4}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-blue-700"
          >
            <FiSave />
            Update Organization
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

/* ================= SHARED FIELDS ================= */

function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className="mt-2 p-3 rounded-xl bg-gray-50 outline-none text-sm focus:bg-white"
      />
    </div>
  );
}

function TextAreaField({ label, rows = 3, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...props}
        rows={rows}
        className="mt-2 p-3 rounded-xl bg-gray-50 outline-none text-sm focus:bg-white resize-none"
      />
    </div>
  );
}
