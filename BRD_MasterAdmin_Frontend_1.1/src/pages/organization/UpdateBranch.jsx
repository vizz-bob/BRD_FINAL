import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { organizationService } from "../../services/organizationService";
import { branchService } from "../../services/branchService";

import {
  InputField,
  SelectField,
  TextAreaField,
} from "../../components/Controls/SharedUIHelpers";

const UpdateBranch = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    organization_id: "",
    branchCode: "",
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const orgRes = await organizationService.getOrganizations();
        const orgList = Array.isArray(orgRes)
          ? orgRes
          : orgRes?.results || [];
        setOrganizations(orgList);

        const branch = await branchService.getBranch(id);

        setForm({
          organization_id: branch.tenant_id || branch.tenant || "",
          branchCode: branch.branch_code || "",
          name: branch.branch_name || "",
          address: branch.branch_address || "",
          contactPerson: branch.contact_person || "",
          phone: branch.phone_number || "",
          email: branch.email || "",
        });
      } catch (err) {
        console.error("Load failed", err);
        navigate("/organizations/branches/list");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      tenant_id: form.organization_id,
      organization: form.organization_id,
      branch_code: form.branchCode,
      branch_name: form.name.trim(),
      branch_address: form.address.trim(),
      contact_person: form.contactPerson.trim(),
      phone_number: form.phone.trim(),
      email: form.email || null,
    };

    try {
      await branchService.updateBranch(id, payload);
      navigate("/organizations/branches/list", { replace: true });
    } catch (err) {
      const apiErrors = err?.response?.data || {};
      const mapped = {};

      if (apiErrors.branch_name) mapped.name = apiErrors.branch_name[0];
      if (apiErrors.branch_address) mapped.address = apiErrors.branch_address[0];
      if (apiErrors.phone_number) mapped.phone = apiErrors.phone_number[0];
      if (apiErrors.tenant_id || apiErrors.organization)
        mapped.organization_id =
          apiErrors.tenant_id?.[0] || apiErrors.organization?.[0];

      setErrors(mapped);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">Loading branch details...</p>
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
          <h1 className="text-xl font-semibold">Update Branch</h1>
          <p className="text-gray-500 text-sm">Edit branch details</p>
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
              value: o.id,
            }))}
          />

          <InputField
            label="Branch Code"
            value={form.branchCode}
            readOnly
            disabled
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
            placeholder="Enter full branch address"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
            rows={4}
          />

          <InputField
            label="Contact Person"
            name="contactPerson"
            placeholder="John Doe"
            value={form.contactPerson}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number *"
            name="phone"
            placeholder="9876543210"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <InputField
            label="Email"
            name="email"
            placeholder="branch@email.com"
            value={form.email}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave />
            {submitting ? "Updating..." : "Update Branch"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default UpdateBranch;
