import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientView() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Client Detail</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-2 text-sm">
        <p><b>Client Category:</b> Individual</p>
        <p><b>Client Type:</b> Salaried</p>
        <p><b>Role:</b> Applicant</p>
        <p><b>Industry:</b> IT</p>
        <p><b>Employment Type:</b> Salaried</p>
        <p><b>Occupation:</b> Software Engineer</p>
        <p><b>Group Loan:</b> Enabled</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={() =>
              navigate(`/profile-management/client/edit/${id}`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Edit Client
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
