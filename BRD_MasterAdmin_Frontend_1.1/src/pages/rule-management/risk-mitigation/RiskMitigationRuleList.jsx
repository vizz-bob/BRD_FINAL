import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function RiskMitigationRuleList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rules, setRules] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await ruleManagementService.getRiskMitigationRules();
    setRules(Array.isArray(data) ? data : []);
  };

  const filtered = rules.filter(r =>
    (r.risk_parameter || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Risk & Mitigation Rules</h1>
          <p className="text-sm text-gray-500">Risk controls and mitigation logic</p>
        </div>
        <button onClick={() => navigate("/rule-management/risk-mitigation/add")}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm">
          <FiPlus /> Add Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by risk..." className="w-full outline-none text-sm bg-transparent" />
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        {/* DESKTOP HEADER */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10">
          <div>Risk Parameter</div>
          <div>Mitigation Action</div>
          <div>Severity</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map(r => (
          <React.Fragment key={r.id}>

            {/* DESKTOP ROW */}
            <div className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm grid-cols-5 items-center text-sm">
              <div className="font-medium truncate">{r.risk_parameter}</div>
              <div className="truncate">{r.mitigation_action}</div>
              <div className="capitalize">{r.severity}</div>
              <StatusBadge status={r.status} />
              <div className="flex justify-end gap-2">
                <IconButton color="gray" onClick={() => navigate(`/rule-management/risk-mitigation/view/${r.id}`)}><FiEye /></IconButton>
                <IconButton color="blue" onClick={() => navigate(`/rule-management/risk-mitigation/edit/${r.id}`)}><FiEdit3 /></IconButton>
                <IconButton color="red" onClick={() => setDeleteId(r.id)}><FiTrash2 /></IconButton>
              </div>
            </div>

            {/* MOBILE CARD */}
            <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="font-semibold text-sm truncate">{r.risk_parameter}</span>
                <div className="flex gap-3 text-gray-600">
                  <FiEye color="gray" onClick={() => navigate(`/rule-management/risk-mitigation/view/${r.id}`)} />
                  <FiEdit3 color="blue" onClick={() => navigate(`/rule-management/risk-mitigation/edit/${r.id}`)} />
                  <FiTrash2 color="red" onClick={() => setDeleteId(r.id)} />
                </div>
              </div>

              <div className="px-4 py-3 space-y-3 text-sm">
                <Row label="Mitigation" value={r.mitigation_action} />
                <Row label="Severity" value={r.severity} />
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Status</span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            </div>

          </React.Fragment>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmButton
          title="Delete Rule"
          message="Are you sure you want to delete this risk mitigation rule?"
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            await ruleManagementService.deleteRiskMitigationRule(deleteId);
            setDeleteId(null);
            load();
          }}
        />
      )}
    </MainLayout>
  );
}

/* HELPERS */

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="font-medium text-right">{value || "-"}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center justify-center
      px-3 py-1 text-xs font-medium
      rounded-full w-fit whitespace-nowrap leading-none
      ${
        status === "ACTIVE"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
  >
    {status}
  </span>
);

const IconButton = ({ children, color, onClick }) => {
  const map = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };
  return <button onClick={onClick} className={`p-2 rounded-full ${map[color]}`}>{children}</button>;
};
