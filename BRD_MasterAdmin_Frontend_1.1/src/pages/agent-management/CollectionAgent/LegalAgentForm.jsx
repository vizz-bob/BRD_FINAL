import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";

export default function LegalAgentForm() {
  const { id } = useParams(); // Edit if ID exists
  const navigate = useNavigate();

  const [agentData, setAgentData] = useState({
    name: "",
    contactInfo: "",
    legalExpertise: "",
    jurisdiction: "",
    feeAgreement: "",
    assignedCollections: "",
  });

  /* ---------------- FETCH DATA (EDIT MODE) ---------------- */
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        // TODO: Replace with API call
        const data = {
          name: "Legal Shield LLP",
          contactInfo: "9876543210 / legal@example.com",
          legalExpertise: "Corporate Law",
          jurisdiction: "West Zone",
          feeAgreement: "10% per case",
          assignedCollections: "Collection A, Collection B",
        };
        setAgentData(data);
      };
      fetchData();
    }
  }, [id]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      console.log("Updating Legal Agent:", agentData);
      // API: PUT /legal-agents/:id
    } else {
      console.log("Creating Legal Agent:", agentData);
      // API: POST /legal-agents
    }

    navigate("/collection-agents/legal");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      
      <div className="flex justify-between items-center mb-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-semibold">{id ? "Edit Legal Agent" : "Add Legal Agent"}</h1>
            <p className="text-sm text-gray-500">Configure legal agent details, jurisdiction, and assigned collections</p>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Agent Name"
            name="name"
            value={agentData.name}
            onChange={handleChange}
            placeholder="Enter agent full name"
          />

          <Input
            label="Contact Info"
            name="contactInfo"
            value={agentData.contactInfo}
            onChange={handleChange}
            placeholder="Phone or email"
          />

          <Input
            label="Legal Expertise"
            name="legalExpertise"
            value={agentData.legalExpertise}
            onChange={handleChange}
            placeholder="SARFAESI, Litigation"
          />

          <Input
            label="Jurisdiction"
            name="jurisdiction"
            value={agentData.jurisdiction}
            onChange={handleChange}
            placeholder="Zone / Court"
          />

          <Input
            label="Fee Agreement"
            name="feeAgreement"
            value={agentData.feeAgreement}
            onChange={handleChange}
            placeholder="Per Case / Percentage"
          />

          <Input
            label="Assigned Collections"
            name="assignedCollections"
            value={agentData.assignedCollections}
            onChange={handleChange}
            placeholder="Retail, MSME"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {id ? "Update Agent" : "Save Agent"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE INPUT ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);
