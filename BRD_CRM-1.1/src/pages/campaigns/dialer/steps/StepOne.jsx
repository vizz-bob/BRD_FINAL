import React from 'react';
import { Info, CheckCircle } from 'lucide-react';

const StepOne = ({ formData, setFormData, errors }) => {

  const audienceGroups = [
  { id: 'warm_leads', name: 'Warm Leads', count: 234 },
  { id: 'cold_leads', name: 'Cold Leads', count: 156 },
  { id: 'hot_leads', name: 'Hot Leads', count: 89 },
  { id: 'home_loan', name: 'Home Loan Prospects', count: 312 },      // matches TARGET_AUDIENCE_CHOICES
  { id: 'business_owners', name: 'Business Owners', count: 178 },
  { id: 'recent_inquiries', name: 'Recent Inquiries', count: 95 },
];

const products = [
  { id: 'home_loan', name: 'Home Loan' },
  { id: 'personal_loan', name: 'Personal Loan' },
  { id: 'business_loan', name: 'Business Loan' },
  { id: 'car_loan', name: 'Car Loan' },
  { id: 'education_loan', name: 'Education Loan' },
];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAudienceGroup = (groupId) => {
    const current = formData.target_audience || [];
    const updated = current.includes(groupId)
      ? current.filter(id => id !== groupId)
      : [...current, groupId];
    handleChange('target_audience', updated);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.campaign_title || ''}
          onChange={e => handleChange('campaign_title', e.target.value)}
          placeholder="e.g., Q1 Outbound Dialer Campaign"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.campaign_title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.campaign_title && (
          <p className="text-red-500 text-sm mt-1">{errors.campaign_title}</p>
        )}
      </div>

      {/* Product Selection (single-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product/Service <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.product || ''}
          onChange={e => handleChange('product', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.product ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.product && (
          <p className="text-red-500 text-sm mt-1">{errors.product}</p>
        )}
      </div>

      {/* Target Audience (multi-select via buttons) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Target Audience <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {audienceGroups.map(group => {
            const selected = (formData.target_audience || []).includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleAudienceGroup(group.id)}
                className={`flex items-center p-3 rounded-xl border transition-all duration-200 text-left ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                  }`}>
                    {selected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.count.toLocaleString()} leads</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.target_audience && (
          <p className="text-red-500 text-sm mt-2">{errors.target_audience}</p>
        )}
      </div>

      {/* Audience Summary */}
      {formData.target_audience?.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <Info className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm text-green-800 font-medium">Audience Summary</p>
            <p className="text-xs text-green-700">
              Selected {formData.target_audience.length} group(s). Total leads: {
                audienceGroups
                  .filter(g => formData.target_audience.includes(g.id))
                  .reduce((sum, g) => sum + g.count, 0)
                  .toLocaleString()
              }
            </p>
          </div>
        </div>
      )}

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['country', 'state', 'city'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`e.g., ${field === 'city' ? 'Mumbai' : field === 'state' ? 'Maharashtra' : 'India'}`}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors[field] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepOne;
