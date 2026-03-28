import React from 'react';
import { Eye, Upload, X, FileText, Image, Info } from 'lucide-react';

const StepTwo = ({ formData, setFormData, errors }) => {

  // const emailTemplates = [
  //   { id: 'tpl_professional', name: 'Professional Blue' },
  //   { id: 'tpl_modern', name: 'Modern Gradient' },
  //   { id: 'tpl_minimal', name: 'Minimal White' },
  // ];

  const emailTemplates = [
  { id: 'professional_blue', name: 'Professional Blue' },
  { id: 'modern_gradient', name: 'Modern Gradient' },
  { id: 'minimal_white', name: 'Minimal White' },
];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const existing = formData.attachments || [];

    const updated = [
      ...existing,
      ...files.map(file => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
      })),
    ];

    handleChange('attachments', updated);
  };

  const removeAttachment = (id) => {
    handleChange(
      'attachments',
      (formData.attachments || []).filter(f => f.id !== id)
    );
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <Image size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="space-y-6">

      {/* Template */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Email Template <span className="text-red-500">*</span>
        </label>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emailTemplates.map(tpl => {
            const selected = formData.call_script === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleChange('call_script', tpl.id)}
                className={`p-4 border-2 rounded-lg text-left ${
                  selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{tpl.name}</p>
                  <Eye size={16} className="text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        {errors.call_script && (
          <p className="text-red-500 text-sm mt-2">{errors.call_script}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Subject Line <span className="text-red-500">*</span>
        </label>
        <input
          value={formData.subject || ''}
          onChange={(e) => handleChange('subject', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Exclusive Home Loan Offer"
          maxLength={100}
        />
        {errors.subject && (
          <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
        )}
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Preview Text
        </label>
        <input
          value={formData.preview_text || ''}
          onChange={(e) => handleChange('preview_text', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-gray-300"
          maxLength={150}
        />
      </div>

      {/* Sender */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Sender Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.sender_email || ''}
          onChange={(e) => handleChange('sender_email', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.sender_email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Sender Name
        </label>
        <input
          value={formData.sender_name || ''}
          onChange={(e) => handleChange('sender_name', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-gray-300"
        />
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium mb-2">Attachments</label>

        <label className="border-2 border-dashed p-6 rounded-lg text-center block cursor-pointer">
          <Upload className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Upload files</p>
          <input
            type="file"
            multiple
            hidden
            onChange={handleFileUpload}
          />
        </label>

        {formData.attachments?.length > 0 && (
          <div className="mt-3 space-y-2">
            {formData.attachments.map(file => (
              <div
                key={file.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div className="flex gap-2 items-center">
                  {getFileIcon(file.type)}
                  <span className="text-sm">{file.name}</span>
                </div>
                <button onClick={() => removeAttachment(file.id)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-800">
        💡 Use tags like <code>{'{{firstName}}'}</code>, <code>{'{{loanAmount}}'}</code> for personalization
      </div>
    </div>
  );
};

export default StepTwo;
