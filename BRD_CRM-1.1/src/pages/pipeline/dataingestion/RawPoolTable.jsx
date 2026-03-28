import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserPlus, Filter, Search, MoreHorizontal, CheckCircle, User } from 'lucide-react';
import { rawLeadService, rawLeadsPoolService } from '../../../services/pipelineService';

const RawPoolTable = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const filterRef = useRef(null);


  const agents = [
    { id: 'a1', name: 'Agent A' },
    { id: 'a2', name: 'Agent B' },
    { id: 'a3', name: 'Agent C' }
  ];

  const [rawLeads, setRawLeads] = useState([]);

  const fetchRawLeads = async () => {
    try{
      const res = await rawLeadsPoolService.list();
      const mappedData = res.data.map(item => ({
        id: item.id,
        name: item.name,
        lead: item.lead,
        contact: item.phone_number || item.email,
        source: item.source === "csv" ? "CSV Upload" : item.source,
        status: item.validation_status.charAt(0).toUpperCase() + 
                item.validation_status.slice(1),
        date: item.ingested_at
      }));
      setRawLeads(mappedData);
    }
    catch(error){
      console.error("Error fetching raw leads:", error);
    }
  }

  useEffect(() => {
    fetchRawLeads();
  },[])

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [statusFilters, setStatusFilters] = useState(new Set());
  const [sourceFilters, setSourceFilters] = useState(new Set());

  const sources = useMemo(() => [...new Set(rawLeads.map(r => r.source))], []);
  const statuses = useMemo(() => [...new Set(rawLeads.map(r => r.status))], []);

  const toggleStatus = (s) => {
    setStatusFilters(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const toggleSource = (s) => {
    setSourceFilters(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const filteredLeads = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rawLeads.filter(lead => {
      if (q) {
        const hay = `${lead.name} ${lead.contact} ${lead.source}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilters.size > 0 && !statusFilters.has(lead.status)) return false;
      if (sourceFilters.size > 0 && !sourceFilters.has(lead.source)) return false;
      return true;
    });
  }, [rawLeads, searchTerm, statusFilters, sourceFilters]);

  const visibleLeadIds = filteredLeads.map(lead => lead.id);

  const isAllSelected = visibleLeadIds.length > 0 && visibleLeadIds.every(id => selectedLeads.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect only visible rows
      setSelectedLeads(prev =>
        prev.filter(id => !visibleLeadIds.includes(id))
      );
    } else {
      // Select all visible rows (avoid duplicates)
      setSelectedLeads(prev =>
        Array.from(new Set([...prev, ...visibleLeadIds]))
      );
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setShowFilterOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const convertAgent = (value) => {
      if (!value) return null;

      const number = parseInt(value.slice(1), 10); 
      const letter = String.fromCharCode(96 + number); 

      return `agent_${letter}`;
    };

  const handleAssignToAgent = async (agentId, leadIds) => {
    try{
      await Promise.all(leadIds.map(id => rawLeadsPoolService.patch(id, { assigned_to: convertAgent(agentId) })));
      fetchRawLeads();
    }
    catch(error){
      console.error("Error assigning leads to agent:", error);
    }
  }


  const toggleSelect = (id) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMoveToStage2 = async (leadIds) => {
  try {
    const leadsToMove = rawLeads.filter(lead =>
      leadIds.includes(lead.id)
    );

    await Promise.all(
      leadsToMove.map(async (lead) => {
        
        await rawLeadService.create({
          lead: lead.lead,
          contact_name: lead.name,
          vendor_source: lead.source,
          phone: lead.contact,
          status: "new",
          last_activity: null,
          is_duplicate: lead.status === "Duplicate",
          is_stagnant: false,
        });

        await rawLeadsPoolService.delete(lead.id);
      })
    );

    setSelectedLeads([]);
    fetchRawLeads();

  } catch (error) {
    console.error("Error moving leads to stage 2:", error);
  }
};
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search raw pool by name, phone or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div ref={filterRef} className="relative">
            <button 
              onClick={() => setShowFilterOptions(!showFilterOptions)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                showFilterOptions || statusFilters.size > 0 || sourceFilters.size > 0
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} /> Filter
              {(statusFilters.size > 0 || sourceFilters.size > 0) && (
                <span className="ml-1 px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                  {statusFilters.size + sourceFilters.size}
                </span>
              )}
            </button>
            
            {showFilterOptions && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm">Filters</h4>
                  {(statusFilters.size > 0 || sourceFilters.size > 0) && (
                    <button 
                      onClick={() => {
                        setStatusFilters(new Set());
                        setSourceFilters(new Set());
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                    <div className="space-y-2">
                      {statuses.map(status => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                          <input 
                            type="checkbox" 
                            checked={statusFilters.has(status)}
                            onChange={() => toggleStatus(status)}
                            className="rounded border-gray-300 text-indigo-600"
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Source</p>
                    <div className="space-y-2">
                      {sources.map(source => (
                        <label key={source} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                          <input 
                            type="checkbox" 
                            checked={sourceFilters.has(source)}
                            onChange={() => toggleSource(source)}
                            className="rounded border-gray-300 text-indigo-600"
                          />
                          <span className="text-sm">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            disabled={selectedLeads.length === 0}
            onClick={() => setShowAgentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
          >
            <UserPlus size={16} /> Assign to Agent
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b">
                <input 
                type="checkbox" 
                checked={isAllSelected} 
                onChange={toggleSelectAll} 
                className="rounded border-gray-300 text-indigo-600" />
              </th>
              <th className="px-4 py-3 border-b">Lead Details</th>
              <th className="px-4 py-3 border-b">Source</th>
              <th className="px-4 py-3 border-b">Validation Status</th>
              <th className="px-4 py-3 border-b">Ingested At</th>
              <th className="px-4 py-3 border-b"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className={`hover:bg-indigo-50/30 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-indigo-50' : ''}`}>
                <td className="px-4 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                    className="rounded border-gray-300 text-indigo-600" 
                  />
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-bold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.contact}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{lead.source}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
                    lead.status === 'Verified' ? 'text-green-600 bg-green-50 border-green-100' :
                    lead.status === 'Duplicate' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                    'text-red-600 bg-red-50 border-red-100'
                  }`}>
                    {lead.status === 'Verified' && <CheckCircle size={12} />}
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs text-gray-500">{lead.date}</td>
                <td className="px-4 py-4 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedLeads.length > 0 && (
        <div className="mt-4 p-3 bg-indigo-600 rounded-xl flex items-center justify-between text-white animate-in slide-in-from-bottom-2">
          <p className="text-sm font-medium">{selectedLeads.length} leads selected for movement to Stage 2</p>
          <button onClick={() => handleMoveToStage2(selectedLeads)} className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30">MOVE NOW</button>
        </div>
      )}

      {/* Agent Assign Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAgentModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Assign to Agent</h3>
              <button onClick={() => setShowAgentModal(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {agents.map(agent => (
                <label key={agent.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="agent" checked={selectedAgent === agent.id} onChange={() => setSelectedAgent(agent.id)} className="rounded border-gray-300" />
                  <User className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500">Capacity: 120 leads</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAgentModal(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={() => {
                if (!selectedAgent) { alert('Select an agent first'); return; }
                alert(`${selectedLeads.length} leads assigned to ${agents.find(a => a.id===selectedAgent).name}`);
                setSelectedLeads([]);
                setSelectedAgent(null);
                setShowAgentModal(false);
                handleAssignToAgent(selectedAgent, selectedLeads);
              }} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawPoolTable;




// import React, { useState, useMemo } from 'react';
// import { UserPlus, Filter, Search, MoreHorizontal, CheckCircle, User } from 'lucide-react';

// const RawPoolTable = () => {
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [showAgentModal, setShowAgentModal] = useState(false);
//   const [selectedAgent, setSelectedAgent] = useState(null);

//   const agents = [
//     { id: 'a1', name: 'Agent A' },
//     { id: 'a2', name: 'Agent B' },
//     { id: 'a3', name: 'Agent C' }
//   ];

//   const rawLeads = [
//     { id: 101, name: "Rahul Verma", contact: "+91 98765-43210", source: "CSV Upload", status: "Verified", date: "2025-12-31" },
//     { id: 102, name: "Sita Kumari", contact: "sita.k@email.com", source: "API - JustDial", status: "Duplicate", date: "2025-12-30" },
//     { id: 103, name: "John Doe", contact: "+91 77665-54433", source: "Manual Entry", status: "Verified", date: "2025-12-31" },
//     { id: 104, name: "Priya Singh", contact: "priya@social.com", source: "FB Campaign", status: "Incomplete", date: "2025-12-29" },
//   ];

//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilterOptions, setShowFilterOptions] = useState(false);
//   const [statusFilters, setStatusFilters] = useState(new Set());
//   const [sourceFilters, setSourceFilters] = useState(new Set());

//   const sources = useMemo(() => [...new Set(rawLeads.map(r => r.source))], []);
//   const statuses = useMemo(() => [...new Set(rawLeads.map(r => r.status))], []);

//   const toggleStatus = (s) => {
//     setStatusFilters(prev => {
//       const next = new Set(prev);
//       if (next.has(s)) next.delete(s); else next.add(s);
//       return next;
//     });
//   };

//   const toggleSource = (s) => {
//     setSourceFilters(prev => {
//       const next = new Set(prev);
//       if (next.has(s)) next.delete(s); else next.add(s);
//       return next;
//     });
//   };

//   const filteredLeads = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return rawLeads.filter(lead => {
//       if (q) {
//         const hay = `${lead.name} ${lead.contact} ${lead.source}`.toLowerCase();
//         if (!hay.includes(q)) return false;
//       }
//       if (statusFilters.size > 0 && !statusFilters.has(lead.status)) return false;
//       if (sourceFilters.size > 0 && !sourceFilters.has(lead.source)) return false;
//       return true;
//     });
//   }, [rawLeads, searchTerm, statusFilters, sourceFilters]);

//   const toggleSelect = (id) => {
//     setSelectedLeads(prev => 
//       prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search raw pool by name, phone or source..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
//             <Filter size={16} /> Filter
//           </button>
//           <button 
//             disabled={selectedLeads.length === 0}
//             onClick={() => setShowAgentModal(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
//           >
//             <UserPlus size={16} /> Assign to Agent
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
//             <tr>
//               <th className="px-4 py-3 border-b">
//                 <input type="checkbox" className="rounded border-gray-300 text-indigo-600" />
//               </th>
//               <th className="px-4 py-3 border-b">Lead Details</th>
//               <th className="px-4 py-3 border-b">Source</th>
//               <th className="px-4 py-3 border-b">Validation Status</th>
//               <th className="px-4 py-3 border-b">Ingested At</th>
//               <th className="px-4 py-3 border-b"></th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filteredLeads.map((lead) => (
//               <tr key={lead.id} className={`hover:bg-indigo-50/30 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-indigo-50' : ''}`}>
//                 <td className="px-4 py-4">
//                   <input 
//                     type="checkbox" 
//                     checked={selectedLeads.includes(lead.id)}
//                     onChange={() => toggleSelect(lead.id)}
//                     className="rounded border-gray-300 text-indigo-600" 
//                   />
//                 </td>
//                 <td className="px-4 py-4">
//                   <p className="text-sm font-bold text-gray-900">{lead.name}</p>
//                   <p className="text-xs text-gray-500">{lead.contact}</p>
//                 </td>
//                 <td className="px-4 py-4">
//                   <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{lead.source}</span>
//                 </td>
//                 <td className="px-4 py-4">
//                   <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
//                     lead.status === 'Verified' ? 'text-green-600 bg-green-50 border-green-100' :
//                     lead.status === 'Duplicate' ? 'text-amber-600 bg-amber-50 border-amber-100' :
//                     'text-red-600 bg-red-50 border-red-100'
//                   }`}>
//                     {lead.status === 'Verified' && <CheckCircle size={12} />}
//                     {lead.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-4 text-xs text-gray-500">{lead.date}</td>
//                 <td className="px-4 py-4 text-right">
//                   <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
//                     <MoreHorizontal size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       {selectedLeads.length > 0 && (
//         <div className="mt-4 p-3 bg-indigo-600 rounded-xl flex items-center justify-between text-white animate-in slide-in-from-bottom-2">
//           <p className="text-sm font-medium">{selectedLeads.length} leads selected for movement to Stage 2</p>
//           <button onClick={() => alert('Leads are moved to raw leads.')} className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30">MOVE NOW</button>
//         </div>
//       )}

//       {/* Agent Assign Modal */}
//       {showAgentModal && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/40" onClick={() => setShowAgentModal(false)} />
//           <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-50">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold">Assign to Agent</h3>
//               <button onClick={() => setShowAgentModal(false)} className="text-gray-500 hover:text-gray-700">Close</button>
//             </div>
//             <div className="space-y-3 max-h-64 overflow-y-auto">
//               {agents.map(agent => (
//                 <label key={agent.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
//                   <input type="radio" name="agent" checked={selectedAgent === agent.id} onChange={() => setSelectedAgent(agent.id)} className="rounded border-gray-300" />
//                   <User className="text-indigo-600" />
//                   <div>
//                     <p className="text-sm font-medium">{agent.name}</p>
//                     <p className="text-xs text-gray-500">Capacity: 120 leads</p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button onClick={() => setShowAgentModal(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
//               <button onClick={() => {
//                 if (!selectedAgent) { alert('Select an agent first'); return; }
//                 alert(`${selectedLeads.length} leads assigned to ${agents.find(a => a.id===selectedAgent).name}`);
//                 setSelectedLeads([]);
//                 setSelectedAgent(null);
//                 setShowAgentModal(false);
//               }} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">Assign</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RawPoolTable;