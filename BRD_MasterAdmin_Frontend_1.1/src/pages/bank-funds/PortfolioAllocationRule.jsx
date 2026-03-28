import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function PortfolioAllocationRules() {
  const [rules, setRules] = useState([
    "Retail Portfolio",
    "MSME Portfolio",
    "Housing Portfolio",
  ]);

  const move = (i, dir) => {
    const arr = [...rules];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setRules(arr);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">
          Portfolio Allocation Rules
        </h1>

        <div className="bg-white rounded-2xl shadow divide-y">
          {rules.map((r, i) => (
            <div
              key={r}
              className="flex justify-between items-center p-4"
            >
              <span>{i + 1}. {r}</span>
              <div className="flex gap-2">
                <button onClick={() => move(i, -1)} className="p-2 bg-gray-100 rounded-full">
                  <FiArrowUp />
                </button>
                <button onClick={() => move(i, 1)} className="p-2 bg-gray-100 rounded-full">
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
}
