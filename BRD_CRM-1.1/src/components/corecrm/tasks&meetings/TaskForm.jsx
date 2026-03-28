import React, { useState, useEffect } from "react";
import { Phone, Mail, MessageCircle, Bell, Search } from "lucide-react";
import { getContacts, createTask } from "../../../services/coreCRMService";
import { getLeads } from "../../../services/dataAndLeads.service";

const TASK_TYPES = [
  { value: "call", label: "Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "reminder", label: "Reminder", icon: Bell },
];

const PRIORITY_LEVELS = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const TaskForm = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    taskType: initialData?.taskType || "call",
    title: initialData?.title || "",
    leadId: initialData?.leadId || "",
    leadName: initialData?.leadName || "",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || "",
    assignedTo: initialData?.assignedTo || "AGENT_A",
    notes: initialData?.notes || "",
    reminderBefore: 60,
  });

  const [leads, setLeads] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await getLeads({ search: leadSearch });
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    if (leadSearch) fetchLeads();
  }, [leadSearch]);
  const searchValue = leadSearch.toLowerCase();

  const filteredLeads = leads.filter((lead) =>
    lead?.name?.toLowerCase().includes(searchValue)
  );


  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLeadSelect = (lead) => {
    handleChange("leadId", lead.id);
    handleChange("leadName", lead.name);
    setLeadSearch(lead.name);
    setShowLeadDropdown(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.leadId || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Map frontend values to backend format
    const payload = {
      activity_type: "TASK",
      task_title: formData.title,
      task_type: formData.taskType.toUpperCase(),
      due_datetime: formData.dueDate,
      priority: formData.priority.toUpperCase(), // 'medium' -> 'MEDIUM'
      status: "PENDING", // always uppercase
      assigned_to: formData.assignedTo,
      related_object_type: "Lead",
      related_object_id: formData.leadId,
      task_notes: formData.notes,
      lead: formData.leadId
    };

    try {
      await createTask(payload);
      alert("Task created successfully");
      onSuccess(payload);
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  const generateTitle = () => {
    if (!formData.leadName) return;
    const titles = {
      call: `Follow-up call with ${formData.leadName}`,
      email: `Send email to ${formData.leadName}`,
      whatsapp: `WhatsApp message to ${formData.leadName}`,
      reminder: `Reminder for ${formData.leadName}`,
    };
    handleChange("title", titles[formData.taskType] || "");
  };

  return (
    <div className="space-y-6">
      {/* Task Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Task Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TASK_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange("taskType", type.value)}
                className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-2 ${formData.taskType === type.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 ${formData.taskType === type.value
                      ? "text-indigo-600"
                      : "text-gray-600"
                    }`}
                />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Lead <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={leadSearch}
              onChange={(e) => {
                setLeadSearch(e.target.value);
                setShowLeadDropdown(true);
              }}
              onFocus={() => setShowLeadDropdown(true)}
              placeholder="Search lead by name or ID..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {showLeadDropdown && filteredLeads.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => handleLeadSelect(lead)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-gray-900">
                    {lead.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lead.id} • {lead.phone}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Task Title <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={generateTitle}
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            Auto-generate
          </button>
        </div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter task title..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Priority Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => handleChange("priority", level.value)}
              className={`p-3 rounded-xl border-2 transition text-sm font-medium ${formData.priority === level.value
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date & Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Reminder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remind Me Before
        </label>
        <select
          value={formData.reminderBefore}
          onChange={(e) => handleChange("reminderBefore", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={15}>15 minutes before</option>
          <option value={30}>30 minutes before</option>
          <option value={60}>1 hour before</option>
          <option value={120}>2 hours before</option>
          <option value={1440}>1 day before</option>
        </select>
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned To
        </label>
        <select
          value={formData.assignedTo}
          onChange={(e) => handleChange("assignedTo", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="AGENT_A">Agent A</option>
          <option value="AGENT_B">Agent B</option>
          <option value="AGENT_C">Agent C</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={4}
          placeholder="Add any additional notes or context..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskForm;

// // src/pages/core-crm/tasks-meetings/components/TaskForm.jsx
// import React, { useState } from 'react';
// import { Phone, Mail, MessageCircle, Bell, Search } from 'lucide-react';

// const TASK_TYPES = [
//   { value: 'call', label: 'Call', icon: Phone },
//   { value: 'email', label: 'Email', icon: Mail },
//   { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
//   { value: 'reminder', label: 'Reminder', icon: Bell }
// ];

// const PRIORITY_LEVELS = [
//   { value: 'high', label: 'High Priority', color: 'red' },
//   { value: 'medium', label: 'Medium Priority', color: 'yellow' },
//   { value: 'low', label: 'Low Priority', color: 'gray' }
// ];

// const MOCK_LEADS = [
//   { id: 'QL-001', name: 'Rajesh Kumar', phone: '+91 98765 43210' },
//   { id: 'QL-002', name: 'Priya Sharma', phone: '+91 98765 43211' },
//   { id: 'QL-003', name: 'Amit Patel', phone: '+91 98765 43212' },
//   { id: 'QL-004', name: 'Sunita Verma', phone: '+91 98765 43213' }
// ];

// const TaskForm = ({ initialData, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     taskType: initialData?.taskType || 'call',
//     title: initialData?.title || '',
//     leadId: initialData?.leadId || '',
//     leadName: initialData?.leadName || '',
//     priority: initialData?.priority || 'medium',
//     dueDate: initialData?.dueDate || '',
//     assignedTo: initialData?.assignedTo || 'Agent A',
//     notes: initialData?.notes || '',
//     reminderBefore: 60
//   });

//   const [leadSearch, setLeadSearch] = useState('');
//   const [showLeadDropdown, setShowLeadDropdown] = useState(false);

//   const filteredLeads = MOCK_LEADS.filter(lead =>
//     lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
//     lead.id.toLowerCase().includes(leadSearch.toLowerCase())
//   );

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleLeadSelect = (lead) => {
//     handleChange('leadId', lead.id);
//     handleChange('leadName', lead.name);
//     setLeadSearch(lead.name);
//     setShowLeadDropdown(false);
//   };

//   const handleSubmit = () => {
//     if (!formData.title || !formData.leadId || !formData.dueDate) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     onSubmit({
//       ...formData,
//       status: 'pending'
//     });
//   };

//   const generateTitle = () => {
//     if (!formData.leadName) return;

//     const titles = {
//       call: `Follow-up call with ${formData.leadName}`,
//       email: `Send email to ${formData.leadName}`,
//       whatsapp: `WhatsApp message to ${formData.leadName}`,
//       reminder: `Reminder for ${formData.leadName}`
//     };

//     handleChange('title', titles[formData.taskType] || '');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Task Type */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-3">
//           Task Type <span className="text-red-500">*</span>
//         </label>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {TASK_TYPES.map((type) => {
//             const Icon = type.icon;
//             return (
//               <button
//                 key={type.value}
//                 type="button"
//                 onClick={() => handleChange('taskType', type.value)}
//                 className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
//                   formData.taskType === type.value
//                     ? 'border-indigo-600 bg-indigo-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Icon className={`w-5 h-5 ${
//                   formData.taskType === type.value ? 'text-indigo-600' : 'text-gray-600'
//                 }`} />
//                 <span className="text-xs font-medium">{type.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Lead Selection */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Select Lead <span className="text-red-500">*</span>
//         </label>
//         <div className="relative">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               value={leadSearch}
//               onChange={(e) => {
//                 setLeadSearch(e.target.value);
//                 setShowLeadDropdown(true);
//               }}
//               onFocus={() => setShowLeadDropdown(true)}
//               placeholder="Search lead by name or ID..."
//               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {showLeadDropdown && filteredLeads.length > 0 && (
//             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
//               {filteredLeads.map((lead) => (
//                 <button
//                   key={lead.id}
//                   type="button"
//                   onClick={() => handleLeadSelect(lead)}
//                   className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
//                 >
//                   <div className="font-medium text-gray-900">{lead.name}</div>
//                   <div className="text-sm text-gray-500">
//                     {lead.id} • {lead.phone}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Title */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Task Title <span className="text-red-500">*</span>
//           </label>
//           <button
//             type="button"
//             onClick={generateTitle}
//             className="text-xs text-indigo-600 hover:text-indigo-700"
//           >
//             Auto-generate
//           </button>
//         </div>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => handleChange('title', e.target.value)}
//           placeholder="Enter task title..."
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Priority */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-3">
//           Priority Level <span className="text-red-500">*</span>
//         </label>
//         <div className="grid grid-cols-3 gap-3">
//           {PRIORITY_LEVELS.map((level) => (
//             <button
//               key={level.value}
//               type="button"
//               onClick={() => handleChange('priority', level.value)}
//               className={`p-3 rounded-xl border-2 transition text-sm font-medium ${
//                 formData.priority === level.value
//                   ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
//                   : 'border-gray-200 text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {level.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Due Date & Time */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Due Date & Time <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="datetime-local"
//           value={formData.dueDate}
//           onChange={(e) => handleChange('dueDate', e.target.value)}
//           min={new Date().toISOString().slice(0, 16)}
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Reminder */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Remind Me Before
//         </label>
//         <select
//           value={formData.reminderBefore}
//           onChange={(e) => handleChange('reminderBefore', e.target.value)}
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value={15}>15 minutes before</option>
//           <option value={30}>30 minutes before</option>
//           <option value={60}>1 hour before</option>
//           <option value={120}>2 hours before</option>
//           <option value={1440}>1 day before</option>
//         </select>
//       </div>

//       {/* Assigned To */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Assigned To
//         </label>
//         <select
//           value={formData.assignedTo}
//           onChange={(e) => handleChange('assignedTo', e.target.value)}
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value="Agent A">Agent A</option>
//           <option value="Agent B">Agent B</option>
//           <option value="Agent C">Agent C</option>
//         </select>
//       </div>

//       {/* Notes */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Notes
//         </label>
//         <textarea
//           value={formData.notes}
//           onChange={(e) => handleChange('notes', e.target.value)}
//           rows={4}
//           placeholder="Add any additional notes or context..."
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-3 pt-4 border-t border-gray-200">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="flex-1 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
//         >
//           Create Task
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskForm;
