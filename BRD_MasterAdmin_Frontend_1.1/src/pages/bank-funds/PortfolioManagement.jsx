import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { bankFundService } from "../../services/bankFundService";

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
const [banksList, setBanksList] = useState([]); // all banks

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const [allBanks, portfolioData] = await Promise.all([
        bankFundService.getBanks(),    // all banks
        bankFundService.getPortfolios() // portfolios with banks as IDs
      ]);
      setBanksList(allBanks);

      // Map bank IDs to bank objects for easier display
      const portfoliosWithBankObjects = portfolioData.map((p) => ({
        ...p,
        banks: p.banks.map((bId) =>
          allBanks.find((b) => b.id === bId) || { bank_name: "Unknown" }
        ),
      }));

      setPortfolios(portfoliosWithBankObjects);
    } catch (err) {
      console.error("Failed to fetch portfolios:", err);
      alert("Error fetching portfolios");
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this portfolio?")) return;
    try {
      await bankFundService.deletePortfolio(id);
      setPortfolios(portfolios.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete portfolio:", err);
      alert("Error deleting portfolio");
    }
  };

  const filteredPortfolios = portfolios.filter(
    (p) =>
      p.portfolio_name.toLowerCase().includes(search.toLowerCase()) ||
      p.portfolio_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Portfolio Management</h1>
          <p className="text-sm text-gray-500">
            Group loans and map portfolios to bank accounts
          </p>
        </div>

        <button
          onClick={() => navigate("/portfolio-management/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Portfolio
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by portfolio name or type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading portfolios...</div>
      ) : (
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
            <div>Portfolio Name</div>
            <div>Type</div>
            <div>Banks Mapped</div>
            <div>Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filteredPortfolios.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
            >
              <div className="font-medium text-gray-900">{p.portfolio_name}</div>
              <div className="text-gray-600">{p.portfolio_type}</div>
              <div className="text-gray-600 truncate">
                {p.banks.map((b) => b.bank_name).join(", ")}
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                  p.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {p.is_active ? "Active" : "Inactive"}
              </span>
              <div className="flex justify-end gap-2 col-span-2 md:col-span-2">
                <IconButton
                  color="gray"
                  onClick={() =>
                    navigate(`/portfolio-management/view/${p.id}`)
                  }
                >
                  <FiEye />
                </IconButton>

                <IconButton
                  color="blue"
                  onClick={() =>
                    navigate(`/portfolio-management/edit/${p.id}`)
                  }
                >
                  <FiEdit3 />
                </IconButton>

                <IconButton color="red" onClick={() => handleDelete(p.id)}>
                  <FiTrash2 />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default PortfolioManagement;

const IconButton = ({ children, onClick, color }) => {
  const styles = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-full ${styles[color]}`}>
      {children}
    </button>
  );
};
