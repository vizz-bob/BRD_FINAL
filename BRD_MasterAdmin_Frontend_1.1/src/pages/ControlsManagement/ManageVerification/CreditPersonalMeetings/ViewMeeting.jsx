// import React from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate } from "react-router-dom";
// import { Header } from "../../../../components/Controls/SharedUIHelpers";

// export default function ViewMeeting() {
//   const navigate = useNavigate();

//   const data = {
//     meetingType: "Home Visit",
//     applicantType: "Primary Applicant",
//     mandatory: "Yes",
//     remarks: "Residence verification required",
//   };

//   return (
//     <MainLayout>
//       <Header
//         title="View Credit Personal Meeting"
//         subtitle="Meeting configuration details"
//         onBack={() => navigate(-1)}
//       />

//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid md:grid-cols-2 gap-6 text-sm">
//         <Info label="Meeting Type" value={data.meetingType} />
//         <Info label="Applicant Type" value={data.applicantType} />
//         <Info label="Mandatory" value={data.mandatory} />
//         <Info
//           label="Remarks"
//           value={data.remarks}
//           className="md:col-span-2"
//         />
//       </div>
//     </MainLayout>
//   );
// }

// const Info = ({ label, value, className = "" }) => (
//   <div className={className}>
//     <p className="text-gray-500 text-xs">{label}</p>
//     <p className="font-medium text-gray-800 mt-1">{value}</p>
//   </div>
// );
