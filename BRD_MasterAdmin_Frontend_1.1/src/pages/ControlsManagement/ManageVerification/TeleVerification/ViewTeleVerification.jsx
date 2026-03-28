// import React, { useState, useEffect } from "react";
// import MainLayout from "../../../../layout/MainLayout";
// import { useNavigate, useParams } from "react-router-dom";
// import { Header } from "../../../../components/Controls/SharedUIHelpers";

// export default function ViewTeleVerification() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [data, setData] = useState({});

//   useEffect(() => {
//     // Fetch tele verification data by id (mocked)
//     setData({
//       applicant: "John Doe",
//       contactMode: "Phone",
//       verifiedBy: "Agent 1",
//       outcome: "Pending",
//     });
//   }, [id]);

//   return (
//     <MainLayout>
//       <Header
//         title="View Tele Verification"
//         subtitle={`Details of tele-verification record #${id}`}
//         back={() => navigate(-1)}
//       />

//       <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl grid gap-4">
//         <div>
//           <h3 className="text-gray-500 text-sm">Applicant</h3>
//           <p className="font-medium text-gray-900">{data.applicant}</p>
//         </div>
//         <div>
//           <h3 className="text-gray-500 text-sm">Contact Mode</h3>
//           <p className="font-medium text-gray-900">{data.contactMode}</p>
//         </div>
//         <div>
//           <h3 className="text-gray-500 text-sm">Verified By</h3>
//           <p className="font-medium text-gray-900">{data.verifiedBy}</p>
//         </div>
//         <div>
//           <h3 className="text-gray-500 text-sm">Outcome</h3>
//           <p className="font-medium text-gray-900">{data.outcome}</p>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
