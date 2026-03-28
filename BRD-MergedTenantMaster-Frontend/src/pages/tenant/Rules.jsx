// src/pages/Rules.jsx
import { useEffect, useMemo, useState } from "react";
import rulesService from "../../services/rulesService";
import authService from "../../services/authService";

const defaultConfig = {
  access: {
    permissions: {
      leads: { view: true, add: true, edit: true, delete: false },
      loan_applications: { view: true, add: true, edit: true, delete: false },
      documents: { view: true, add: true, edit: false, delete: false },
      products: { view: true, add: true, edit: true, delete: true },
      users: { view: true, add: true, edit: true, delete: false },
    },
    module_access: { crm: true, loan: true, collection: false },
  },
  workflow: {
    approval_levels: ["Sales", "Verification", "Credit", "Risk", "Approval"],
    approver_roles: ["Credit", "Risk", "Approval"],
    rejector_roles: ["Risk", "Approval"],
    document_verification: {
      mandatory: ["PAN", "Aadhaar", "Address Proof"],
      auto_validation: true,
      upload_limit_mb: 10,
    },
  },
  validation: {
    unique_email: true,
    pan_format: true,
    aadhaar_format: true,
    phone_10_digits: true,
  },
  assignment: {
    lead_by_category: true,
    application_by_product: true,
    auto_assign: { sales: true, verification: true, credit: true },
  },
  security: {
    password_min_length: 8,
    password_special_required: true,
    session_timeout_minutes: 30,
    device_restrictions: ["Web"],
  },
};

function normalizeConfig(raw) {
  const c = raw || {};
  const perms = c.access?.permissions || {};
  const moduleAccess = c.access?.module_access || {};
  const workflow = c.workflow || {};
  const docVer = workflow.document_verification || {};

  return {
    access: {
      permissions: {
        leads: { ...defaultConfig.access.permissions.leads, ...(perms.leads || {}) },
        loan_applications: { ...defaultConfig.access.permissions.loan_applications, ...(perms.loan_applications || {}) },
        documents: { ...defaultConfig.access.permissions.documents, ...(perms.documents || {}) },
        products: { ...defaultConfig.access.permissions.products, ...(perms.products || {}) },
        users: { ...defaultConfig.access.permissions.users, ...(perms.users || {}) },
      },
      module_access: { ...defaultConfig.access.module_access, ...moduleAccess },
    },
    workflow: {
      approval_levels: workflow.approval_levels || defaultConfig.workflow.approval_levels,
      approver_roles: workflow.approver_roles || defaultConfig.workflow.approver_roles,
      rejector_roles: workflow.rejector_roles || defaultConfig.workflow.rejector_roles,
      document_verification: {
        mandatory: docVer.mandatory || defaultConfig.workflow.document_verification.mandatory,
        auto_validation: docVer.auto_validation ?? defaultConfig.workflow.document_verification.auto_validation,
        upload_limit_mb: docVer.upload_limit_mb ?? defaultConfig.workflow.document_verification.upload_limit_mb,
      },
    },
    validation: { ...defaultConfig.validation, ...(c.validation || {}) },
    assignment: {
      lead_by_category: c.assignment?.lead_by_category ?? defaultConfig.assignment.lead_by_category,
      application_by_product: c.assignment?.application_by_product ?? defaultConfig.assignment.application_by_product,
      auto_assign: { ...defaultConfig.assignment.auto_assign, ...(c.assignment?.auto_assign || {}) },
    },
    security: { ...defaultConfig.security, ...(c.security || {}) },
  };
}

export default function Rules() {
  const [tenantId, setTenantId] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [ruleId, setRuleId] = useState(null);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = authService.getTenantIdFromToken();
    const fromLocal = localStorage.getItem("TENANT_ID");
    if (t) setTenantId(t);
    else if (fromLocal) setTenantId(fromLocal);
    else {
      console.warn("No tenant found → read-only mode");
      setTenantId(null);
    }
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    loadRules();
  }, [tenantId]);

  async function loadRules() {
    setLoading(true);
    try {
      const data = await rulesService.getConfig(tenantId);
      if (data) {
        setRuleId(data.id);
        setConfig(normalizeConfig(data.config));
      }
    } catch (e) {
      console.error("Failed load:", e);
    }
    setLoading(false);
  }

  async function saveRules() {
    setLoading(true);
    try {
      const saved = await rulesService.saveConfig(ruleId, config, tenantId);
      if (saved?.id) setRuleId(saved.id);
      alert("Saved!");
      setOpen(null);
    } catch (e) {
      console.error("Save error", e);
      alert("Save failed");
    }
    setLoading(false);
  }

  const resources = useMemo(
    () => [
      { key: "leads", name: "Leads" },
      { key: "loan_applications", name: "Loan Applications" },
      { key: "documents", name: "Documents" },
      { key: "products", name: "Products" },
      { key: "users", name: "Users" },
    ],
    []
  );

  const FooterButtons = ({ onClose, onSave }) => (
    <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm font-medium transition whitespace-nowrap"
      >
        Close
      </button>
      <button
        onClick={onSave}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 text-sm font-medium transition whitespace-nowrap"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Rules Engine</h1>
        <div className="text-sm text-gray-600 whitespace-nowrap">
          Tenant: <strong className="text-gray-900">{tenantId || "None"}</strong>
        </div>
      </div>

      {/* Rule Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
        <Card title="Access Rules" description="Manage permissions per resource" icon="🔐" onClick={() => setOpen("access")} />
        <Card title="Workflow Rules" description="Configure approval levels and stages" icon="🔄" onClick={() => setOpen("workflow")} />
        <Card title="Validation Rules" description="Field format and uniqueness checks" icon="✅" onClick={() => setOpen("validation")} />
        <Card title="Assignment Rules" description="Auto-routing logic for leads and apps" icon="📋" onClick={() => setOpen("assignment")} />
        <Card title="Security Rules" description="Password policy and session settings" icon="🛡️" onClick={() => setOpen("security")} className="sm:col-span-2 xl:col-span-1" />
      </div>

      {/* ── ACCESS MODAL ── */}
      {open === "access" && (
        <ModalWrapper title="Access Rules" onClose={() => setOpen(null)}>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden min-w-[380px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 md:p-3 text-left font-semibold text-gray-700">Resource</th>
                  <th className="p-2 md:p-3 text-center font-semibold text-gray-700">View</th>
                  <th className="p-2 md:p-3 text-center font-semibold text-gray-700">Add</th>
                  <th className="p-2 md:p-3 text-center font-semibold text-gray-700">Edit</th>
                  <th className="p-2 md:p-3 text-center font-semibold text-gray-700">Delete</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.key} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-2 md:p-3 font-medium text-gray-800 whitespace-nowrap">{r.name}</td>
                    {["view", "add", "edit", "delete"].map((perm) => (
                      <td key={perm} className="p-2 md:p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                          checked={config.access.permissions[r.key][perm]}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              access: {
                                ...config.access,
                                permissions: {
                                  ...config.access.permissions,
                                  [r.key]: {
                                    ...config.access.permissions[r.key],
                                    [perm]: e.target.checked,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FooterButtons onClose={() => setOpen(null)} onSave={saveRules} />
        </ModalWrapper>
      )}

      {/* ── WORKFLOW MODAL ── */}
      {open === "workflow" && (
        <ModalWrapper title="Workflow Rules" onClose={() => setOpen(null)}>
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Approval Levels</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {config.workflow.approval_levels.map((lvl, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
                  {i + 1}. {lvl}
                </span>
              ))}
            </div>
            <input
              className="border border-gray-300 p-2.5 w-full rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Type a level name and press Enter to add"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  setConfig({
                    ...config,
                    workflow: {
                      ...config.workflow,
                      approval_levels: [...config.workflow.approval_levels, e.target.value.trim()],
                    },
                  });
                  e.target.value = "";
                }
              }}
            />
            <p className="text-xs text-gray-400 mt-1">Press Enter to add a new level</p>
          </div>
          <FooterButtons onClose={() => setOpen(null)} onSave={saveRules} />
        </ModalWrapper>
      )}

      {/* ── VALIDATION MODAL ── */}
      {open === "validation" && (
        <ModalWrapper title="Validation Rules" onClose={() => setOpen(null)}>
          <div className="space-y-3">
            {Object.entries(config.validation).map(([k, v]) => (
              <label
                key={k}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                  checked={v}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      validation: { ...config.validation, [k]: e.target.checked },
                    })
                  }
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {k.replace(/_/g, " ")}
                </span>
              </label>
            ))}
          </div>
          <FooterButtons onClose={() => setOpen(null)} onSave={saveRules} />
        </ModalWrapper>
      )}

      {/* ── ASSIGNMENT MODAL ── */}
      {open === "assignment" && (
        <ModalWrapper title="Assignment Rules" onClose={() => setOpen(null)}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                checked={config.assignment.lead_by_category}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    assignment: { ...config.assignment, lead_by_category: e.target.checked },
                  })
                }
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Lead by Category</p>
                <p className="text-xs text-gray-400">Assign leads based on their category type</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                checked={config.assignment.application_by_product}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    assignment: { ...config.assignment, application_by_product: e.target.checked },
                  })
                }
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Application by Product</p>
                <p className="text-xs text-gray-400">Route applications based on selected loan product</p>
              </div>
            </label>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Auto-Assign Stages</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(config.assignment.auto_assign).map(([stage, val]) => (
                  <label key={stage} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                      checked={val}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          assignment: {
                            ...config.assignment,
                            auto_assign: { ...config.assignment.auto_assign, [stage]: e.target.checked },
                          },
                        })
                      }
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{stage}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <FooterButtons onClose={() => setOpen(null)} onSave={saveRules} />
        </ModalWrapper>
      )}

      {/* ── SECURITY MODAL ── */}
      {open === "security" && (
        <ModalWrapper title="Security Rules" onClose={() => setOpen(null)}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password Minimum Length
              </label>
              <input
                type="number"
                className="border border-gray-300 p-2.5 rounded-lg w-full md:w-48 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={config.security.password_min_length}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    security: { ...config.security, password_min_length: Number(e.target.value) },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                className="border border-gray-300 p-2.5 rounded-lg w-full md:w-48 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={config.security.session_timeout_minutes}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    security: { ...config.security, session_timeout_minutes: Number(e.target.value) },
                  })
                }
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                checked={config.security.password_special_required}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    security: { ...config.security, password_special_required: e.target.checked },
                  })
                }
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Require Special Characters</p>
                <p className="text-xs text-gray-400">Passwords must include at least one special character</p>
              </div>
            </label>
          </div>
          <FooterButtons onClose={() => setOpen(null)} onSave={saveRules} />
        </ModalWrapper>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// CARD COMPONENT
// ─────────────────────────────────────────
function Card({ title, description, icon, onClick, className = "" }) {
  return (
    <div
      className={`bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between gap-4 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={onClick}
        className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shrink-0 whitespace-nowrap"
      >
        Manage
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// MODAL WRAPPER
// ─────────────────────────────────────────
function ModalWrapper({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base md:text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {/* Modal Body */}
        <div className="px-5 md:px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
