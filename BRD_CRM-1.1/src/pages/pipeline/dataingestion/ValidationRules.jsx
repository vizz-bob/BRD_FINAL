import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Fingerprint, Trash2, Save } from 'lucide-react';

const ValidationRules = () => {
  const [rules, setRules] = useState({
    requireName: true,
    requirePhone: true,
    requireEmail: true,
    blockBlacklisted: true,
    dedupeMobile: true,
    dedupeEmail: false
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Validation Engine Configuration</h3>
        <p className="text-sm text-gray-500">Define the strict hygiene checks leads must pass before entering Stage 2.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mandatory Field Checks */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-indigo-600" size={20} />
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mandatory Fields</h4>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4">
            {[
              { id: 'requireName', label: 'Full Name', desc: 'Reject leads missing a name' },
              { id: 'requirePhone', label: 'Phone Number', desc: 'Primary contact verification' },
              { id: 'requireEmail', label: 'Email Address', desc: 'Electronic contact verification' }
            ].map(rule => (
              <div key={rule.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{rule.label}</p>
                  <p className="text-xs text-gray-400">{rule.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rules[rule.id]} 
                    onChange={() => setRules({...rules, [rule.id]: !rules[rule.id]})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Deduplication Logic */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint className="text-indigo-600" size={20} />
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Deduplication Logic</h4>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Mobile Number Dedupe</p>
                <p className="text-xs text-gray-400">Check for existing phone numbers</p>
              </div>
              <input 
                type="checkbox" 
                checked={rules.dedupeMobile} 
                onChange={() => setRules({...rules, dedupeMobile: !rules.dedupeMobile})}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Email Dedupe</p>
                <p className="text-xs text-gray-400">Check for existing email addresses</p>
              </div>
              <input 
                type="checkbox" 
                checked={rules.dedupeEmail} 
                onChange={() => setRules({...rules, dedupeEmail: !rules.dedupeEmail})}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Handling */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-red-100 rounded-xl">
          <AlertOctagon className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-red-900">Rejection Criteria Handling</h4>
          <p className="text-xs text-red-700 mt-1 leading-relaxed">
            Leads failing these checks will be moved to the <strong>Rejected Pool</strong> and will not enter Stage 2. 
            This ensures your sales funnel remains free of invalid or blacklisted data.
          </p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 shadow-sm transition-all">
          Clean Raw Pool Now
        </button>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
          <Save size={18} />
          Save Validation Logic
        </button>
      </div>
    </div>
  );
};

export default ValidationRules;