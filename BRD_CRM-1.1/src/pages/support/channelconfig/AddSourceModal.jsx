import React, { useState } from 'react';
import { X, Save, Database, PhoneCall, MapPin } from 'lucide-react';
import { createchannels } from '../../../services/roiService';

const AddSourceModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    channel_name: "",
    channel_type: "aggregator",
    Origin_type: "aggregator",
    Operational_valve: "telecaller",
    cost_per_lead: "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createchannels({
        ...formData,
        cost_per_lead: parseFloat(formData.cost_per_lead),
        integration_required: false,
        is_active: true
      });
      onClose();

    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to create channel");
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Configure New Reservoir</h3>
            <p className="text-xs text-gray-500 mt-1">Add a new lead source to the supply network.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source Name</label>
              <input value={formData.channel_name}
                onChange={(e) => handleChange("channel_name", e.target.value)} type="text" placeholder="e.g., Google Ads" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Origin Type</label>
              <select value={formData.channel_type}
              onChange={(e) => handleChange("channel_type", e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none">
                <option>Aggregator</option>
                <option>Social Media</option>
                <option>Offline/Referral</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contractual CPL (ROI Metric)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 text-sm">₹</span>
              <input  value={formData.cost_per_lead}
              onChange={(e) => handleChange("cost_per_lead", e.target.value)} type="number" placeholder="Enter cost per lead" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" />
            </div>
          </div>

          {/* Operational Routing (Point 1 of your docs) */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operational Routing Valve</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleChange("Operational_valve", "telecaller")} className="flex items-center justify-center gap-2 p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl">
                <PhoneCall size={18} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-900">Telecallers</span>
              </button>
              <button onClick={() => handleChange("Operational_valve", "field agent")} className="flex items-center justify-center gap-2 p-4 border border-gray-100 bg-gray-50 rounded-2xl hover:bg-white transition-all">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-700">Field Agents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-white transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all">
            <Save size={18} /> Enable Source
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSourceModal;