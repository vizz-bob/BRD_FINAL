// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";

// import {
//   Header,
//   Select,
//   SaveBtn,
// } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function EditInvestigationReport() {
//   const navigate = useNavigate();

//   /* -------- MOCK PREFILLED DATA -------- */
//   const [form, setForm] = useState({
//     reportType: "Fraud",
//     outcome: "Clean",
//     ratingScale: "0 - 10",
//     active: true,
//   });

//   return (
//     <MainLayout>
//       {/* HEADER */}
//       <Header
//         title="Edit Investigation Report"
//         subtitle="Update investigation-based scoring configuration"
//         onBack={() => navigate(-1)}
//       />

//       {/* FORM */}
//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* REPORT TYPE */}
//         <Select
//           label="Report Type"
//           value={form.reportType}
//           onChange={(e) =>
//             setForm({ ...form, reportType: e.target.value })
//           }
//           options={["Legal", "Technical", "Fraud"]}
//           required
//         />

//         {/* INVESTIGATION OUTCOME */}
//         <Select
//           label="Investigation Outcome"
//           value={form.outcome}
//           onChange={(e) =>
//             setForm({ ...form, outcome: e.target.value })
//           }
//           options={["Clean", "Flagged", "Pending"]}
//           required
//         />

//         {/* RATING SCALE */}
//         <Select
//           label="Rating Scale"
//           value={form.ratingScale}
//           onChange={(e) =>
//             setForm({ ...form, ratingScale: e.target.value })
//           }
//           options={["0 - 10", "0 - 50", "0 - 100"]}
//           required
//         />

//         {/* STATUS */}
//         <ToggleSwitch
//           label="Active"
//           checked={form.active}
//           onChange={(val) =>
//             setForm({ ...form, active: val })
//           }
//         />

//         {/* ACTIONS */}
//         <div className="md:col-span-2 flex justify-end">
//           <SaveBtn
//             label="Update Configuration"
//             onClick={() => navigate(-1)}
//           />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
