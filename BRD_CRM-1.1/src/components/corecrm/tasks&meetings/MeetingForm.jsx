import React, { useState, useEffect } from "react";
import {
  Video,
  Users,
  Phone,
  MapPin,
  Search,
  ExternalLink,
} from "lucide-react";
import { getContacts, createMeeting } from "../../../services/coreCRMService";
import { getLeads } from "../../../services/dataAndLeads.service";

const MEETING_TYPES = [
  { value: "in-person", label: "In-Person", icon: Users },
  { value: "video-call", label: "Video Call", icon: Video },
  { value: "phone-call", label: "Phone Call", icon: Phone },
];

const MEETING_MODES = [
  { value: "zoom", label: "Zoom" },
  { value: "google-meet", label: "Google Meet" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "physical", label: "Physical" },
];

const MeetingForm = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    meetingType: initialData?.meetingType || "video-call",
    meetingMode: initialData?.meetingMode || "zoom",
    title: initialData?.title || "",
    leadId: initialData?.leadId || "",
    leadName: initialData?.leadName || "",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || "",
    assignedTo: initialData?.assignedTo || "Agent A",
    agenda: initialData?.agenda || "",
    location: initialData?.location || "",
    meetingLink: initialData?.meetingLink || "",
    duration: initialData?.duration || 30,
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
      setLeads(res.data); // assuming API returns an array of contacts
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    if (leadSearch) fetchLeads();
  }, [leadSearch]);

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(leadSearch.toLowerCase()),
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    if (formData.meetingType === "in-person" && !formData.location) {
      alert("Please provide a location for in-person meetings");
      return;
    }
    if (formData.meetingType === "video-call" && !formData.meetingLink) {
      alert("Please provide a meeting link for video calls");
      return;
    }

    // Map frontend values to backend
    const payload = {
      meeting_type: formData.meetingType.toUpperCase().replace("-", "_"), // video-call -> VIDEO_CALL
      meeting_mode: formData.meetingMode.toUpperCase().replace("-", "_"), // zoom -> ZOOM
      scheduled_datetime: formData.dueDate,
      agent: 1, // replace with actual user ID
      related_lead_type: "Lead",
      related_lead_id: formData.leadId,
      location: formData.location || formData.meetingLink,
      notes: formData.agenda,
      datetime: formData.dueDate,
      duration: formData.duration,
      priority: formData.priority.toUpperCase(),
      title: formData.title,
      lead: formData.leadId,
      status: "SCHEDULED",
    };

    try {
      await createMeeting(payload);
      alert("Meeting scheduled successfully");
      onSuccess?.();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to schedule meeting");
    }
  };

  const generateTitle = () => {
    if (!formData.leadName) return;
    const titles = {
      "in-person": `In-person meeting with ${formData.leadName}`,
      "video-call": `Video call with ${formData.leadName}`,
      "phone-call": `Phone call with ${formData.leadName}`,
    };
    handleChange("title", titles[formData.meetingType] || "");
  };

  const generateMeetingLink = () => {
    if (formData.meetingMode === "zoom") {
      handleChange(
        "meetingLink",
        "https://zoom.us/j/" + Math.floor(Math.random() * 1000000000),
      );
    } else if (formData.meetingMode === "google-meet") {
      handleChange(
        "meetingLink",
        "https://meet.google.com/" + Math.random().toString(36).substring(7),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Meeting Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Meeting Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {MEETING_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange("meetingType", type.value)}
                className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                  formData.meetingType === type.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    formData.meetingType === type.value
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

      {/* Meeting Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Mode <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.meetingMode}
          onChange={(e) => handleChange("meetingMode", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {MEETING_MODES.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
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
            Meeting Title <span className="text-red-500">*</span>
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
          placeholder="Enter meeting title..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Date, Time & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <select
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>

      {/* Location (for in-person) */}
      {formData.meetingType === "in-person" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter meeting location..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Meeting Link (for video) */}
      {formData.meetingType === "video-call" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Meeting Link <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={generateMeetingLink}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              Generate Link
            </button>
          </div>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => handleChange("meetingLink", e.target.value)}
              placeholder="Enter or generate meeting link..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Priority Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["high", "medium", "low"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleChange("priority", level)}
              className={`p-3 rounded-xl border-2 transition text-sm font-medium capitalize ${
                formData.priority === level
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
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
          <option value="Agent A">Agent A</option>
          <option value="Agent B">Agent B</option>
          <option value="Agent C">Agent C</option>
        </select>
      </div>

      {/* Agenda */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Agenda
        </label>
        <textarea
          value={formData.agenda}
          onChange={(e) => handleChange("agenda", e.target.value)}
          rows={4}
          placeholder="Add meeting agenda or topics to discuss..."
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
          Schedule Meeting
        </button>
      </div>
    </div>
  );
};

export default MeetingForm;

// // src/pages/core-crm/tasks-meetings/components/MeetingForm.jsx
// import React, { useState } from 'react';
// import { Video, Users, Phone, MapPin, Search, ExternalLink } from 'lucide-react';

// const MEETING_TYPES = [
//   { value: 'in-person', label: 'In-Person', icon: Users },
//   { value: 'video-call', label: 'Video Call', icon: Video },
//   { value: 'phone-call', label: 'Phone Call', icon: Phone }
// ];

// const MEETING_MODES = [
//   { value: 'zoom', label: 'Zoom' },
//   { value: 'google-meet', label: 'Google Meet' },
//   { value: 'whatsapp', label: 'WhatsApp' },
//   { value: 'physical', label: 'Physical' }
// ];

// const MOCK_LEADS = [
//   { id: 'QL-001', name: 'Rajesh Kumar', phone: '+91 98765 43210' },
//   { id: 'QL-002', name: 'Priya Sharma', phone: '+91 98765 43211' },
//   { id: 'QL-003', name: 'Amit Patel', phone: '+91 98765 43212' },
//   { id: 'QL-004', name: 'Sunita Verma', phone: '+91 98765 43213' }
// ];

// const MeetingForm = ({ initialData, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     meetingType: initialData?.meetingType || 'video-call',
//     meetingMode: initialData?.meetingMode || 'zoom',
//     title: initialData?.title || '',
//     leadId: initialData?.leadId || '',
//     leadName: initialData?.leadName || '',
//     priority: initialData?.priority || 'medium',
//     dueDate: initialData?.dueDate || '',
//     assignedTo: initialData?.assignedTo || 'Agent A',
//     agenda: initialData?.agenda || '',
//     location: initialData?.location || '',
//     meetingLink: initialData?.meetingLink || '',
//     duration: initialData?.duration || 30
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

//     if (formData.meetingType === 'in-person' && !formData.location) {
//       alert('Please provide a location for in-person meetings');
//       return;
//     }

//     if (formData.meetingType === 'video-call' && !formData.meetingLink) {
//       alert('Please provide a meeting link for video calls');
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
//       'in-person': `In-person meeting with ${formData.leadName}`,
//       'video-call': `Video call with ${formData.leadName}`,
//       'phone-call': `Phone call with ${formData.leadName}`
//     };

//     handleChange('title', titles[formData.meetingType] || '');
//   };

//   const generateMeetingLink = () => {
//     if (formData.meetingMode === 'zoom') {
//       handleChange('meetingLink', 'https://zoom.us/j/' + Math.floor(Math.random() * 1000000000));
//     } else if (formData.meetingMode === 'google-meet') {
//       handleChange('meetingLink', 'https://meet.google.com/' + Math.random().toString(36).substring(7));
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Meeting Type */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-3">
//           Meeting Type <span className="text-red-500">*</span>
//         </label>
//         <div className="grid grid-cols-3 gap-3">
//           {MEETING_TYPES.map((type) => {
//             const Icon = type.icon;
//             return (
//               <button
//                 key={type.value}
//                 type="button"
//                 onClick={() => handleChange('meetingType', type.value)}
//                 className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
//                   formData.meetingType === type.value
//                     ? 'border-indigo-600 bg-indigo-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Icon className={`w-5 h-5 ${
//                   formData.meetingType === type.value ? 'text-indigo-600' : 'text-gray-600'
//                 }`} />
//                 <span className="text-xs font-medium">{type.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Meeting Mode */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Meeting Mode <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={formData.meetingMode}
//           onChange={(e) => handleChange('meetingMode', e.target.value)}
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           {MEETING_MODES.map(mode => (
//             <option key={mode.value} value={mode.value}>{mode.label}</option>
//           ))}
//         </select>
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
//             Meeting Title <span className="text-red-500">*</span>
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
//           placeholder="Enter meeting title..."
//           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Date, Time & Duration */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Meeting Date & Time <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="datetime-local"
//             value={formData.dueDate}
//             onChange={(e) => handleChange('dueDate', e.target.value)}
//             min={new Date().toISOString().slice(0, 16)}
//             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Duration (minutes)
//           </label>
//           <select
//             value={formData.duration}
//             onChange={(e) => handleChange('duration', e.target.value)}
//             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value={15}>15 minutes</option>
//             <option value={30}>30 minutes</option>
//             <option value={45}>45 minutes</option>
//             <option value={60}>1 hour</option>
//             <option value={90}>1.5 hours</option>
//             <option value={120}>2 hours</option>
//           </select>
//         </div>
//       </div>

//       {/* Location (for in-person) */}
//       {formData.meetingType === 'in-person' && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Location <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               value={formData.location}
//               onChange={(e) => handleChange('location', e.target.value)}
//               placeholder="Enter meeting location..."
//               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>
//       )}

//       {/* Meeting Link (for video) */}
//       {formData.meetingType === 'video-call' && (
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Meeting Link <span className="text-red-500">*</span>
//             </label>
//             <button
//               type="button"
//               onClick={generateMeetingLink}
//               className="text-xs text-indigo-600 hover:text-indigo-700"
//             >
//               Generate Link
//             </button>
//           </div>
//           <div className="relative">
//             <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="url"
//               value={formData.meetingLink}
//               onChange={(e) => handleChange('meetingLink', e.target.value)}
//               placeholder="Enter or generate meeting link..."
//               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>
//       )}

//       {/* Priority */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-3">
//           Priority Level
//         </label>
//         <div className="grid grid-cols-3 gap-3">
//           {['high', 'medium', 'low'].map((level) => (
//             <button
//               key={level}
//               type="button"
//               onClick={() => handleChange('priority', level)}
//               className={`p-3 rounded-xl border-2 transition text-sm font-medium capitalize ${
//                 formData.priority === level
//                   ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
//                   : 'border-gray-200 text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {level}
//             </button>
//           ))}
//         </div>
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

//       {/* Agenda */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Meeting Agenda
//         </label>
//         <textarea
//           value={formData.agenda}
//           onChange={(e) => handleChange('agenda', e.target.value)}
//           rows={4}
//           placeholder="Add meeting agenda or topics to discuss..."
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
//           Schedule Meeting
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MeetingForm;
