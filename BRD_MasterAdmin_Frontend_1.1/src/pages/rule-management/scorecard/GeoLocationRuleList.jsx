import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function GeoLocationRuleList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rules, setRules] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await ruleManagementService.getGeoLocationRules();
    setRules(Array.isArray(data) ? data : []);
  };

  const filtered = rules.filter(r =>
    (r.city || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.state || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Geo Location Scorecard</h1>
          <p className="text-sm text-gray-500">Location based risk scoring</p>
        </div>
        <button onClick={() => navigate("/rule-management/scorecard/geo/add")}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm">
          <FiPlus /> Add Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by city/state..." className="w-full outline-none text-sm bg-transparent"/>
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        {/* DESKTOP HEADER */}
        <div className="hidden md:grid grid-cols-7 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10">
          <div>State</div>
          <div>City</div>
          <div>Pincode</div>
          <div>Risk</div>
          <div>Weight</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map(r => (
          <React.Fragment key={r.id}>

            {/* DESKTOP ROW */}
            <div className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm grid-cols-7 items-center text-sm">
              <div className="font-medium truncate">{r.state}</div>
              <div className="truncate">{r.city}</div>
              <div>{r.pincode}</div>
              <div className="capitalize">{r.risk_level}</div>
              <div>{r.weight}%</div>
              <StatusBadge status={r.status} />
              <div className="flex justify-end gap-2">
                <IconButton color="gray" onClick={() => navigate(`/rule-management/scorecard/geo/view/${r.id}`)}><FiEye /></IconButton>
                <IconButton color="blue" onClick={() => navigate(`/rule-management/scorecard/geo/edit/${r.id}`)}><FiEdit3 /></IconButton>
                <IconButton color="red" onClick={() => setDeleteId(r.id)}><FiTrash2 /></IconButton>
              </div>
            </div>

            {/* MOBILE CARD */}
            <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="font-semibold text-sm">{r.city}, {r.state}</span>
                <div className="flex gap-3 text-gray-600">
                  <FiEye onClick={() => navigate(`/rule-management/scorecard/geo/view/${r.id}`)} />
                  <FiEdit3 onClick={() => navigate(`/rule-management/scorecard/geo/edit/${r.id}`)} />
                  <FiTrash2 onClick={() => setDeleteId(r.id)} />
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 text-sm">
                <Row label="Pincode" value={r.pincode} />
                <Row label="Risk" value={r.risk_level} />
                <Row label="Weight" value={`${r.weight}%`} />
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
          message="Are you sure you want to delete this geo-location rule?"
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            await ruleManagementService.deleteGeoLocationRule(deleteId);
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
  <div className="flex justify-between gap-3">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="font-medium">{value || "-"}</span>
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
const IconButton = ({ children, onClick, color }) => {
  const map = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600"
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-full ${map[color]}`}>
      {children}
    </button>
  );
};
