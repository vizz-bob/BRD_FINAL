// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";

// import {
//   Header,
//   Select,
//   SaveBtn,
// } from "../../../../components/Controls/SharedUIHelpers";
// import ToggleSwitch from "../../../../components/Controls/ToggleSwitch";

// export default function EditReferenceCheck() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     criteria: "Employment",
//     ratingScale: "0 - 10",
//     active: true,
//   });

//   return (
//     <MainLayout>
//       <Header
//         title="Edit Reference Check"
//         subtitle="Update reference scoring configuration"
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
//         />

//         <Select
//           label="Rating Scale"
//           value={form.ratingScale}
//           onChange={(e) =>
//             setForm({ ...form, ratingScale: e.target.value })
//           }
//           options={["0 - 10", "0 - 50", "0 - 100"]}
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
