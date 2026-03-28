import React, { useState, useEffect } from 'react';
import {
  Plus, Save, Trash2, CheckCircle, X, User,
  Phone, Mail, MapPin, Globe, Building, List
} from 'lucide-react';
import { ManualEntryService } from '../../../services/dataAndLeads.service';

// Must match ManualEntry model PRODUCT_SELECTION_CHOICES
const PRODUCT_CHOICES = [
  { id: 'personal_loan',  name: 'Personal Loan'  },
  { id: 'home_loan',      name: 'Home Loan'       },
  { id: 'car_loan',       name: 'Car Loan'        },
  { id: 'business_loan',  name: 'Business Loan'  },
  { id: 'education_loan', name: 'Education Loan' },
];

const PRODUCT_LABEL = (id) => PRODUCT_CHOICES.find(p => p.id === id)?.name || id;

const EMPTY_ENTRY = () => ({
  _key: Date.now() + Math.random(),
  name:              '',
  mobile_number:     '',
  email:             '',
  product_selection: 'personal_loan',
  country:           'India',
  state:             '',
  city:              '',
});

const ManualEntryForm = ({ onSelect, selectedId }) => {
  const [entries,      setEntries]      = useState([EMPTY_ENTRY()]);
  const [saving,       setSaving]       = useState(false);
  const [successCount, setSuccessCount] = useState(null);
  const [rowErrors,    setRowErrors]    = useState({});

  // Saved entries list
  const [savedEntries, setSavedEntries] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [deletingId,   setDeletingId]   = useState(null);
  const [activeTab,    setActiveTab]    = useState('form'); // 'form' | 'saved'

  const isValid = (e) => e.name.trim() && (e.mobile_number.trim() || e.email.trim());

  const addEntry    = () => setEntries(prev => [...prev, EMPTY_ENTRY()]);
  const removeEntry = (key) => { if (entries.length > 1) setEntries(prev => prev.filter(e => e._key !== key)); };
  const updateEntry = (key, field, value) => setEntries(prev => prev.map(e => e._key === key ? { ...e, [field]: value } : e));

  useEffect(() => { fetchSaved(); }, []);

  const fetchSaved = async () => {
    setLoadingSaved(true);
    try {
      const res = await ManualEntryService.list();
      setSavedEntries(res.data);
    } catch (err) {
      console.error('Failed to fetch manual entries:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleSaveAll = async () => {
    const valid = entries.filter(isValid);
    if (!valid.length) { alert('No valid entries. Fill Name + Mobile or Email.'); return; }

    setSaving(true);
    setRowErrors({});
    let saved = 0;
    const errs = {};

    for (const entry of valid) {
      try {
        await ManualEntryService.create({
          name:              entry.name.trim(),
          mobile_number:     entry.mobile_number.trim() || null,
          email:             entry.email.trim()         || null,
          product_selection: entry.product_selection,
          country:           entry.country.trim(),
          state:             entry.state.trim(),
          city:              entry.city.trim(),
        });
        saved++;
      } catch (err) {
        errs[entry._key] = JSON.stringify(err.response?.data || 'Unknown error');
        console.error(`Failed for "${entry.name}":`, err.response?.data);
      }
    }

    setSaving(false);
    setRowErrors(errs);

    if (saved > 0) {
      setSuccessCount(saved);
      await fetchSaved(); // refresh saved list
      setTimeout(() => {
        setSuccessCount(null);
        setEntries([EMPTY_ENTRY()]);
        setActiveTab('saved'); // switch to saved tab after save
      }, 2000);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this entry?')) return;
    setDeletingId(id);
    try {
      await ManualEntryService.delete(id);
      setSavedEntries(prev => prev.filter(en => en.id !== id));
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = () => { setEntries([EMPTY_ENTRY()]); setRowErrors({}); setSuccessCount(null); };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-black text-gray-900">Manual Data Entry</h3>
          <p className="text-xs text-gray-500 mt-1">Add leads manually one by one</p>
        </div>
        {activeTab === 'form' && (
          <button onClick={addEntry} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-md font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
            <Plus className="w-3 h-3" /> Add Row
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'form' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Plus className="w-3.5 h-3.5" /> New Entries
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <List className="w-3.5 h-3.5" /> Saved Entries
          {savedEntries.length > 0 && (
            <span className="ml-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
              {savedEntries.length}
            </span>
          )}
        </button>
      </div>

      {/* ── FORM TAB ── */}
      {activeTab === 'form' && (
        <>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-xs text-indigo-900"><strong>Required Fields:</strong> Name + (Mobile Number or Email) + Product</p>
          </div>

          {successCount !== null && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-bold text-emerald-700">{successCount} lead{successCount > 1 ? 's' : ''} saved successfully!</p>
            </div>
          )}

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {entries.map((entry, idx) => (
              <div key={entry._key} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-gray-900">Entry #{idx + 1}</p>
                  {entries.length > 1 && (
                    <button onClick={() => removeEntry(entry._key)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {rowErrors[entry._key] && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-[10px] font-bold text-red-700">{rowErrors[entry._key]}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Name *</label>
                    <input type="text" value={entry.name} placeholder="Enter full name" onChange={(e) => updateEntry(entry._key, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Phone className="w-3 h-3" /> Mobile Number *</label>
                    <input type="tel" value={entry.mobile_number} placeholder="10-digit mobile number" onChange={(e) => updateEntry(entry._key, 'mobile_number', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                    <input type="email" value={entry.email} placeholder="email@example.com" onChange={(e) => updateEntry(entry._key, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Building className="w-3 h-3" /> Product *</label>
                    <select value={entry.product_selection} onChange={(e) => updateEntry(entry._key, 'product_selection', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
                      {PRODUCT_CHOICES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Globe className="w-3 h-3" /> Country</label>
                    <input type="text" value={entry.country} placeholder="Country" onChange={(e) => updateEntry(entry._key, 'country', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> State</label>
                    <input type="text" value={entry.state} placeholder="State" onChange={(e) => updateEntry(entry._key, 'state', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> City</label>
                    <input type="text" value={entry.city} placeholder="City" onChange={(e) => updateEntry(entry._key, 'city', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                </div>

                {isValid(entry) ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                    <CheckCircle className="w-4 h-4" /><span className="text-xs font-bold">Valid Entry</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <X className="w-4 h-4" /><span className="text-xs font-bold">Incomplete — Fill Name + Mobile or Email</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-900">Total Entries: {entries.length}</p>
                  <p className="text-xs text-indigo-700 mt-1">Valid: {entries.filter(isValid).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleClearAll} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
                <X className="w-4 h-4" /> Clear All
              </button>
              <button onClick={handleSaveAll} disabled={saving} className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save All Entries'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── SAVED ENTRIES TAB ── */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {loadingSaved ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading saved entries...</div>
          ) : savedEntries.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <User className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400">No saved entries yet.</p>
              <button onClick={() => setActiveTab('form')} className="text-xs font-bold text-indigo-600 hover:underline">
                Add your first entry →
              </button>
            </div>
          ) : (
            <div className="max-h-[620px] overflow-y-auto space-y-3 pr-1">
              {savedEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => onSelect?.(entry)}
                  className={`bg-gray-50 border rounded-xl p-4 cursor-pointer transition-all hover:bg-indigo-50 hover:border-indigo-200 ${selectedId === entry.id ? 'bg-indigo-100 border-indigo-400 border-l-4' : 'border-gray-200'}`}
                >
                  {/* Top row: name + delete */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-black text-gray-900">{entry.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{entry.id}</p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(entry.id, e)}
                      disabled={deletingId === entry.id}
                      className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Product badge */}
                  <div className="mb-3">
                    <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {PRODUCT_LABEL(entry.product_selection)}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {entry.mobile_number && (
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Phone className="w-3 h-3" /> Mobile</p>
                        <p className="text-xs font-bold text-gray-800">{entry.mobile_number}</p>
                      </div>
                    )}
                    {entry.email && (
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                        <p className="text-xs font-bold text-gray-800 truncate">{entry.email}</p>
                      </div>
                    )}
                    {(entry.city || entry.state) && (
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                        <p className="text-xs font-bold text-gray-800">
                          {[entry.city, entry.state].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                    {entry.country && (
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Globe className="w-3 h-3" /> Country</p>
                        <p className="text-xs font-bold text-gray-800">{entry.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer count */}
          {!loadingSaved && savedEntries.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                {savedEntries.length} saved {savedEntries.length === 1 ? 'entry' : 'entries'} total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManualEntryForm;



// import React, { useState } from 'react';
// import {
//   Plus, Save, Trash2, CheckCircle, X, User,
//   Phone, Mail, MapPin, Globe, Building
// } from 'lucide-react';
// import { ManualEntryService } from '../../../services/dataAndLeads.service';

// // Must match ManualEntry model PRODUCT_SELECTION_CHOICES
// const PRODUCT_CHOICES = [
//   { id: 'personal_loan',  name: 'Personal Loan'  },
//   { id: 'home_loan',      name: 'Home Loan'       },
//   { id: 'car_loan',       name: 'Car Loan'        },
//   { id: 'business_loan',  name: 'Business Loan'  },
//   { id: 'education_loan', name: 'Education Loan' },
// ];

// const EMPTY_ENTRY = () => ({
//   _key: Date.now() + Math.random(),
//   name:              '',
//   mobile_number:     '',   // model: mobile_number
//   email:             '',
//   product_selection: 'personal_loan', // model: product_selection
//   country:           'India',
//   state:             '',
//   city:              '',
// });

// const ManualEntryForm = ({ onSelect, selectedId }) => {
//   const [entries,      setEntries]      = useState([EMPTY_ENTRY()]);
//   const [saving,       setSaving]       = useState(false);
//   const [successCount, setSuccessCount] = useState(null);
//   const [rowErrors,    setRowErrors]    = useState({});

//   const isValid = (e) => e.name.trim() && (e.mobile_number.trim() || e.email.trim());

//   const addEntry    = () => setEntries(prev => [...prev, EMPTY_ENTRY()]);
//   const removeEntry = (key) => { if (entries.length > 1) setEntries(prev => prev.filter(e => e._key !== key)); };
//   const updateEntry = (key, field, value) => setEntries(prev => prev.map(e => e._key === key ? { ...e, [field]: value } : e));

//   const handleSaveAll = async () => {
//     const valid = entries.filter(isValid);
//     if (!valid.length) { alert('No valid entries. Fill Name + Mobile or Email.'); return; }

//     setSaving(true);
//     setRowErrors({});
//     let saved = 0;
//     const errs = {};

//     for (const entry of valid) {
//       try {
//         // ⚠️ Keys must match ManualEntry model field names exactly
//         await ManualEntryService.create({
//           name:              entry.name.trim(),
//           mobile_number:     entry.mobile_number.trim() || null,  // model: mobile_number
//           email:             entry.email.trim()         || null,
//           product_selection: entry.product_selection,              // model: product_selection
//           country:           entry.country.trim(),
//           state:             entry.state.trim(),
//           city:              entry.city.trim(),
//         });
//         saved++;
//       } catch (err) {
//         errs[entry._key] = JSON.stringify(err.response?.data || 'Unknown error');
//         console.error(`Failed for "${entry.name}":`, err.response?.data);
//       }
//     }

//     setSaving(false);
//     setRowErrors(errs);

//     if (saved > 0) {
//       setSuccessCount(saved);
//       setTimeout(() => { setSuccessCount(null); setEntries([EMPTY_ENTRY()]); }, 2500);
//     }
//   };

//   const handleClearAll = () => { setEntries([EMPTY_ENTRY()]); setRowErrors({}); setSuccessCount(null); };

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
//       <div className="flex items-center justify-between pb-4 border-b border-gray-100">
//         <div>
//           <h3 className="text-lg font-black text-gray-900">Manual Data Entry</h3>
//           <p className="text-xs text-gray-500 mt-1">Add leads manually one by one</p>
//         </div>
//         <button onClick={addEntry} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-md font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
//           <Plus className="w-3 h-3" /> Add Row
//         </button>
//       </div>

//       <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
//         <p className="text-xs text-indigo-900"><strong>Required Fields:</strong> Name + (Mobile Number or Email) + Product</p>
//       </div>

//       {successCount !== null && (
//         <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
//           <CheckCircle className="w-5 h-5 text-emerald-600" />
//           <p className="text-sm font-bold text-emerald-700">{successCount} lead{successCount > 1 ? 's' : ''} saved successfully!</p>
//         </div>
//       )}

//       <div className="space-y-4 max-h-[600px] overflow-y-auto">
//         {entries.map((entry, idx) => (
//           <div key={entry._key} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-black text-gray-900">Entry #{idx + 1}</p>
//               {entries.length > 1 && (
//                 <button onClick={() => removeEntry(entry._key)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {rowErrors[entry._key] && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-2">
//                 <p className="text-[10px] font-bold text-red-700">{rowErrors[entry._key]}</p>
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Name *</label>
//                 <input type="text" value={entry.name} placeholder="Enter full name" onChange={(e) => updateEntry(entry._key, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Phone className="w-3 h-3" /> Mobile Number *</label>
//                 <input type="tel" value={entry.mobile_number} placeholder="10-digit mobile number" onChange={(e) => updateEntry(entry._key, 'mobile_number', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
//                 <input type="email" value={entry.email} placeholder="email@example.com" onChange={(e) => updateEntry(entry._key, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Building className="w-3 h-3" /> Product *</label>
//                 <select value={entry.product_selection} onChange={(e) => updateEntry(entry._key, 'product_selection', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
//                   {PRODUCT_CHOICES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                 </select>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><Globe className="w-3 h-3" /> Country</label>
//                 <input type="text" value={entry.country} placeholder="Country" onChange={(e) => updateEntry(entry._key, 'country', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> State</label>
//                 <input type="text" value={entry.state} placeholder="State" onChange={(e) => updateEntry(entry._key, 'state', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
//               </div>

//               <div className="space-y-1 md:col-span-2">
//                 <label className="text-[9px] font-black text-gray-600 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> City</label>
//                 <input type="text" value={entry.city} placeholder="City" onChange={(e) => updateEntry(entry._key, 'city', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
//               </div>
//             </div>

//             {isValid(entry) ? (
//               <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
//                 <CheckCircle className="w-4 h-4" /><span className="text-xs font-bold">Valid Entry</span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
//                 <X className="w-4 h-4" /><span className="text-xs font-bold">Incomplete — Fill Name + Mobile or Email</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="pt-4 border-t border-gray-100">
//         <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-bold text-indigo-900">Total Entries: {entries.length}</p>
//               <p className="text-xs text-indigo-700 mt-1">Valid: {entries.filter(isValid).length}</p>
//             </div>
//             <CheckCircle className="w-8 h-8 text-indigo-600" />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <button onClick={handleClearAll} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
//             <X className="w-4 h-4" /> Clear All
//           </button>
//           <button onClick={handleSaveAll} disabled={saving} className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60">
//             <Save className="w-4 h-4" />
//             {saving ? 'Saving...' : 'Save All Entries'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryForm;
