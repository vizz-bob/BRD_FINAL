import { useState, useRef } from 'react'

const ProfileModal = ({ isOpen, onClose, onLogout }) => {
  const userEmail = localStorage.getItem('userEmail') || 'admin@los.com'
  const defaultName = userEmail.split('@')[0] || 'Admin'
  const [view, setView] = useState('menu')
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('displayName') || defaultName)
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem('profileImage') || '')
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('preferences')
      return saved ? JSON.parse(saved) : { compactLayout: false, showTooltips: true, darkMode: false }
    } catch {
      return { compactLayout: false, showTooltips: true, darkMode: false }
    }
  })
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const saveProfile = () => {
    localStorage.setItem('displayName', displayName)
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage)
    } else {
      localStorage.removeItem('profileImage')
    }
    onClose()
    alert('Profile updated')
  }

  const savePreferences = () => {
    localStorage.setItem('preferences', JSON.stringify(preferences))
    onClose()
    alert('Preferences saved')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-brand-border bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-brand-border px-6 py-4">
          <div className="flex items-center gap-3">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-center text-lg font-semibold leading-12 text-indigo-700">
                {(displayName || defaultName)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-brand-text">{displayName}</p>
              <p className="text-xs text-brand-text/60">{userEmail}</p>
            </div>
          </div>
        </div>

        {view === 'menu' ? (
          <div className="divide-y divide-brand-border">
            <button onClick={() => setView('profile')} className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm text-brand-text transition hover:bg-slate-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3a3 3 0 000 6 3 3 0 000-6z" /><path d="M12 14v7" /><path d="M5 14h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z" /></svg>
              Profile Settings
            </button>
            <button onClick={() => setView('preferences')} className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm text-brand-text transition hover:bg-slate-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 000-6l1.6-2.8-2.6-2.6L15.6 4a1.7 1.7 0 00-6 0L6.8 3.6 4.2 6.2 5.8 9a1.7 1.7 0 000 6l-1.6 2.8 2.6 2.6L8.4 20a1.7 1.7 0 006 0l2.8.4 2.6-2.6z" /></svg>
              Preferences
            </button>
            <button onClick={() => setView('help')} className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm text-brand-text transition hover:bg-slate-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
              Help & Support
            </button>
            <button onClick={() => { onLogout(); onClose() }} className="flex w-full items-center justify-center gap-2 px-6 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
              Logout
            </button>
          </div>
        ) : view === 'profile' ? (
          <div className="space-y-4 px-6 py-4">
            <p className="text-sm font-semibold text-brand-text">Edit Profile</p>
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-text">Profile Image</label>
              <div className="flex flex-wrap items-center gap-3">
                {profileImage ? (
                  <img src={profileImage} alt="Preview" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-200" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const result = typeof reader.result === 'string' ? reader.result : ''
                      setProfileImage(result)
                    }
                    reader.readAsDataURL(file)
                  }}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="rounded-lg border border-brand-border px-3 py-1 text-xs font-semibold text-brand-text"
                >
                  Choose image
                </button>
                {profileImage && (
                  <button
                    type="button"
                    onClick={() => setProfileImage('')}
                    className="shrink-0 rounded-lg border border-brand-border px-3 py-1 text-xs font-semibold text-brand-text"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-text">Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text focus:border-brand-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-text">Email</label>
              <input type="email" value={userEmail} readOnly className="w-full rounded-lg border border-brand-border bg-slate-50 px-3 py-2 text-sm text-brand-text" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setView('menu')} className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text">Cancel</button>
              <button onClick={saveProfile} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </div>
        ) : view === 'preferences' ? (
          <div className="space-y-4 px-6 py-4">
            <p className="text-sm font-semibold text-brand-text">Preferences</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-text">Compact Layout</p>
                <p className="text-xs text-slate-500">Reduce spacing in dashboard</p>
              </div>
              <input type="checkbox" checked={preferences.compactLayout} onChange={(e) => setPreferences({ ...preferences, compactLayout: e.target.checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-text">Show Tooltips</p>
                <p className="text-xs text-slate-500">Enable chart tooltips</p>
              </div>
              <input type="checkbox" checked={preferences.showTooltips} onChange={(e) => setPreferences({ ...preferences, showTooltips: e.target.checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-text">Dark Mode</p>
                <p className="text-xs text-slate-500">Experimental theme</p>
              </div>
              <input type="checkbox" checked={preferences.darkMode} onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })} />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setView('menu')} className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text">Cancel</button>
              <button onClick={savePreferences} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-6 py-4">
            <p className="text-sm font-semibold text-brand-text">Help & Support</p>
            <p className="text-xs text-brand-text/70">For assistance, contact support or browse FAQs.</p>
            <div className="flex gap-3">
              <button onClick={() => window.open(`mailto:support@losplatform.example?subject=Support Request&body=From: ${userEmail}`)} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white">Contact Support</button>
              <button onClick={() => setView('menu')} className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileModal
