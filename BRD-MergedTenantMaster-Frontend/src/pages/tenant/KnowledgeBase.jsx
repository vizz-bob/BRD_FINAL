import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  DocumentArrowDownIcon,
  PlayCircleIcon,
  FolderIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

export default function KnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("knowledge-base/");
        setDocs(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      } catch (err) {
        console.error("Fetch docs failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 font-sans">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8 lg:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium mt-1">
            Training materials, policy documents, and SOPs.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all shrink-0">
          <ArrowUpTrayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline sm:inline">Upload Resource</span>
          <span className="xs:hidden sm:hidden">Upload</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 sm:h-48 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (Array.isArray(docs) ? docs : []).length === 0 ? (
        /* Empty State */
        <div className="text-center py-14 sm:py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 px-4">
          <FolderIcon className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-slate-500">No documents found</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload training videos or PDFs to get started.
          </p>
        </div>
      ) : (
        /* Doc Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(Array.isArray(docs) ? docs : []).map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-200 group cursor-pointer active:scale-[0.98]"
            >
              {/* Thumbnail */}
              <div
                className={`h-28 sm:h-32 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${doc.type === "VIDEO"
                    ? "bg-rose-50 text-rose-500"
                    : "bg-blue-50 text-blue-500"
                  }`}
              >
                {doc.type === "VIDEO" ? (
                  <PlayCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <DocumentArrowDownIcon className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-110 transition-transform duration-200" />
                )}
              </div>

              {/* Info */}
              <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{doc.title}</h3>
              <div className="flex justify-between items-center mt-2 gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide truncate">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 shrink-0">
                  {doc.size || "2 MB"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
