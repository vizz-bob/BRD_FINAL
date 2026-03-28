import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { repaymentsService } from "../../../../services/productManagementService";

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);
const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);
const StatusBadge = ({ value }) => {
  const isActive = value === "Active" || value === "ACTIVE" || value === true;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${isActive ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-600 border border-red-200"}`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default function RepaymentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await repaymentsService.getRepayment(id);
        setData(res);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading repayment details...</p></div>;
  if (!data) return <div className="px-8 py-6"><p className="text-gray-500">Repayment rule not found.</p></div>;

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center justify-between mb-6 shadow-sm max-w-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Repayment Rule Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">View repayment structure and collection rules</p>
          </div>
        </div>
        <button onClick={() => navigate(`/repayment/${id}/edit`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all">
          <FiEdit size={15} />Edit
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl space-y-8">
        <Section title="Repayment Configuration">
          <DetailItem label="Repayment Type" value={data.repayment_type} />
          <DetailItem label="Frequency" value={data.frequency} />
          <DetailItem label="Limit in Months" value={data.limit_in_month} />
          <DetailItem label="Gap Before First Repayment" value={data.gap_between_disbursement_and_first_repayment} />
          <DetailItem label="Number of Repayments" value={data.number_of_repayments} />
          <DetailItem label="Sequence of Adjustment" value={data.sequence_of_repayment_adjustment} />
          <DetailItem label="Collection Mode" value={data.mode_of_collection} />
        </Section>
        <Section title="Repayment Schedule">
          <DetailItem label="Repayment Months" value={data.repayment_months?.length ? data.repayment_months.join(", ") : "—"} />
          <DetailItem label="Repayment Days" value={data.repayment_days?.length ? data.repayment_days.join(", ") : "—"} />
          <DetailItem label="Repayment Dates" value={data.repayment_dates?.length ? data.repayment_dates.join(", ") : "—"} />
        </Section>
        <Section title="Retry Configuration">
          <DetailItem label="Retry Attempts" value={data.retry_attempts || "0"} />
          <DetailItem label="Retry Interval (Days)" value={data.retry_interval || "0"} />
        </Section>
        <Section title="Configuration">
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <StatusBadge value={data.status || data.is_active} />
          </div>
        </Section>
      </div>
    </div>
  );
}