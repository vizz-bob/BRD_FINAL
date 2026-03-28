// AccountForm.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

import {
  ACCOUNT_TYPE_MAP,
  INDUSTRY_MAP,
  STATUS_MAP,
} from "../../../constants/account.constants";

const ACCOUNT_TYPE_OPTIONS = Object.keys(ACCOUNT_TYPE_MAP);
const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_MAP);
const STATUS_OPTIONS = Object.keys(STATUS_MAP);

const AccountForm = ({ account, accounts, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: account?.company_name || "",
    accountType: account
      ? Object.keys(ACCOUNT_TYPE_MAP).find(
          (k) => ACCOUNT_TYPE_MAP[k] === account.account_type
        )
      : "Client",
    industry: account
      ? Object.keys(INDUSTRY_MAP).find(
          (k) => INDUSTRY_MAP[k] === account.industry
        )
      : "Banking",
    gstNumber: account?.gst_number || "",
    panNumber: account?.pan_number || "",
    address: account?.address || "",
    status: account
      ? Object.keys(STATUS_MAP).find(
          (k) => STATUS_MAP[k] === account.status
        )
      : "Active",
    assignedTo: account?.assigned_to || null, // MUST be user ID
  });

  const [errors, setErrors] = useState({});

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";

    if (!formData.gstNumber.trim())
      newErrors.gstNumber = "GST number is required";

    if (!formData.panNumber.trim())
      newErrors.panNumber = "PAN number is required";

    if (
      formData.gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        formData.gstNumber
      )
    ) {
      newErrors.gstNumber = "Invalid GST format";
    }

    if (
      formData.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)
    ) {
      newErrors.panNumber = "Invalid PAN format (ABCDE1234F)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      company_name: formData.companyName.trim(),
      account_type: ACCOUNT_TYPE_MAP[formData.accountType],
      industry: INDUSTRY_MAP[formData.industry],
      gst_number: formData.gstNumber || null,
      pan_number: formData.panNumber || null,
      address: formData.address || null,
      status: STATUS_MAP[formData.status],
      assigned_to: formData.assignedTo || null, // FK → ID
    };

    onSave(payload);
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
          <h2 className="text-xl font-bold">
            {account ? "Edit Account" : "Add New Account"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* BASIC INFO */}
          <div>
            <h3 className="font-semibold mb-3">Basic Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Company Name *</label>
                <input
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                />
                {errors.companyName && (
                  <p className="text-xs text-red-600">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">Account Type *</label>
                <select
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {ACCOUNT_TYPE_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {INDUSTRY_OPTIONS.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TAX */}
          <div>
            <h3 className="font-semibold mb-3">Tax Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label>GST Number *</label>
                <input
                  value={formData.gstNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gstNumber: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={15}
                  className="w-full px-4 py-2 border rounded-xl"
                />
                {errors.gstNumber && (
                  <p className="text-xs text-red-600">{errors.gstNumber}</p>
                )}
              </div>

              <div>
                <label>PAN Number *</label>
                <input
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      panNumber: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={10}
                  className="w-full px-4 py-2 border rounded-xl"
                />
                {errors.panNumber && (
                  <p className="text-xs text-red-600">{errors.panNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* EXTRA */}
          <div>
            <h3 className="font-semibold mb-3">Additional Information</h3>

            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-xl"
              placeholder="Address"
            />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
            >
              {account ? "Update Account" : "Add Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;


// // AccountForm.jsx
// import React, { useState } from "react";
// import { X } from "lucide-react";

// import {
//   ACCOUNT_TYPE_MAP,
//   INDUSTRY_MAP,
//   STATUS_MAP,
// } from "../../../constants/account.constants";

// const AccountForm = ({ account, accounts, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     companyName: account?.companyName || "",
//     accountType: account?.accountType || "Client",
//     industry: account?.industry || "Banking",
//     gstNumber: account?.gstNumber || "",
//     panNumber: account?.panNumber || "",
//     address: account?.address || "",
//     status: account?.status || "Active",
//     assignedTo: account?.assignedTo || "",
//     parentAccountId: account?.parentAccountId || null,
//   });
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.companyName.trim())
//       newErrors.companyName = "Company name is required";
//     if (!formData.gstNumber.trim())
//       newErrors.gstNumber = "GST number is required";
//     if (!formData.panNumber.trim())
//       newErrors.panNumber = "PAN number is required";

//     // GST format validation (basic)
//     if (
//       formData.gstNumber &&
//       !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
//         formData.gstNumber,
//       )
//     ) {
//       newErrors.gstNumber = "Invalid GST format";
//     }

//     // PAN format validation
//     if (
//       formData.panNumber &&
//       !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)
//     ) {
//       newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const payload = {
//       company_name: formData.companyName,
//       account_type: ACCOUNT_TYPE_MAP[formData.accountType],
//       industry: INDUSTRY_MAP[formData.industry],
//       gst_number: formData.gstNumber || null,
//       pan_number: formData.panNumber || null,
//       address: formData.address || null,
//       status: STATUS_MAP[formData.status],
//       assigned_to: formData.assignedTo || null, // MUST be user ID
//     };

//     onSave(payload);
//   };

//   const availableParentAccounts = accounts.filter(
//     (acc) => acc.id !== account?.id && !acc.parentAccountId,
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <h2 className="text-xl font-bold text-gray-900">
//             {account ? "Edit Account" : "Add New Account"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Basic Information */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Basic Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company Name <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.companyName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, companyName: e.target.value })
//                   }
//                   className={`w-full px-4 py-2 bg-gray-50 rounded-xl border ${
//                     errors.companyName ? "border-red-500" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                   placeholder="ABC Corporation Pvt Ltd"
//                 />
//                 {errors.companyName && (
//                   <p className="text-xs text-red-600 mt-1">
//                     {errors.companyName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Account Type <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   value={formData.accountType}
//                   onChange={(e) =>
//                     setFormData({ ...formData, accountType: e.target.value })
//                   }
//                   className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {account_type.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Industry <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   value={formData.industry}
//                   onChange={(e) =>
//                     setFormData({ ...formData, industry: e.target.value })
//                   }
//                   className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {industries.map((industry) => (
//                     <option key={industry} value={industry}>
//                       {industry}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Tax Information */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Tax Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   GST Number <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.gstNumber}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       gstNumber: e.target.value.toUpperCase(),
//                     })
//                   }
//                   className={`w-full px-4 py-2 bg-gray-50 rounded-xl border ${
//                     errors.gstNumber ? "border-red-500" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                   placeholder="22AAAAA0000A1Z5"
//                   maxLength="15"
//                 />
//                 {errors.gstNumber && (
//                   <p className="text-xs text-red-600 mt-1">
//                     {errors.gstNumber}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   PAN Number <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.panNumber}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       panNumber: e.target.value.toUpperCase(),
//                     })
//                   }
//                   className={`w-full px-4 py-2 bg-gray-50 rounded-xl border ${
//                     errors.panNumber ? "border-red-500" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                   placeholder="ABCDE1234F"
//                   maxLength="10"
//                 />
//                 {errors.panNumber && (
//                   <p className="text-xs text-red-600 mt-1">
//                     {errors.panNumber}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Additional Information */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Additional Information
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address
//                 </label>
//                 <textarea
//                   value={formData.address}
//                   onChange={(e) =>
//                     setFormData({ ...formData, address: e.target.value })
//                   }
//                   rows="3"
//                   className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Street, City, State, PIN"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Assigned To
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.assignedTo}
//                     onChange={(e) =>
//                       setFormData({ ...formData, assignedTo: e.target.value })
//                     }
//                     className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Manager/Agent name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) =>
//                       setFormData({ ...formData, status: e.target.value })
//                     }
//                     className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                     <option value="Archived">Archived</option>
//                   </select>
//                 </div>

//                 {availableParentAccounts.length > 0 && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Parent Account (Optional)
//                     </label>
//                     <select
//                       value={formData.parentAccountId || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           parentAccountId: e.target.value || null,
//                         })
//                       }
//                       className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="">None (Independent Account)</option>
//                       {availableParentAccounts.map((acc) => (
//                         <option key={acc.id} value={acc.id}>
//                           {acc.companyName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
//             >
//               {account ? "Update Account" : "Add Account"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AccountForm;
