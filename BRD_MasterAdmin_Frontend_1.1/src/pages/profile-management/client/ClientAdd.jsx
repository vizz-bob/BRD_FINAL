import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

export default function ClientAdd() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    console.log("Add Client:", form);
    navigate("/profile-management/client");
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Add Client</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        {/* Classification */}
        <Section title="Client Classification">
          <Select name="category" label="Client Category" onChange={handleChange}>
            <option value="">Select</option>
            <option>Individual</option>
            <option>Business</option>
          </Select>

          <Select name="type" label="Client Type" onChange={handleChange}>
            <option value="">Select</option>
            <option>Salaried</option>
            <option>Self Employed</option>
            <option>MSME</option>
          </Select>

          <Select name="role" label="Role" onChange={handleChange}>
            <option value="">Select</option>
            <option>Applicant</option>
            <option>Co-Applicant</option>
            <option>Guarantor</option>
          </Select>

          <Select name="industry" label="Industry" onChange={handleChange}>
            <option value="">Select</option>
            <option>IT</option>
            <option>Finance</option>
            <option>Healthcare</option>
          </Select>
        </Section>

        {/* Employment */}
        <Section title="Employment Details">
          <Select
            name="employmentType"
            label="Employment Type"
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Salaried</option>
            <option>Self Employed</option>
          </Select>

          <Select
            name="employerType"
            label="Employer Type"
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Company</option>
            <option>Government</option>
            <option>Freelancer</option>
          </Select>

          <Input
            name="employer"
            label="Employer"
            onChange={handleChange}
          />

          <Select
            name="occupation"
            label="Occupation"
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Engineer</option>
            <option>Doctor</option>
            <option>Business Owner</option>
          </Select>
        </Section>

        {/* Address */}
        <Section title="Address & Ownership">
          <Select name="addressType" label="Address Type" onChange={handleChange}>
            <option value="">Select</option>
            <option>Residential</option>
            <option>Official</option>
          </Select>

          <Select name="ownership" label="Ownership" onChange={handleChange}>
            <option value="">Select</option>
            <option>Owned</option>
            <option>Rented</option>
          </Select>
        </Section>

        {/* Group Loan */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="groupLoan"
            checked={form.groupLoan}
            onChange={handleChange}
          />
          <span className="text-sm">Enable Group Loans</span>
        </div>

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
            Save Client
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

/* Reusable */
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
