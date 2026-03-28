import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { moratoriumService } from "../../../../services/productManagementService";

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const StatusBadge = ({ value }) => {
  const isActive =
    value === "Active" || value === "ACTIVE" || value === true || value === "Yes";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        ${isActive
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-600 border border-red-200"
        }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

/* ================= MAIN COMPONENT ================= */

const MoratoriumDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await moratoriumService.getMoratorium(id);
        setData(res);
      } catch (err) {
        console.error("Failed to load moratorium:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="px-8 py-6">
        <p className="text-center py-6 text-gray-500">Loading moratorium details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-8 py-6">
        <p className="text-center py-6 text-gray-500">Moratorium rule not found.</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">

      {/* ===== PAGE HEADER ===== */}
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5
        flex items-center justify-between mb-6 shadow-sm max-w-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Moratorium Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View moratorium configuration and impact
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/moratorium/${id}/edit`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600
            hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <FiEdit size={15} />
          Edit
        </button>
      </div>

      {/* ===== DETAIL CARD ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl space-y-8">

        {/* MORATORIUM DETAILS */}
        <Section title="Moratorium Details">
          <DetailItem
            label="Moratorium Type"
            value={data.moratorium_type === "FULL" ? "Full" : "Interest-only"}
          />
          <DetailItem
            label="Effect of Moratorium"
            value={data.effect_of_moratorium === "DEFERRED" ? "Deferred" : "Interest-only"}
          />
          <DetailItem
            label="Amount Under Moratorium"
            value={`₹${Number(data.amount).toLocaleString()}`}
          />
          <DetailItem
            label="Effective Date"
            value={data.effective_date || "—"}
          />
          <DetailItem
            label="Period"
            value={`${data.period_value} ${data.period_unit === "DAY" ? "Days" : "Months"}`}
          />
        </Section>

        {/* INTEREST IMPACT */}
        <Section title="Interest Impact">
          <DetailItem
            label="Interest Handling"
            value={
              data.interest_handling === "RECOVER_DURING"
                ? "Recover During Moratorium"
                : data.interest_handling === "ACCUMULATE"
                ? "Accumulate & Pay Later"
                : data.interest_handling === "WAIVE"
                ? "Waive Off"
                : data.interest_handling || "—"
            }
          />
          <DetailItem
            label="Revised Interest Rate"
            value={
              data.revised_interest_rate
                ? `${data.revised_interest_rate}%`
                : "Not Applicable"
            }
          />
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Interest Rationalisation
            </p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                ${data.interest_rationalisation
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
            >
              {data.interest_rationalisation ? "✓ Waived" : "Not Waived"}
            </span>
          </div>
        </Section>

        {/* CONFIGURATION */}
        <Section title="Configuration">
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Status
            </p>
            <StatusBadge value={data.status || data.is_active} />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default MoratoriumDetail;