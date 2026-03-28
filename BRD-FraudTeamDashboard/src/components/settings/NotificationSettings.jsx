import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settingsApi";

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    fraud_alert_notifications: false,
    aml_screening_alerts: false,
    case_status_updates: false,
  });

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await settingsApi.getNotifications();
        setPrefs({
          fraud_alert_notifications: !!data.fraud_alert_notifications,
          aml_screening_alerts: !!data.aml_screening_alerts,
          case_status_updates: !!data.case_status_updates,
        });
      } catch {
        toast.error("Failed to load notification settings");
      }
    };

    loadNotifications();
  }, []);

  const toggleAndSave = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await settingsApi.updateNotifications(next);
    } catch {
      setPrefs(prefs);
      toast.error("Failed to update notification settings");
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6">
      <h2 className="text-base sm:text-lg font-semibold">Notification Preferences</h2>

      <div className="space-y-4 text-sm">
        <label className="flex justify-between items-center gap-4 cursor-pointer">
          <span className="text-gray-700">Fraud Alert Notifications</span>
          <input
            type="checkbox"
            className="toggle-switch flex-shrink-0"
            checked={prefs.fraud_alert_notifications}
            onChange={() => toggleAndSave("fraud_alert_notifications")}
          />
        </label>

        <label className="flex justify-between items-center gap-4 cursor-pointer">
          <span className="text-gray-700">AML Screening Alerts</span>
          <input
            type="checkbox"
            className="toggle-switch flex-shrink-0"
            checked={prefs.aml_screening_alerts}
            onChange={() => toggleAndSave("aml_screening_alerts")}
          />
        </label>

        <label className="flex justify-between items-center gap-4 cursor-pointer">
          <span className="text-gray-700">Case Status Updates</span>
          <input
            type="checkbox"
            className="toggle-switch flex-shrink-0"
            checked={prefs.case_status_updates}
            onChange={() => toggleAndSave("case_status_updates")}
          />
        </label>
      </div>
    </div>
  );
}