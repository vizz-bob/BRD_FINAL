import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiSave,
  FiClock,
  FiBell,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SetOverdueAlerts = () => {
  const navigate = useNavigate();

  // PURE FRONTEND STATE (NO SERVICES)
  const [settings, setSettings] = useState({
    enableAlerts: true,

    alertTiming: {
      firstReminderAfter: 3, // Days after due date
      secondReminderAfter: 7,
      finalNoticeAfter: 15,
    },

    escalation: {
      enableEscalation: false,
      escalateTo: "",
    },

    channels: {
      sms: true,
      email: true,
      push: true,
      whatsapp: false,
    },
  });

  const save = () => {
    alert("Overdue Alert Settings Saved (Frontend Only). Backend can be added later.");
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
            <FiAlertTriangle /> Set Overdue Alerts
          </h1>
          <p className="text-gray-500 text-sm">
            Configure reminders, escalation rules, and notification channels.
          </p>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">

        {/* Enable/Disable */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <Toggle
            label="Enable Overdue Alerts"
            checked={settings.enableAlerts}
            onChange={() =>
              setSettings({ ...settings, enableAlerts: !settings.enableAlerts })
            }
          />
        </section>

        {/* Reminder Timing */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiClock /> Reminder Timing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="First Reminder (Days after due date)"
              value={settings.alertTiming.firstReminderAfter}
              type="number"
              onChange={(v) =>
                setSettings({
                  ...settings,
                  alertTiming: {
                    ...settings.alertTiming,
                    firstReminderAfter: Number(v),
                  },
                })
              }
            />

            <Input
              label="Second Reminder (Days after due date)"
              type="number"
              value={settings.alertTiming.secondReminderAfter}
              onChange={(v) =>
                setSettings({
                  ...settings,
                  alertTiming: {
                    ...settings.alertTiming,
                    secondReminderAfter: Number(v),
                  },
                })
              }
            />

            <Input
              label="Final Notice (Days after due date)"
              type="number"
              value={settings.alertTiming.finalNoticeAfter}
              onChange={(v) =>
                setSettings({
                  ...settings,
                  alertTiming: {
                    ...settings.alertTiming,
                    finalNoticeAfter: Number(v),
                  },
                })
              }
            />
          </div>
        </section>

        {/* Escalation Settings */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiAlertTriangle /> Escalation Settings
          </h2>

          <Toggle
            label="Enable Escalation"
            checked={settings.escalation.enableEscalation}
            onChange={() =>
              setSettings({
                ...settings,
                escalation: {
                  ...settings.escalation,
                  enableEscalation: !settings.escalation.enableEscalation,
                },
              })
            }
          />

          {settings.escalation.enableEscalation && (
            <div className="mt-4">
              <label className="text-sm text-gray-700">Escalate To</label>
              <select
                value={settings.escalation.escalateTo}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    escalation: {
                      ...settings.escalation,
                      escalateTo: e.target.value,
                    },
                  })
                }
                className="p-3 border rounded-xl w-full mt-1 bg-gray-50"
              >
                <option value="">Select…</option>
                <option value="manager">Branch Manager</option>
                <option value="collection_team">Collections Team</option>
                <option value="risk_head">Risk Head</option>
              </select>
            </div>
          )}
        </section>

        {/* Notification Channels */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBell /> Notification Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="SMS"
              checked={settings.channels.sms}
              onChange={() =>
                setSettings({
                  ...settings,
                  channels: {
                    ...settings.channels,
                    sms: !settings.channels.sms,
                  },
                })
              }
            />
            <Toggle
              label="Email"
              checked={settings.channels.email}
              onChange={() =>
                setSettings({
                  ...settings,
                  channels: {
                    ...settings.channels,
                    email: !settings.channels.email,
                  },
                })
              }
            />
            <Toggle
              label="Push Notification"
              checked={settings.channels.push}
              onChange={() =>
                setSettings({
                  ...settings,
                  channels: {
                    ...settings.channels,
                    push: !settings.channels.push,
                  },
                })
              }
            />
            <Toggle
              label="WhatsApp"
              checked={settings.channels.whatsapp}
              onChange={() =>
                setSettings({
                  ...settings,
                  channels: {
                    ...settings.channels,
                    whatsapp: !settings.channels.whatsapp,
                  },
                })
              }
            />
          </div>
        </section>

        {/* SAVE BUTTON */}
        <button
          onClick={save}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700"
        >
          <FiSave /> Save Overdue Alert Settings
        </button>
      </div>
    </MainLayout>
  );
};

/* ------------------------------
   REUSABLE COMPONENTS
------------------------------ */

const Input = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 border rounded-xl bg-gray-50 mt-1"
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="text-sm">{label}</span>
  </label>
);

export default SetOverdueAlerts;
