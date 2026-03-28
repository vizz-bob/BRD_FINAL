import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function ImpactValueList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [impacts, setImpacts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await ruleManagementService.getImpactValues();
    setImpacts(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []);
  };

  const filtered = impacts.filter(i =>
    i.rule?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    await ruleManagementService.deleteImpactValue(deleteId);
    setDeleteId(null);
    loadData();
  };

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Impact Values</h1>
          <p className="text-sm text-gray-500">Define numeric impact of rules</p>
        </div>
        <button onClick={() => navigate("/rule-management/impact-values/add")}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm">
          <FiPlus /> Add Impact
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by rule name..."
          className="w-full outline-none text-sm bg-transparent" />
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        {/* DESKTOP HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10">
          <div>Rule</div><div>Impact Type</div><div>Value</div>
          <div>Risk</div><div>Status</div><div className="text-right">Actions</div>
        </div>

        {filtered.map(item => (
          <React.Fragment key={item.id}>

            {/* DESKTOP ROW */}
            <div className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm grid-cols-6 items-center text-sm">
              <div className="font-medium truncate">{item.rule}</div>
              <div className={item.impact_value > 0 ? "text-green-600" : "text-red-600"}>
                {item.impact_type}
              </div>
              <div>{item.impact_value}</div>
              <div>{item.risk_impact}</div>
              <StatusBadge status={item.status} />
              <div className="flex justify-end gap-2">
                <IconButton color="gray" onClick={() => navigate(`/rule-management/impact-values/view/${item.id}`)}><FiEye/></IconButton>
                <IconButton color="blue" onClick={() => navigate(`/rule-management/impact-values/edit/${item.id}`)}><FiEdit3/></IconButton>
                <IconButton color="red" onClick={() => setDeleteId(item.id)}><FiTrash2/></IconButton>
              </div>
            </div>

            {/* MOBILE CARD */}
            <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="font-semibold text-sm">{item.rule}</span>
                <div className="flex gap-3 text-gray-600">
                  <FiEye onClick={() => navigate(`/rule-management/impact-values/view/${item.id}`)} />
                  <FiEdit3 onClick={() => navigate(`/rule-management/impact-values/edit/${item.id}`)} />
                  <FiTrash2 onClick={() => setDeleteId(item.id)} />
                </div>
              </div>

              <div className="px-4 py-3 space-y-3 text-sm">
                <Row label="Impact Type" value={item.impact_type} />
                <Row label="Impact Value" value={item.impact_value} />
                <Row label="Risk Impact" value={item.risk_impact} />
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Status</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>

          </React.Fragment>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmButton
          title="Delete Impact"
          message="Are you sure you want to delete this impact value?"
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
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
