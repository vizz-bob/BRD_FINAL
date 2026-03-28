// ContactsView.jsx
import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Plus } from "lucide-react";
import ContactsList from "../../../components/corecrm/accounts&contacts/ContactsList";
import ContactForm from "../../../components/corecrm/accounts&contacts/ContactForm";
import ContactDetails from "../../../components/corecrm/accounts&contacts/ContactDetails";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../../../services/coreCRMService";

const ContactsView = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    tags: [],
  });

  // Mock data - replace with API call
  // useEffect(() => {
  //   const mockContacts = [
  //     {
  //       id: 'CNT-001',
  //       fullName: 'Rajesh Kumar',
  //       mobile: '+91 98765 43210',
  //       email: 'rajesh.k@email.com',
  //       gender: 'Male',
  //       dob: '1985-05-15',
  //       address: '123 MG Road, Delhi',
  //       tags: ['VIP', 'Hot'],
  //       source: 'Campaign',
  //       assignedTo: 'Agent A',
  //       createdBy: 'Admin',
  //       status: 'Active',
  //       accountId: 'ACC-001',
  //       accountName: 'ABC Corp',
  //       lastActivity: '2025-01-15T10:30:00',
  //       createdAt: '2024-12-01T09:00:00'
  //     },
  //     {
  //       id: 'CNT-002',
  //       fullName: 'Priya Sharma',
  //       mobile: '+91 98765 43211',
  //       email: 'priya.s@email.com',
  //       gender: 'Female',
  //       dob: '1990-08-22',
  //       address: '456 Park Street, Mumbai',
  //       tags: ['Hot'],
  //       source: 'Website',
  //       assignedTo: 'Agent B',
  //       createdBy: 'Agent B',
  //       status: 'Active',
  //       accountId: null,
  //       accountName: null,
  //       lastActivity: '2025-01-20T14:15:00',
  //       createdAt: '2025-01-10T11:00:00'
  //     },
  //     {
  //       id: 'CNT-003',
  //       fullName: 'Amit Patel',
  //       mobile: '+91 98765 43212',
  //       email: 'amit.p@email.com',
  //       gender: 'Male',
  //       dob: '1988-03-10',
  //       address: '789 Station Road, Bangalore',
  //       tags: [],
  //       source: 'Referral',
  //       assignedTo: 'Agent A',
  //       createdBy: 'Agent C',
  //       status: 'Dormant',
  //       accountId: 'ACC-002',
  //       accountName: 'XYZ Ltd',
  //       lastActivity: '2024-11-10T16:45:00',
  //       createdAt: '2024-10-15T13:30:00'
  //     }
  //   ];
  //   setContacts(mockContacts);
  // }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleSaveContact = async (formData) => {
    if (!formData) {
      console.error('handleSaveContact called without formData');
      return;
    }

    try {
      const payload = {
        full_name: formData.fullName,
        mobile_number: formData.mobile,
        email: formData.email,

        gender: formData.gender?.toLowerCase() || null,
        date_of_birth: formData.dob || null,
        address: formData.address || "",

        tags: Array.isArray(formData.tags) ? formData.tags.join(',') : (formData.tags || ""),
        source: formData.source?.toLowerCase() || null,

        assigned_to: formData.assignedTo,
      };

      if (editingContact) {
        const contactId = editingContact.id ?? editingContact.pk;
        const res = await updateContact(contactId, payload);
        setContacts((prev) => prev.map((c) => {
          const cId = c.id ?? c.pk;
          return cId === contactId ? res.data : c;
        }));

        // if this contact is currently selected, update selection
        const selectedId = selectedContact?.id ?? selectedContact?.pk;
        if (selectedId && selectedId === (editingContact.id ?? editingContact.pk)) {
          setSelectedContact(res.data);
        }
      } else {
        const res = await createContact(payload);
        setContacts((prev) => [res.data, ...prev]);
      }

      setShowContactForm(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Save failed", error.response?.data || error);
      alert("Failed to save contact");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteContact(contactId);
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
      setSelectedContact(null);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete contact");
    }
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter((contact) => {
    const name = contact.full_name?.toLowerCase() || "";
    const mobile = contact.mobile_number || "";
    const email = contact.email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || mobile.includes(query) || email.includes(query);

    const matchesSource = filters.source === "all" || contact.source === filters.source;

    return matchesSearch && matchesSource;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Dormant">Dormant</option>
            </select>

            <select
              value={filters.source}
              onChange={(e) =>
                setFilters({ ...filters, source: e.target.value })
              }
              className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sources</option>
              <option value="Campaign">Campaign</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                  }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddContact}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts List or Details */}
      <div
        className={`grid ${selectedContact ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
      >
        <div className={selectedContact ? "lg:col-span-2" : ""}>
          <ContactsList
            contacts={filteredContacts}
            viewMode={viewMode}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onAddContact={handleAddContact}
          />
        </div>

        {selectedContact && (
          <div className="lg:col-span-1">
            <ContactDetails
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              onEdit={() => handleEditContact(selectedContact)}
              onDelete={() => handleDeleteContact(selectedContact.id)}
            />
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          contact={editingContact}
          onClose={() => {
            setShowContactForm(false);
            setEditingContact(null);
          }}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
};

export default ContactsView;

// ContactsView.jsx
// import React, { useState, useEffect } from 'react';
// import { Search, Grid, List, Plus } from 'lucide-react';

// import ContactsList from '../../../components/corecrm/accounts&contacts/ContactsList';
// import ContactForm from '../../../components/corecrm/accounts&contacts/ContactForm';
// import ContactDetails from '../../../components/corecrm/accounts&contacts/ContactDetails';

// import {
//   getContacts,
//   createContact,
//   updateContact,
//   deleteContact,
// } from '../../../services/coreCRMService';

// const ContactsView = () => {
//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [showContactForm, setShowContactForm] = useState(false);
//   const [editingContact, setEditingContact] = useState(null);
//   const [viewMode, setViewMode] = useState('grid');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({
//     status: 'all',
//     source: 'all',
//     tags: [],
//   });

//   /* ===================== FETCH CONTACTS ===================== */
//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const res = await getContacts();
//       setContacts(res.data);
//     } catch (error) {
//       console.error('Failed to fetch contacts', error);
//     }
//   };

//   /* ===================== HANDLERS ===================== */
//   const handleAddContact = () => {
//     setEditingContact(null);
//     setShowContactForm(true);
//   };

//   const handleEditContact = (contact) => {
//     setEditingContact(contact);
//     setShowContactForm(true);
//   };

//   const handleSaveContact = async (formData) => {
//   // 🔁 FRONTEND → BACKEND FIELD MAPPING
//   const payload = {
//   full_name: formData.fullName,
//   mobile_number: formData.mobile,
//   email: formData.email,
//   gender: formData.gender?.toUpperCase() || null,
//   date_of_birth: formData.dob || null,
//   address: formData.address || "",
//   tags: formData.tags || [],
//   source: formData.source?.toUpperCase(),

//   // 🔥 FIX IS HERE
//   assigned_to:
//     typeof formData.assignedTo === "number"
//       ? formData.assignedTo
//       : null,
// };

//   try {
//     if (editingContact) {
//       const res = await updateContact(editingContact.id, payload);
//       setContacts((prev) =>
//         prev.map((c) => (c.id === editingContact.id ? res.data : c))
//       );
//     } else {
//       const res = await createContact(payload);
//       setContacts((prev) => [res.data, ...prev]);
//     }

//     setShowContactForm(false);
//     setEditingContact(null);
//   } catch (error) {
//     console.error("Failed to save contact", error.response?.data || error);
//     alert("Failed to save contact");
//   }
// };

//   const handleDeleteContact = async (contactId) => {
//     if (!window.confirm('Are you sure you want to delete this contact?')) return;

//     try {
//       await deleteContact(contactId);
//       setContacts((prev) => prev.filter((c) => c.id !== contactId));
//       setSelectedContact(null);
//     } catch (error) {
//       console.error('Failed to delete contact', error);
//       alert('Failed to delete contact');
//     }
//   };

//   /* ===================== FILTERING ===================== */
//   const filteredContacts = contacts.filter((contact) => {
//     const matchesSearch =
//       contact.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       contact.mobile_number?.includes(searchQuery) ||
//       contact.email?.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesSource =
//       filters.source === 'all' || contact.source === filters.source;

//     return matchesSearch && matchesSource;
//   });

//   /* ===================== RENDER ===================== */
//   return (
//     <div className="space-y-6">
//       {/* Search and Filters */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search contacts by name, phone, or email..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Source Filter */}
//           <select
//             value={filters.source}
//             onChange={(e) =>
//               setFilters({ ...filters, source: e.target.value })
//             }
//             className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200"
//           >
//             <option value="all">All Sources</option>
//             <option value="CAMPAIGN">Campaign</option>
//             <option value="WEBSITE">Website</option>
//             <option value="REFERRAL">Referral</option>
//             <option value="WALK_IN">Walk In</option>
//             <option value="OTHER">Other</option>
//           </select>

//           {/* View Toggle */}
//           <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`p-2 rounded-lg ${
//                 viewMode === 'grid' ? 'bg-white shadow-sm' : ''
//               }`}
//             >
//               <Grid className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded-lg ${
//                 viewMode === 'list' ? 'bg-white shadow-sm' : ''
//               }`}
//             >
//               <List className="w-4 h-4" />
//             </button>
//           </div>

//           <button
//             onClick={handleAddContact}
//             className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl"
//           >
//             <Plus className="w-5 h-5" />
//             Add Contact
//           </button>
//         </div>
//       </div>

//       {/* List + Details */}
//       <div
//         className={`grid ${
//           selectedContact ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
//         } gap-6`}
//       >
//         <div className={selectedContact ? 'lg:col-span-2' : ''}>
//           <ContactsList
//             contacts={filteredContacts}
//             viewMode={viewMode}
//             selectedContact={selectedContact}
//             onSelectContact={setSelectedContact}
//             onEditContact={handleEditContact}
//             onDeleteContact={handleDeleteContact}
//             onAddContact={handleAddContact}
//           />
//         </div>

//         {selectedContact && (
//           <ContactDetails
//             contact={selectedContact}
//             onClose={() => setSelectedContact(null)}
//             onEdit={() => handleEditContact(selectedContact)}
//             onDelete={() => handleDeleteContact(selectedContact.id)}
//           />
//         )}
//       </div>

//       {/* Modal */}
//       {showContactForm && (
//         <ContactForm
//           contact={editingContact}
//           onClose={() => {
//             setShowContactForm(false);
//             setEditingContact(null);
//           }}
//           onSave={handleSaveContact}
//         />
//       )}
//     </div>
//   );
// };

// export default ContactsView;
