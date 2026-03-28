import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function AgentView() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Agent Detail</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-2 text-sm">
        <p><b>Agent Type:</b> DSA</p>
        <p><b>Category:</b> Freelance</p>
        <p><b>Level:</b> Tier 1</p>
        <p><b>Constitution:</b> Individual</p>
        <p><b>Location:</b> Pune</p>
        <p><b>Service Type:</b> Lead Generation</p>
        <p><b>Responsibilities:</b> Sourcing, Support</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={() =>
              navigate(`/profile-management/agent/edit/${id}`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Edit Agent
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
