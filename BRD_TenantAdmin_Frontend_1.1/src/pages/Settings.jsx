import { useEffect, useState } from "react";
import { systemSettingsService } from "../services/settingService";

/* -----------------------------
   Field Component
----------------------------- */
const Field = ({ s, onChange }) => {
  const masked = s.is_encrypted && !s.reveal;

  const label = s.key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (s.data_type === "BOOLEAN") {
    return (
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          className="w-4 h-4 accent-primary-600 shrink-0"
          checked={s.value === "true"}
          onChange={(e) =>
            onChange(s.key, e.target.checked ? "true" : "false")
          }
        />
        <span className="text-gray-700">{label}</span>
      </label>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={masked ? "••••••••" : s.value}
          onChange={(e) => !masked && onChange(s.key, e.target.value)}
          className="flex-1 min-w-0 h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        {s.is_encrypted && (
          <button
            type="button"
            className="h-10 px-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition whitespace-nowrap shrink-0"
            onClick={() => onChange(s.key, s.value, { reveal: !s.reveal })}
          >
            {s.reveal ? "Hide" : "Reveal"}
          </button>
        )}
      </div>
    </div>
  );
};

/* -----------------------------
   Modal Component
----------------------------- */
const SettingsModal = ({
  isOpen,
  onClose,
  title,
  description,
  settings,
  onChange,
  onSave,
  saving,
}) => {
  if (!isOpen) return null;

  return (
    // p-4 outer wrapper ensures modal never touches screen edges on mobile
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10 flex flex-col">
        {/* Scrollable body */}
        <div className="p-5 md:p-6 overflow-auto flex-1">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-xl leading-none shrink-0 transition"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-5">{description}</p>

          <div className="space-y-4">
            {settings.map((s) => (
              <Field key={s.key} s={s} onChange={onChange} />
            ))}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="p-4 border-t bg-gray-50 flex flex-wrap justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="h-9 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium disabled:opacity-60 hover:bg-primary-700 transition whitespace-nowrap"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Card icons (simple emoji fallbacks — swap with Heroicons if preferred)
----------------------------- */
const CARD_ICONS = {
  loan: "💰",
  system: "🛡️",
  notify: "🔔",
};

/* -----------------------------
   Main Component
----------------------------- */
export default function Settings() {
  const [activeModal, setActiveModal] = useState(null);
  const [loan, setLoan] = useState([]);
  const [system, setSystem] = useState([]);
  const [notify, setNotify] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* ---------------- Load ---------------- */
  const loadSettings = async () => {
    setLoading(true);
    try {
      const [loanRes, systemRes, notifyRes] = await Promise.all([
        systemSettingsService.getLoanConfiguration(),
        systemSettingsService.getSystemSecurityConfig(),
        systemSettingsService.getNotificationEmailConfig(),
      ]);

      setLoan([
        { key: "default_interest_rate", value: String(loanRes.data.default_interest_rate), data_type: "NUMBER" },
        { key: "max_loan_amount", value: String(loanRes.data.max_loan_amount), data_type: "NUMBER" },
        { key: "min_tenure_months", value: String(loanRes.data.min_tenure_months), data_type: "NUMBER" },
        { key: "currency_symbol", value: loanRes.data.currency_symbol, data_type: "STRING" },
      ]);

      setSystem([
        { key: "password_min_length", value: String(systemRes.data.password_min_length), data_type: "NUMBER" },
        { key: "session_timeout_minutes", value: String(systemRes.data.session_timeout_minutes), data_type: "NUMBER" },
        { key: "allow_anonymous_signup", value: String(systemRes.data.allow_anonymous_signup), data_type: "BOOLEAN" },
      ]);

      setNotify([
        { key: "notification_email", value: notifyRes.data.notification_email, data_type: "STRING" },
        {
          key: "webhook_secret_key",
          value: notifyRes.data.webhook_secret_key,
          data_type: "STRING",
          is_encrypted: true,
          reveal: false,
        },
      ]);
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const mutate = (setter, group) => (key, value, extra = {}) =>
    setter(group.map((s) => (s.key === key ? { ...s, value, ...extra } : s)));

  /* ---------------- Save ---------------- */
  const saveSettings = async () => {
    setSaving(true);
    try {
      if (activeModal === "loan") {
        await systemSettingsService.updateLoanConfiguration({
          default_interest_rate: Number(loan[0].value),
          max_loan_amount: Number(loan[1].value),
          min_tenure_months: Number(loan[2].value),
          currency_symbol: loan[3].value,
        });
      }
      if (activeModal === "system") {
        await systemSettingsService.updateSystemSecurityConfig({
          password_min_length: Number(system[0].value),
          session_timeout_minutes: Number(system[1].value),
          allow_anonymous_signup: system[2].value === "true",
        });
      }
      if (activeModal === "notify") {
        await systemSettingsService.updateNotificationEmailConfig({
          notification_email: notify[0].value,
          webhook_secret_key: notify[1].value,
        });
      }

      setSuccess("Settings saved successfully");
      setActiveModal(null);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const modalConfig = {
    loan: {
      title: "Loan Configuration",
      description: "Set default loan parameters and limits",
      settings: loan,
      onChange: mutate(setLoan, loan),
    },
    system: {
      title: "System & Security",
      description: "Manage system-wide security policies",
      settings: system,
      onChange: mutate(setSystem, system),
    },
    notify: {
      title: "Notifications & Email",
      description: "Configure email and webhook settings",
      settings: notify,
      onChange: mutate(setNotify, notify),
    },
  };

  const cards = [
    { key: "loan",   title: "Loan Configuration",    desc: "Set default loan parameters and limits" },
    { key: "system", title: "System & Security",      desc: "Manage security settings and policies" },
    { key: "notify", title: "Notifications & Email",  desc: "Configure email and webhook settings" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">System Configuration</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-sm">
          {success}
        </div>
      )}
      {loading && (
        <div className="text-sm text-gray-500 animate-pulse">Loading settings…</div>
      )}

      {/* Cards — 1 col mobile → 3 col md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveModal(item.key)}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-primary-300 transition group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl shrink-0">{CARD_ICONS[item.key]}</span>
              <div className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary-700 transition">
                {item.title}
              </div>
            </div>
            <div className="text-sm text-gray-500">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeModal && (
        <SettingsModal
          isOpen
          onClose={() => setActiveModal(null)}
          {...modalConfig[activeModal]}
          onSave={saveSettings}
          saving={saving}
        />
      )}
    </div>
  );
}