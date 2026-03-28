import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CityList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([
    { id: 1, name: "Mumbai", state: "Maharashtra" },
    { id: 2, name: "Los Angeles", state: "California" },
  ]);

  const filtered = cities.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this city?")) return;
    setCities(cities.filter((c) => c.id !== id));
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Manage Cities</h1>
          <p className="text-sm text-gray-500">Add, edit, or delete cities</p>
        </div>
        <button
          onClick={() => navigate("/controls/geo/add-city")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          <FiPlus /> Add City
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search by city or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-3 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Name</div>
          <div>State</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-3 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">{c.name}</div>
            <div className="text-gray-600">{c.state}</div>
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton color="blue" onClick={() => navigate(`/controls/geo/edit-city/${c.id}`)}>
                <FiEdit3 />
              </IconButton>
              <IconButton color="red" onClick={() => handleDelete(c.id)}>
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

const IconButton = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
