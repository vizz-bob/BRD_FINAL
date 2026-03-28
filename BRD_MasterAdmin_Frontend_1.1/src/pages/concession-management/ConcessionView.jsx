import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import concessionManagementService from "../../services/concessionManagementService";

export default function ConcessionView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // to detect type from URL or state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Determine if viewing Type or Category based on pathname
  const isType = location.pathname.includes("/type/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (isType) {
          res = await concessionManagementService.getType(id);
        } else {
          res = await concessionManagementService.getCategory(id);
        }
        setData(res);
      } catch (err) {
        setError("Failed to load concession details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isType]);

  if (loading) return <MainLayout>Loading...</MainLayout>;
  if (error) return <MainLayout>{error}</MainLayout>;

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Concession Details</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-4">
        {isType ? (
          <>
            <Detail label="Concession Type" value={data.concession_type_name} />
            <Detail label="Applicable On" value={data.applicable_on} />
            <Detail label="Description" value={data.description} />
            <Detail label="Status" value={data.status} />
          </>
        ) : (
          <>
            <Detail label="Category Name" value={data.category_name} />
            <Detail label="Linked Concession Type" value={data.concession_type_name || data.linked_concession_type} />
            <Detail label="Product" value={data.product_type} />
            <Detail label="Validity" value={`${data.valid_from} → ${data.valid_to}`} />
            <Detail label="Eligibility Criteria" value={data.eligibility_criteria} />
            <Detail label="Status" value={data.status} />
          </>
        )}
      </div>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);
