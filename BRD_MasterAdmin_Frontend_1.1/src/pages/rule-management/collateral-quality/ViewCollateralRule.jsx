import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewCollateralRule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rule, setRule] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await ruleManagementService.getCollateralRuleById(id);
      setRule(data);
    })();
  }, [id]);

  if (!rule) return null;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">View Collateral Rule</h1>
        </div>

        <button
          onClick={() => navigate(`/rule-management/collateral-quality/edit/${id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
        >
          <FiEdit3 /> Edit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl space-y-6">
        <Info label="Collateral Type" value={rule.collateral_type} />
        <Info label="Ownership" value={rule.ownership} />
        <Info label="Minimum Value" value={`₹${rule.min_market_value}`} />
        <Info label="Maximum Value" value={`₹${rule.max_market_value}`} />
        <Info label="Allowed LTV (%)" value={`${rule.allowed_ltv}%`} />
        <Info label="Risk Level" value={rule.risk_level} />

        <Info label="Created At" value={formatDate(rule.created_at)} />
        <Info label="Updated At" value={formatDate(rule.updated_at)} />
        <Info label="Created By" value={`${rule.created_by_name} (${rule.created_by_role})`} />
        <Info label="Updated By" value={`${rule.updated_by_name} (${rule.updated_by_role})`} />

        <div>
          <label className="text-sm font-medium">Status</label>
          <div className="mt-2">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
              rule.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
              {rule.status}
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleString();
};

const Info = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className="mt-1 text-sm text-gray-900">{value || "-"}</p>
  </div>
);
