import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
// import { disbursementMasterService } from "../../../services/disbursementMasterService";

export default function DisbursementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // TEMP MOCK DATA
    setData({
      id,
      disbursement_name: "Standard Loan Disbursement",
      agency_name: "State Bank",
      frequency_label: "Monthly",
      third_party_name: "Verifier Ltd",
      down_payment_percentage: 20,
      stage_name: "Pre-Approval",
      required_documents_names: ["KYC", "Agreement"],
      status: "Active",
      created_at: new Date()
    });
  }, [id]);

  if (!data) return null;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-semibold">Disbursement Details</h1>
            <p className="text-sm text-gray-500">
              View disbursement workflow configuration
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/disbursement-management/disbursement-master/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Disbursement
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Detail label="Disbursement Name" value={data.disbursement_name} />
        <Detail label="Agency" value={data.agency_name} />
        <Detail label="Frequency" value={data.frequency_label} />
        <Detail label="Third Party" value={data.third_party_name} />
        <Detail label="Down Payment %" value={`${data.down_payment_percentage}%`} />
        <Detail label="Down Payment Stage" value={data.stage_name} />
        <Detail label="Required Documents" value={data.required_documents_names.join(", ")} />
        <Detail label="Status" value={data.status} />
        <Detail label="Created At" value={new Date(data.created_at).toLocaleString()} />

      </div>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);
