import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

// import { interestService } from "../../../services/interestService";

const InterestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  /* ---------------- LOAD INTEREST DETAIL ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const res = await interestService.getInterestById(id);
        setData(res);
        */

        // TEMP MOCK DATA
        setData({
          benchmark: {
            type: "MCLR",
            frequency: "Quarterly",
            rate: 8.5,
            mark_up: 1.5,
          },
          interest: {
            type: "Floating",
            accrual_stage: "Post-EMI",
            accrual_method: "Compound",
            rate: 10,
          },
          status: "Active",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading interest details...</p>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <p className="text-gray-500">Interest configuration not found.</p>
      </MainLayout>
    );
  }

  const apr = data.benchmark.rate + data.benchmark.mark_up;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <SubPageHeader
          title="Interest Configuration Details"
          subtitle="View benchmark, interest rules and APR"
          onBack={() => navigate(-1)}
        />

        <Button
          label="Edit"
          icon={<FiEdit />}
          onClick={() => navigate(`/interest/${id}/edit`)}
        />
      </div>

      {/* CONTENT */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl space-y-8">
        {/* BENCHMARK */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
            Benchmark Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Benchmark Type</p>
              <p className="font-medium">{data.benchmark.type}</p>
            </div>

            <div>
              <p className="text-gray-500">Frequency</p>
              <p className="font-medium">{data.benchmark.frequency}</p>
            </div>

            <div>
              <p className="text-gray-500">Benchmark Rate</p>
              <p className="font-medium">{data.benchmark.rate}%</p>
            </div>

            <div>
              <p className="text-gray-500">Mark Up</p>
              <p className="font-medium">{data.benchmark.mark_up}%</p>
            </div>
          </div>
        </div>

        {/* INTEREST */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
            Interest Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Interest Type</p>
              <p className="font-medium">{data.interest.type}</p>
            </div>

            <div>
              <p className="text-gray-500">Stage of Accrual</p>
              <p className="font-medium">{data.interest.accrual_stage}</p>
            </div>

            <div>
              <p className="text-gray-500">Method of Accrual</p>
              <p className="font-medium">{data.interest.accrual_method}</p>
            </div>

            <div>
              <p className="text-gray-500">Interest Rate</p>
              <p className="font-medium">{data.interest.rate}% p.a.</p>
            </div>
          </div>
        </div>

        {/* APR */}
        <div className="border-t pt-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Average Percentage Rate (APR)
          </h3>
          <span className="text-2xl font-bold text-indigo-600">
            {apr.toFixed(2)}%
          </span>
        </div>

        {/* STATUS */}
        <div className="flex justify-end">
          <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
            {data.status}
          </span>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterestDetail;
