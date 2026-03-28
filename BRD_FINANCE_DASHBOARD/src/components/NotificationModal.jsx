import { useState, useEffect } from 'react'

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Fetch notifications
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setNotifications([
          {
            id: 1,
            title: 'Payment Received',
            message: 'Payment of ₹25,000 received from Rahul Mehta',
            time: '2 minutes ago',
            read: false,
            type: 'success',
          },
          {
            id: 2,
            title: 'Overdue Alert',
            message: '5 repayments are overdue and require attention',
            time: '1 hour ago',
            read: false,
            type: 'warning',
          },
          {
            id: 3,
            title: 'New Loan Application',
            message: 'A new loan application has been submitted',
            time: '3 hours ago',
            read: true,
            type: 'info',
          },
          {
            id: 4,
            title: 'Report Generated',
            message: 'Monthly finance report has been generated successfully',
            time: '1 day ago',
            read: true,
            type: 'info',
          },
        ])
        setLoading(false)
      }, 300)
    }
  }, [isOpen])

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-brand-border bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
          <h2 className="text-lg font-semibold text-brand-text">Notifications</h2>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-brand-accent hover:text-indigo-500"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 text-brand-text/60 transition hover:bg-brand-border hover:text-brand-text"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-sm text-brand-text/60">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-brand-text/60">No notifications</div>
          ) : (
            <div className="divide-y divide-brand-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 transition hover:bg-slate-50 ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        !notification.read
                          ? 'bg-brand-accent'
                          : notification.type === 'warning'
                            ? 'bg-amber-400'
                            : notification.type === 'success'
                              ? 'bg-emerald-400'
                              : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-brand-text">{notification.title}</p>
                      <p className="mt-1 text-xs text-brand-text/70">{notification.message}</p>
                      <p className="mt-2 text-xs text-brand-text/50">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-brand-border px-6 py-3 text-center">
            <button className="text-sm font-semibold text-brand-accent hover:text-indigo-500">
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationModal
