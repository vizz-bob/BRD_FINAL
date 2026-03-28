import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { penaltyService } from "../../../services/penaltyService";

const PenaltyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const res = await penaltyService.getPenaltyById(id);
        setData(res);
        */

        // TEMP MOCK DATA
        setData({
          name: "Late EMI Penalty",
          frequency: "Recurring",
          basis: "Percentage",
          recovery_stage: "Missed EMI",
          recovery_mode: "Auto",
          rate: "2%",
          status: "Active",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading penalty details...</p>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <p className="text-gray-500">Penalty not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Penalty Details
            </h1>
            <p className="text-gray-500 text-sm">
              View penalty configuration and recovery rules
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/penalties/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiEdit /> Edit
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-8">
        {/* CONFIGURATION */}
        <Section title="Penalty Configuration">
          <DetailItem label="Penalty Name" value={data.name} />
          <DetailItem label="Frequency" value={data.frequency} />
          <DetailItem label="Basis of Recovery" value={data.basis} />
        </Section>

        {/* RECOVERY */}
        <Section title="Recovery Rules">
          <DetailItem
            label="Recovery Stage"
            value={data.recovery_stage}
          />
          <DetailItem
            label="Mode of Recovery"
            value={data.recovery_mode}
          />
          <DetailItem
            label="Rate of Penalties"
            value={data.rate}
          />
        </Section>

        {/* STATUS */}
        <div className="flex justify-end">
          <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
            {data.status}
          </span>
        </div>
      </div>
    </MainLayout>
  );
};

export default PenaltyDetail;

/* ---------------- SMALL UI HELPERS ---------------- */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
);
