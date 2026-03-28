import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function VendorView() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Vendor Detail</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-2 text-sm">
        <p><b>Type:</b> Company</p>
        <p><b>Category:</b> Legal</p>
        <p><b>Constitution:</b> Pvt Ltd</p>
        <p><b>Location:</b> Mumbai</p>
        <p><b>Service Type:</b> Documentation</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={() =>
              navigate(`/profile-management/vendor/edit/${id}`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Edit Vendor
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
