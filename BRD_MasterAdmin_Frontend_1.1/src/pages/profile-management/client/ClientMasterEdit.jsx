import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientMasterEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    category: "",
    type: "",
    role: "",
    industry: "",
    employmentType: "",
    employerType: "",
    employer: "",
    occupation: "",
    addressType: "",
    ownership: "",
    groupLoan: false,
  });

  /* MOCK FETCH FOR EDIT */
  useEffect(() => {
    if (id) {
      setForm({
        category: "Individual",
        type: "Salaried",
        role: "Applicant",
        industry: "IT",
        employmentType: "Salaried",
        employerType: "Company",
        employer: "TCS",
        occupation: "Software Engineer",
        addressType: "Residential",
        ownership: "Owned",
        groupLoan: true,
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    console.log("Updated Client:", form);
    navigate("/profile-management/client");
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Edit Client Master</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        {/* CLIENT CLASSIFICATION */}
        <Section title="Client Classification">
          <Select
            label="Client Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Individual</option>
            <option>Business</option>
          </Select>

          <Select
            label="Client Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Salaried</option>
            <option>Self Employed</option>
            <option>MSME</option>
          </Select>

          <Select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Applicant</option>
            <option>Co-Applicant</option>
            <option>Guarantor</option>
          </Select>

          <Select
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>IT</option>
            <option>Finance</option>
            <option>Healthcare</option>
          </Select>
        </Section>

        {/* EMPLOYMENT */}
        <Section title="Employment Details">
          <Select
            label="Employment Type"
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Salaried</option>
            <option>Self Employed</option>
          </Select>

          <Select
            label="Employer Type"
            name="employerType"
            value={form.employerType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Company</option>
            <option>Government</option>
            <option>Freelancer</option>
          </Select>

          <Input
            label="Employer"
            name="employer"
            value={form.employer}
            onChange={handleChange}
          />

          <Select
            label="Occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Software Engineer</option>
            <option>Doctor</option>
            <option>Business Owner</option>
          </Select>
        </Section>

        {/* ADDRESS */}
        <Section title="Address & Ownership">
          <Select
            label="Address Type"
            name="addressType"
            value={form.addressType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Residential</option>
            <option>Official</option>
          </Select>

          <Select
            label="Ownership"
            name="ownership"
            value={form.ownership}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Owned</option>
            <option>Rented</option>
            <option>Mortgaged</option>
          </Select>
        </Section>

        {/* GROUP LOAN */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="groupLoan"
            checked={form.groupLoan}
            onChange={handleChange}
          />
          <span className="text-sm">Enable Group Loans</span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl"
          >
            Update Client
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

/* ---------- REUSABLE UI ---------- */

const Section = ({ title, children }) => (
  <section>
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 p-2 border rounded-lg" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="w-full mt-1 p-2 border rounded-lg">
      {children}
    </select>
  </div>
);
