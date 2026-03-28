import { useState, useEffect } from "react";
import { ClockIcon, BellAlertIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { escalationAPI } from "../services/escalationService.js";

export default function EscalationRules() {
  const [rules, setRules] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ stage: "Underwriting", hours: "", action: "Notify", priority: "Medium" });
  const [loading, setLoading] = useState(true);

  const addRule = async () => {
  if (!newRule.hours || newRule.hours <= 0) {
    alert("Please enter a valid number of hours");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      stage: newRule.stage,
      delay_hours: parseInt(newRule.hours), // This will be converted in service
      action: newRule.action
    };
    const createdRule = await escalationAPI.create(payload);
    setRules(prev => [...prev, createdRule]);
    setIsModalOpen(false);
    setNewRule({ stage: "Underwriting", hours: "", action: "Notify Supervisor", priority: "Medium" });
  } catch (err) {
    console.error("Error creating rule:", err.response?.data); // Better error logging
    alert("Server error: Could not save rule.");
  } finally {
    setLoading(false);
  }
};



  const handleDelete = async (id) => {
    try {
      await escalationAPI.delete(id);
      setRules(rules.filter(r => r.id !== id));
    } catch (err) {
      alert("Delete failed on server.");
    }
  };

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await escalationAPI.getAll();
        setRules(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load escalation rules:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  return (
  <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen bg-slate-50">

    {/* Header */}
    <div className="flex flex-wrap justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
          <BellAlertIcon className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Escalation Master</h1>
          <p className="text-slate-500 font-medium">Define auto-triggers for delayed applications.</p>
        </div>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 transition text-sm whitespace-nowrap"
      >
        <PlusIcon className="w-5 h-5" /> Add Rule
      </button>
    </div>

    {/* Rules Grid */}
    <div className="grid grid-cols-1 gap-4">
      {loading ? (
        <p className="text-center p-10 text-slate-400 font-bold uppercase tracking-widest">Loading rules...</p>
      ) : rules.length > 0 ? (
        rules.map((rule) => (
          <div key={rule.id} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-4 group hover:border-rose-200 transition-all">
            <div className="flex items-center gap-4 md:gap-6 min-w-0">
              <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                <ClockIcon className="h-6 w-6 text-slate-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base md:text-lg font-bold text-slate-800">{rule.stage} Stage</h4>
                <div className="flex flex-wrap gap-2 mt-1 text-sm font-medium text-slate-500">
                  <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 whitespace-nowrap">{rule.condition}</span>
                  <span>→</span>
                  <span className="text-slate-700">{rule.action}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 shrink-0">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap ${rule.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {rule.priority} Priority
              </span>
              <button onClick={() => handleDelete(rule.id)} className="p-2 text-slate-300 hover:text-rose-500 transition">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-16 md:p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No escalation rules defined yet.</p>
        </div>
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6">Configure Escalation Rule</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Process Stage</label>
              <select value={newRule.stage} className="w-full p-3 border rounded-xl font-bold text-slate-700" onChange={e => setNewRule({ ...newRule, stage: e.target.value })}>
                <option>Underwriting</option>
                <option>Document Verification</option>
                <option>Disbursement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trigger Delay (Hours)</label>
              <input value={newRule.hours} type="number" className="w-full p-3 border rounded-xl font-bold text-slate-700" placeholder="e.g. 24" onChange={e => setNewRule({ ...newRule, hours: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Action</label>
              <select value={newRule.action} className="w-full p-3 border rounded-xl font-bold text-slate-700" onChange={e => setNewRule({ ...newRule, action: e.target.value })}>
                <option>Notify Supervisor</option>
                <option>Notify Admin</option>
                <option>Auto-Reassign</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3 mt-8">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            <button onClick={addRule} className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-200">Save Rule</button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
