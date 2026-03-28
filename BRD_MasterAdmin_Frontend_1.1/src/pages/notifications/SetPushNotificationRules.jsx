import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiBell,
  FiSave,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SetPushNotificationRules = () => {
  const navigate = useNavigate();

  // PURE FRONTEND STATE (NO LOCALSTORAGE, NO SERVICE)
  const [rules, setRules] = useState({
    enabled: true,
    provider: "fcm",
    priority: "high",
    sound: "default",

    triggers: {
      loanCreated: true,
      dueReminder: true,
      paymentReceived: true,
      loanApproved: true,
      loanRejected: false,
    },

    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00",
    },
  });

  const save = () => {
    alert("Push Notification Rules Saved (Frontend Only)\nBackend will be added later.");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-50 border rounded-xl"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiBell /> Set Push Notification Rules
          </h1>
          <p className="text-gray-500 text-sm">
            Configure push rules, triggers, quiet hours & priorities.
          </p>
        </div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="space-y-8 max-w-4xl">

        {/* ENABLE/DISABLE */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiShield /> Push Notification Settings
          </h2>

          <Toggle
            label="Enable Push Notifications"
            checked={rules.enabled}
            onChange={() =>
              setRules({ ...rules, enabled: !rules.enabled })
            }
          />
        </section>

        {/* PROVIDER */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Default Provider</h2>

          <select
            className="p-3 rounded-xl border w-full bg-gray-50"
            value={rules.provider}
            onChange={(e) =>
              setRules({ ...rules, provider: e.target.value })
            }
          >
            <option value="fcm">Firebase Cloud Messaging</option>
            <option value="onesignal">OneSignal</option>
            <option value="webpush">Web Push</option>
          </select>
        </section>

        {/* TRIGGER EVENTS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Push Trigger Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(rules.triggers).map((key) => (
              <Toggle
                key={key}
                label={formatLabel(key)}
                checked={rules.triggers[key]}
                onChange={() =>
                  setRules({
                    ...rules,
                    triggers: {
                      ...rules.triggers,
                      [key]: !rules.triggers[key],
                    },
                  })
                }
              />
            ))}
          </div>
        </section>

        {/* PRIORITY */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Default Priority</h2>

          <select
            value={rules.priority}
            onChange={(e) =>
              setRules({ ...rules, priority: e.target.value })
            }
            className="p-3 border rounded-xl bg-gray-50 w-full"
          >
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </section>

        {/* SOUND */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Notification Sound</h2>

          <select
            className="p-3 border rounded-xl bg-gray-50 w-full"
            value={rules.sound}
            onChange={(e) =>
              setRules({ ...rules, sound: e.target.value })
            }
          >
            <option value="default">Default</option>
            <option value="chime">Chime</option>
            <option value="alert">Alert</option>
            <option value="none">Silent</option>
          </select>
        </section>

        {/* QUIET HOURS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiClock /> Quiet Hours (Do Not Disturb)
          </h2>

          <Toggle
            label="Enable Quiet Hours"
            checked={rules.quietHours.enabled}
            onChange={() =>
              setRules({
                ...rules,
                quietHours: {
                  ...rules.quietHours,
                  enabled: !rules.quietHours.enabled,
                },
              })
            }
          />

          {rules.quietHours.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-gray-600">Start Time</label>
                <input
                  type="time"
                  value={rules.quietHours.start}
                  onChange={(e) =>
                    setRules({
                      ...rules,
                      quietHours: {
                        ...rules.quietHours,
                        start: e.target.value,
                      },
                    })
                  }
                  className="p-3 border rounded-xl w-full bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">End Time</label>
                <input
                  type="time"
                  value={rules.quietHours.end}
                  onChange={(e) =>
                    setRules({
                      ...rules,
                      quietHours: {
                        ...rules.quietHours,
                        end: e.target.value,
                      },
                    })
                  }
                  className="p-3 border rounded-xl w-full bg-gray-50"
                />
              </div>
            </div>
          )}
        </section>

        {/* SAVE BUTTON */}
        <button
          onClick={save}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          <FiSave /> Save Push Notification Rules
        </button>
      </div>
    </MainLayout>
  );
};

/* REUSABLE TOGGLE COMPONENT */
const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 p-3 bg-gray-50 border rounded-xl cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

/* Converts camelCase to Nice Text */
const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

export default SetPushNotificationRules;
