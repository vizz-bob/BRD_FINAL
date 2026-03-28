import { useEffect, useState } from 'react'
// import { reportsApi } from '../services/api.js'

export default function Reports() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ report_type: 'LOAN_ACTIVITY', start_date: '', end_date: '', tenant_id: '' })
  const [job, setJob] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let t
    if (job) {
      t = setInterval(async () => {
        const s = await reportsApi.status(job.job_id)
        if (s.ok) {
          setStatus(s.status)
          if (s.status === 'COMPLETED') clearInterval(t)
        }
      }, 1000)
    }
    return () => t && clearInterval(t)
  }, [job])

  const reportCards = [
    { title: 'Loan Activity Report', desc: 'All loan records with key fields and activity dates' },
    { title: 'Tenant Summary Report', desc: 'Active and inactive tenants with core metrics' },
    { title: 'User Activity Report', desc: 'User actions and login activity in a period' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Generate and download data exports.</p>
        </div>
        <button
          className="h-9 px-3 sm:px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-medium transition whitespace-nowrap"
          onClick={() => setOpen(true)}
        >
          Download Report (CSV)
        </button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {reportCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            <div className="font-medium text-sm sm:text-base text-slate-900">{card.title}</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 leading-snug">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/25 grid place-items-center z-40 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl border border-gray-200 shadow-xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Configure Report</h2>

            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="text-sm text-gray-700 mb-1">Report Type</div>
                <select
                  value={form.report_type}
                  onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                  className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                >
                  <option value="LOAN_ACTIVITY">Loan Activity</option>
                  <option value="TENANT_SUMMARY">Tenant Summary</option>
                  <option value="USER_ACTIVITY">User Activity</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <div className="text-sm text-gray-700 mb-1">Start Date</div>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none" />
                </label>
                <label className="block">
                  <div className="text-sm text-gray-700 mb-1">End Date</div>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none" />
                </label>
              </div>

              <label className="block">
                <div className="text-sm text-gray-700 mb-1">Tenant ID (optional)</div>
                <input value={form.tenant_id} onChange={(e) => setForm({ ...form, tenant_id: e.target.value })} className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none" />
              </label>

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition" onClick={() => { setOpen(false); setStatus(null); setJob(null) }}>Cancel</button>
                <button
                  className="h-9 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition"
                  onClick={async () => {
                    const r = await reportsApi.generate(form)
                    if (r.ok) { setJob(r); setStatus(r.status) }
                  }}
                >Generate</button>
              </div>

              {job && (
                <div className="mt-2 text-sm text-gray-700 bg-slate-50 rounded-lg p-3 flex flex-wrap items-center gap-2">
                  <span>Job: <strong>{job.job_id}</strong></span>
                  <span>•</span>
                  <span>Status: <strong>{status}</strong></span>
                  <span>•</span>
                  <span>ETA: {job.estimated_completion_time}</span>
                  {status === 'COMPLETED' && (
                    <button
                      className="ml-auto h-8 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition"
                      onClick={async () => {
                        const d = await reportsApi.download(job.job_id)
                        if (d.ok) {
                          const a = document.createElement('a')
                          a.href = d.url
                          a.download = `${form.report_type.toLowerCase()}.csv`
                          document.body.appendChild(a)
                          a.click()
                          a.remove()
                        }
                      }}
                    >Download</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}