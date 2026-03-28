// import React, { useState } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";
// import { Header, Select, SaveBtn } from "../../../../components/Controls/SharedUIHelpers";

// export default function AddTeleVerification() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     applicant: "",
//     contactMode: "",
//     verifiedBy: "",
//     outcome: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Add TeleVerification:", form);
//     navigate("/controls/verification/tele-verification");
//   };

//   return (
//     <MainLayout>
//       <Header
//         title="Add Tele Verification"
//         subtitle="Create a new tele-verification record"
//         back={() => navigate(-1)}
//       />

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-2xl shadow-md max-w-2xl grid md:grid-cols-2 gap-6"
//       >
//         <div>
//           <label className="text-sm font-medium text-gray-700">Applicant Name</label>
//           <input
//             type="text"
//             name="applicant"
//             value={form.applicant}
//             onChange={handleChange}
//             required
//             className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <Select
//           label="Contact Mode"
//           name="contactMode"
//           value={form.contactMode}
//           onChange={handleChange}
//           options={["Phone", "Video Call"]}
//         />

//         <div>
//           <label className="text-sm font-medium text-gray-700">Verified By</label>
//           <input
//             type="text"
//             name="verifiedBy"
//             value={form.verifiedBy}
//             onChange={handleChange}
//             required
//             className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <Select
//           label="Outcome"
//           name="outcome"
//           value={form.outcome}
//           onChange={handleChange}
//           options={["Pending", "Success", "Failure"]}
//         />

//         <div className="md:col-span-2 flex justify-end mt-4">
//           <SaveBtn onClick={handleSubmit} text="Save Tele Verification" />
//         </div>
//       </form>
//     </MainLayout>
//   );
// }
