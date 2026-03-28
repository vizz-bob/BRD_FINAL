import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// Ensure these components exist in src/components/
import LeadKanban from "./LeadKanban";
import LeadListView from "./LeadListView";
import LeadProfileDrawer from "./LeadProfileDrawer";
import BulkUploadModal from "./BulkUploadModal";
import AddLeadModal from "./AddLeadModal";
import { 
  MagnifyingGlassIcon, ChartBarIcon, TableCellsIcon, 
  UserPlusIcon, CloudArrowUpIcon 
} from "@heroicons/react/24/outline";

export default function PipelineManager() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("KANBAN");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleConvertLead = (lead) => {
    if (window.confirm(`Convert ${lead.name} to a Deal?`)) {
      navigate("/loan-applications/new-personal-loan", { 
        state: { prefill: { first_name: lead.name?.split(" ")[0], mobile_no: lead.mobile } } 
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* TOOLBAR */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
         
         {/* Search */}
         <div className="relative w-96">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Pipeline..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         {/* Actions */}
         <div className="flex gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setViewMode("KANBAN")} className={`p-2 rounded ${viewMode === 'KANBAN' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>
                <ChartBarIcon className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("LIST")} className={`p-2 rounded ${viewMode === 'LIST' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>
                <TableCellsIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2 text-xs font-bold uppercase text-slate-600 hover:text-slate-900">
               <CloudArrowUpIcon className="h-5 w-5" /> Import
            </button>
            <button onClick={() => setIsAddLeadOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-700">
               + Add Lead
            </button>
         </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
         {viewMode === "KANBAN" ? (
           <LeadKanban onLeadClick={setSelectedLead} searchTerm={searchTerm} />
         ) : (
           <LeadListView onLeadClick={setSelectedLead} searchTerm={searchTerm} />
         )}
      </div>

      {/* DRAWERS & MODALS */}
      <LeadProfileDrawer 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)}
        onConvert={handleConvertLead}
      />
      <BulkUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
    </div>
  );
}
