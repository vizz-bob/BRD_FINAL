import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ThirdPartyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      name: "Verifier Ltd",
      role: "Auditor",
      contact_info: "verifier@gmail.com",
      associated_stages_names: ["Pre-Approval", "Disbursement"],
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
            <h1 className="text-xl font-semibold">Third Party Details</h1>
            <p className="text-sm text-gray-500">
              View verification / validation partner configuration
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/disbursement-management/third-party/${id}/edit`)
          }
          className="btn-primary"
        >
          <FiEdit /> Edit Third Party
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail label="Third Party Name" value={data.name} />
        <Detail label="Role" value={data.role} />
        <Detail label="Contact Information" value={data.contact_info || "-"} />
        <Detail
          label="Associated Stages"
          value={data.associated_stages_names.join(", ")}
        />
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
