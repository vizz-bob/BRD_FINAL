import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function LanguageList() {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchLanguages = async () => {
    setLoading(true);
    const data = await controlsManagementService.languages.list();
    setLanguages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  /* ================= FILTER ================= */
  const filtered = languages.filter(
    (l) =>
      l.language_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.language_code?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this language?")) return;
    const success = await controlsManagementService.languages.delete(id);
    if (success) {
      setLanguages((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Manage Languages</h1>
          <p className="text-sm text-gray-500">
            Configure platform languages
          </p>
        </div>

        <button
          onClick={() => navigate("/controls/language/add")}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm"
        >
          <FiPlus /> Add Language
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:grid grid-cols-4 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10">
          <div>Name</div>
          <div>Code</div>
          <div>Default</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading languages...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No languages found
          </div>
        ) : (
          filtered.map((lang) => (
            <React.Fragment key={lang.id}>

              {/* ================= DESKTOP ROW ================= */}
              <div className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm grid-cols-4 items-center text-sm">
                <div className="font-medium truncate">
                  {lang.language_name}
                </div>
                <div className="text-gray-600">{lang.language_code}</div>

                <span
                  className={`w-fit px-3 py-1 text-xs rounded-full ${
                    lang.is_default
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {lang.is_default ? "Default" : "—"}
                </span>

                <div className="flex justify-end gap-2">
                  <IconButton
                    color="blue"
                    onClick={() =>
                      navigate(`/controls/language/edit/${lang.id}`)
                    }
                  >
                    <FiEdit3 />
                  </IconButton>
                  <IconButton
                    color="red"
                    onClick={() => handleDelete(lang.id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </div>
              </div>

              {/* ================= MOBILE CARD ================= */}
              <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
                {/* TOP */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-sm">
                    {lang.language_name}
                  </span>

                  <div className="flex gap-3 text-gray-600">
                    <FiEdit3
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/controls/language/edit/${lang.id}`)
                      }
                    />
                    <FiTrash2
                      className="cursor-pointer"
                      onClick={() => handleDelete(lang.id)}
                    />
                  </div>
                </div>

                {/* BODY */}
                <div className="px-4 py-3 space-y-3 text-sm">
                  <Row label="Code" value={lang.language_code} />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Default</span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        lang.is_default
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lang.is_default ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </MainLayout>
  );
}

/* ================= HELPERS ================= */

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="font-medium text-gray-800 text-right">
      {value || "-"}
    </span>
  </div>
);

const IconButton = ({ children, onClick, color }) => {
  const map = {
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-full ${map[color]}`}>
      {children}
    </button>
  );
};
