const fs = require('fs');
let code = fs.readFileSync('src/pages/tenant/RiskEngine.jsx', 'utf8');

const hookCode = `
import rulesService from '../../services/rulesService';
import authService from '../../services/authService';
import { createContext, useContext, useEffect, useState } from 'react';

const RiskEngineContext = createContext({
  data: {},
  update: () => {},
});

function useEngineState(key, initialValue) {
  const { data, update } = useContext(RiskEngineContext);
  const val = data[key] !== undefined ? data[key] : initialValue;
  const setVal = (newVal) => {
    update(key, typeof newVal === 'function' ? newVal(val) : newVal);
  };
  return [val, setVal];
}
`;

code = code.replace(/import\s*\{\s*useState\s*\}\s*from\s*"react";/, hookCode);

// Replace useState with useEngineState except for specific variables (open, saved, simulating, loading)
code = code.replace(/const\s+\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s*=\s*useState\(([\s\S]*?)\);/g, (match, stateVar, stateSetter, initValue) => {
    if (['open', 'saved', 'simulating', 'loading', 'data', 'tenantId', 'ruleId'].includes(stateVar)) {
        return `const [${stateVar}, ${stateSetter}] = useState(${initValue});`;
    }
    return `const [${stateVar}, ${stateSetter}] = useEngineState('${stateVar}', ${initValue});`;
});

// Update the main Rules component to be the Provider
code = code.replace(/export default function Rules\(\)\s*\{[\s\S]*?return \(/, `export default function Rules() {
  const [saved, setSaved] = useState(false);
  const [simulating, setSimulating] = useState(false);
  
  const [data, setData] = useState({});
  const [tenantId, setTenantId] = useState(null);
  const [ruleId, setRuleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = authService.getTenantIdFromToken() || sessionStorage.getItem("tenant_id") || "1";
    setTenantId(t);
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    rulesService.getConfig(tenantId).then((res) => {
      if (res) {
        setRuleId(res.id);
        setData(res.config?.riskEngine || {});
      }
      setLoading(false);
    });
  }, [tenantId]);

  const update = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSimulating(true);
    try {
      const res = await rulesService.getConfig(tenantId);
      const existingConfig = res?.config || {};
      const payload = { ...existingConfig, riskEngine: data };
      await rulesService.saveConfig(res?.id || null, payload, tenantId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch(e) {
      console.error(e);
      alert('Failed to save');
    }
    setSimulating(false);
  };

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2000);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Configuration...</div>;

  return (
    <RiskEngineContext.Provider value={{ data, update }}>
`);

// Add closing context provider tag
code = code.replace(/<p className="text-center text-xs text-slate-400 mt-6">\s*Rules are versioned and time-stamped on publish\. Simulate before going live\.\s*<\/p>\s*<\/div>\s*\);\s*\}/, `
      <p className="text-center text-xs text-slate-400 mt-6">
        Rules are versioned and time-stamped on publish. Simulate before going live.
      </p>
    </div>
    </RiskEngineContext.Provider>
  );
}`);

fs.writeFileSync('src/pages/tenant/RiskEngine.jsx', code);
console.log('Successfully refactored RiskEngine.jsx');
