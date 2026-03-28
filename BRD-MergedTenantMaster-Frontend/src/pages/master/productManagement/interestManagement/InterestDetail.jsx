import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { interestService } from "../../../../services/productManagementService";

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

export default function InterestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await interestService.getInterest(id);
        setData(res);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading interest details...</p></div>;
  if (!data) return <div className="px-8 py-6"><p className="text-gray-500">Interest configuration not found.</p></div>;

  const apr = (Number(data.benchmark_rate || 0) + Number(data.mark_up || 0)).toFixed(2);

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center justify-between mb-6 shadow-sm max-w-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Interest Configuration Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">View benchmark, interest rules and APR</p>
          </div>
        </div>
        <button onClick={() => navigate(`/interest/${id}/edit`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all">
          <FiEdit size={15} />Edit
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl space-y-8">
        <Section title="Benchmark Configuration">
          <DetailItem label="Benchmark Type" value={data.benchmark_type} />
          <DetailItem label="Benchmark Frequency" value={data.benchmark_frequency} />
          <DetailItem label="Benchmark Rate" value={data.benchmark_rate ? `${data.benchmark_rate}%` : "—"} />
          <DetailItem label="Mark Up" value={data.mark_up ? `${data.mark_up}%` : "—"} />
        </Section>
        <Section title="Interest Configuration">
          <DetailItem label="Interest Type" value={data.interest_type} />
          <DetailItem label="Accrual Stage" value={data.accrual_stage} />
          <DetailItem label="Accrual Method" value={data.accrual_method} />
          <DetailItem label="Interest Rate" value={data.interest_rate ? `${data.interest_rate}% p.a.` : "—"} />
        </Section>
        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <span className="text-sm font-semibold text-indigo-700">Average Percentage Rate (APR)</span>
          <span className="text-2xl font-bold text-indigo-600">{apr}%</span>
        </div>
        <Section title="Configuration">
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <StatusBadge value={data.is_active} />
          </div>
        </Section>
      </div>
    </div>
  );
}