// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";

// import {
//   Header,
//   Select,
//   SaveBtn,
// } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function AddReferenceCheck() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     criteria: "",
//     ratingScale: "",
//     active: true,
//   });

//   return (
//     <MainLayout>
//       <Header
//         title="Add Reference Check"
//         subtitle="Define reference-based scoring criteria"
//         onBack={() => navigate(-1)}
//       />

//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl grid gap-6">
//         <Select
//           label="Check Criteria"
//           value={form.criteria}
//           onChange={(e) =>
//             setForm({ ...form, criteria: e.target.value })
//           }
//           options={[
//             "Employment",
//             "Address",
//             "Personal Reference",
//           ]}
//           required
//         />

//         <Select
//           label="Rating Scale"
//           value={form.ratingScale}
//           onChange={(e) =>
//             setForm({ ...form, ratingScale: e.target.value })
//           }
//           options={["0 - 10", "0 - 50", "0 - 100"]}
//           required
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
