import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function GeoManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("country");
  const [search, setSearch] = useState("");

  // Dummy data
  const [countries, setCountries] = useState([
    { id: 1, name: "India", code: "IN" },
    { id: 2, name: "United States", code: "US" },
  ]);

  const [cities, setCities] = useState([
    { id: 1, name: "Mumbai", state: "Maharashtra" },
    { id: 2, name: "Los Angeles", state: "California" },
  ]);

  const [areas, setAreas] = useState([
    { id: 1, name: "Andheri", city: "Mumbai" },
    { id: 2, name: "Santa Monica", city: "Los Angeles" },
  ]);

  // Filtered lists
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
  );

  // Delete handlers
  const handleDelete = (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    if (type === "country") setCountries(countries.filter((c) => c.id !== id));
    if (type === "city") setCities(cities.filter((c) => c.id !== id));
    if (type === "area") setAreas(areas.filter((a) => a.id !== id));
  };
  // Tab headers
  const tabs = [
    { key: "country", label: "Countries" },
    { key: "city", label: "Cities" },
    { key: "area", label: "Areas" },
  ];

  // Render table based on active tab
  const renderTable = () => {
    if (activeTab === "country") {
      return (
        <DataTable
          data={filteredCountries}
          columns={["Name", "Code"]}
          actions={{
            edit: (id) => navigate(`/controls/geo/country/edit/${id}`),
            delete: (id) => handleDelete("country", id),
          }}
          type="country"
        />
      );
    } else if (activeTab === "city") {
      return (
        <DataTable
          data={filteredCities}
          columns={["Name", "State"]}
          actions={{
            edit: (id) => navigate(`/controls/geo/city/edit/${id}`),
            delete: (id) => handleDelete("city", id),
          }}
          type="city"
        />
      );
    } else if (activeTab === "area") {
      return (
        <DataTable
          data={filteredAreas}
          columns={["Name", "City"]}
          actions={{
            edit: (id) => navigate(`/controls/geo/area/edit/${id}`),
            delete: (id) => handleDelete("area", id),
          }}
          type="area"
        />
      );
    }
  };

  // Add button click
  const handleAdd = () => {
    if (activeTab === "country") navigate("/controls/geo/country/add");
    if (activeTab === "city") navigate("/controls/geo/city/add");
    if (activeTab === "area") navigate("/controls/geo/area/add");
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Geo Management</h1>
        <p className="text-sm text-gray-500">
          Add, edit, or delete countries, cities, and areas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-3">
        <div className="flex items-center bg-white rounded-2xl p-3 gap-3 shadow-sm w-full md:w-1/2">
          <FiSearch className="text-gray-400" />
          <input
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-2xl shadow hover:bg-blue-700 transition-colors"
        >
          <FiPlus /> Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-50 rounded-2xl p-4 shadow-inner">{renderTable()}</div>
    </MainLayout>
  );
}

// Reusable table component
const DataTable = ({ data, columns, actions }) => {
  return (
    <div className="space-y-3">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-3 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
        {columns.map((col) => (
          <div key={col}>{col}</div>
        ))}
        <div className="text-right">Actions</div>
      </div>

      {/* Table rows */}
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl px-5 py-4 shadow hover:shadow-md transition-shadow grid grid-cols-2 md:grid-cols-3 gap-y-2 items-center text-sm"
        >
          {columns.map((col) => (
            <div
              key={col}
              className="font-medium text-gray-900"
            >
              {item[col.toLowerCase()]}
            </div>
          ))}
          <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
            <IconButton color="blue" onClick={() => actions.edit(item.id)}>
              <FiEdit3 />
            </IconButton>
            <IconButton color="red" onClick={() => actions.delete(item.id)}>
              <FiTrash2 />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

// Icon button
const IconButton = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200 transition-colors`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
