import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

/* ---------------- COMPONENT ---------------- */

export default function OtherList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD OTHERS ---------------- */
  useEffect(() => {
    // MOCK DATA (API later)
    setItems([
      {
        id: 1,
        parameter_name: "Temporary High-Risk Pin",
        parameter_value: "302019",
        valid_from: "2025-09-01",
        valid_to: "2025-09-30",
        status: "Active",
      },
      {
        id: 2,
        parameter_name: "Pilot MSME Relaxation",
        parameter_value: "Limit +10%",
        valid_from: "2025-10-01",
        valid_to: "2025-12-31",
        status: "Inactive",
      },
    ]);
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = () => {
    setItems((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            Other Risk Parameters
          </h1>
          <p className="text-sm text-gray-500">
            Manage temporary or custom risk configurations
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/risk-management/others/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Parameter
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-6 py-3 text-xs font-semibold text-gray-600">
          <div>Parameter Name</div>
          <div>Value</div>
          <div>Valid From</div>
          <div>Valid To</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
                       hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-6 items-center text-sm"
          >
            <div className="font-medium">
              {item.parameter_name}
            </div>

            <div className="text-gray-700">
              {item.parameter_value}
            </div>

            <div>{item.valid_from}</div>

            <div>{item.valid_to}</div>

            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() =>
                  navigate(
                    `/risk-management/others/${item.id}/view`
                  )
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/risk-management/others/${item.id}/edit`
                  )
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => {
                  setDeleteId(item.id);
                  setShowDelete(true);
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-gray-500 text-sm">
            No custom parameters defined.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Parameter"
          message="Are you sure you want to delete this parameter?"
          onCancel={() => {
            setShowDelete(false);
            setDeleteId(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
