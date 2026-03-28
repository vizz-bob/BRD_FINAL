import React from 'react';
import { Users, PhoneCall, RotateCcw, FileText, Check } from 'lucide-react';

const StepTwo = ({ formData, setFormData, errors }) => {
  const dialerTypes = [
    { id: 'preview', name: 'Preview Dialer', desc: 'Agent reviews info before calling' },
    { id: 'progressive', name: 'Progressive Dialer', desc: 'Calls automatically when agent is free' },
    { id: 'predictive', name: 'Predictive Dialer', desc: 'Uses AI to predict agent availability' },
  ];

  const agents = [
  { id: 'team_alpha', name: 'Team Alpha', members: 5 },
  { id: 'team_beta', name: 'Team Beta', members: 8 },
  { id: 'external_agency', name: 'External Agency', members: 12 },
];

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleAgent = (agentId) => {
    const current = formData.agent_assignment || [];
    const updated = current.includes(agentId)
      ? current.filter(id => id !== agentId)
      : [...current, agentId];
    handleChange('agent_assignment', updated);
  };

  const handleFileChange = (e) => {
    handleChange('call_script', e.target.files[0]);
  };

  return (
    <div className="space-y-8">
      {/* Dialer Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Dialer Type</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dialerTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleChange('dialer_type', type.id)}
              className={`p-4 border rounded-xl text-left transition-all ${
                formData.dialer_type === type.id
                  ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <PhoneCall className={`w-6 h-6 mb-2 ${formData.dialer_type === type.id ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="font-semibold text-gray-900">{type.name}</p>
              <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
            </button>
          ))}
        </div>
        {errors.dialer_type && <p className="mt-2 text-sm text-red-500">{errors.dialer_type}</p>}
      </div>

      {/* Retry Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Retry Attempts</label>
          <div className="flex items-center space-x-3 bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
            <RotateCcw className="w-5 h-5 text-gray-400" />
            <select
              value={formData.retry_attempts || ''}
              onChange={(e) => handleChange('retry_attempts', e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm text-gray-900"
            >
              <option value="">Select Retry Attempts</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Attempt' : 'Attempts'}</option>
              ))}
            </select>
          </div>
          {errors.retry_attempts && <p className="text-red-500 text-sm mt-1">{errors.retry_attempts}</p>}
        </div>

        {/* Agent Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Assign Agent Groups <span className="text-gray-400 font-normal">(Select Multiple)</span>
          </label>
          <div className="space-y-2">
            {agents.map(agent => {
              const isSelected = (formData.agent_assignment || []).includes(agent.id);
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => toggleAgent(agent.id)}
                  className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${
                    isSelected ? 'border-indigo-600 bg-indigo-100 ring-1 ring-indigo-600' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${isSelected ? 'text-indigo-600' : 'text-gray-900'}`}>{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.members} agents available</p>
                    </div>
                  </div>
                  <Users className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>
          {errors.agent_assignment && <p className="mt-2 text-sm text-red-500">{errors.agent_assignment}</p>}
        </div>
      </div>

      {/* Call Script Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Call Script</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        {formData.call_script && <p className="text-xs text-gray-500 mt-1">Selected: {formData.call_script.name}</p>}
        {errors.call_script && <p className="text-red-500 text-sm mt-1">{errors.call_script}</p>}
      </div>
    </div>
  );
};

export default StepTwo;
