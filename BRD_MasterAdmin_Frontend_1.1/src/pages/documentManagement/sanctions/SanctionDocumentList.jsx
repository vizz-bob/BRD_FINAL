import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit,
  FiEye,
  FiSearch,
   FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

const SanctionDocumentList = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD SANCTION DOCUMENTS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const data = await documentService.getSanctionDocuments();
        setDocuments(data || []);
        */

        // TEMP MOCK DATA
        setDocuments([
          {
            id: 1,
            document_type: "KYC Document",
            requirement_type: "Mandatory",
            requirement_stage: "Pre-Sanction",
            requirement_mode: "Digital",
            status: "Active",
          },
          {
            id: 2,
            document_type: "Income Proof",
            requirement_type: "Mandatory",
            requirement_stage: "Post-Sanction",
            requirement_mode: "Physical",
            status: "Active",
          },
          {
            id: 3,
            document_type: "Bank Statement",
            requirement_type: "Optional",
            requirement_stage: "Pre-Sanction",
            requirement_mode: "Digital",
            status: "Inactive",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this record? This action cannot be undone."
  );
  if (!confirmed) return;

  try {
    /*
    await documentService.deleteXXX(id);
    */

    // Optimistic UI update
    setDocuments((prev) => prev.filter((item) => item.id !== id));
  } catch (err) {
    console.error("Delete failed", err);
    alert("Unable to delete. Please try again.");
  }
};


  /* ---------------- SEARCH ---------------- */
  const filteredDocuments = documents.filter((doc) =>
    doc.document_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Sanction Documents
          </h1>
          <p className="text-sm text-gray-500">
            Configure documents required during loan sanction stage
          </p>
        </div>

        <button
          onClick={() => navigate("/documents/sanction/add")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Document
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by document type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500">Loading documents...</p>
      ) : (
        <div className="space-y-3">
          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-7 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
            <div>Document Type</div>
            <div>Requirement Type</div>
            <div>Requirement Stage</div>
            <div>Requirement Mode</div>
            <div>Status</div>
            <div className="text-right col-span-2">Action</div>
          </div>

          {/* ROWS */}
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-7 gap-y-2 items-center text-sm"
            >
              <div className="font-medium text-gray-900">
                {doc.document_type}
              </div>

              <div className="text-gray-600">
                {doc.requirement_type}
              </div>

              <div className="text-gray-600">
                {doc.requirement_stage}
              </div>

              <div className="text-gray-600">
                {doc.requirement_mode}
              </div>

              <div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    doc.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              {/* ACTIONS */}
           <div className="flex justify-end gap-2 col-span-2">
  <button
    onClick={() => navigate(`/documents/sanction/${doc.id}`)}
    className="p-2 rounded-full bg-gray-100"
  >
    <FiEye />
  </button>

  <button
    onClick={() => navigate(`/documents/sanction/${doc.id}/edit`)}
    className="p-2 rounded-full bg-blue-100 text-blue-600"
  >
    <FiEdit />
  </button>

  <button
    onClick={() => handleDelete(doc.id)}
    className="p-2 rounded-full bg-red-100 text-red-600"
  >
    <FiTrash2 />
  </button>
</div>

            </div>
          ))}

          {filteredDocuments.length === 0 && (
            <p className="text-gray-500 text-sm">
              No sanction documents found.
            </p>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default SanctionDocumentList;
