import { useState, useEffect } from "react";
import { MapPinIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import riskAPI from "../services/riskService";

export default function GeoFencingMap() {
  const [blockedZones, setBlockedZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newZone, setNewZone] = useState({ pincode: "", city: "", reason: "", risk_level: "High" });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await riskAPI.getBlockedZones();
      setBlockedZones(res.data);
    } catch (e) {
      console.error("Error fetching zones");
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async () => {
    if (!newZone.pincode || !newZone.city) return;
    try {
      await riskAPI.createBlockedZone(newZone); // 2. Post to API
      fetchZones(); // 3. Refresh list
      setNewZone({ pincode: "", city: "", reason: "", risk_level: "High" });
    } catch (e) { alert("Could not add zone"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;
    try {
      await riskAPI.deleteBlockedZone(id);
      fetchZones(); 
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            Negative Area Mapping
          </h3>
          <p className="text-xs text-slate-500 mt-1">Define geo-fences where lending is restricted.</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded border border-rose-200">
            {blockedZones.length} Active Zones
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Input Form */}
        <div className="p-6 border-r border-slate-100 bg-white space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Add Restricted Zone</h4>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Pincode</label>
            <input
              type="text"
              maxLength="6"
              className="w-full p-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              value={newZone.pincode}
              onChange={e => setNewZone({ ...newZone, pincode: e.target.value })}
              placeholder="e.g. 110059"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">City / Area Name</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              value={newZone.city}
              onChange={e => setNewZone({ ...newZone, city: e.target.value })}
              placeholder="e.g. Uttam Nagar"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Risk Level</label>
            <select
              className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none"
              value={newZone.risk_level}
              onChange={e => setNewZone({ ...newZone, risk_level: e.target.value })}
            >
              <option value="High">High (Manual Review)</option>
              <option value="Critical">Critical (Auto Reject)</option>
            </select>
          </div>

          <button
            onClick={handleAddZone}
            className="w-full py-2 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition flex justify-center items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" /> Add Zone
          </button>
        </div>

        {/* List & Map Placeholder */}
        <div className="col-span-2 p-6 bg-slate-50/50">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {blockedZones.map(zone => (
              <div key={zone.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${zone.risk_level === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
                    <ExclamationTriangleIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{zone.city} <span className="font-mono text-slate-400">({zone.pincode})</span></div>
                    <div className="text-xs text-slate-500 font-medium">{zone.reason || "Generic Risk"} • {zone.risk_level} Risk</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(zone.id)} className="text-slate-300 hover:text-rose-500 transition">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            {blockedZones.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No negative areas defined.</div>
            )}
          </div>

          {/* Visual Placeholder for a Real Map */}
          <div className="mt-6 h-32 bg-primary-50 rounded-xl border-2 border-dashed border-primary-100 flex items-center justify-center text-primary-300 font-bold text-xs uppercase tracking-widest">
            Interactive Map Visualization Component
          </div>
        </div>
      </div>
    </div>
  );
}
