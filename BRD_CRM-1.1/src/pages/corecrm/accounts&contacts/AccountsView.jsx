// AccountsView.jsx
import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Plus } from 'lucide-react';
import AccountsList from '../../../components/corecrm/accounts&contacts/AccountsList';
import AccountForm from '../../../components/corecrm/accounts&contacts/AccountForm';
import AccountDetails from '../../../components/corecrm/accounts&contacts/AccountDetails';

import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../../services/coreCRMService";

import { ACCOUNT_TYPE_MAP, INDUSTRY_MAP, STATUS_MAP } from '../../../constants/account.constants';

// ===== MAP API DATA TO FRONTEND =====
const mapFromApi = (acc) => ({
  id: acc.id,
  companyName: acc.company_name,
  accountType: Object.keys(ACCOUNT_TYPE_MAP).find(k => ACCOUNT_TYPE_MAP[k] === acc.account_type),
  industry: Object.keys(INDUSTRY_MAP).find(k => INDUSTRY_MAP[k] === acc.industry),
  gstNumber: acc.gst_number,
  panNumber: acc.pan_number,
  address: acc.address,
  status: Object.keys(STATUS_MAP).find(k => STATUS_MAP[k] === acc.status),
  assignedTo: acc.assigned_to,
  createdBy: acc.created_by,
  createdAt: acc.created_at,
});

// ===== MAP FRONTEND FORM TO API =====
const mapToApi = (form) => ({
  company_name: form.companyName,
  account_type: ACCOUNT_TYPE_MAP[form.accountType],
  industry: INDUSTRY_MAP[form.industry],
  gst_number: form.gstNumber || null,
  pan_number: form.panNumber || null,
  address: form.address || null,
  status: STATUS_MAP[form.status],
  assigned_to: form.assignedTo || null,
});

const AccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all'
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await getAccounts();
      setAccounts(res.data.map(mapFromApi));
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowAccountForm(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const handleSaveAccount = async (payload) => {
  
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, payload);
      } else {
        await createAccount(payload);
      }

      const res = await getAccounts();
      setAccounts(res.data.map(mapFromApi));

      setShowAccountForm(false);
      setEditingAccount(null);
    } catch (err) {
      console.error("Failed to save account", err.response?.data);
      alert("Failed to save account. Check inputs.");
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;

    try {
      await deleteAccount(accountId);
      setAccounts(prev => prev.filter(a => a.id !== accountId));
      setSelectedAccount(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete account");
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch =
      account.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (account.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = filters.status === 'all' || account.status === filters.status;
    const matchesIndustry = filters.industry === 'all' || account.industry === filters.industry;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts by company name or GST..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              {Object.keys(STATUS_MAP).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Industries</option>
              {Object.keys(INDUSTRY_MAP).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddAccount}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" /> Add Account
            </button>
          </div>
        </div>
      </div>

      {/* Accounts List / Details */}
      <div className={`grid ${selectedAccount ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        <div className={selectedAccount ? 'lg:col-span-2' : ''}>
          <AccountsList
            accounts={filteredAccounts}
            viewMode={viewMode}
            selectedAccount={selectedAccount}
            onSelectAccount={setSelectedAccount}
            onEditAccount={handleEditAccount}
            onDeleteAccount={handleDeleteAccount}
            onAddAccount={handleAddAccount}
          />
        </div>

        {selectedAccount && (
          <div className="lg:col-span-1">
            <AccountDetails
              account={selectedAccount}
              allAccounts={accounts}
              onClose={() => setSelectedAccount(null)}
              onEdit={() => handleEditAccount(selectedAccount)}
              onDelete={() => handleDeleteAccount(selectedAccount.id)}
            />
          </div>
        )}
      </div>

      {showAccountForm && (
        <AccountForm
          account={editingAccount}
          accounts={accounts}
          onClose={() => {
            setShowAccountForm(false);
            setEditingAccount(null);
          }}
          onSave={handleSaveAccount}
        />
      )}
    </div>
  );
};

export default AccountsView;


// // AccountsView.jsx
// import React, { useState, useEffect } from 'react';
// import { Search, Grid, List, Building2, Plus } from 'lucide-react';
// import AccountsList from '../../../components/corecrm/accounts&contacts/AccountsList';
// import AccountForm from '../../../components/corecrm/accounts&contacts/AccountForm';
// import AccountDetails from '../../../components/corecrm/accounts&contacts/AccountDetails';

// import {
//   getAccounts,
//   createAccount,
//   updateAccount,
//   deleteAccount,
// } from "../../../services/coreCRMService";

// const mapFromApi = (acc) => ({
//   id: acc.id,
//   companyName: acc.company_name,
//   accountType: acc.account_type,
//   industry: acc.industry,
//   gstNumber: acc.gst_number,
//   panNumber: acc.pan_number,
//   address: acc.address,
//   status: acc.status,
//   assignedTo: acc.assigned_to, // user id (can resolve later)
//   createdBy: acc.created_by,
//   createdAt: acc.created_at,
// });

// const mapToApi = (form) => ({
//   company_name: form.companyName,
//   account_type: form.accountType,
//   industry: form.industry,
//   gst_number: form.gstNumber,
//   pan_number: form.panNumber,
//   address: form.address,
//   status: form.status,
//   assigned_to: form.assignedTo || null,
// });


// const AccountsView = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [showAccountForm, setShowAccountForm] = useState(false);
//   const [editingAccount, setEditingAccount] = useState(null);
//   const [viewMode, setViewMode] = useState('grid');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({
//     status: 'all',
//     industry: 'all'
//   });

//   useEffect(() => {
//   fetchAccounts();
// }, []);

// const fetchAccounts = async () => {
//   try {
//     const res = await getAccounts();
//     setAccounts(res.data.map(mapFromApi));
//   } catch (err) {
//     console.error("Failed to fetch accounts", err);
//   }
// };


//   const handleAddAccount = () => {
//     setEditingAccount(null);
//     setShowAccountForm(true);
//   };

//   const handleEditAccount = (account) => {
//     setEditingAccount(account);
//     setShowAccountForm(true);
//   };


// const handleSaveAccount = async (payload) => {
//   try {
//     if (editingAccount) {
//       await updateAccount(editingAccount.id, payload);
//     } else {
//       await createAccount(payload);
//     }

//     const res = await getAccounts();
//     setAccounts(res.data);

//     setShowAccountForm(false);
//     setEditingAccount(null);
//   } catch (err) {
//     console.error("Failed to save account", err.response?.data);
//     alert("Failed to save account. Check inputs.");
//   }
// };



//   const handleDeleteAccount = async (accountId) => {
//   if (!window.confirm("Are you sure you want to delete this account?")) return;

//   try {
//     await deleteAccount(accountId);
//     setAccounts((prev) => prev.filter((a) => a.id !== accountId));
//     setSelectedAccount(null);
//   } catch (err) {
//     console.error("Delete failed", err);
//     alert("Failed to delete account");
//   }
// };


//   const filteredAccounts = accounts.filter(account => {
//     const matchesSearch = account.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          account.gstNumber.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = filters.status === 'all' || account.status === filters.status;
//     const matchesIndustry = filters.industry === 'all' || account.industry === filters.industry;
//     return matchesSearch && matchesStatus && matchesIndustry;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Search and Filters */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search accounts by company name or GST..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div className="flex gap-2">
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="all">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>

//             <select
//               value={filters.industry}
//               onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
//               className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="all">All Industries</option>
//               <option value="Banking">Banking</option>
//               <option value="Retail">Retail</option>
//               <option value="Services">Services</option>
//             </select>

//             <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 rounded-lg transition ${
//                   viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
//                 }`}
//               >
//                 <Grid className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 rounded-lg transition ${
//                   viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
//                 }`}
//               >
//                 <List className="w-4 h-4" />
//               </button>
//             </div>

//             <button 
//               onClick={handleAddAccount} 
//               className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
//             >
//               <Plus className="w-5 h-5" />
//               Add Account
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Accounts List or Details */}
//       <div className={`grid ${selectedAccount ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
//         <div className={selectedAccount ? 'lg:col-span-2' : ''}>
//           <AccountsList
//             accounts={filteredAccounts}
//             viewMode={viewMode}
//             selectedAccount={selectedAccount}
//             onSelectAccount={setSelectedAccount}
//             onEditAccount={handleEditAccount}
//             onDeleteAccount={handleDeleteAccount}
//             onAddAccount={handleAddAccount}
//           />
//         </div>

//         {selectedAccount && (
//           <div className="lg:col-span-1">
//             <AccountDetails
//               account={selectedAccount}
//               allAccounts={accounts}
//               onClose={() => setSelectedAccount(null)}
//               onEdit={() => handleEditAccount(selectedAccount)}
//               onDelete={() => handleDeleteAccount(selectedAccount.id)}
//             />
//           </div>
//         )}
//       </div>

//       {showAccountForm && (
//         <AccountForm
//           account={editingAccount}
//           accounts={accounts}
//           onClose={() => {
//             setShowAccountForm(false);
//             setEditingAccount(null);
//           }}
//           onSave={handleSaveAccount}
//         />
//       )}
//     </div>
//   );
// };

// export default AccountsView;