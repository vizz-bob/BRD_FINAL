import React, { useState } from "react";

const topFrauds = [
    { id: "FRA901", applicant: "Rohit Sharma", amount: "₹1,20,000", type: "Loan Fraud", date: "2025-10-05" },
    { id: "FRA902", applicant: "Aditi Mehra", amount: "₹95,000", type: "Identity Theft", date: "2025-10-08" },
    { id: "FRA903", applicant: "Vikas Patel", amount: "₹88,000", type: "Card Fraud", date: "2025-10-12" },
    { id: "FRA904", applicant: "Karan Singh", amount: "₹78,000", type: "Insurance Scam", date: "2025-10-14" },
    { id: "FRA905", applicant: "Riya Kapoor", amount: "₹74,000", type: "Loan Fraud", date: "2025-10-18" },
];

export default function TopFraudCases() {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const parseAmount = (amt) => Number(amt.replace(/[₹,]/g, ""));

    const handleExportReport = () => {
        try {
            const data = topFrauds.map((f) => ({
                ID: f.id,
                Applicant: f.applicant,
                Amount: f.amount,
                Type: f.type,
                Date: f.date,
            }));
            const headers = Object.keys(data[0]).join(",") + "\n";
            const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
            const csv = headers + rows;
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "fraud-report.csv";
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    const filteredData = topFrauds.filter(
        (f) =>
            f.id.toLowerCase().includes(search.toLowerCase()) ||
            f.applicant.toLowerCase().includes(search.toLowerCase()) ||
            f.type.toLowerCase().includes(search.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortField) return 0;
        if (sortField === "amount") {
            return sortOrder === "asc"
                ? parseAmount(a.amount) - parseAmount(b.amount)
                : parseAmount(b.amount) - parseAmount(a.amount);
        } else if (sortField === "date") {
            return sortOrder === "asc"
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        }
        return 0;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const typeColor = (type) => {
        if (type === "Loan Fraud") return "bg-blue-100 text-blue-700";
        if (type === "Identity Theft") return "bg-purple-100 text-purple-700";
        if (type === "Card Fraud") return "bg-green-100 text-green-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full">
            {/* Header */}
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Top Fraud Cases</h2>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <input
                        type="text"
                        placeholder="Search by name, ID, or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-56 md:w-64 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    <button
                        onClick={handleExportReport}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap w-full sm:w-auto"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            {/* Desktop Table — hidden on mobile */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 whitespace-nowrap">Case ID</th>
                            <th className="p-3 whitespace-nowrap">Applicant</th>
                            <th
                                className="p-3 cursor-pointer select-none whitespace-nowrap"
                                onClick={() => handleSort("amount")}
                            >
                                Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="p-3 whitespace-nowrap">Fraud Type</th>
                            <th
                                className="p-3 cursor-pointer select-none whitespace-nowrap"
                                onClick={() => handleSort("date")}
                            >
                                Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((f) => (
                            <tr key={f.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-3 font-medium text-gray-800">{f.id}</td>
                                <td className="p-3 whitespace-nowrap">{f.applicant}</td>
                                <td className="p-3 whitespace-nowrap">{f.amount}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-lg ${typeColor(f.type)}`}>
                                        {f.type}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">{f.date}</td>
                            </tr>
                        ))}
                        {sortedData.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-400 text-sm">
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List — visible only on mobile */}
            <div className="flex flex-col gap-3 sm:hidden">
                {sortedData.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-6">No results found.</p>
                )}
                {sortedData.map((f) => (
                    <div key={f.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-800 text-sm">{f.id}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-lg ${typeColor(f.type)}`}>
                                {f.type}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm font-medium mb-2">{f.applicant}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-semibold text-gray-800">{f.amount}</span>
                            <span>{f.date}</span>
                        </div>
                    </div>
                ))}
                {/* Mobile sort buttons */}
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={() => handleSort("amount")}
                        className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Sort by Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                        onClick={() => handleSort("date")}
                        className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Sort by Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                </div>
            </div>
        </div>
    );
}