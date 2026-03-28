import React from 'react';
import { Info } from 'lucide-react';

const StepOne = ({ formData, setFormData, errors }) => {
  const products = [
  { id: 'home_loan', name: 'Home Loan' },
  { id: 'personal_loan', name: 'Personal Loan' },
  { id: 'business_loan', name: 'Business Loan' },
  { id: 'car_loan', name: 'Car Loan' },
  { id: 'education_loan', name: 'Education Loan' },
];

const audienceGroups = [
  { id: 'warm_leads', name: 'Warm Leads', count: 1234 },
  { id: 'cold_leads', name: 'Cold Leads', count: 567 },
  { id: 'hot_leads', name: 'Hot Leads', count: 89 },
  { id: 'home_loan', name: 'Home Loan Prospects', count: 450 },
  { id: 'business_owners', name: 'Business Owners', count: 200 },
  { id: 'recent_inquiries', name: 'Recent Inquiries', count: 320 },
  { id: 'sms_subscribers', name: 'SMS Subscribers', count: 856 },
];

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleAudienceGroup = (groupId) => {
    const current = formData.targetAudience || [];
    const updated = current.includes(groupId) ? current.filter(id => id !== groupId) : [...current, groupId];
    handleChange('targetAudience', updated);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
        <input
          type="text"
          value={formData.campaignTitle || ''}
          onChange={(e) => handleChange('campaignTitle', e.target.value)}
          placeholder="e.g., Q1 Home Loan SMS Blast"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.campaignTitle ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.campaignTitle && <p className="text-red-500 text-xs mt-1">{errors.campaignTitle}</p>}
      </div>

      {/* Product */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Related Product</label>
        <select
          value={formData.product || ''}
          onChange={(e) => handleChange('product', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${errors.product ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select a Product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Target Audience Groups</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audienceGroups.map(group => (
            <button
              key={group.id}
              type="button"
              onClick={() => toggleAudienceGroup(group.id)}
              className={`flex items-center p-3 border rounded-lg transition-all ${
                (formData.targetAudience || []).includes(group.id)
                  ? 'bg-indigo-100 border-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{group.name}</p>
                <p className="text-xs text-gray-500">{group.count} contacts</p>
              </div>
            </button>
          ))}
        </div>
        {errors.targetAudience && <p className="text-red-500 text-xs mt-2">{errors.targetAudience}</p>}
      </div>
    </div>
  );
};

export default StepOne;
