import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { repaymentService } from "../../../services/repaymentService";

const RepaymentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const res = await repaymentService.getRepaymentById(id);
        setData(res);
        */

        // TEMP MOCK DATA
        setData({
          type: "EMI",
          frequency: "Monthly",
          limit_in_month: 24,
          gap_first_repayment: 1,
          no_of_repayments: 24,
          sequence: "Principal First",
          repayment_months: ["January", "February", "March"],
          repayment_days: ["Monday"],
          repayment_dates: ["5"],
          collection_mode: "NACH",
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
        <p className="text-gray-500">Loading repayment details...</p>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <p className="text-gray-500">Repayment rule not found.</p>
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
              Repayment Rule Details
            </h1>
            <p className="text-gray-500 text-sm">
              View repayment structure and collection rules
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/repayment/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiEdit /> Edit
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl space-y-8">
        {/* CONFIGURATION */}
        <Section title="Repayment Configuration">
          <DetailItem label="Repayment Type" value={data.type} />
          <DetailItem label="Frequency" value={data.frequency} />
          <DetailItem
            label="Limit in Months"
            value={data.limit_in_month}
          />
          <DetailItem
            label="Gap before First Repayment (Months)"
            value={data.gap_first_repayment}
          />
          <DetailItem
            label="Number of Repayments"
            value={data.no_of_repayments}
          />
          <DetailItem
            label="Sequence of Adjustment"
            value={data.sequence}
          />
        </Section>

        {/* SCHEDULE */}
        <Section title="Repayment Schedule">
          <DetailItem
            label="Repayment Months"
            value={
              data.repayment_months?.length
                ? data.repayment_months.join(", ")
                : "-"
            }
          />
          <DetailItem
            label="Repayment Days"
            value={
              data.repayment_days?.length
                ? data.repayment_days.join(", ")
                : "-"
            }
          />
          <DetailItem
            label="Repayment Dates"
            value={
              data.repayment_dates?.length
                ? data.repayment_dates.join(", ")
                : "-"
            }
          />
        </Section>

        {/* COLLECTION */}
        <Section title="Collection">
          <DetailItem
            label="Mode of Collection"
            value={data.collection_mode}
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

export default RepaymentDetail;

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
