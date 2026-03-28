import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewClientProfileRule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rule, setRule] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await ruleManagementService.getClientProfileRuleById(id);
      setRule(data);
    })();
  }, [id]);

  if (!rule) return null;

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">View Client Profile Rule</h1>
        </div>

        <button
          onClick={() => navigate(`/rule-management/client-profile/edit/${id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
        >
          <FiEdit3 /> Edit
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Detail label="Rule Name" value={rule.rule_name} />
        <Detail label="Parameter" value={rule.parameter} />
        <Detail label="Condition" value={rule.condition} />
        <Detail label="Value" value={rule.value} />
        <Detail label="Impact Value" value={rule.impact_value} />

        <Detail label="Created At" value={formatDate(rule.created_at)} />
        <Detail label="Created By" value={rule.created_by || "System"} />
        <Detail label="Last Updated At" value={formatDate(rule.updated_at)} />
        <Detail label="Last Updated By" value={rule.updated_by || "System"} />

        <div>
          <p className="text-gray-500">Status</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
              rule.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {rule.status}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleString();
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 mt-1">{value || "-"}</p>
  </div>
);
