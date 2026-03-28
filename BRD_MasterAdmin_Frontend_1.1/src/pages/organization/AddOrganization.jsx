import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { organizationService } from "../../services/organizationService";

import {
  InputField,
  TextAreaField,
} from "../../components/Controls/SharedUIHelpers";

export default function AddOrganization() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    mobile_number: "",
    contact_person: "",
    full_address: "",
    loan_products: "",
    gst_number: "",
    pan_number: "",
    cin_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    if (!form.business_name.trim()) return "Business name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address";

    if (!form.mobile_number.trim())
      return "Mobile number is required";
    if (!/^[0-9]{10}$/.test(form.mobile_number))
      return "Mobile number must be exactly 10 digits";

    if (!form.contact_person.trim())
      return "Contact person is required";

    if (!form.full_address.trim())
      return "Full address is required";

    if (!form.loan_products.trim())
      return "Loan products are required";

    if (
      form.gst_number &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        form.gst_number.toUpperCase()
      )
    )
      return "Invalid GST number";

    if (
      form.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
        form.pan_number.toUpperCase()
      )
    )
      return "Invalid PAN number";

    if (
      form.cin_number &&
      !/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(
        form.cin_number.toUpperCase()
      )
    )
      return "Invalid CIN number";

    return null;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const validationError = validateForm();
    if (validationError) {
      setErrors(validationError);
      return;
    }

    setLoading(true);

    try {
      await organizationService.addOrganization({
        ...form,
        is_active: true,
      });

      navigate("/organizations/list", { replace: true });
    } catch (err) {
      if (err.response?.data) {
        const firstError = Object.values(err.response.data)[0];
        setErrors(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setErrors("Something went wrong while saving organization.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">Add New Organization</h1>
          <p className="text-gray-500 text-sm">
            Register a new organization
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-4xl">
        {errors && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Business Name *"
              name="business_name"
              placeholder="Enter business name"
              value={form.business_name}
              onChange={handleChange}
            />

            <InputField
              label="Email *"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              label="Mobile Number *"
              name="mobile_number"
              placeholder="10-digit mobile number"
              value={form.mobile_number}
              onChange={handleChange}
            />

            <InputField
              label="Contact Person *"
              name="contact_person"
              placeholder="Contact person name"
              value={form.contact_person}
              onChange={handleChange}
            />

            <InputField
              label="GST Number"
              name="gst_number"
              placeholder="22AAAAA0000A1Z5"
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
              placeholder="L12345MH2023PLC123456"
              value={form.cin_number}
              onChange={handleChange}
            />
          </div>

          <TextAreaField
            label="Full Address *"
            name="full_address"
            placeholder="Enter complete business address"
            value={form.full_address}
            onChange={handleChange}
            rows={4}
          />

          <InputField
            label="Loan Products *"
            name="loan_products"
            placeholder="Home Loan, Personal Loan"
            value={form.loan_products}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex justify-center gap-2 hover:bg-blue-700 disabled:opacity-60"
          >
            <FiSave />
            {loading ? "Saving..." : "Save Organization"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
