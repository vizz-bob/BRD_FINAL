import { useState, useEffect } from "react";
import { CalculatorIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import riskAPI from "../services/riskService";

export default function ScorecardBuilder() {
  const [activeTab, setActiveTab] = useState("SALARIED");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false)

  const [newRule, setNewRule] = useState({ parameter: "Salary", condition: "GREATER_THAN", value: "", score: "" });

  useEffect(() => {
    loadRules();
  }, [activeTab]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await riskAPI.getScorecardRules(activeTab);
      setRules(res.data);
    } catch (err) {
      console.error("Failed to load rules");
    } finally {
      setLoading(false);
    }
  };

  const addRule = async () => {
    if (!newRule.value || !newRule.score) return;
    try {
        // 3. Save to Database
        await riskAPI.createScorecardRule({ ...newRule, category: activeTab });
        loadRules(); // Refresh list
        setNewRule({ parameter: "Salary", condition: "GREATER_THAN", value: "", score: "" });
    } catch (e) { alert("Save failed"); }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this rule?")) return;
  try {
    await riskAPI.deleteScorecardRule(id); 
    loadRules(); 
  } catch (e) {
    alert("Delete failed. Please try again.");
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5 text-emerald-600" /> 
            Credit Scorecard Engine
          </h3>
          <p className="text-xs text-slate-500 mt-1">Configure scoring weights for automated underwriting.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["SALARIED", "BUSINESS"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === tab ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-3 pl-2">Parameter</th>
              <th className="pb-3">Condition</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">Impact (Score)</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rules.map((rule) => (
              <tr key={rule.id} className="group border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="py-4 pl-2 font-bold text-slate-700">{rule.parameter}</td>
                <td className="py-4">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">{rule.condition}</span>
                </td>
                <td className="py-4 font-mono font-bold text-indigo-600">{rule.value}</td>
                <td className="py-4">
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">+{rule.score}</span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleDelete(rule.id)} className="text-slate-300 hover:text-rose-500">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Add Row */}
            <tr className="bg-emerald-50/30">
              <td className="py-3 pl-2">
                <select 
                  className="bg-white border border-slate-200 rounded p-1.5 text-xs font-bold outline-none"
                  value={newRule.parameter}
                  onChange={e => setNewRule({...newRule, parameter: e.target.value})}
                >
                  <option>CIBIL Score</option>
                  <option>Salary</option>
                  <option>Age</option>
                  <option>FOIR</option>
                </select>
              </td>
              <td className="py-3">
                <select 
                  className="bg-white border border-slate-200 rounded p-1.5 text-xs font-bold outline-none"
                  value={newRule.condition}
                  onChange={e => setNewRule({...newRule, condition: e.target.value})}
                >
                  <option value="GREATER_THAN">&gt; Greater Than</option>
                  <option value="LESS_THAN">&lt; Less Than</option>
                  <option value="BETWEEN">↔ Between</option>
                </select>
              </td>
              <td className="py-3">
                <input 
                  className="w-24 p-1.5 border border-slate-200 rounded text-xs font-bold outline-none"
                  placeholder="Value"
                  value={newRule.value}
                  onChange={e => setNewRule({...newRule, value: e.target.value})}
                />
              </td>
              <td className="py-3">
                <input 
                  type="number"
                  className="w-16 p-1.5 border border-slate-200 rounded text-xs font-bold outline-none"
                  placeholder="Score"
                  value={newRule.score}
                  onChange={e => setNewRule({...newRule, score: e.target.value})}
                />
              </td>
              <td className="py-3 text-right pr-2">
                <button onClick={addRule} className="text-emerald-600 hover:text-emerald-800">
                  <PlusCircleIcon className="h-6 w-6" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}