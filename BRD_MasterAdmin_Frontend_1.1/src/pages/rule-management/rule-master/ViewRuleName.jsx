import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewRuleName() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rule, setRule] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await ruleManagementService.getRuleMasterById(id);
      setRule(data);
    })();
  }, [id]);

  if (!rule) return null;

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">View Rule Engine</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Detail label="Rule Name" value={rule.rule_name} />
        <Detail label="Rule Code" value={rule.rule_code} />

        <div>
          <label className="text-sm font-medium">Status</label>
          <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
            rule.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}>
            {rule.status}
          </span>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <p className="mt-2 p-4 bg-gray-50 rounded-xl">
            {rule.description || "-"}
          </p>
        </div>

        <Detail label="Created At" value={formatDate(rule.created_at)} />
        <Detail label="Updated At" value={formatDate(rule.updated_at)} />
        <Detail label="Created By" value={`${rule.created_by_name} (${rule.created_by_role})`} />
        <Detail label="Updated By" value={`${rule.updated_by_name} (${rule.updated_by_role})`} />
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
    <label className="text-sm font-medium">{label}</label>
    <div className="mt-2 p-3 bg-gray-50 rounded-xl">
      {value || "-"}
    </div>
  </div>
);
