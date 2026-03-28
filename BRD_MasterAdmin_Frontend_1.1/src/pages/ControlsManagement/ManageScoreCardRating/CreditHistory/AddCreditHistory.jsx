// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";

// import {
//   Header,
//   Select,
//   SaveBtn,
// } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function AddCreditHistory() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     bureau: "",
//     minScore: "",
//     maxScore: "",
//     active: true,
//   });

//   return (
//     <MainLayout>
//       <Header
//         title="Add Credit History Rule"
//         subtitle="Define credit bureau score thresholds"
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
//           required
//         />

//         <input
//           type="number"
//           placeholder="Minimum Score"
//           value={form.minScore}
//           onChange={(e) =>
//             setForm({ ...form, minScore: e.target.value })
//           }
//           className="p-3 rounded-xl border bg-gray-50"
//         />

//         <input
//           type="number"
//           placeholder="Maximum Score"
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
//           <SaveBtn onClick={() => navigate(-1)} />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
