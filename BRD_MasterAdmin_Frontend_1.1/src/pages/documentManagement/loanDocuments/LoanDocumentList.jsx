import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

const LoanDocumentList = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setDocuments([
          {
            id: 1,
            document_type: "Loan Agreement",
            requirement_type: "Mandatory",
            requirement_stage: "Disbursement",
            requirement_mode: "eSign",
            status: "Active",
          },
          {
            id: 2,
            document_type: "Insurance Policy",
            requirement_type: "Optional",
            requirement_stage: "Monitoring",
            requirement_mode: "Digital",
            status: "Active",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan document rule?")) return;

    try {
      // await documentService.deleteLoanDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("DELETE LOAN DOCUMENT ERROR:", err);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.document_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Loan Documents
          </h1>
          <p className="text-sm text-gray-500">
            Configure documents required during loan approval and disbursement
          </p>
        </div>

        <button
          onClick={() => navigate("/documents/loan/add")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-blue-600 text-white"
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
          <div className="hidden md:grid grid-cols-7 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
            <div>Document Type</div>
            <div>Requirement Type</div>
            <div>Requirement Stage</div>
            <div>Requirement Mode</div>
            <div>Status</div>
            <div className="text-right col-span-2">Action</div>
          </div>

          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-7 items-center text-sm"
            >
              <div className="font-medium">{doc.document_type}</div>
              <div>{doc.requirement_type}</div>
              <div>{doc.requirement_stage}</div>
              <div>{doc.requirement_mode}</div>

              <div>
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {doc.status}
                </span>
              </div>

              <div className="flex justify-end gap-2 col-span-2">
                <button
                  onClick={() => navigate(`/documents/loan/${doc.id}`)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <FiEye />
                </button>

                <button
                  onClick={() =>
                    navigate(`/documents/loan/${doc.id}/edit`)
                  }
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                >
                  <FiEdit />
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default LoanDocumentList;
