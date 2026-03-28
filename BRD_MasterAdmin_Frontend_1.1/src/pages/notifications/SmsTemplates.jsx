// src/pages/notifications/SmsTemplates.jsx

import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiSave,
  FiMessageSquare,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { smsTemplateService } from "../../services/smsTemplateService";

const TEMPLATE_TYPES = [
  "OTP",
  "Due Reminder",
  "Welcome",
  "Disbursement",
  "Collection",
  "Custom",
];

const SmsTemplates = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "Custom",
    message: "",
    isTransactional: true,
    isActive: true,
  });

  // Load templates initially
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await smsTemplateService.getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  // Extract variables like {{name}}, {{loan_id}} from message
  const extractedVariables = useMemo(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const found = new Set();
    let match;
    while ((match = regex.exec(form.message))) {
      found.add(match[1].trim());
    }
    return Array.from(found);
  }, [form.message]);

  // For preview: replace variables with demo values
  const previewText = useMemo(() => {
    let text = form.message || "";
    const sampleMap = {
      name: "Rahul",
      customer_name: "Rahul Sharma",
      loan_id: "LN-10293",
      amount: "₹25,000",
      due_date: "05 Jan 2026",
      emi_amount: "₹1,750",
      branch_name: "Bhopal Main Branch",
    };

    extractedVariables.forEach((v) => {
      const key = v.toLowerCase();
      const replacement = sampleMap[key] || `[${v}]`;
      const pattern = new RegExp(`\\{\\{\\s*${escapeRegExp(v)}\\s*\\}\\}`, "g");
      text = text.replace(pattern, replacement);
    });

    return text;
  }, [form.message, extractedVariables]);

  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase();

    return templates.filter((t) => {
      const matchesSearch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.message?.toLowerCase().includes(q) ||
        t.type?.toLowerCase().includes(q);

      const matchesType =
        typeFilter === "ALL" ||
        (t.type || "").toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [templates, search, typeFilter]);

  const handleSelectTemplate = (tpl) => {
    setEditingId(tpl.id);
    setForm({
      name: tpl.name || "",
      type: tpl.type || "Custom",
      message: tpl.message || "",
      isTransactional: !!tpl.isTransactional,
      isActive: tpl.isActive ?? true,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      type: "Custom",
      message: "",
      isTransactional: true,
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Template name is required.");
    if (!form.message.trim()) return alert("Template message cannot be empty.");

    const payload = {
      ...form,
      variables: extractedVariables,
    };

    if (editingId) {
      const updated = await smsTemplateService.updateTemplate(editingId, payload);
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingId ? updated : t))
      );
      alert("Template updated successfully.");
    } else {
      const created = await smsTemplateService.addTemplate(payload);
      setTemplates((prev) => [...prev, created]);
      alert("Template created successfully.");
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    await smsTemplateService.deleteTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));

    if (editingId === id) resetForm();
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiMessageSquare className="text-blue-600" />
              SMS Templates
            </h1>
            <p className="text-gray-500 text-sm">
              Create & manage SMS templates for OTP, reminders and loan notifications.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: LEFT LIST + RIGHT FORM/PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1.6fr] gap-6 items-start">
        {/* LEFT: TEMPLATE LIST / FILTERS */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
          {/* Search + Filters */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, type or text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none"
              >
                <option value="ALL">All Types</option>
                {TEMPLATE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={resetForm}
                className="ml-auto px-3 py-2 text-xs rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
              >
                <FiPlus /> New Template
              </button>
            </div>
          </div>

          {/* Template List */}
          <div className="mt-3 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-gray-500 text-sm text-center py-6">
                Loading templates...
              </p>
            ) : filteredTemplates.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">
                No templates found. Create a new one on the right.
              </p>
            ) : (
              filteredTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`w-full text-left p-4 rounded-xl border flex justify-between items-start gap-3 transition
                    ${
                      editingId === tpl.id
                        ? "bg-blue-50 border-blue-400"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                    }`}
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {tpl.name}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {tpl.message}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      {tpl.type} •{" "}
                      {tpl.isTransactional ? "Transactional" : "Promotional"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        tpl.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tpl.isActive ? "Active" : "Inactive"}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(tpl.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-red-100"
                    >
                      <FiTrash2 className="text-red-500 text-xs" />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: FORM + PREVIEW */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 space-y-5"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Template Name *">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. EMI Due Reminder"
                className="w-full mt-1 p-3 rounded-xl bg-gray-50 outline-none border border-gray-200 text-sm"
              />
            </Field>

            <Field label="Template Type">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl bg-gray-50 outline-none border border-gray-200 text-sm"
              >
                {TEMPLATE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Category">
              <div className="flex gap-3 mt-1">
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="isTransactional"
                    checked={form.isTransactional === true}
                    onChange={() =>
                      setForm((p) => ({ ...p, isTransactional: true }))
                    }
                  />
                  Transactional
                </label>
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="isTransactional"
                    checked={form.isTransactional === false}
                    onChange={() =>
                      setForm((p) => ({ ...p, isTransactional: false }))
                    }
                  />
                  Promotional
                </label>
              </div>
            </Field>

            <Field label="Status">
              <label className="inline-flex items-center gap-2 mt-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                {form.isActive ? "Active" : "Inactive"}
              </label>
            </Field>
          </div>

          {/* Message Textarea */}
          <Field label="SMS Content *">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              placeholder="Dear {{name}}, your EMI of {{emi_amount}} for Loan {{loan_id}} is due on {{due_date}}."
              className="w-full mt-1 p-3 rounded-xl bg-gray-50 outline-none border border-gray-200 text-sm"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Use variables like {"{{name}}"}, {"{{loan_id}}"}, {"{{amount}}"},{" "}
              {"{{due_date}}"} etc. They will be replaced at runtime.
            </p>
          </Field>

          {/* Variables + Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Variables / chips */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Detected Variables
              </p>

              {extractedVariables.length === 0 ? (
                <p className="text-[11px] text-gray-400">
                  No variables found yet. Use {"{{variable_name}}"} in message.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {extractedVariables.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-1 text-[11px] rounded-full bg-white border border-gray-200 text-gray-700"
                    >
                      {"{{"}
                      {v}
                      {"}}"}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile-like preview */}
            <div className="bg-gray-900 rounded-2xl p-3 text-gray-50 flex flex-col items-center">
              <p className="text-[11px] text-gray-300 mb-2 self-start">
                Preview
              </p>

              <div className="w-full max-w-[260px] bg-black rounded-2xl p-3 flex flex-col gap-2">
                <div className="text-[11px] text-gray-400 flex justify-between">
                  <span>VM-LOANAPP</span>
                  <span>Now</span>
                </div>

                <div className="bg-gray-800 rounded-2xl p-3 text-[11px] leading-relaxed">
                  {previewText || "Your preview will appear here."}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-700"
              >
                Clear / New Template
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700 shadow-sm"
            >
              <FiSave /> {editingId ? "Update Template" : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

/* Small layout helper */
const Field = ({ label, children }) => (
  <div className="flex flex-col text-sm">
    <label className="text-gray-700 text-xs font-semibold">{label}</label>
    {children}
  </div>
);

// escape for preview regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default SmsTemplates;
