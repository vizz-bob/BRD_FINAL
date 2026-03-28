import React from "react";
import MainLayout from "../../layout/MainLayout";

const portfolios = ["Retail", "MSME", "Housing"];
const banks = ["HDFC", "ICICI", "SBI"];

export default function PortfolioBankMatrix() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">
          Portfolio – Bank Mapping
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Portfolio</th>
                {banks.map((b) => (
                  <th key={b} className="p-2 border">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolios.map((p) => (
                <tr key={p}>
                  <td className="p-2 border font-medium">{p}</td>
                  {banks.map((b) => (
                    <td key={b} className="p-2 border text-center">
                      <input type="checkbox" defaultChecked />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
              Save Mapping
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
