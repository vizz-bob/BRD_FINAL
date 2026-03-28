import React from 'react';
import { Info, Target, LayoutGrid, Check } from 'lucide-react';

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
      {/* Campaign Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2 text-indigo-600" />
          Campaign Title <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={formData.campaignTitle || ''}
          onChange={(e) => handleChange('campaignTitle', e.target.value)}
          placeholder="e.g., WhatsApp Q1 Home Loan Promotion"
          className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            errors.campaignTitle ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.campaignTitle && <p className="text-red-500 text-xs mt-1 font-medium">{errors.campaignTitle}</p>}
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



      {/* Audience Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2 text-indigo-600" />
          Target Audience <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audienceGroups.map((group) => {
            const isSelected = (formData.targetAudience || []).includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleAudienceGroup(group.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-100 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.count.toLocaleString()} contacts</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.targetAudience && <p className="text-red-500 text-xs mt-2 font-medium">{errors.targetAudience}</p>}
      </div>

      {/* Summary Helper */}
      {formData.targetAudience?.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total potential reach: 
            <span className="font-bold text-gray-900 ml-1">
              {audienceGroups
                .filter(g => formData.targetAudience.includes(g.id))
                .reduce((sum, g) => sum + g.count, 0)
                .toLocaleString()}
            </span>
          </div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {formData.targetAudience.length} Groups Selected
          </div>
        </div>
      )}
    </div>
  );
};

export default StepOne;