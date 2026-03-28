import { useState, useEffect, useCallback } from "react";
import { Search, User, Star, RefreshCw, Phone, Mail, Calendar } from "lucide-react";
import CampaignLeadAPI from "../../../services/campaignLeads.service";

const AllData = () => {
  const [leads,        setLeads]        = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading,      setLoading]      = useState(true);

  /* Filters */
  const [search,     setSearch]     = useState("");
  const [statusF,    setStatusF]    = useState("");
  const [sourceF,    setSourceF]    = useState("");
  const [convF,      setConvF]      = useState("");

  /* Fetch all leads */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CampaignLeadAPI.list({ page_size: 1000 });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setLeads(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  /* Apply filters whenever any filter changes */
  useEffect(() => {
    let result = [...leads];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.contact_name?.toLowerCase().includes(q) ||
        l.contact_phone?.includes(q) ||
        l.contact_email?.toLowerCase().includes(q) ||
        String(l.id).includes(q)
      );
    }
    if (statusF)  result = result.filter(l => l.lead_status        === statusF);
    if (sourceF)  result = result.filter(l => l.lead_source        === sourceF);
    if (convF)    result = result.filter(l => l.conversion_status  === convF);
    setFiltered(result);
    setSelectedLead(null);
  }, [search, statusF, sourceF, convF, leads]);

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-280px)]">

      {/* ── Left: Filters ── */}
      <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-4 space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button onClick={fetchLeads} className="text-indigo-600 hover:text-indigo-700">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:border-indigo-500"
              placeholder="Name, phone, email, ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Lead Status */}
        <FilterSelect
          label="Lead Status"
          value={statusF}
          onChange={setStatusF}
          options={[
            { value: "RAW",       label: "Raw"       },
            { value: "QUALIFIED", label: "Qualified" },
            { value: "HOT",       label: "Hot"       },
          ]}
        />

        {/* Lead Source */}
        <FilterSelect
          label="Lead Source"
          value={sourceF}
          onChange={setSourceF}
          options={[
            { value: "EMAIL",  label: "Email"  },
            { value: "SMS",    label: "SMS"    },
            { value: "SOCIAL", label: "Social" },
            { value: "CALL",   label: "Call"   },
          ]}
        />

        {/* Conversion Status */}
        <FilterSelect
          label="Conversion Status"
          value={convF}
          onChange={setConvF}
          options={[
            { value: "NOT_CONVERTED", label: "Not Converted" },
            { value: "CONVERTED",     label: "Converted"     },
          ]}
        />

        {/* Clear filters */}
        {(search || statusF || sourceF || convF) && (
          <button
            onClick={() => { setSearch(""); setStatusF(""); setSourceF(""); setConvF(""); }}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Middle: Lead list ── */}
      <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50 text-sm font-medium text-gray-700 shrink-0">
          {loading ? "Loading…" : `${filtered.length} leads found`}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading leads…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No leads match your filters.</div>
          ) : (
            filtered.map(lead => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedLead?.id === lead.id
                    ? "bg-indigo-50 border-l-4 border-indigo-600"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{lead.contact_name}</p>
                    <p className="text-xs text-gray-500">{lead.lead_source} • {lead.product}</p>
                  </div>
                  <StatusBadge status={lead.lead_status} />
                </div>
                <p className="text-xs text-gray-400 mt-1">#{lead.id}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right: Detail panel ── */}
      <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        {!selectedLead ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
            <User size={48} className="text-gray-300" />
            <p className="font-medium">Select a lead to view details</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.contact_name}</h2>
                <p className="text-sm text-gray-500">#{selectedLead.id} • {selectedLead.lead_source}</p>
              </div>
              <StatusBadge status={selectedLead.lead_status} />
            </div>

            {/* Product & Conversion */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Product" value={selectedLead.product || "—"} />
              <InfoCard
                label="Conversion"
                value={selectedLead.conversion_status === "CONVERTED" ? "✓ Converted" : "Not Converted"}
                valueClass={selectedLead.conversion_status === "CONVERTED" ? "text-emerald-600 font-bold" : "text-gray-700"}
              />
            </div>

            {/* Contact */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Contact Info</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                {selectedLead.contact_phone || "—"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                {selectedLead.contact_email || "—"}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Campaign Start" value={selectedLead.campaign_start || "—"} />
              <InfoCard label="Campaign End"   value={selectedLead.campaign_end   || "Ongoing"} />
              {selectedLead.follow_up_date && (
                <div className="col-span-2">
                  <InfoCard label="Follow-up Date" value={new Date(selectedLead.follow_up_date).toLocaleString()} />
                </div>
              )}
            </div>

            {/* Consent & Tags */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                label="Consent"
                value={selectedLead.consent_obtained ? "✓ Obtained" : "✗ Not Obtained"}
                valueClass={selectedLead.consent_obtained ? "text-emerald-600" : "text-red-500"}
              />
              {selectedLead.tags && (
                <InfoCard label="Tags" value={selectedLead.tags} />
              )}
            </div>

            {/* Notes */}
            {selectedLead.notes && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedLead.notes}</p>
              </div>
            )}

            {/* Assigned Users */}
            {selectedLead.assigned_users?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Assigned Users</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.assigned_users.map(uid => (
                    <span key={uid} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                      User #{uid}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Helpers ─── */
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">All</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function InfoCard({ label, value, valueClass = "text-gray-800" }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{label}</p>
      <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    RAW:       "bg-gray-100 text-gray-700",
    QUALIFIED: "bg-indigo-100 text-indigo-700",
    HOT:       "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default AllData;
