import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { approvalMasterService } from "../../services/approvalMasterService";

const ApprovalView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    approvalMasterService
      .getApprovalById(id)
      .then((d) => {
        // 🔁 Map backend → UI structure (NO UI CHANGE)
        setApproval({
          product_name: d.product_name,
          product_type: d.product_type,
          level: d.level,
          type: d.type,
          approval_name: {
            sanction: d.sanction_name,
            rate_inc: d.rate_inc,
            rate_dec: d.rate_dec,
            fees_inc: d.fees_inc,
            fees_dec: d.fees_dec,
            tenure_inc: d.tenure_inc,
            tenure_dec: d.tenure_dec,
            range: d.approval_range,
            moratorium: {
              interest: d.moratorium_interest,
              period: d.moratorium_period,
            },
          },
          status: d.status,
          created_at: d.created_at,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch approval", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return null;
  if (!approval) return null;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            View Approval
          </h1>
          <p className="text-sm text-gray-500">
            Approval ID: {id}
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl">
        {/* BASIC DETAILS */}
        <Card title="Basic Details">
          <Row label="Product Type" value={approval.product_type} />
          <Row label="Product Name" value={approval.product_name} />
          <Row label="Approval Level" value={approval.level} />
          <Row label="Approval Type" value={approval.type} />
          <Row label="Sanction Name" value={approval.approval_name.sanction} />
          <Row label="Range" value={approval.approval_name.range} />
          <Row label="Status">
            <StatusBadge status={approval.status} />
          </Row>
        </Card>

        {/* RATE & FEES */}
        <Card title="Rate & Fees">
          <Row label="Rate Increase (%)" value={approval.approval_name.rate_inc} />
          <Row label="Rate Decrease (%)" value={approval.approval_name.rate_dec} />
          <Row label="Fees Increase" value={approval.approval_name.fees_inc} />
          <Row label="Fees Decrease" value={approval.approval_name.fees_dec} />
        </Card>

        {/* TENURE & MORATORIUM */}
        <Card title="Tenure & Moratorium">
          <Row label="Tenure Increase (Months)" value={approval.approval_name.tenure_inc} />
          <Row label="Tenure Decrease (Months)" value={approval.approval_name.tenure_dec} />
          <Row
            label="Moratorium Interest (%)"
            value={approval.approval_name.moratorium.interest}
          />
          <Row
            label="Moratorium Period (Months)"
            value={approval.approval_name.moratorium.period}
          />
        </Card>

        {/* METADATA */}
        <Card title="Audit Information">
          <Row label="Created At" value={approval.created_at} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApprovalView;

/* ---------- UI HELPERS ---------- */

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Row = ({ label, value, children }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800 mt-1">
      {children || value || "-"}
    </p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 text-xs rounded-full font-medium ${
      status === "ACTIVE" || status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    {status}
  </span>
);
