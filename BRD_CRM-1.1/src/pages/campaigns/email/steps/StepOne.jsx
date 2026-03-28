import React from 'react';
import { Info } from 'lucide-react';

const StepOne = ({ formData, setFormData, errors }) => {
  // const products = [
  //   { id: 'home-loan', name: 'Home Loan' },
  //   { id: 'personal-loan', name: 'Personal Loan' },
  //   { id: 'business-loan', name: 'Business Loan' },
  //   { id: 'car-loan', name: 'Car Loan' },
  //   { id: 'education-loan', name: 'Education Loan' },
  // ];

  // // UI-only audience groups (IDs will be sent)
  // const audienceGroups = [
  //   { id: 'a1', name: 'Warm Leads', count: 234 },
  //   { id: 'a2', name: 'Cold Leads', count: 156 },
  //   { id: 'a3', name: 'Hot Leads', count: 89 },
  // ];

  const products = [
  { id: 'home_loan', name: 'Home Loan' },
  { id: 'personal_loan', name: 'Personal Loan' },
  { id: 'business_loan', name: 'Business Loan' },
  { id: 'car_loan', name: 'Car Loan' },
  { id: 'education_loan', name: 'Education Loan' },
];

const audienceGroups = [
  { id: 'warm_leads', name: 'Warm Leads', count: 234 },
  { id: 'cold_leads', name: 'Cold Leads', count: 156 },
  { id: 'hot_leads', name: 'Hot Leads', count: 89 },
];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleAudience = (id) => {
    const current = formData.agent_assignment || [];
    const updated = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];

    handleChange('agent_assignment', updated);
  };

  return (
    <div className="space-y-6">

      {/* Campaign Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Campaign Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.campaign_title || ''}
          onChange={(e) => handleChange('campaign_title', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.campaign_title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Summer Home Loan Campaign"
        />
        {errors.campaign_title && (
          <p className="text-red-500 text-sm mt-1">{errors.campaign_title}</p>
        )}
      </div>

      {/* Product */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Product <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.product || ''}
          onChange={(e) => handleChange('product', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.product ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.product && (
          <p className="text-red-500 text-sm mt-1">{errors.product}</p>
        )}
      </div>

      {/* Audience */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Target Audience <span className="text-red-500">*</span>
        </label>

        <div className="bg-indigo-50 p-3 rounded-lg mb-3 flex gap-2">
          <Info size={16} className="text-indigo-600 mt-0.5" />
          <p className="text-xs text-indigo-800">
            Select one or more audience groups for this campaign
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audienceGroups.map(group => {
            const selected = (formData.agent_assignment || []).includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleAudience(group.id)}
                className={`p-4 border-2 rounded-lg text-left ${
                  selected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200'
                }`}
              >
                <p className="font-medium">{group.name}</p>
                <p className="text-xs text-gray-500">{group.count} leads</p>
              </button>
            );
          })}
        </div>

        {errors.agent_assignment && (
          <p className="text-red-500 text-sm mt-2">{errors.agent_assignment}</p>
        )}
      </div>

    </div>
  );
};

export default StepOne;
