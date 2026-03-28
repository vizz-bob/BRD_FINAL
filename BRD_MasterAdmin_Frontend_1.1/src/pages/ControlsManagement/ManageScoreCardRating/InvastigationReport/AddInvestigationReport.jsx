// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";

// import { Header, Select, SaveBtn } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function AddInvestigationReport() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     type: "",
//     outcome: "",
//     active: true,
//   });

//   return (
//     <MainLayout>
//       <Header
//         title="Add Investigation Report Rule"
//         subtitle="Configure report scoring outcome"
//         onBack={() => navigate(-1)}
//       />

//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl grid gap-6">
//         <Select
//           label="Report Type"
//           value={form.type}
//           onChange={(e) => setForm({ ...form, type: e.target.value })}
//           options={["Legal", "Technical", "Fraud"]}
//           required
//         />

//         <Select
//           label="Investigation Outcome"
//           value={form.outcome}
//           onChange={(e) => setForm({ ...form, outcome: e.target.value })}
//           options={["Clean", "Flagged", "Pending"]}
//           required
//         />

//         <ToggleSwitch
//           label="Active"
//           checked={form.active}
//           onChange={(val) => setForm({ ...form, active: val })}
//         />

//         <div className="flex justify-end">
//           <SaveBtn onClick={() => navigate(-1)} />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
