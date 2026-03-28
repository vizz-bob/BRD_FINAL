import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

const CollateralDocumentList = () => {
  const navigate = useNavigate();

  const [collaterals, setCollaterals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const data = await documentService.getCollateralDocuments();
        setCollaterals(data || []);
        */

        // MOCK DATA
        setCollaterals([
          {
            id: 1,
            collateral_category: "Immovable",
            collateral_type: "Property",
            coverage_type: "Full",
            mode: "Registered",
            ltv_ratio: "70%",
            status: "Active",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collateral rule?"
    );
    if (!confirmed) return;

    try {
      /*
      await documentService.deleteCollateralDocument(id);
      */

      // Optimistic UI update
      setCollaterals((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("DELETE COLLATERAL ERROR:", err);
      alert("Unable to delete collateral document.");
    }
  };

  /* ---------------- SEARCH ---------------- */
  const filtered = collaterals.filter((c) =>
    c.collateral_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Collateral Documents</h1>
          <p className="text-sm text-gray-500">
            Configure collateral security & value mapping rules
          </p>
        </div>

        <button
          onClick={() => navigate("/documents/collateral/add")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2"
        >
          <FiPlus /> Add Collateral Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by collateral type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500">Loading collateral documents...</p>
      ) : (
        <div className="space-y-3">
          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-7 bg-gray-100 px-5 py-3 rounded-xl text-xs font-semibold text-gray-600">
            <div>Category</div>
            <div>Type</div>
            <div>Coverage</div>
            <div>Mode</div>
            <div>LTV</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          {/* ROWS */}
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white grid grid-cols-2 md:grid-cols-7 px-5 py-4 rounded-2xl shadow-sm items-center text-sm"
            >
              <div>{c.collateral_category}</div>
              <div>{c.collateral_type}</div>
              <div>{c.coverage_type}</div>
              <div>{c.mode}</div>
              <div>{c.ltv_ratio}</div>
              <div>
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {c.status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    navigate(`/documents/collateral/${c.id}`)
                  }
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <FiEye />
                </button>

                <button
                  onClick={() =>
                    navigate(`/documents/collateral/${c.id}/edit`)
                  }
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  <FiEdit />
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">
              No collateral documents found.
            </p>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default CollateralDocumentList;
