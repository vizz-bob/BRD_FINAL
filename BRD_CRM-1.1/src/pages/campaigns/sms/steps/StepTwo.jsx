import React from 'react';
import { Smartphone, Layout, Info, CheckCircle2 } from 'lucide-react';

const StepTwo = ({ formData, setFormData, errors }) => {
  const templates = [
  { id: 'promo_1', name: 'Flash Sale', content: 'Flash Sale! Get 20% off...' },
  { id: 'remind_1', name: 'Follow-up', content: 'Hi {{firstName}}, following up...' },
  { id: 'alert_1', name: 'Rate Alert', content: 'Good news! Interest rates...' },
];

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      messageContent: template.content,
      smsTemplate: template.id
    }));
  };

  const charCount = (formData.messageContent || '').length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Layout className="w-4 h-4 mr-2 text-indigo-600" />
          Choose SMS Template <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t)}
              className={`p-4 border-2 rounded-xl text-left transition-all relative ${
                formData.smsTemplate === t.id
                  ? 'border-indigo-500 bg-indigo-100'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              {formData.smsTemplate === t.id && (
                <CheckCircle2 className="w-4 h-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <p className="text-sm font-bold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{t.content}</p>
            </button>
          ))}
        </div>
        {errors.smsTemplate && <p className="text-red-500 text-xs mt-2 font-medium">{errors.smsTemplate}</p>}
      </div>

      {/* Sender & Message */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID / Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.senderId || ''}
              onChange={(e) => handleChange('senderId', e.target.value)}
              placeholder="e.g., LENDCO or +12345678"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.senderId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.senderId && <p className="text-red-500 text-xs mt-1">{errors.senderId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message Content <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              value={formData.messageContent || ''}
              onChange={(e) => handleChange('messageContent', e.target.value)}
              placeholder="Hi {{firstName}}, your loan is approved..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none ${errors.messageContent ? 'border-red-500' : 'border-gray-300'}`}
            />
            <div className="flex justify-between mt-2 px-1">
              <span className={`text-xs font-medium ${charCount > 160 ? 'text-orange-600' : 'text-gray-500'}`}>
                {charCount} characters
              </span>
              <span className="text-xs text-gray-500">
                {smsSegments} SMS Segment{smsSegments > 1 ? 's' : ''}
              </span>
            </div>
            {errors.messageContent && <p className="text-red-500 text-xs mt-1">{errors.messageContent}</p>}
          </div>

          <div className="bg-indigo-100 p-3 rounded-lg flex items-start space-x-2">
            <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
            <p className="text-xs text-indigo-700">
              Use tags like <code className="bg-white px-1 rounded">{"{{firstName}}"}</code> or <code className="bg-white px-1 rounded">{"{{product}}"}</code> for personalization.
            </p>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Device Preview</p>
          <div className="relative w-64 h-[420px] bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#333] rounded-b-2xl z-20"></div>
            <div className="bg-white h-full p-4 pt-12">
              <div className="flex flex-col space-y-2">
                <div className="self-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-[10px] text-center mt-1 text-gray-500">{formData.senderId || 'Sender'}</p>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 text-[11px] text-gray-800 break-words shadow-sm">
                  {formData.messageContent || 'Compose your message to see a preview...'}
                </div>
                <p className="text-[9px] text-gray-400 ml-1">Delivered • Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
