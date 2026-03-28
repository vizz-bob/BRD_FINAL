import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiSave,
  FiMail,
  FiSearch
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import { emailTemplateService } from "../../services/emailTemplateService";

const CATEGORIES = [
  "Welcome",
  "Loan Confirmation",
  "Payment Reminder",
  "Overdue Alert",
  "Closure Email",
  "General",
];

const EmailTemplates = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "General",
    subject: "",
    body: "",
    isActive: true,
  });

  // Load templates
  useEffect(() => {
    (async () => {
      const data = await emailTemplateService.getTemplates();
      setTemplates(data);
      setLoading(false);
    })();
  }, []);

  // Extract variables like {{name}}, {{loan_id}}
  const variables = useMemo(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const found = new Set();
    let m;
    while ((m = regex.exec(form.body))) {
      found.add(m[1].trim());
    }
    return [...found];
  }, [form.body]);

  // Preview body (replace variables with sample values)
  const previewHtml = useMemo(() => {
    let html = form.body;
    const samples = {
      name: "Rahul Sharma",
      loan_id: "LN-29901",
      emi_amount: "₹2,150",
      due_date: "10 Feb 2026",
      branch_name: "Bhopal HQ",
    };

    variables.forEach((v) => {
      const rep = samples[v.toLowerCase()] || `[${v}]`;
      html = html.replace(new RegExp(`\\{\\{${v}\\}\\}`, "g"), rep);
    });

    return html;
  }, [form.body, variables]);

  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase();

    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" ||
        t.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [templates, search, categoryFilter]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "General",
      subject: "",
      body: "",
      isActive: true,
    });
  };

  const saveTemplate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Name required!");
    if (!form.subject.trim()) return alert("Subject required!");
    if (!form.body.trim()) return alert("Body cannot be empty!");

    const payload = { ...form, variables };

    if (editingId) {
      const updated = await emailTemplateService.updateTemplate(editingId, payload);
      setTemplates((t) => t.map((i) => (i.id === editingId ? updated : i)));
      alert("Template updated!");
    } else {
      const created = await emailTemplateService.addTemplate(payload);
      setTemplates((t) => [...t, created]);
      alert("Template created!");
    }

    resetForm();
  };

  const selectTemplate = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      category: t.category,
      subject: t.subject,
      body: t.body,
      isActive: t.isActive,
    });
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm("Delete template permanently?")) return;
    await emailTemplateService.deleteTemplate(id);
    setTemplates((t) => t.filter((i) => i.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-50 rounded-xl border"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FiMail className="text-blue-600" /> Email Templates
          </h1>
          <p className="text-gray-500 text-sm">
            Manage reusable email templates with variables & preview.
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1.7fr] gap-6">

        {/* LEFT LIST PANEL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          {/* Search + Filter */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center bg-gray-50 p-2 rounded-xl border">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 bg-gray-50 border rounded-xl text-sm"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={resetForm}
                className="ml-auto px-3 py-2 bg-blue-600 text-white rounded-xl text-xs flex items-center gap-1"
              >
                <FiPlus /> New Template
              </button>
            </div>
          </div>

          {/* TEMPLATE LIST */}
          <div className="max-h-[450px] overflow-y-auto space-y-3">
            {loading ? (
              <p className="text-center text-gray-500 py-6">Loading...</p>
            ) : filteredTemplates.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                No templates found.
              </p>
            ) : (
              filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => selectTemplate(t)}
                  className={`p-4 cursor-pointer rounded-xl border transition 
                    ${
                      editingId === t.id
                        ? "bg-blue-50 border-blue-400"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-100"
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                        {t.subject}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(t.id);
                      }}
                      className="p-1 rounded-full hover:bg-red-100"
                    >
                      <FiTrash2 className="text-red-500 text-xs" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT FORM + PREVIEW */}
        <form
          onSubmit={saveTemplate}
          className="bg-white p-6 rounded-2xl shadow-sm  space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <Field label="Template Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Welcome Email"
                className="w-full p-3 bg-gray-50 rounded-xl border text-sm"
              />
            </Field>

            {/* Category */}
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 bg-gray-50 border rounded-xl text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            {/* Status */}
            <Field label="Status">
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                {form.isActive ? "Active" : "Inactive"}
              </label>
            </Field>
          </div>

          {/* Email Subject */}
          <Field label="Email Subject">
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Your loan has been approved!"
              className="w-full p-3 bg-gray-50 rounded-xl border text-sm"
            />
          </Field>

          {/* Email Body */}
          <Field label="Email Body (HTML allowed)">
            <textarea
              rows="6"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Dear {{name}}, Your loan {{loan_id}} is approved..."
              className="w-full p-3 bg-gray-50 rounded-xl border text-sm"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Use variables like {"{{name}}, {{loan_id}}, {{emi_amount}}"} etc.
            </p>
          </Field>

          {/* Variables */}
          <div className="bg-gray-50 p-3 rounded-xl border">
            <p className="text-xs text-gray-600 mb-2 font-semibold">
              Extracted Variables
            </p>

            {variables.length === 0 ? (
              <p className="text-[11px] text-gray-400">No variables detected.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <span
                    key={v}
                    className="px-2 py-1 text-[11px] rounded-full bg-white border"
                  >
                    {"{{" + v + "}}"}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW */}
          <div className="bg-white  text-black rounded-2xl p-4">
            <p className="text-xs text-black mb-2">Email Preview</p>

            <div
              className=" p-4 rounded-xl text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-gray-300"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
            >
              <FiSave /> {editingId ? "Update Template" : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

const Field = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    {children}
  </div>
);

export default EmailTemplates;
