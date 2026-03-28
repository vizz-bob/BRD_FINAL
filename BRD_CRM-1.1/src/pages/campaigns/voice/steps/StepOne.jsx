import React from 'react';
import { Target, Users, LayoutGrid, Check, Info } from 'lucide-react';

const StepOne = ({ formData, setFormData, errors }) => {
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
  { id: 'home_loan', name: 'Home Loan Prospects', count: 312 },
  { id: 'business_owners', name: 'Business Owners', count: 178 },
  { id: 'recent_inquiries', name: 'Recent Inquiries', count: 95 },
];



  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAudienceGroup = (groupId) => {
    const currentGroups = formData.targetAudience || [];
    const newGroups = currentGroups.includes(groupId)
      ? currentGroups.filter(id => id !== groupId)
      : [...currentGroups, groupId];
    handleChange('targetAudience', newGroups);
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={formData.campaignTitle || ''}
          onChange={(e) => setFormData({ ...formData, campaignTitle: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.campaignTitle ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Payment Reminder March"
        />
        {errors.campaignTitle && <p className="text-red-500 text-xs mt-1">{errors.campaignTitle}</p>}
      </div>

      {/* Product Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product/Service <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.product || ''}
          onChange={(e) => handleChange('product', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.product ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a product...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.product && (
          <p className="text-red-500 text-sm mt-1">{errors.product}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          Link this campaign to a specific loan or service offering
        </p>
      </div>

      {/* Target Audience Groups */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Audience Groups <span className="text-red-500">*</span>
        </label>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-3 flex items-start space-x-2">
          <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-indigo-800">
            Select one or more lead segments to target. You can select multiple groups to maximize reach.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audienceGroups.map((group) => {
            const isSelected = (formData.targetAudience || []).includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleAudienceGroup(group.id)}
                className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.count} leads</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {errors.targetAudience && (
          <p className="text-red-500 text-sm mt-2">{errors.targetAudience}</p>
        )}
        
        {formData.targetAudience && formData.targetAudience.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">{formData.targetAudience.length}</span> audience group(s) selected • 
              <span className="font-medium ml-1">
                {audienceGroups
                  .filter(g => formData.targetAudience.includes(g.id))
                  .reduce((sum, g) => sum + g.count, 0)}
              </span> total leads will receive this campaign
            </p>
          </div>
        )}
      </div>





    </div>
  );
};

export default StepOne;