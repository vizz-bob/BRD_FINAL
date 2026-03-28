// ReallocateData.jsx — integrated with /data_lead/used-leads/:id/reallocate/
import React, { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { UsedLeadService, ThirdPartyLeadService } from "../../../services/dataAndLeads.service";

// Users endpoint lives on ThirdPartyLeadService.getUsers()
const fetchUsers = () => ThirdPartyLeadService.getUsers();

/* ─── Toast ────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
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

/* ─── Status badge ─────────────────────────────────── */
const StatusBadge = ({ value }) => {
  const map = {
    "follow up": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    "follow-up": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    coverted:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    converted:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    hot:         "bg-red-50 text-red-700 ring-1 ring-red-200",
    qualified:   "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };
  const cls = map[(value ?? "").toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {value ?? "—"}
    </span>
  );
};

/* ─── Main Component ────────────────────────────────── */
const ReallocateData = ({ initialLead = null, onBack }) => {
  const [leads, setLeads]             = useState([]);
  const [users, setUsers]             = useState([]);
  const [selectedLead, setSelectedLead] = useState(initialLead);
  const [newAgent, setNewAgent]       = useState("");
  const [reason, setReason]           = useState("");
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [toast, setToast]             = useState(null);

  /* sync if opened from AllData modal */
  useEffect(() => {
    setSelectedLead(initialLead);
    setNewAgent("");
    setReason("");
  }, [initialLead]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    try {
      /* Fetch active (allocated) used leads for reallocation */
      const res = await UsedLeadService.list({ is_active: true });
      const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      setLeads(data);
    } catch (err) {
      showToast("Failed to load leads: " + (err.response?.data?.error ?? err.message), "error");
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetchUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    /* Only fetch list when not pre-seeded from AllData */
    if (!initialLead) loadLeads();
    loadUsers();
  }, [initialLead, loadLeads, loadUsers]);

  const handleReallocate = async () => {
    if (!selectedLead || !newAgent || !reason.trim()) return;
    setSubmitting(true);
    try {
      await UsedLeadService.reallocate(selectedLead.id, {
        agent_id: Number(newAgent),
        reason: reason.trim(),
      });
      showToast(`Lead #${selectedLead.id} reallocated successfully.`);
      /* reset form */
      setSelectedLead(null);
      setNewAgent("");
      setReason("");
      if (onBack) {
        onBack();
      } else {
        loadLeads(); /* refresh table if standalone */
      }
    } catch (err) {
      showToast("Reallocation failed: " + (err.response?.data?.error ?? err.message), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getName   = (l) => l.lead_object?.contact_name  ?? l.contact_name  ?? `Lead #${l.id}`;
  const getAgent  = (l) => l.allocated_to?.username      ?? l.agent         ?? "Unassigned";
  const getProduct = (l) => l.product?.name              ?? l.product       ?? "—";
  const getStatus = (l) => l.status ?? "—";
  const getDays   = (l) => {
    if (!l.created_at) return "—";
    const diff = Math.floor((Date.now() - new Date(l.created_at)) / 86400000);
    return `${diff}d`;
  };

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ── Guidelines Banner ── */}
      <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-indigo-900 mb-0.5">Reallocation Guidelines</p>
          <p className="text-sm text-indigo-700">
            Reallocate leads when agent performance is low, agent is unavailable, or workload
            balancing is needed. A reason is required for audit trail.
          </p>
        </div>
      </div>

      {/* ── Lead Table (hidden when pre-seeded) ── */}
      {!initialLead && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Allocated Leads</p>
            <button
              onClick={loadLeads}
              disabled={loadingLeads}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loadingLeads ? (
            <div className="flex items-center justify-center py-12 text-gray-400 gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No allocated leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["ID", "Name", "Agent", "Product", "Status", "Age", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{lead.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{getName(lead)}</td>
                      <td className="px-4 py-3 text-gray-600">{getAgent(lead)}</td>
                      <td className="px-4 py-3 text-gray-600">{getProduct(lead)}</td>
                      <td className="px-4 py-3"><StatusBadge value={getStatus(lead)} /></td>
                      <td className="px-4 py-3 text-gray-500">{getDays(lead)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setNewAgent("");
                            setReason("");
                          }}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium transition"
                        >
                          Reallocate
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Reallocation Form ── */}
      {selectedLead && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-base font-semibold text-gray-900 mb-5">
            Reallocate Lead <span className="font-mono text-indigo-600">#{selectedLead.id}</span>
          </p>

          <div className="space-y-4">
            {/* Current assignment */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Current Assignment
              </label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-100">
                <span className="font-medium">{getName(selectedLead)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                <span>{getAgent(selectedLead)}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{getProduct(selectedLead)}</span>
              </div>
            </div>

            {/* New agent */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                New Agent <span className="text-red-400">*</span>
              </label>
              <select
                value={newAgent}
                onChange={(e) => setNewAgent(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Select new agent…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Reason for Reallocation <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Provide a clear reason (required for audit trail)…"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleReallocate}
                disabled={!newAgent || !reason.trim() || submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm Reallocation
              </button>
              <button
                onClick={() => {
                  setSelectedLead(null);
                  setNewAgent("");
                  setReason("");
                  if (onBack) onBack();
                }}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReallocateData;
