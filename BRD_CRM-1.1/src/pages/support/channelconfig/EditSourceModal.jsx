import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditSourceModal = ({ channel, onClose, onEdit }) => {
  const [routing, setRouting] = useState(channel.routing);
  const [priority, setPriority] = useState(channel.priority);

  const handleSubmit = () => {
    onEdit({
      ...channel,
      routing,
      priority
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            Modify {channel.name}
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">

          <div>
            <label className="text-xs font-bold">Operational Routing</label>
            <select
              value={routing}
              onChange={(e) => setRouting(e.target.value)}
              className="w-full p-3 bg-gray-50 border rounded-xl"
            >
              <option>Telecallers</option>
              <option>Field Agents</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold">Priority Logic</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 bg-gray-50 border rounded-xl"
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>

        </div>

        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1">Cancel</button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Save size={18} /> Update Reservoir
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditSourceModal;