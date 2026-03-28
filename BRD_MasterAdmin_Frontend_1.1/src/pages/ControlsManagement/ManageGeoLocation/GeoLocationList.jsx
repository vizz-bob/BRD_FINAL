import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function GeoLocationList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [geoList, setGeoList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchGeoLocations = async () => {
    setLoading(true);
    const data = await controlsManagementService.geo_locations.list();
    setGeoList(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGeoLocations();
  }, []);

  /* ================= FILTER ================= */

  const filtered = geoList.filter((g) =>
    `${g.country} ${g.state} ${g.city} ${g.area}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this geo location?")) return;

    const success =
      await controlsManagementService.geo_locations.delete(id);

    if (success) {
      setGeoList((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Geo Locations</h1>
          <p className="text-sm text-gray-500">
            Manage country, state, city and area hierarchy
          </p>
        </div>

        <button
          onClick={() => navigate("/controls/geo/add")}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm"
        >
          <FiPlus /> Add Geo Location
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search country, state, city or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10">
          <div>Country</div>
          <div>State</div>
          <div>City</div>
          <div>Area</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading geo locations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No geo locations found
          </div>
        ) : (
          filtered.map((g) => (
            <React.Fragment key={g.id}>
              {/* ================= DESKTOP ROW ================= */}
              <div className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm grid-cols-6 items-center text-sm">
                <div className="font-medium truncate">{g.country}</div>
                <div>{g.state}</div>
                <div>{g.city}</div>
                <div>{g.area}</div>

                <span className="w-fit px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {g.status}
                </span>

                <div className="flex justify-end gap-2">
                  <IconButton
                    color="blue"
                    onClick={() =>
                      navigate(`/controls/geo/edit/${g.id}`)
                    }
                  >
                    <FiEdit3 />
                  </IconButton>
                  <IconButton
                    color="red"
                    onClick={() => handleDelete(g.id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </div>
              </div>

              {/* ================= MOBILE CARD ================= */}
              <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="font-semibold text-sm">
                    {g.country} · {g.state}
                  </div>

                  <div className="flex gap-3 text-gray-600">
                    <FiEdit3
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/controls/geo/edit/${g.id}`)
                      }
                    />
                    <FiTrash2
                      className="cursor-pointer"
                      onClick={() => handleDelete(g.id)}
                    />
                  </div>
                </div>

                <div className="px-4 py-3 space-y-3 text-sm">
                  <Row label="City" value={g.city} />
                  <Row label="Area" value={g.area} />

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Status</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {g.status}
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
