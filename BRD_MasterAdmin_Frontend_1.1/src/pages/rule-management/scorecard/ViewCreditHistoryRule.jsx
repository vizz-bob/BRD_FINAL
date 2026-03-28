import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewCreditHistoryRule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rule, setRule] = useState(null);

  useEffect(() => {
    loadRule();
  }, [id]);

  const loadRule = async () => {
    const data = await ruleManagementService.getCreditHistoryRules();
    const record = data.find((x) => String(x.id) === String(id));
    if (record) setRule(record);
  };

  if (!rule) return null;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">View Credit History Rule</h1>
        </div>

        <button
          onClick={() => navigate(`/rule-management/scorecard/credit-history/edit/${id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
        >
          <FiEdit3 /> Edit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl space-y-6">
        <Info label="Credit Bureau" value={rule.credit_bureau} />
        <Info label="Minimum Credit Score" value={rule.min_credit_score} />
        <Info label="Maximum DPD Days" value={rule.max_dpd_days} />
        <Info label="Maximum Enquiries" value={rule.max_enquiries} />
        <Info label="Risk Level" value={rule.risk_level} />
        <Info label="Remarks" value={rule.remarks || "-"} />

        <div>
          <label className="text-sm font-medium">Status</label>
          <div className="mt-2">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                rule.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {rule.status}
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const Info = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className="mt-1 text-sm text-gray-900">{value}</p>
  </div>
);
