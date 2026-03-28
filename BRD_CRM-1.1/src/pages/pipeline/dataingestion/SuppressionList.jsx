import React, { useEffect, useState } from 'react';
import { ShieldX, Search, Download, Trash2, UserMinus, AlertCircle } from 'lucide-react';
import { suppressionListService } from '../../../services/pipelineService';

const SuppressionList = () => {

  const [search, setSearch] = useState("");


  const [list, setList] = useState([]);

  const formatSuppressionReason = (reason) => {
    if (!reason) return "Unknown";

    return reason
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const mapSuppression = (item) => ({
    id: item.id,
    name: item.name,
    contact: item.contact || item.email,
    reason: formatSuppressionReason(item.suppression_reason),
    date: item.blocked_date,
  });

  const [listData, setListData] = useState(list);

  const fetchSuppressionList = async () => {
    try {
      const res = await suppressionListService.list();
      const mapped = res.data.map(mapSuppression);
      setListData(mapped);
    }
    catch (error) {
      console.error("Error fetching suppression list:", error);
    }
  }

  useEffect(() => {
    fetchSuppressionList();
  }, []);

  const filteredList = listData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.contact.toLowerCase().includes(search.toLowerCase()) ||
    item.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await suppressionListService.delete(id);
      fetchSuppressionList();
    } catch (error) {
      console.error("Error deleting suppression item:", error);
    }
  };



  return (
    <div className="p-8">
      {/* Warning Banner */}
      <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start gap-4">
        <AlertCircle className="text-amber-600 mt-1" size={24} />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Active Suppression Protocol</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Leads in this list are programmatically blocked from all Dialer, SMS, and Email campaigns.
            To move a lead back to the active pool, explicit physical consent documentation is required.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search suppressed contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Download size={16} /> Export List
        </button>
      </div>

      {/* Suppression Table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Contact Detail</th>
              <th className="px-6 py-4">Suppression Reason</th>
              <th className="px-6 py-4">Blocked Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredList.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-sm text-gray-400"
                >
                  No suppressed contacts found
                </td>
              </tr>
            )}

            {filteredList.map((item) => (
              <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-full">
                      <UserMinus size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.contact}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 uppercase">
                    <ShieldX size={10} /> {item.reason}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                  {item.date}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Remove Suppression">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Counter */}
      <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
        <p>Showing {filteredList.length} suppressed records</p>
        <p className="font-medium italic">Compliant with DPDP Regulation 2025</p>
      </div>
    </div>
  );
};

export default SuppressionList;