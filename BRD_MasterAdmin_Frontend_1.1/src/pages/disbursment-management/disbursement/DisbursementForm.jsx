import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
// import {
//   disbursementMasterService,
//   agencyMasterService,
//   frequencyMasterService,
//   documentMasterService,
//   thirdPartyMasterService,
//   stageMasterService
// } from "../../../services/...";

export default function DisbursementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [agencies, setAgencies] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [thirdParties, setThirdParties] = useState([]);
  const [stages, setStages] = useState([]);

  const [form, setForm] = useState({
    disbursement_name: "",
    agency_id: "",
    frequency_id: "",
    required_documents: [],
    third_party_id: "",
    down_payment_percentage: "",
    down_payment_stage_id: "",
    status: "Active"
  });

  useEffect(() => {
    // TEMP MOCK DATA
    setAgencies([{ id: 1, name: "State Bank" }, { id: 2, name: "ABC Finance" }]);
    setFrequencies([{ id: 1, label: "Monthly" }, { id: 2, label: "Milestone" }]);
    setDocuments([{ id: 1, name: "KYC" }, { id: 2, name: "Agreement" }]);
    setThirdParties([{ id: 1, name: "Verifier Ltd" }]);
    setStages([{ id: 1, stage_name: "Pre-Approval" }, { id: 2, stage_name: "Foundation" }]);
  }, []);

  const submit = async e => {
    e.preventDefault();
    console.log("Disbursement Data:", form);
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">{isEdit ? "Edit Disbursement" : "Add Disbursement"}</h1>
          <p className="text-sm text-gray-500">
            Configure disbursement workflow rules
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Disbursement Name */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Disbursement Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.disbursement_name}
              onChange={e => setForm({ ...form, disbursement_name: e.target.value })}
              placeholder="e.g. Construction Loan Disbursement"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Agency */}
          <div>
            <label className="text-sm font-medium text-gray-700">Agency *</label>
            <select
              required
              value={form.agency_id}
              onChange={e => setForm({ ...form, agency_id: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Agency</option>
              {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm font-medium text-gray-700">Frequency *</label>
            <select
              required
              value={form.frequency_id}
              onChange={e => setForm({ ...form, frequency_id: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Frequency</option>
              {frequencies.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>

          {/* Required Documents */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Required Documents</label>
            <select
              multiple
              value={form.required_documents}
              onChange={e => setForm({
                ...form,
                required_documents: [...e.target.selectedOptions].map(o => o.value)
              })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm h-32"
            >
              {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {/* Third Party */}
          <div>
            <label className="text-sm font-medium text-gray-700">Third Party *</label>
            <select
              required
              value={form.third_party_id}
              onChange={e => setForm({ ...form, third_party_id: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Third Party</option>
              {thirdParties.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          {/* Down Payment % */}
          <div>
            <label className="text-sm font-medium text-gray-700">Down Payment % *</label>
            <input
              type="number"
              required
              value={form.down_payment_percentage}
              onChange={e => setForm({ ...form, down_payment_percentage: e.target.value })}
              placeholder="e.g. 20"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Down Payment Stage */}
          <div>
            <label className="text-sm font-medium text-gray-700">Down Payment Stage *</label>
            <select
              required
              value={form.down_payment_stage_id}
              onChange={e => setForm({ ...form, down_payment_stage_id: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Stage</option>
              {stages.map(s => <option key={s.id} value={s.id}>{s.stage_name}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2 rounded-xl bg-gray-100 text-sm hover:bg-gray-200">
            Cancel
          </button>

          <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700">
            <FiSave /> Save Disbursement
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
