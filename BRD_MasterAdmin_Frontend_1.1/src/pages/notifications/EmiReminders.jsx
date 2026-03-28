import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiBell, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const KEY = "emiReminderRules";

const defaultRules = {
  preDue: {
    enabled: true,
    daysBefore: 3,
    channels: {
      sms: true,
      email: true,
      push: false,
      whatsapp: false,
    },
    template: "Your EMI is due in {{days}} days. Please ensure your bank balance.",
  },
  dueDay: {
    enabled: true,
    channels: {
      sms: true,
      email: true,
      push: true,
      whatsapp: false,
    },
    template: "Your EMI is due today. Kindly make the payment to avoid penalties.",
  },
  postDue: {
    enabled: false,
    daysAfter: 2,
    channels: {
      sms: true,
      email: true,
      push: false,
      whatsapp: false,
    },
    template: "Your EMI is overdue. Please pay immediately to avoid penalty.",
  },
  custom: [],
};

const EmiReminders = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState(defaultRules);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) setRules(saved);
  }, []);

  const saveRules = () => {
    localStorage.setItem(KEY, JSON.stringify(rules));
    alert("EMI Reminder Settings Saved!");
  };

  const toggleChannel = (type, channel) => {
    setRules({
      ...rules,
      [type]: {
        ...rules[type],
        channels: {
          ...rules[type].channels,
          [channel]: !rules[type].channels[channel],
        },
      },
    });
  };

  const addCustomReminder = () => {
    const updated = [
      ...rules.custom,
      {
        id: Date.now(),
        days: 1,
        template: "",
        channels: { sms: true, email: false, push: false, whatsapp: false },
      },
    ];
    setRules({ ...rules, custom: updated });
  };

  const updateCustom = (id, field, value) => {
    const updated = rules.custom.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setRules({ ...rules, custom: updated });
  };

  const removeCustom = (id) => {
    const updated = rules.custom.filter((c) => c.id !== id);
    setRules({ ...rules, custom: updated });
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2  rounded-xl">
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <FiBell /> Configure EMI Reminders
        </h1>
      </div>

      <div className="space-y-8 max-w-4xl">

        {/* ================= PRE-DUE REMINDER ================= */}
        <ReminderCard
          title="Pre-Due Reminder"
          type="preDue"
          rules={rules}
          setRules={setRules}
          toggleChannel={toggleChannel}
        >
          <Input
            label="Days Before"
            type="number"
            value={rules.preDue.daysBefore}
            onChange={(v) =>
              setRules({
                ...rules,
                preDue: { ...rules.preDue, daysBefore: Number(v) },
              })
            }
          />

          <Textarea
            label="Message Template"
            value={rules.preDue.template}
            onChange={(v) =>
              setRules({
                ...rules,
                preDue: { ...rules.preDue, template: v },
              })
            }
          />
        </ReminderCard>

        {/* ================= DUE-DAY REMINDER ================= */}
        <ReminderCard
          title="Due-Day Reminder"
          type="dueDay"
          rules={rules}
          setRules={setRules}
          toggleChannel={toggleChannel}
        >
          <Textarea
            label="Message Template"
            value={rules.dueDay.template}
            onChange={(v) =>
              setRules({
                ...rules,
                dueDay: { ...rules.dueDay, template: v },
              })
            }
          />
        </ReminderCard>

        {/* ================= POST-DUE REMINDER ================= */}
        <ReminderCard
          title="Post-Due Reminder"
          type="postDue"
          rules={rules}
          setRules={setRules}
          toggleChannel={toggleChannel}
        >
          <Input
            label="Days After"
            type="number"
            value={rules.postDue.daysAfter}
            onChange={(v) =>
              setRules({
                ...rules,
                postDue: { ...rules.postDue, daysAfter: Number(v) },
              })
            }
          />

          <Textarea
            label="Message Template"
            value={rules.postDue.template}
            onChange={(v) =>
              setRules({
                ...rules,
                postDue: { ...rules.postDue, template: v },
              })
            }
          />
        </ReminderCard>

        {/* ================= CUSTOM REMINDERS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">
            Custom Reminders (Optional)
          </h2>

          <button
            onClick={addCustomReminder}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            + Add Custom Reminder
          </button>

          {rules.custom.map((c) => (
            <div
              key={c.id}
              className=" p-4 rounded-xl mb-3 bg-gray-50 space-y-3"
            >
              <Input
                label="Days From Due Date"
                type="number"
                value={c.days}
                onChange={(v) => updateCustom(c.id, "days", Number(v))}
              />

              <Textarea
                label="Message Template"
                value={c.template}
                onChange={(v) => updateCustom(c.id, "template", v)}
              />

              <ChannelSelector
                channels={c.channels}
                onToggle={(channel) =>
                  updateCustom(c.id, "channels", {
                    ...c.channels,
                    [channel]: !c.channels[channel],
                  })
                }
              />

              <button
                onClick={() => removeCustom(c.id)}
                className="text-red-600 underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveRules}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
        >
          <FiSave /> Save EMI Reminder Rules
        </button>
      </div>
    </MainLayout>
  );
};

/* -------------------------------------------
   Reusable Components
-------------------------------------------- */

const ReminderCard = ({ title, type, rules, setRules, toggleChannel, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">{title}</h2>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={rules[type].enabled}
          onChange={() =>
            setRules({
              ...rules,
              [type]: { ...rules[type], enabled: !rules[type].enabled },
            })
          }
        />
        Enable
      </label>
    </div>

    {rules[type].enabled && (
      <div className="mt-4 space-y-4">
        {children}

        <ChannelSelector
          channels={rules[type].channels}
          onToggle={(c) => toggleChannel(type, c)}
        />
      </div>
    )}
  </div>
);

const ChannelSelector = ({ channels, onToggle }) => (
  <div className="flex gap-4 flex-wrap">
    {Object.keys(channels).map((ch) => (
      <label key={ch} className="flex items-center gap-2">
        <input type="checkbox" checked={channels[ch]} onChange={() => onToggle(ch)} />
        {ch.toUpperCase()}
      </label>
    ))}
  </div>
);

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 mt-1  rounded-xl bg-gray-50"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 mt-1 rounded-xl bg-gray-50"
    />
  </div>
);

export default EmiReminders;
