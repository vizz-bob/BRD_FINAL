// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";

// import {
//   Header,
//   Select,
//   SaveBtn,
// } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function EditCreditHistory() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     bureau: "CIBIL",
//     minScore: "650",
//     maxScore: "900",
//     active: true,
//   });

//   return (
//     <MainLayout>
//       <Header
//         title="Edit Credit History Rule"
//         subtitle="Update credit score configuration"
//         onBack={() => navigate(-1)}
//       />

//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl grid gap-6">
//         <Select
//           label="Credit Bureau"
//           value={form.bureau}
//           onChange={(e) =>
//             setForm({ ...form, bureau: e.target.value })
//           }
//           options={["CIBIL", "Experian", "Equifax", "CRIF"]}
//         />

//         <input
//           type="number"
//           value={form.minScore}
//           onChange={(e) =>
//             setForm({ ...form, minScore: e.target.value })
//           }
//           className="p-3 rounded-xl border bg-gray-50"
//         />

//         <input
//           type="number"
//           value={form.maxScore}
//           onChange={(e) =>
//             setForm({ ...form, maxScore: e.target.value })
//           }
//           className="p-3 rounded-xl border bg-gray-50"
//         />

//         <ToggleSwitch
//           label="Active"
//           checked={form.active}
//           onChange={(val) =>
//             setForm({ ...form, active: val })
//           }
//         />

//         <div className="flex justify-end">
//           <SaveBtn label="Update" onClick={() => navigate(-1)} />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
