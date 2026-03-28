// AllocateData.jsx — integrated with /data_lead/used-leads/allocate/
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { UsedLeadService, ThirdPartyLeadService } from "../../../services/dataAndLeads.service";

// Users endpoint lives on ThirdPartyLeadService.getUsers()
const fetchUsers = () => ThirdPartyLeadService.getUsers();

/* ─── helpers ─────────────────────────────────────── */
const scoreColor = (s) =>
  s >= 80
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : s >= 60
    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
    : "bg-red-50 text-red-700 ring-1 ring-red-200";

const statusColor = (st) =>
  st === "Hot"
    ? "bg-red-50 text-red-700 ring-1 ring-red-200"
    : "bg-orange-50 text-orange-700 ring-1 ring-orange-200";

/* ─── Toast ────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all
      ${type === "success"
        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : "bg-red-50 border-red-200 text-red-800"
      }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
    )}
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
  </div>
);

/* ─── Main Component ────────────────────────────────── */
const AllocateData = () => {
  const [leads, setLeads]               = useState([]);
  const [users, setUsers]               = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [searchTerm, setSearchTerm]     = useState("");
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [toast, setToast]               = useState(null);

  /* filter: fetch unallocated/active leads */
  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    try {
      /* is_active=true returns unallocated/active used leads from all_data */
      const res = await UsedLeadService.allData({ is_active: true });
      const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      setLeads(data);
    } catch (err) {
      showToast("Failed to load leads: " + (err.response?.data?.error ?? err.message), "error");
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetchUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
    loadUsers();
  }, [loadLeads, loadUsers]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* filtered view */
  const filtered = leads.filter((l) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const name  = (l.lead_object?.contact_name ?? l.contact_name ?? "").toLowerCase();
    const phone = (l.lead_object?.contact_phone ?? l.contact_phone ?? "").toLowerCase();
    const email = (l.lead_object?.contact_email ?? l.contact_email ?? "").toLowerCase();
    const id    = String(l.id).toLowerCase();
    return name.includes(q) || phone.includes(q) || email.includes(q) || id.includes(q);
  });

  /* toggle select */
  const toggle = (id) =>
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allChecked =
    filtered.length > 0 && filtered.every((l) => selectedLeads.includes(l.id));

  const toggleAll = () =>
    setSelectedLeads(allChecked ? [] : filtered.map((l) => l.id));

  /* allocate */
  const handleAllocate = async () => {
    if (!selectedLeads.length || !selectedAgent) return;
    setSubmitting(true);
    try {
      await UsedLeadService.allocate({
        lead_ids: selectedLeads,
        agent_id: Number(selectedAgent),
      });
      showToast(`${selectedLeads.length} lead${selectedLeads.length > 1 ? "s" : ""} allocated successfully.`);
      setSelectedLeads([]);
      loadLeads();
    } catch (err) {
      showToast("Allocation failed: " + (err.response?.data?.error ?? err.message), "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* display helpers */
  const getName  = (l) => l.lead_object?.contact_name  ?? l.contact_name  ?? "—";
  const getPhone = (l) => l.lead_object?.contact_phone ?? l.contact_phone ?? "—";
  const getEmail = (l) => l.lead_object?.contact_email ?? l.contact_email ?? "—";
  const getSource = (l) => l.Source ?? l.source ?? "—";
  const getScore  = (l) => l.lead_quality ?? l.lead_status ?? "—";
  const getStatus = (l) => l.status ?? "—";

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ── Search + Refresh ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, phone, or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={loadLeads}
            disabled={loadingLeads}
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingLeads ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Allocation Settings ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Allocation Settings
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign to Agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              disabled={loadingUsers}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-50"
            >
              <option value="">
                {loadingUsers ? "Loading agents…" : "Choose agent…"}
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAllocate}
              disabled={!selectedLeads.length || !selectedAgent || submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Allocate
              {selectedLeads.length > 0 && (
                <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedLeads.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loadingLeads ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading leads…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No unallocated leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="rounded accent-indigo-600"
                    />
                  </th>
                  {["ID", "Name", "Contact", "Source", "Quality", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => toggle(lead.id)}
                    className={`cursor-pointer transition ${
                      selectedLeads.includes(lead.id)
                        ? "bg-indigo-50/60"
                        : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggle(lead.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded accent-indigo-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{lead.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{getName(lead)}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800">{getPhone(lead)}</div>
                      <div className="text-xs text-gray-400">{getEmail(lead)}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getSource(lead)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${scoreColor(parseInt(getScore(lead)) || 50)}`}>
                        {getScore(lead)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(getStatus(lead))}`}>
                        {getStatus(lead)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocateData;
