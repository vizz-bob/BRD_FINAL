import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiCreditCard,
} from "react-icons/fi";

export default function VerificationAgencyView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [agency, setAgency] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    // TODO: replace with API call
    const data = {
      id,
      name: "ABC Verifications",
      agentType: "Verification Agent",
      contactPerson: "Rahul Sharma",
      mobile: "9876543210",
      email: "abc@verify.com",
      region: "North",
      status: "Active",
    };
    setAgency(data);
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("Delete this agency?")) return;
    console.log("Deleting agency:", id);
    // API: DELETE /verification-agencies/:id
    navigate("/verification-agency");
  };

  if (!agency) return null;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-semibold">Agency Details</h1>
            <p className="text-sm text-gray-500">
              View verification agency configuration and status
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/verification-agency/edit/${id}`)
            }
            className="px-4 py-2 rounded-xl text-sm bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FiEdit3 /> Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-sm bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center gap-2"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl">
        <InfoRow label="Agency Name" value={agency.name} />
        <InfoRow label="Agent Type" value={agency.agentType} />
        <InfoRow label="Contact Person" value={agency.contactPerson} />
        <InfoRow label="Mobile Number" value={agency.mobile} />
        <InfoRow label="Email Address" value={agency.email} />
        <InfoRow label="Region / Zone" value={agency.region} />
        <InfoRow
          label="Status"
          value={
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                agency.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {agency.status}
            </span>
          }
        />

        {/* ACTION */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() =>
              navigate(`/verification-agency/manage-fees/${id}`)
            }
            className="px-5 py-2 rounded-xl text-sm bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <FiCreditCard /> Manage Fees
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

/* ---------------- HELPER ---------------- */

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);
