import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import occupationTypeService from "../../services/occupationTypeService";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewOccupationTypePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load details
  const loadDetails = async () => {
    const res = await occupationTypeService.getById(uuid);
    setDetails(res);
    setLoading(false);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    );
  }

  if (!details) {
    return (
      <MainLayout>
        <p className="text-red-500">Occupation type not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>

        <h1 className="text-xl font-semibold">Occupation Type Details</h1>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-xl">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">{details.occ_name}</h2>

        <div className="space-y-3">
          <DetailRow label="UUID" value={details.uuid} />

          <DetailRow
            label="Created By"
            value={details.created_user || "System"}
          />

          <DetailRow
            label="Modified By"
            value={details.modified_user || "System"}
          />

          <DetailRow
            label="Created At"
            value={
              details.created_at
                ? new Date(details.created_at).toLocaleString()
                : "N/A"
            }
          />

          <DetailRow
            label="Modified At"
            value={
              details.modified_at
                ? new Date(details.modified_at).toLocaleString()
                : "N/A"
            }
          />
        </div>

        <button
          onClick={() => navigate("/occupation-types")}
          className="mt-6 px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>
    </MainLayout>
  );
}

// Reusable detail component
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
