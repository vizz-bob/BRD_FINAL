// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";
// import { Header, Select, SaveBtn } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function EditMeeting() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     meetingType: "Home Visit",
//     applicantType: "Primary Applicant",
//     mandatory: true,
//     remarks: "Initial residence verification",
//   });

//   return (
//     <MainLayout>
//       <Header
//         title="Edit Credit Personal Meeting"
//         subtitle="Update meeting configuration"
//         onBack={() => navigate(-1)}
//       />

//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid md:grid-cols-2 gap-6">
//         <Select
//           label="Meeting Type"
//           value={form.meetingType}
//           onChange={(e) =>
//             setForm({ ...form, meetingType: e.target.value })
//           }
//           options={["Home Visit", "Office Visit", "Branch Visit"]}
//         />

//         <Select
//           label="Applicant Type"
//           value={form.applicantType}
//           onChange={(e) =>
//             setForm({ ...form, applicantType: e.target.value })
//           }
//           options={["Primary Applicant", "Co-Applicant", "Guarantor"]}
//         />

//         <div className="md:col-span-2 flex items-center gap-4">
//           <ToggleSwitch
//             checked={form.mandatory}
//             onChange={(v) => setForm({ ...form, mandatory: v })}
//           />
//           <span className="text-sm text-gray-700">
//             Mandatory Meeting
//           </span>
//         </div>

//         <div className="md:col-span-2">
//           <label className="text-sm font-medium text-gray-700">
//             Remarks
//           </label>
//           <textarea
//             value={form.remarks}
//             onChange={(e) =>
//               setForm({ ...form, remarks: e.target.value })
//             }
//             rows={3}
//             className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm"
//           />
//         </div>

//         <div className="md:col-span-2 flex justify-end">
//           <SaveBtn label="Update Meeting" onClick={() => navigate(-1)} />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
