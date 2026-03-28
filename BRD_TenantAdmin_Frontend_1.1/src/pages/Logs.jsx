import { useEffect, useMemo, useState } from 'react'
// import { logsApi } from '../services/api'

function formatRelative(ts) {
  const d = new Date(ts)
  return d.toLocaleString()
}

export default function Logs() {
  const [items, setItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ summary: '', actor_user_role: '', status: 'Approved' })

  const statusFromEvent = (et) =>
    et === 'LOAN_APPROVED' ? 'Approved' : et === 'LOAN_REJECTED' ? 'Rejected' : 'Other'

  const load = async () => {
    setError(null)
    const res = await logsApi.list({ search })
    if (res.ok) {
      setAllItems(res.data)
      const filtered = res.data.filter(l =>
        statusFilter === 'All' ? true : statusFromEvent(l.event_type) === statusFilter
      )
      setItems(filtered)
    } else {
      setError('Unable to load logs')
    }
  }

  useEffect(() => {
    const filtered = allItems.filter(l =>
      statusFilter === 'All' ? true : statusFromEvent(l.event_type) === statusFilter
    )
    setItems(filtered)
  }, [statusFilter, allItems])

  useEffect(() => { load() }, [])

  const counts = useMemo(() => {
    const c = { All: allItems.length, Approved: 0, Rejected: 0 }
    allItems.forEach(l => {
      const s = statusFromEvent(l.event_type)
      if (c[s] != null) c[s]++
    })
    return c
  }, [allItems])

  const statusBadgeClass = (status) => {
    if (status === 'Approved') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    if (status === 'Rejected') return 'bg-rose-50 text-rose-700 border border-rose-200'
    return 'bg-slate-100 text-slate-600 border border-slate-200'
  }

  return (
    <div className="p-3 sm:p-5 lg:p-8 space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Review and track loan activity events.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 sm:p-4 text-sm font-medium flex items-center gap-2">
          <span className="text-base">⚠️</span>
          {error}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-8 sm:h-9 px-3 sm:px-4 rounded-full border text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'border-primary-300 bg-primary-50 text-primary-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s}
              {s !== 'All' && (
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  statusFilter === s ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + Actions — pushed right on larger screens */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <div className="flex flex-1 sm:flex-none min-w-0 gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') load() }}
              placeholder="Search summary or event…"
              className="h-9 flex-1 sm:w-56 md:w-72 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition min-w-0"
            />
            <button
              onClick={load}
              className="h-9 px-3 sm:px-4 rounded-lg border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => { setCreating(true); setForm({ summary: '', actor_user_role: '', status: 'Approved' }) }}
            className="h-9 px-3 sm:px-4 rounded-lg bg-primary-600 text-white text-xs sm:text-sm font-semibold hover:bg-primary-700 transition whitespace-nowrap shrink-0"
          >
            + New Log
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "520px" }}>
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Summary</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[11px] sm:text-xs uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[11px] sm:text-xs uppercase tracking-wider hidden md:table-cell">Time</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 sm:py-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <span className="text-4xl">📋</span>
                      <p className="text-sm font-semibold text-gray-600">No logs found</p>
                      <p className="text-xs text-gray-400">Try changing filters or create a new log.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(l => (
                  <tr key={l.log_id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800 max-w-[200px] sm:max-w-none">
                      <div className="truncate text-xs sm:text-sm">{l.summary}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                      {l.actor_user_role || 'Admin'}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {new Date(l.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wide ${statusBadgeClass(statusFromEvent(l.event_type))}`}>
                        {statusFromEvent(l.event_type)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="text-base sm:text-lg font-bold text-gray-900">Add Log</div>
              <button
                onClick={() => setCreating(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <label className="block">
                <div className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Summary</div>
                <input
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition"
                  placeholder="Describe the log event…"
                />
              </label>
              <label className="block">
                <div className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Role</div>
                <input
                  value={form.actor_user_role}
                  onChange={(e) => setForm({ ...form, actor_user_role: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition"
                  placeholder="e.g. Analyst"
                />
              </label>
              <label className="block">
                <div className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status</div>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition bg-white"
                >
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                className="h-9 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                onClick={() => setCreating(false)}
              >
                Cancel
              </button>
              <button
                className="h-9 px-5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition"
                onClick={async () => {
                  const event_type = form.status === 'Approved' ? 'LOAN_APPROVED' : 'LOAN_REJECTED'
                  const r = await logsApi.create({
                    summary: form.summary,
                    actor_user_role: form.actor_user_role,
                    event_type,
                  })
                  if (r.ok) { setCreating(false); load() }
                }}
              >
                Create Log
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}