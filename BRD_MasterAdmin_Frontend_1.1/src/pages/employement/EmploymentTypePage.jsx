import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import employmentTypeService from "../../services/employementTypeService";

import {
  FiArrowLeft,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function EmploymentTypePage() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const loadTypes = async () => {
    const res = await employmentTypeService.getAll();
    setList(res);
    setFiltered(res);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);

    setFiltered(
      list.filter((item) =>
        item.emp_name.toLowerCase().includes(keyword)
      )
    );
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this employment type?")) return;
    await employmentTypeService.delete(uuid);
    loadTypes();
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border hover:bg-gray-100">
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Employment Types</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-white p-3 rounded-xl w-full shadow-sm border">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search Employment Type..."
            className="outline-none w-full"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <button
          onClick={() => navigate("/employment-types/add")}
          className="ml-4 px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No employment types found.</p>
        ) : (
          filtered.map((item) => (
            <div key={item.uuid} className="flex justify-between items-center py-4 border-b last:border-none">
              <p className="text-lg font-medium">{item.emp_name}</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/employment-types/view/${item.uuid}`)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                >
                  <FiEye size={18} />
                </button>

                <button
                  onClick={() => navigate(`/employment-types/edit/${item.uuid}`)}
                  className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                >
                  <FiEdit2 size={18} />
                </button>

                <button
                  onClick={() => handleDelete(item.uuid)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
