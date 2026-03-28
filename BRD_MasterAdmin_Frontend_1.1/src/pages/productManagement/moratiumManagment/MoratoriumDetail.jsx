import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { moratoriumService } from "../../../services/moratoriumService";

const MoratoriumDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const res = await moratoriumService.getMoratoriumById(id);
        setData(res);
        */

        // TEMP MOCK DATA
        setData({
          type: "Full",
          period_value: 3,
          period_unit: "Months",
          amount: 50000,
          effect: "Deferred",
          interest_rationalisation: true,
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
        <p className="text-gray-500">Loading moratorium details...</p>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <p className="text-gray-500">Moratorium rule not found.</p>
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
              Moratorium Details
            </h1>
            <p className="text-gray-500 text-sm">
              View moratorium configuration and impact
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/moratorium/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiEdit /> Edit
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-8">
        {/* CONFIGURATION */}
        <Section title="Moratorium Configuration">
          <DetailItem label="Moratorium Type" value={data.type} />
          <DetailItem
            label="Period"
            value={`${data.period_value} ${data.period_unit}`}
          />
          <DetailItem
            label="Amount under Moratorium"
            value={`₹${data.amount}`}
          />
        </Section>

        {/* IMPACT */}
        <Section title="Moratorium Impact">
          <DetailItem
            label="Effect of Moratorium"
            value={data.effect}
          />
          <DetailItem
            label="Interest Rationalisation"
            value={data.interest_rationalisation ? "Yes" : "No"}
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

export default MoratoriumDetail;

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
