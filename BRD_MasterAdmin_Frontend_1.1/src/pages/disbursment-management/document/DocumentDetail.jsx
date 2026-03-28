import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
// import { documentMasterService } from "../../services/documentMasterService";

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    documentMasterService.getById(id).then(res => setData(res.data));
  }, [id]);

  if (!data) return null;

  return (
    <MainLayout title="Document Details">
      <div className="flex justify-between mb-4">
        <button onClick={() => navigate(-1)} className="btn-light">
          <FiArrowLeft /> Back
        </button>
        <button onClick={() => navigate(`/disbursement-management/documents-master/${id}/edit`)} className="btn-primary">
          <FiEdit /> Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow">
        <Detail label="Name" value={data.name} />
        <Detail label="Type" value={data.type} />
        <Detail label="Mandatory" value={data.mandatory ? "Yes" : "No"} />
        <Detail label="Applicable Stage" value={data.applicable_stage_name || "-"} />
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
