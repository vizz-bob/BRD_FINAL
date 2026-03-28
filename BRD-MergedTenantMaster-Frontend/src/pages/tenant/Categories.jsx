import { useEffect, useState, useMemo, useRef } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../services/categoryService";

export default function Categories() {
  const defaults = useMemo(
    () => ({
      loan: [],
      product: [],
      document: [],
      lead: [],
      source: [],
      customer: [],
      internal_team: [],
      external_team: [],
      income_type: [],
      employment_type: [],
      account_type: [],
      gender: [],
    }),
    []
  );

  const [config, setConfig] = useState(defaults);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCategoryValue, setNewCategoryValue] = useState({});

  const inputRef = useRef(null);

  const cards = useMemo(
    () => [
      { key: "loan", title: "Loan Category", desc: "Types of loans" },
      { key: "product", title: "Product Category", desc: "Loan products" },
      { key: "document", title: "Document Category", desc: "Document types" },
      { key: "lead", title: "Lead Category", desc: "Types of leads" },
      { key: "source", title: "Source Category", desc: "Where lead came from" },
      { key: "customer", title: "Customer Category", desc: "Customer type" },
      { key: "internal_team", title: "Internal Team Category", desc: "Internal role groups" },
      { key: "external_team", title: "External Team Category", desc: "External agency groups" },
      { key: "income_type", title: "Income Types", desc: "Manage sources of income" },
      { key: "employment_type", title: "Employment Types", desc: "Private, Govt, Business, etc." },
      { key: "account_type", title: "Bank Account Types", desc: "Savings, Current, Overdraft" },
      { key: "gender", title: "Genders", desc: "Male, Female, Non-binary, etc." },
    ],
    []
  );

  // -------------------------
  // FETCH CATEGORIES
  // -------------------------
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCategories();
      const grouped = {};

      data.forEach((cat) => {
        grouped[cat.category_key] = grouped[cat.category_key] || [];
        grouped[cat.category_key].push(cat);
      });

      setConfig({ ...defaults, ...grouped });
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // -------------------------
  // CARD COMPONENT
  // -------------------------
  const Card = ({ title, desc, onOpen }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 flex items-center justify-between">
      <div>
        <div className="text-base font-semibold">{title}</div>
        <div className="text-xs text-gray-600 mt-1">{desc}</div>
      </div>
      <button className="h-9 px-3 rounded-lg border border-gray-200" onClick={onOpen}>
        Manage
      </button>
    </div>
  );

  // -------------------------
  // MODAL COMPONENT
  // -------------------------
  const Modal = ({ k, open }) => {
    const card = cards.find((c) => c.key === k);

    // Auto-focus input when modal opens or value changes
    useEffect(() => {
      if (open && inputRef.current) {
        inputRef.current.focus();
      }
    }, [open, k]);

    if (!k) return null;

    return (
      <div
        className={`fixed inset-0 bg-black/25 grid place-items-center z-40 transition-all duration-200
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(null)}
      >
        <div
          className="bg-white w-full max-w-lg rounded-xl border border-gray-200 shadow-card p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-lg font-semibold">{card?.title}</div>

          {loading ? (
            <div className="mt-4 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="mt-4 text-red-500">{error}</div>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-4">
                {(config[k] || []).map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3 w-full">
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 border border-gray-200 w-full">
                      {item.title}
                    </span>

                    <button
                      className="h-8 px-4 rounded-full border border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        try {
                          await deleteCategory(item.id);
                          await fetchCategories();
                        } catch (err) {
                          console.error(err);
                          setError("Failed to delete category");
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Add {card?.title} Item
                </label>

                <input
                  ref={inputRef}
                  value={newCategoryValue[k] || ""}
                  onChange={(e) =>
                    setNewCategoryValue((prev) => ({ ...prev, [k]: e.target.value }))
                  }
                  placeholder={`Add ${card?.title} item`}
                  className="h-9 rounded-lg border border-gray-300 px-3"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      const val = (newCategoryValue[k] || "").trim();
                      if (!val) return;

                      try {
                        await createCategory(k, val, "");
                        setNewCategoryValue((prev) => ({ ...prev, [k]: "" }));
                        await fetchCategories();
                        // focus is handled by useEffect
                      } catch (err) {
                        console.error(err.response?.data || err.message);
                        setError(
                          "Failed to add category: " +
                            (err.response?.data?.title ||
                              err.response?.data?.detail ||
                              "")
                        );
                      }
                    }
                  }}
                />

                <div className="text-xs text-gray-500">Press Enter to add</div>
              </div>
            </>
          )}

          <div className="mt-4 flex justify-center">
            <button className="h-9 px-4 rounded-lg border border-gray-200" onClick={() => setOpen(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const openModal = (key) => {
    setOpen(key);
    fetchCategories();
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
    <div>
      <div className="text-lg md:text-xl font-semibold">Type of Category</div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((c) => (
        <Card key={c.key} title={c.title} desc={c.desc} onOpen={() => openModal(c.key)} />
      ))}
    </div>

      {/* Always Mounted Modal */}
      <Modal k={open} open={open !== null} />
    </div>
  );
}
