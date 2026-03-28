import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function VendorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    vendorType: "",
    constitution: "",
    location: "",
    category: "",
    serviceType: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const serviceOptions = {
    Legal: ["Title Search", "Legal Opinion", "Documentation", "Litigation Support"],
    Technical: ["Field Investigation", "Structural Inspection", "Site Visit", "Technical Audit"],
    Valuation: ["Property Valuation", "Asset Valuation", "Market Valuation"],
    Collection: ["Soft Collection", "Hard Collection", "Legal Recovery", "Asset Recovery"],
    Insurance: ["Life Insurance", "Property Insurance", "Health Insurance"],
    Audit: ["Internal Audit", "Tax Audit", "Compliance Audit"],
  };

  useEffect(() => {
    // Mock fetch by id — replace with real API call
    setForm({
      vendorType: "Company",
      constitution: "Pvt Ltd",
      location: "Mumbai",
      category: "Legal",
      serviceType: "Documentation",
      status: "Active",
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { serviceType: "" } : {}),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const required = ["vendorType", "constitution", "location", "category", "serviceType", "status"];
    const newErrors = {};
    required.forEach((f) => {
      if (!form[f]) newErrors[f] = "This field is required";
    });
    return newErrors;
  };

  const handleUpdate = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    console.log("Update Vendor:", id, form);
    navigate("/profile-management/vendor");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/profile-management/vendor")}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Edit Vendor</h1>
          <p className="text-sm text-gray-500">Update vendor #{id} details</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Section 1 */}
        <Section title="Vendor Identification & Legal Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Vendor Type" required error={errors.vendorType}>
              <select name="vendorType" value={form.vendorType} onChange={handleChange} className={select(errors.vendorType)}>
                <option value="">Select vendor type</option>
                <option>Individual</option>
                <option>Company</option>
                <option>Partnership</option>
                <option>Trust</option>
                <option>Society</option>
              </select>
            </Field>

            <Field label="Constitution" required error={errors.constitution}>
              <select name="constitution" value={form.constitution} onChange={handleChange} className={select(errors.constitution)}>
                <option value="">Select constitution</option>
                <option>Proprietorship</option>
                <option>Pvt Ltd</option>
                <option>LLP</option>
                <option>Public Ltd</option>
                <option>Partnership Firm</option>
                <option>Trust</option>
                <option>Society</option>
              </select>
            </Field>

            <Field label="Location" required error={errors.location} full>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter operational or registered location"
                className={inputCls(errors.location)}
              />
            </Field>
          </div>
        </Section>

        {/* Section 2 */}
        <Section title="Service & Classification Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category" required error={errors.category}>
              <select name="category" value={form.category} onChange={handleChange} className={select(errors.category)}>
                <option value="">Select category</option>
                <option>Legal</option>
                <option>Technical</option>
                <option>Valuation</option>
                <option>Collection</option>
                <option>Insurance</option>
                <option>Audit</option>
              </select>
            </Field>

            <Field label="Service Type" required error={errors.serviceType}>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                disabled={!form.category}
                className={select(errors.serviceType)}
              >
                <option value="">{form.category ? "Select service type" : "Select a category first"}</option>
                {form.category &&
                  (serviceOptions[form.category] || []).map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* Section 3 */}
        <Section title="Status & Activation">
          <div className="flex gap-3">
            {["Active", "Inactive"].map((s) => (
              <label
                key={s}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all
                  ${form.status === s
                    ? s === "Active"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-400 bg-red-50 text-red-600"
                    : "border-gray-200 bg-white text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`w-2 h-2 rounded-full ${form.status === s ? (s === "Active" ? "bg-green-500" : "bg-red-400") : "bg-gray-300"}`} />
                {s}
              </label>
            ))}
          </div>
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Update Vendor
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Helpers ── */
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Field = ({ label, required, error, children, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const base = (err) =>
  `w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all ${
    err ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;
const inputCls = (err) => base(err);
const select = (err) => base(err) + " cursor-pointer";