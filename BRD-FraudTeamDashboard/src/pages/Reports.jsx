import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

import ReportSelector from "../components/reports/ReportSelector";
import ReportGenerator from "../components/reports/ReportGenerator";
import ReportTable from "../components/reports/ReportTable";

import { generateReport, getReportHistory } from "../api/reportApi";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("Fraud Summary Report");
  const [reportData, setReportData] = useState([]);
  const [reportHistory, setReportHistory] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const reportTypeMap = {
    "Fraud Summary Report": "FRAUD_SUMMARY",
    "AML Sanction Report": "AML_SANCTION",
    "High Risk Applicants": "HIGH_RISK",
    "Synthetic ID Report": "SYNTHETIC_ID",
    "All Case Records": "ALL_CASES",
  };

  const reportTypeLabelMap = {
    FRAUD_SUMMARY: "Fraud Summary Report",
    AML_SANCTION: "AML Sanction Report",
    HIGH_RISK: "High Risk Applicants",
    SYNTHETIC_ID: "Synthetic ID Report",
    ALL_CASES: "All Case Records",
  };

  const loadHistory = async () => {
    try {
      const history = await getReportHistory();
      setReportHistory(history || []);
    } catch {
      // Keep current report UX functional even if history fails
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 1. GENERATE report
  const handleGenerateReport = async (from, to, done) => {
    setIsSearching(true);
    setHasGenerated(false);
    if (!from || !to) {
      toast.error("Please select a date range");
      done();
      return;
    }

    try {
      const type = reportTypeMap[selectedReport];
      const result = await generateReport(type, from, to);

      let mappedData = [];

      if (type === "FRAUD_SUMMARY") {
        mappedData = [
          { id: "Summary", name: "Total Cases", fraud: result.total_cases, aml: result.sanction_hits, synthetic: "N/A" },
          { id: "Summary", name: "High Risk", fraud: result.high_risk, aml: "N/A", synthetic: "N/A" },
          { id: "Summary", name: "Medium Risk", fraud: result.medium_risk, aml: "N/A", synthetic: "N/A" },
          { id: "Summary", name: "Low Risk", fraud: result.low_risk, aml: "N/A", synthetic: "N/A" },
        ];
      } else if (result.results) {
        mappedData = result.results.map(r => ({
          id: r.case_id || "N/A",
          name: r.name || "N/A",
          fraud: r.fraud_score ?? 0,
          aml: r.aml_status || "CLEAR",
          synthetic: r.synthetic_status || "CLEAN"
        }));
      }

      setReportData(mappedData);
      setHasGenerated(true);
      await loadHistory();
      toast.success("Report generated");
    } catch (error) {
      console.error("Report generation failed", error);
      toast.error("Failed to generate report");
    } finally {
      setIsSearching(false);
      done();
    }
  };

  // 2. EXPORT CSV
  const exportCSV = () => {
    if (!reportData.length) return toast.error("No data to export");
    const rows = [
      ["Case ID", "Applicant", "Fraud Score", "AML", "Synthetic"],
      ...reportData.map((r) => [r.id, r.name, r.fraud + "%", r.aml, r.synthetic]),
    ];
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "fraud-report.csv");
    toast.success("CSV exported");
  };

  // 3. EXPORT PDF
  const exportPDF = () => {
    if (!reportData.length) return toast.error("No data to export");
    let text = "Fraud Report\n\n";
    reportData.forEach((row) => {
      text += `${row.id} | ${row.name} | Fraud: ${row.fraud}% | AML: ${row.aml} | Synthetic: ${row.synthetic}\n`;
    });
    const blob = new Blob([text], { type: "application/pdf" });
    saveAs(blob, "fraud-report.pdf");
    toast.success("PDF exported");
  };

  return (
    <div className="space-y-4 sm:space-y-6">

      <h2 className="text-lg sm:text-xl font-bold text-gray-700">Reports</h2>

      <ReportSelector
        selected={selectedReport}
        setSelected={setSelectedReport}
        options={Object.keys(reportTypeMap)}
      />

      <ReportGenerator onGenerate={handleGenerateReport} />

      <ReportTable
        data={reportData}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        hasGenerated={hasGenerated}
        loading={isSearching}
      />

      {/* Report History */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-3">Generated Report History</h3>

        {!reportHistory.length ? (
          <p className="text-xs sm:text-sm text-gray-500">No saved reports yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-semibold text-gray-600">Report</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Date Range</th>
                  <th className="py-2 text-left font-semibold text-gray-600">Generated At</th>
                </tr>
              </thead>
              <tbody>
                {reportHistory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-2 pr-4">{reportTypeLabelMap[item.report_type] || item.report_type}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{item.start_date} to {item.end_date}</td>
                    <td className="py-2 whitespace-nowrap">{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}