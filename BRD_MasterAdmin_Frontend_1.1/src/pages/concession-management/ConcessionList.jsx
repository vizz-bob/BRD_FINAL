import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import concessionManagementService from "../../services/concessionManagementService";

export default function ConcessionList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("TYPE");
  const [search, setSearch] = useState("");

  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    activeTab === "TYPE" ? fetchTypes() : fetchCategories();
  }, [activeTab]);

  const fetchTypes = async () => {
    const res = await concessionManagementService.getAllTypes();
    setTypes(res || []);
  };

  const fetchCategories = async () => {
    const res = await concessionManagementService.getAllCategories();
    setCategories(res || []);
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Deactivate this record?")) return;
    activeTab === "TYPE"
      ? await concessionManagementService.deleteType(uuid)
      : await concessionManagementService.deleteCategory(uuid);
    activeTab === "TYPE" ? fetchTypes() : fetchCategories();
  };

  const filtered =
    activeTab === "TYPE"
      ? types.filter((t) =>
          t.concession_type_name?.toLowerCase().includes(search.toLowerCase())
        )
      : categories.filter((c) =>
          c.category_name?.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Concession Management</h1>
          <p className="text-sm text-gray-500">
            Manage concession types and categories
          </p>
        </div>

        <div className="flex gap-2">
          <AddButton onClick={() => navigate("/concession-management/type/add")}>
            Concession Type
          </AddButton>
          <AddButton
            color="indigo"
            onClick={() => navigate("/concession-management/category/add")}
          >
            Concession Category
          </AddButton>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-4">
        <Tab active={activeTab === "TYPE"} onClick={() => setActiveTab("TYPE")}>
          Concession Types
        </Tab>
        <Tab
          active={activeTab === "CATEGORY"}
          onClick={() => setActiveTab("CATEGORY")}
        >
          Concession Categories
        </Tab>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            activeTab === "TYPE"
              ? "Search concession type..."
              : "Search category..."
          }
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* DESKTOP HEADER */}
        <div
          className="hidden md:grid bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10"
          style={{
            gridTemplateColumns:
              activeTab === "TYPE"
                ? "repeat(4,1fr)"
                : "repeat(6,1fr)",
          }}
        >
          {activeTab === "TYPE" ? (
            <>
              <div>Type Name</div>
              <div>Applicable On</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </>
          ) : (
            <>
              <div>Category</div>
              <div>Type</div>
              <div>Product</div>
              <div>Validity</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </>
          )}
        </div>

        {filtered.map((item) => (
          <React.Fragment key={item.uuid}>
            {/* DESKTOP ROW */}
            <div
              className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm items-center text-sm"
              style={{
                gridTemplateColumns:
                  activeTab === "TYPE"
                    ? "repeat(4,1fr)"
                    : "repeat(6,1fr)",
              }}
            >
              {activeTab === "TYPE" ? (
                <>
                  <div className="font-medium">
                    {item.concession_type_name}
                  </div>
                  <div>{item.applicable_on}</div>
                  <StatusBadge status={item.status} />
                </>
              ) : (
                <>
                  <div className="font-medium">{item.category_name}</div>
                  <div>{item.concession_type_name}</div>
                  <div>{item.product_type}</div>
                  <div className="text-xs">
                    {item.valid_from} → {item.valid_to}
                  </div>
                  <StatusBadge status={item.status} />
                </>
              )}

              <ActionButtons
                onView={() =>
                  navigate(
                    activeTab === "TYPE"
                      ? `/concession-management/type/view/${item.uuid}`
                      : `/concession-management/category/view/${item.uuid}`
                  )
                }
                onEdit={() =>
                  navigate(
                    activeTab === "TYPE"
                      ? `/concession-management/type/edit/${item.uuid}`
                      : `/concession-management/category/edit/${item.uuid}`
                  )
                }
                onDelete={() => handleDelete(item.uuid)}
              />
            </div>

            {/* MOBILE CARD */}
            <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="font-semibold text-sm">
                  {activeTab === "TYPE"
                    ? item.concession_type_name
                    : item.category_name}
                </span>

                <div className="flex gap-3 text-gray-600">
                  <FiEye
                    onClick={() =>
                      navigate(
                        activeTab === "TYPE"
                          ? `/concession-management/type/view/${item.uuid}`
                          : `/concession-management/category/view/${item.uuid}`
                      )
                    }
                  />
                  <FiEdit3
                    onClick={() =>
                      navigate(
                        activeTab === "TYPE"
                          ? `/concession-management/type/edit/${item.uuid}`
                          : `/concession-management/category/edit/${item.uuid}`
                      )
                    }
                  />
                  <FiTrash2 onClick={() => handleDelete(item.uuid)} />
                </div>
              </div>

              <div className="px-4 py-3 space-y-3 text-sm">
                {activeTab === "TYPE" ? (
                  <>
                    <Row label="Applicable On" value={item.applicable_on} />
                  </>
                ) : (
                  <>
                    <Row label="Type" value={item.concession_type_name} />
                    <Row label="Product" value={item.product_type} />
                    <Row
                      label="Validity"
                      value={`${item.valid_from} → ${item.valid_to}`}
                    />
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Status</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </MainLayout>
  );
}

/* ================= HELPERS ================= */

const Tab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const AddButton = ({ children, onClick, color = "blue" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-${color}-600 text-white rounded-xl text-sm flex items-center gap-2`}
  >
    <FiPlus /> {children}
  </button>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="font-medium text-gray-800 text-right">{value || "-"}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center justify-center
      px-3 py-1 text-xs font-medium
      rounded-full w-fit whitespace-nowrap leading-none
      ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
  >
    {status}
  </span>
);


const ActionButtons = ({ onView, onEdit, onDelete }) => (
  <div className="flex justify-end gap-2">
    <IconButton color="gray" onClick={onView}>
      <FiEye />
    </IconButton>
    <IconButton color="blue" onClick={onEdit}>
      <FiEdit3 />
    </IconButton>
    <IconButton color="red" onClick={onDelete}>
      <FiTrash2 />
    </IconButton>
  </div>
);

const IconButton = ({ children, onClick, color }) => {
  const map = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-full ${map[color]}`}>
      {children}
    </button>
  );
};
