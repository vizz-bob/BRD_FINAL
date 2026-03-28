import React, { useState } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

const STEPS = ["Details", "Audience", "Content", "Schedule"];

export default function CreateCampaignModal({
  isOpen,
  onClose,
  defaultChannel,
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const [campaign, setCampaign] = useState({
    documentEvidence: false,
    title: "",
    type: "Email",
    schedule: "",
    audienceGroup: "",
    tenantId: "",
    leadSource: "Campaign",
    leadStatus: "Raw",
    leadQuality: "Medium",
    consentObtained: false,
    assignedTo: "",
    locationCountry: "",
    locationState: "",
    locationCity: "",
    campaignAssociation: "",
    product: "",
    // Content step fields
    contentType: "Email",
    templateId: "",
    personalizationFields: "",
    previewContent: "",
    dndCompliance: false,
    unsubscribeIncluded: true,
    // Schedule fields
    startDate: "",
    startTime: "",
    endDate: "",
    timeZone: "",
    scheduleStatus: "Scheduled",
    status: "Draft",
    approvalRequired: false,
    owner: "",
  });

  if (!isOpen) return null;

  const update = (key, value) =>
    setCampaign((prev) => ({ ...prev, [key]: value }));

  const handleLaunch = () => {
    console.log("Launching campaign:", campaign);
    // TODO: call API to create the campaign
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800">New Campaign</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              {defaultChannel === "OVERVIEW"
                ? "Select Channel"
                : `${defaultChannel} Campaign`}
            </p>
          </div>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="px-8 pt-6">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step, idx) => (
              <div
                key={step}
                className="flex flex-col items-center gap-2 bg-white px-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    idx <= currentStep
                      ? "bg-blue-600 text-white ring-4 ring-blue-50"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    idx <= currentStep ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 flex-1 overflow-y-auto">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Campaign Title / Name
                  </label>
                  <input
                    value={campaign.title}
                    onChange={(e) => update("title", e.target.value)}
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Summer Bonanza Sale"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Campaign Type
                  </label>
                  <select
                    value={campaign.type}
                    onChange={(e) => update("type", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Push</option>
                    <option>Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Product Selection
                  </label>
                  <select
                    value={campaign.product}
                    onChange={(e) => update("product", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- Select Product --</option>
                    <option>Personal Loan</option>
                    <option>Home Loan</option>
                    <option>Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Campaign Status
                  </label>
                  <select
                    value={campaign.status}
                    onChange={(e) => update("status", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>Draft</option>
                    <option>Scheduled</option>
                    <option>Sent</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={campaign.documentEvidence}
                    onChange={(e) =>
                      update("documentEvidence", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-600">
                    Document Evidence Present
                  </span>
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={campaign.approvalRequired}
                    onChange={(e) =>
                      update("approvalRequired", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-600">
                    Approval Workflow Required
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Campaign Owner
                </label>
                <input
                  value={campaign.owner}
                  onChange={(e) => update("owner", e.target.value)}
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  placeholder="Owner name or user id"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Tenant ID
                  </label>
                  <input
                    value={campaign.tenantId}
                    onChange={(e) => update("tenantId", e.target.value)}
                    type="text"
                    readOnly
                    placeholder="Implicit tenant isolation"
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Implicit tenant isolation
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Lead Source
                  </label>
                  <select
                    value={campaign.leadSource}
                    onChange={(e) => update("leadSource", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>Campaign</option>
                    <option>Third Party</option>
                    <option>Internal</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Campaign / Third Party / Internal
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Lead Status
                  </label>
                  <select
                    value={campaign.leadStatus}
                    onChange={(e) => update("leadStatus", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>Raw</option>
                    <option>Qualified</option>
                    <option>Hot</option>
                    <option>Follow-up</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Raw / Qualified / Hot / Follow-up
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Lead Quality
                  </label>
                  <select
                    value={campaign.leadQuality}
                    onChange={(e) => update("leadQuality", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: High / Medium / Low
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Consent Obtained
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={campaign.consentObtained}
                        onChange={(e) =>
                          update("consentObtained", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-xs font-bold text-slate-600">
                        Yes
                      </span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Mandatory compliance
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Product Selection
                  </label>
                  <select
                    value={campaign.product}
                    onChange={(e) => update("product", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- Select Product --</option>
                    <option>Personal Loan</option>
                    <option>Home Loan</option>
                    <option>Credit Card</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Product-specific campaigns
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Assigned Team / User
                  </label>
                  <input
                    value={campaign.assignedTo}
                    onChange={(e) => update("assignedTo", e.target.value)}
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    placeholder="e.g. Sales Team A or user id"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Allocation logic
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Location (Country / State / City)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      value={campaign.locationCountry}
                      onChange={(e) =>
                        update("locationCountry", e.target.value)
                      }
                      type="text"
                      className="p-2 border border-slate-200 rounded-xl outline-none"
                      placeholder="Country"
                    />
                    <input
                      value={campaign.locationState}
                      onChange={(e) => update("locationState", e.target.value)}
                      type="text"
                      className="p-2 border border-slate-200 rounded-xl outline-none"
                      placeholder="State"
                    />
                    <input
                      value={campaign.locationCity}
                      onChange={(e) => update("locationCity", e.target.value)}
                      type="text"
                      className="p-2 border border-slate-200 rounded-xl outline-none"
                      placeholder="City"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Country / State / City
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Campaign Association
                  </label>
                  <input
                    value={campaign.campaignAssociation}
                    onChange={(e) =>
                      update("campaignAssociation", e.target.value)
                    }
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    placeholder="Previous campaigns or IDs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Source in Document: Previous campaigns
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Content Type
                  </label>
                  <select
                    value={campaign.contentType}
                    onChange={(e) => update("contentType", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Social</option>
                    <option>Voice</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    In Document: Email / SMS / Social / Voice
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Template Selection
                  </label>
                  <select
                    value={campaign.templateId}
                    onChange={(e) => update("templateId", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- Select Template --</option>
                    <option value="tmpl-welcome">Welcome Template</option>
                    <option value="tmpl-offer">Promotional Offer</option>
                    <option value="tmpl-reminder">Reminder</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    In Document: Reusable content base
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Personalization Fields (dynamic placeholders)
                  </label>
                  <textarea
                    value={campaign.personalizationFields}
                    onChange={(e) =>
                      update("personalizationFields", e.target.value)
                    }
                    rows={3}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    placeholder="e.g. {{first_name}}, {{loan_amount}}"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    In Document: Dynamic placeholders
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Preview (final rendered content)
                  </label>
                  <textarea
                    value={campaign.previewContent}
                    readOnly
                    rows={6}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                    placeholder="Render preview to see final content"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "previewContent",
                          `Template: ${campaign.templateId || "none"}\nType: ${
                            campaign.contentType
                          }\n\nPersonalization:\n${
                            campaign.personalizationFields || "-none-"
                          }\n`
                        )
                      }
                      className="px-3 py-2 bg-slate-100 rounded-lg text-sm"
                    >
                      Render Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => update("previewContent", "")}
                      className="px-3 py-2 bg-slate-100 rounded-lg text-sm"
                    >
                      Clear Preview
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    In Document: Final rendered content
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Compliance Validation
                  </label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campaign.dndCompliance}
                        onChange={(e) =>
                          update("dndCompliance", e.target.checked)
                        }
                        className="w-4 h-4"
                      />{" "}
                      <span className="text-xs">DND checked</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campaign.consentObtained}
                        onChange={(e) =>
                          update("consentObtained", e.target.checked)
                        }
                        className="w-4 h-4"
                      />{" "}
                      <span className="text-xs">Consent obtained</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campaign.unsubscribeIncluded}
                        onChange={(e) =>
                          update("unsubscribeIncluded", e.target.checked)
                        }
                        className="w-4 h-4"
                      />{" "}
                      <span className="text-xs">Unsubscribe link included</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    In Document: DND, consent, unsubscribe
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={campaign.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document Alignment: Campaign start
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={campaign.startTime}
                    onChange={(e) => update("startTime", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document Alignment: Execution time
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={campaign.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document Alignment: Campaign end
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Time Zone
                  </label>
                  <input
                    type="text"
                    value={campaign.timeZone}
                    onChange={(e) => update("timeZone", e.target.value)}
                    placeholder="Tenant / branch timezone"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document Alignment: Tenant / branch timezone (implied)
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Schedule Status
                  </label>
                  <select
                    value={campaign.scheduleStatus}
                    onChange={(e) => update("scheduleStatus", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                  >
                    <option>Scheduled</option>
                    <option>Paused</option>
                    <option>Completed</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document Alignment: Scheduled / Paused / Completed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-6 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition"
          >
            Back
          </button>

          <button
            onClick={() =>
              currentStep === 3
                ? handleLaunch()
                : setCurrentStep((prev) => prev + 1)
            }
            className="px-8 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition"
          >
            {currentStep === 3 ? "Launch Campaign" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
