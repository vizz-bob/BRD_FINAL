import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const FundAllocationRules = () => {
  const [rules, setRules] = useState([
    { id: 1, fund_type: "Internal Fund" },
    { id: 2, fund_type: "Borrowed Fund" },
    { id: 3, fund_type: "Corpus Fund" },
  ]);

  const move = (index, direction) => {
    const newRules = [...rules];
    const target = index + direction;
    if (target < 0 || target >= rules.length) return;
    [newRules[index], newRules[target]] = [
      newRules[target],
      newRules[index],
    ];
    setRules(newRules);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold mb-1">
          Fund Allocation Rules
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Define priority order for fund utilization
        </p>

        <div className="bg-white rounded-2xl shadow divide-y">
          {rules.map((r, i) => (
            <div
              key={r.id}
              className="flex justify-between items-center p-4"
            >
              <span className="font-medium">
                {i + 1}. {r.fund_type}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => move(i, -1)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <FiArrowUp />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <FiArrowDown />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
            Save Rules
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FundAllocationRules;
