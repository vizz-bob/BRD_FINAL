import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { organizationService } from "../../services/organizationService";
import { branchService } from "../../services/branchService";

import {
  InputField,
  SelectField,
  TextAreaField,
} from "../../components/Controls/SharedUIHelpers";

const CreateBranch = () => {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    organization_id: "",
    branchCode: "",
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- LOAD ORGANIZATIONS ---------------- */
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const res = await organizationService.getOrganizations();
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.results)
          ? res.results
          : [];
        setOrganizations(list);
      } catch (err) {
        console.error("Failed to load organizations", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!form.organization_id)
      newErrors.organization_id = "Organization is required";

    if (!form.branchCode || form.branchCode.trim().length < 3)
      newErrors.branchCode = "Branch code must be at least 3 characters";
    else if (!/^[A-Z0-9-_]+$/i.test(form.branchCode))
      newErrors.branchCode =
        "Only letters, numbers, hyphen (-) and underscore (_) allowed";

    if (!form.name || form.name.trim().length < 3)
      newErrors.name = "Branch name must be at least 3 characters";

    if (!form.address || form.address.trim().length < 5)
      newErrors.address = "Branch address is required";

    if (!form.contactPerson)
      newErrors.contactPerson = "Contact person is required";

    if (!form.phone)
      newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit mobile number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setSubmitting(true);

  const payload = {
    tenant_id: form.organization_id,        // ✅ REQUIRED
    organization: form.organization_id,     // ✅ REQUIRED (yes, both)
    branch_code: form.branchCode.trim(),
    branch_name: form.name.trim(),           // ✅ FIX
    branch_address: form.address.trim(),     // ✅ FIX
    contact_person: form.contactPerson.trim(),
    phone_number: form.phone.trim(),         // ✅ FIX
  };

  try {
    await branchService.addBranch(payload);
    navigate("/organizations/branches/list", { replace: true });
  } catch (err) {
    const apiErrors = err?.response?.data || {};
    const mappedErrors = {};

    if (apiErrors.branch_code)
      mappedErrors.branchCode = apiErrors.branch_code[0];

    if (apiErrors.branch_name)
      mappedErrors.name = apiErrors.branch_name[0];

    if (apiErrors.branch_address)
      mappedErrors.address = apiErrors.branch_address[0];

    if (apiErrors.phone_number)
      mappedErrors.phone = apiErrors.phone_number[0];

    if (apiErrors.tenant_id || apiErrors.organization)
      mappedErrors.organization_id =
        apiErrors.tenant_id?.[0] || apiErrors.organization?.[0];

    setErrors(mappedErrors);
  } finally {
    setSubmitting(false);
  }
};

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500 text-sm">
          Loading organizations...
        </p>
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
          <h1 className="text-xl font-semibold">Create Branch</h1>
          <p className="text-gray-500 text-sm">
            Create a new branch under an organization
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <SelectField
            label="Organization *"
            name="organization_id"
            value={form.organization_id}
            onChange={handleChange}
            error={errors.organization_id}
            options={organizations.map((o) => ({
              label: o.business_name,
              value: o.id, // ✅ correct
            }))}
          />

          <InputField
            label="Organization ID"
            value={form.organization_id}
            readOnly
            disabled
          />

          <InputField
            label="Branch Code *"
            name="branchCode"
            placeholder="DEL-HQ-001"
            value={form.branchCode}
            onChange={handleChange}
            error={errors.branchCode}
          />

          <InputField
            label="Branch Name *"
            name="name"
            placeholder="Delhi Head Office"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <TextAreaField
            label="Branch Address *"
            name="address"
            placeholder="Enter complete branch address"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
            rows={4}
          />

          <InputField
            label="Contact Person *"
            name="contactPerson"
            placeholder="John Doe"
            value={form.contactPerson}
            onChange={handleChange}
            error={errors.contactPerson}
          />

          <InputField
            label="Phone Number *"
            name="phone"
            placeholder="9876543210"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
          >
            <FiSave />
            {submitting ? "Creating..." : "Create Branch"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateBranch;
