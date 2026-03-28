import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiRefreshCcw,
  FiPercent,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiTrendingUp,
  FiPauseCircle,
  FiPlusCircle,
  FiArrowLeft,
} from "react-icons/fi";

import { productManagementService } from "../../services/productManagementService";

/* ---------------- IMPROVEMENT OPTIONS CONFIG ---------------- */
const IMPROVEMENTS = [
  { title: "Change Interest Rate", description: "Revise loan interest rate", icon: <FiPercent />, path: "interest-rate" },
  { title: "Change Repayment Period", description: "Modify loan tenure", icon: <FiClock />, path: "tenure" },
  { title: "Change Repayment Amount", description: "Update EMI amount", icon: <FiDollarSign />, path: "emi" },
  { title: "Change Loan Product", description: "Switch loan product", icon: <FiRefreshCcw />, path: "product" },
  { title: "Change Fees & Charges", description: "Update fees applied", icon: <FiFileText />, path: "fees" },
  { title: "Change Collateral", description: "Update pledged security", icon: <FiShield />, path: "collateral" },
  { title: "Repayment Rationalisation", description: "Restructure repayment plan", icon: <FiTrendingUp />, path: "rationalisation" },
  { title: "Moratorium of Interest", description: "Apply interest moratorium", icon: <FiPauseCircle />, path: "moratorium" },
  { title: "Top-Up Management", description: "Allow additional funding", icon: <FiPlusCircle />, path: "top-up" },
];

const LoanImprovementDashboard = () => {
  const navigate = useNavigate();
  const { loanId } = useParams(); // this is actually product id

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD PRODUCT ---------------- */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productManagementService.getProduct(loanId);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [loanId]);

  if (loading) return <MainLayout><p className="text-gray-500">Loading product details...</p></MainLayout>;
  if (!product) return <MainLayout><p className="text-gray-500">Product not found.</p></MainLayout>;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Loan Improvement Dashboard</h1>
          <p className="text-sm text-gray-500">Choose the type of improvement to apply</p>
        </div>
      </div>

      {/* PRODUCT SNAPSHOT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <Info label="Product Name" value={product.product_name} />
        <Info label="Category" value={product.product_category} />
        <Info label="Type" value={product.product_type} />
        <Info label="Amount" value={`₹${Number(product.product_amount).toLocaleString()}`} />
        <Info label="Period" value={`${product.product_period_value} ${product.product_period_unit}`} />
        <Info label="Status" value={product.is_active ? "Active" : "Inactive"} />
      </div>

      {/* IMPROVEMENT OPTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {IMPROVEMENTS.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(`/loan-improvement/${loanId}/${item.path}`)}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3 text-blue-600">
                <span className="text-xl">{item.icon}</span>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/loan-improvement/${loanId}/${item.path}`);
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
              >
                Modify
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default LoanImprovementDashboard;

/* ---------------- SMALL UI HELPERS ---------------- */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);
