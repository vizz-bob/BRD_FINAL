import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
// import { agencyMasterService } from "../../../services/agencyMasterService";

export default function AgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // TEMP MOCK DATA (replace later with API)
    setData({
      id,
      name: "State Bank",
      type: "Govt",
      contact: "sb@bank.com",
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
            <h1 className="text-xl font-semibold">Agency Details</h1>
            <p className="text-sm text-gray-500">
              View agency configuration
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/disbursement-management/agency-master/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Agency
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Detail label="Agency Name" value={data.name} />
        <Detail label="Agency Type" value={data.type} />
        <Detail label="Contact Details" value={data.contact || "-"} />
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
