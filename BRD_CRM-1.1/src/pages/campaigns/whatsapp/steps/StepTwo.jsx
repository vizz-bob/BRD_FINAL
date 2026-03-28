import React, { useState } from 'react';
import { Eye, Image, Info, FileText, X } from 'lucide-react';

const StepTwo = ({ formData, setFormData, errors }) => {
  const [showPreview, setShowPreview] = useState(false);
  const templates = [
    { id: 'offer-1', name: 'Flash Sale Template', type: 'Transactional' },
    { id: 'remind-1', name: 'EMI Reminder', type: 'Utility' },
    { id: 'greet-1', name: 'Welcome Message', type: 'Marketing' },
  ];

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Template <span className="text-red-500 ml-1">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleChange('whatsappTemplate', t.id)}
              className={`p-4 border-2 rounded-lg text-left ${formData.whatsappTemplate === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
            >
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-gray-500">{t.type}</p>
            </button>
          ))}
        </div>
        {errors.whatsappTemplate && <p className="text-red-500 text-s mt-1 font-medium">{errors.whatsappTemplate}</p>}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium">Message Body <span className="text-red-500 ml-1">*</span></label>
          <button onClick={() => setShowPreview(!showPreview)} className="text-green-600 text-xs flex items-center gap-1">
            <Eye className="w-4 h-4" /> {showPreview ? 'Hide Preview' : 'Show Mobile Preview'}
          </button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <textarea
              value={formData.messageBody || ''}
              onChange={(e) => handleChange('messageBody', e.target.value)}
              rows={4}
              className={`w-full p-3 border rounded-lg focus:ring-green-500 ${errors.messageBody ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Hi {{name}}, we have a special offer for you..."
            />
            {errors.messageBody && <p className="text-red-500 text-s mt-1 font-medium">{errors.messageBody}</p>}
          </div>
          {showPreview && (
            <div className="hidden md:block w-64 bg-gray-100 rounded-xl p-3 border-8 border-gray-800 relative">
              <div className="bg-[#E5DDD5] h-64 rounded p-2 overflow-y-auto">
                <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs">
                  {formData.messageBody || 'Your message will appear here...'}
                  <p className="text-[10px] text-right text-gray-400 mt-1">12:00 PM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwo;