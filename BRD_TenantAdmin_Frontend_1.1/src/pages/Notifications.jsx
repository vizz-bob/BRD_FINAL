import { useEffect, useState } from 'react'
// import { notificationsApi } from '../services/api'

export default function Notifications() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    setError(null)
    const res = await notificationsApi.list()
    if (res.ok) setItems(res.data)
    else setError('Unable to load notifications')
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Stay updated on all activity.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={load}
            className="h-9 px-3 sm:px-4 rounded-lg border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition whitespace-nowrap"
          >
            Refresh
          </button>
          <button
            onClick={async () => {
              const r = await notificationsApi.markAllRead()
              if (r.ok) load()
            }}
            className="h-9 px-3 sm:px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-medium transition whitespace-nowrap"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-2 sm:space-y-3">
        {items.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-4xl mb-3 opacity-30">🔔</div>
            <p className="text-sm font-semibold text-slate-500">No notifications</p>
            <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
          </div>
        )}

        {items.map((n) => (
          <div
            key={n.notification_id}
            className={`bg-white rounded-xl shadow-sm p-4 sm:p-5 border transition-all ${
              n.read ? 'border-gray-100' : 'border-primary-200 shadow-primary-50'
            }`}
          >
            {/* Title + Time */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-0.5" />
                )}
                <span className="font-semibold text-sm sm:text-base text-slate-900 truncate">{n.title}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap shrink-0">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>

            {/* Message */}
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed pl-4">
              {n.message}
            </p>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                onClick={async () => {
                  const r = await notificationsApi.delete(n.notification_id)
                  if (r.ok) load()
                }}
                className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
              >
                Delete
              </button>
              {n.read ? (
                <button
                  onClick={async () => {
                    const r = await notificationsApi.unread(n.notification_id)
                    if (r.ok) load()
                  }}
                  className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Mark Unread
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const r = await notificationsApi.read(n.notification_id)
                    if (r.ok) load()
                  }}
                  className="h-8 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium transition"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}