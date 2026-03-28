import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import employmentTypeService from "../../services/employementTypeService";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewEmploymentTypePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await employmentTypeService.getById(uuid);
      setDetails(res);
    };
    load();
  }, [uuid]);

  if (!details) {
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded-xl hover:bg-gray-100">
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Employment Type Details</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-xl">
        <h2 className="text-lg font-semibold mb-4">{details.emp_name}</h2>

        <Detail label="UUID" value={details.uuid} />
        <Detail label="Created By" value={details.created_user || "System"} />
        <Detail label="Modified By" value={details.modified_user || "System"} />
        <Detail
          label="Created At"
          value={new Date(details.created_at).toLocaleString()}
        />
        <Detail
          label="Modified At"
          value={new Date(details.modified_at).toLocaleString()}
        />

        <button
          onClick={() => navigate("/employment-types")}
          className="mt-6 px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>
    </MainLayout>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
