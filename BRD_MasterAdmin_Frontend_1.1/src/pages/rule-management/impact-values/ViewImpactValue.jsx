import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewImpactValue() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await ruleManagementService.getImpactValueById(id);
      setImpact(data);
    })();
  }, [id]);

  if (!impact) return null;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">View Impact Value</h1>
        </div>

        <button
          onClick={() => navigate(`/rule-management/impact-values/edit/${id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
        >
          <FiEdit3 /> Edit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

        <Detail label="Rule Name" value={impact.rule_name || impact.rule?.rule_name} />
        <Detail label="Impact Type" value={impact.impact_type} />
        <Detail label="Impact Value" value={impact.impact_value} />
        <Detail label="Risk Impact" value={impact.risk_impact} />

        <div>
          <p className="text-gray-500">Status</p>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
            impact.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {impact.status}
          </span>
        </div>

        <Detail label="Created At" value={new Date(impact.created_at).toLocaleString()} />

      </div>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 mt-1">{value || "-"}</p>
  </div>
);
