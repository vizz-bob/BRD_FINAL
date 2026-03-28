import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";

export default function LegalAgentView() {
  const navigate = useNavigate();
  const { id } = useParams();

  // later replace with API call using id
  const agent = {
    id,
    name: "Legal Shield LLP",
    contact: "legal@shield.com | +91 98765 43210",
    expertise: "Loan Recovery, SARFAESI",
    jurisdiction: "North Zone",
    feeAgreement: "Per Case",
    assignedCollections: "Retail Loans, MSME Loans",
    status: "Active",
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold"></h2>
        <p className="text-sm text-gray-500">
          
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold"></h2>
        <p className="text-sm text-gray-500">
          
        </p>
      </div>

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
            <h1 className="text-xl font-semibold">Legal Agent Details</h1>
            <p className="text-sm text-gray-500">View legal agent information and assigned collections</p>
          </div>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-700">
          <Detail label="Agent Name" value={agent.name} />
          <Detail label="Contact Info" value={agent.contact} />
          <Detail label="Legal Expertise" value={agent.expertise} />
          <Detail label="Jurisdiction" value={agent.jurisdiction} />
          <Detail label="Fee Agreement" value={agent.feeAgreement} />
          <Detail label="Assigned Collections" value={agent.assignedCollections} />
          <Detail
            label="Status"
            value={
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {agent.status}
              </span>
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() =>
              navigate(`/legal-agents/edit/${id}`)
            }
            className="px-5 py-2 rounded-xl text-sm bg-yellow-500 text-white hover:bg-yellow-600 transition"
          >
            Edit
          </button>

          <button
            onClick={() =>
              navigate(`/collection-agent/update/${id}`)
            }
            className="px-5 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Update Agent
          </button>

          <button
            onClick={() =>
              navigate(`/collection-agent/fees/${id}`)
            }
            className="px-5 py-2 rounded-xl text-sm bg-green-600 text-white hover:bg-green-700 transition"
          >
            Manage Fees
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

/* ---------- Helper ---------- */

const Detail = ({ label, value }) => (
  <div>
    <span className="font-semibold">{label}:</span>{" "}
    <span>{value}</span>
  </div>
);
