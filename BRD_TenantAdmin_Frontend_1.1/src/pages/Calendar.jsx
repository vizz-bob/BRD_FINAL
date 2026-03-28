import { useEffect, useState, useMemo } from "react";
import { calendarAPI } from "../services/calendarService";

export default function Calendar() {
  // -------------------- STATES --------------------
  const [financialYears, setFinancialYears] = useState([]);
  const [reportingPeriods, setReportingPeriods] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [overtimeSettings, setOvertimeSettings] = useState([]);
  const [assessmentYears, setAssessmentYears] = useState([]);

  const [modals, setModals] = useState({ 
    fy: false, 
    rp: false, 
    h: false, 
    wd: false, 
    wh: false, 
    ot: false, 
    ay: false 
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fyForm, setFyForm] = useState({
    start: "",
    end: "",
    status: "active",
  });
  
  const [rpForm, setRpForm] = useState({ name: "", start: "", end: "" });
  const [hForm, setHForm] = useState({ title: "", date: "" });
  const [wdForm, setWdForm] = useState({ days: [] });
  const [whForm, setWhForm] = useState({ start_time: "", end_time: "" });
  const [otForm, setOtForm] = useState({ enable_overtime: false, rate_multiplier: 1.5 });
  const [ayForm, setAyForm] = useState({ 
    financial_year: null,
    status: "active",
    financial_eligibility_years: 3,
    document_compliance_required: true,
    credit_assessment_enabled: true,
    itr_years_required: 3,
    loan_type_specific: false,
    borrower_type_specific: false
  });

  // -------------------- COUNTS --------------------
  const fyCounts = useMemo(
    () => ({
      Active: (financialYears || []).filter((f) => f?.status === "active").length,
      Inactive: (financialYears || []).filter((f) => f?.status === "inactive").length,
    }),
    [financialYears]
  );

  const ayCounts = useMemo(
    () => ({
      Active: (assessmentYears || []).filter((a) => a?.status === "active").length,
      Inactive: (assessmentYears || []).filter((a) => a?.status === "inactive").length,
    }),
    [assessmentYears]
  );

  const statusBadge = (status) =>
    status === "active"
      ? "inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
      : "inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800";

  // -------------------- FETCH ALL DATA --------------------
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadFinancialYears(),
        loadReportingPeriods(),
        loadHolidays(),
        loadAssessmentYears()
      ]);
    } catch (error) {
      console.error("Error loading calendar data:", error);
      
      // Check if it's a network error
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError("Cannot connect to the server. Please ensure the Django backend is running on http://127.0.0.1:8000");
      } else {
        setError("Failed to load calendar data. Please refresh the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialYears = async () => {
    try {
      const res = await calendarAPI.getFinancialYears();
      setFinancialYears(res?.data || []);
    } catch (err) {
      console.error("Error loading FY:", err);
      setFinancialYears([]);
      throw err; // Propagate to parent handler
    }
  };

  const loadReportingPeriods = async () => {
    try {
      const res = await calendarAPI.getReportingPeriods();
      setReportingPeriods(res?.data || []);
    } catch (err) {
      console.error("Error loading RP:", err);
      setReportingPeriods([]);
      throw err;
    }
  };

  const loadHolidays = async () => {
    try {
      const res = await calendarAPI.getHolidays();
      setHolidays(res?.data || []);
    } catch (err) {
      console.error("Error loading holidays:", err);
      setHolidays([]);
      throw err;
    }
  };

  const loadAssessmentYears = async () => {
    try {
      const res = await calendarAPI.getAssessmentYears();
      setAssessmentYears(res?.data || []);
    } catch (err) {
      console.error("Error loading AY:", err);
      setAssessmentYears([]);
      throw err;
    }
  };

  // -------------------- HELPER FUNCTIONS --------------------
  const generateFYName = (startDate) => {
    if (!startDate) return "";
    const startYear = new Date(startDate).getFullYear();
    const endYear = startYear + 1;
    const endYearShort = endYear.toString().slice(-2);
    return `FY ${startYear}-${endYearShort}`;
  };

  const calculateEndDate = (startDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const endYear = start.getFullYear() + 1;
    return `${endYear}-03-31`;
  };

  const generateAYName = (linkedFyId) => {
    if (!linkedFyId) return "";
    const linkedFY = financialYears.find(fy => fy.id === parseInt(linkedFyId));
    if (!linkedFY) return "";
    const startYear = parseInt(linkedFY.start_date.split('-')[0]) + 1;
    const endYear = parseInt(linkedFY.end_date.split('-')[0]) + 1;
    const endYearShort = endYear.toString().slice(-2);
    return `AY ${startYear}-${endYearShort}`;
  };

  const calculateAYDates = (linkedFyId) => {
    if (!linkedFyId) return { start: "", end: "" };
    const linkedFY = financialYears.find(fy => fy.id === parseInt(linkedFyId));
    if (!linkedFY) return { start: "", end: "" };
    
    const fyEndDate = new Date(linkedFY.end_date);
    const ayStartDate = new Date(fyEndDate);
    ayStartDate.setDate(ayStartDate.getDate() + 1);
    
    const ayEndDate = new Date(ayStartDate);
    ayEndDate.setFullYear(ayEndDate.getFullYear() + 1);
    ayEndDate.setDate(ayEndDate.getDate() - 1);
    
    return {
      start: ayStartDate.toISOString().split('T')[0],
      end: ayEndDate.toISOString().split('T')[0]
    };
  };

  // -------------------- CREATE OPERATIONS --------------------
  const saveFinancialYear = async () => {
    if (!fyForm.start || !fyForm.end) {
      alert("Please fill all mandatory fields");
      return;
    }

    const startDate = new Date(fyForm.start);
    const endDate = new Date(fyForm.end);
    
    if (startDate.getMonth() !== 3 || startDate.getDate() !== 1) {
      alert("Financial Year must start on April 1st");
      return;
    }
    
    if (endDate.getMonth() !== 2 || endDate.getDate() !== 31) {
      alert("Financial Year must end on March 31st");
      return;
    }

    const hasActiveFY = financialYears.some(fy => fy.status === "active");
    if (fyForm.status === "active" && hasActiveFY) {
      alert("Only one Financial Year can be Active at a time. Please deactivate the existing active FY first.");
      return;
    }

    const payload = {
      start_date: fyForm.start,
      end_date: fyForm.end,
      status: fyForm.status.toLowerCase(),
    };

    try {
      const res = await calendarAPI.createFinancialYear(payload);
      await loadFinancialYears();
      setModals((m) => ({ ...m, fy: false }));
      alert("Financial Year created successfully!");
    } catch (err) {
      console.error("FY create error:", err);
      
      // Better error handling
      if (err.code === 'ERR_NETWORK') {
        alert("Cannot connect to server. Please ensure Django is running on http://127.0.0.1:8000");
      } else if (err.response?.data) {
        const errorData = err.response.data;
        let errorMsg = "Error creating Financial Year:\n";
        
        if (errorData.error) {
          errorMsg += errorData.error;
          if (errorData.detail) {
            errorMsg += "\n" + (typeof errorData.detail === 'object' 
              ? JSON.stringify(errorData.detail, null, 2) 
              : errorData.detail);
          }
        } else {
          errorMsg += JSON.stringify(errorData, null, 2);
        }
        
        alert(errorMsg);
      } else {
        alert("Error creating Financial Year. Please try again.");
      }
    }
  };

  const saveReportingPeriod = async () => {
    if (!rpForm.name || !rpForm.start || !rpForm.end) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: rpForm.name,
      start_date: rpForm.start,
      end_date: rpForm.end,
    };

    try {
      await calendarAPI.createReportingPeriod(payload);
      await loadReportingPeriods();
      setModals((m) => ({ ...m, rp: false }));
      alert("Reporting Period created successfully!");
    } catch (err) {
      console.error("RP create error:", err);
      if (err.code === 'ERR_NETWORK') {
        alert("Cannot connect to server. Please ensure Django is running.");
      } else {
        alert("Error creating Reporting Period: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  const saveHoliday = async () => {
    if (!hForm.title || !hForm.date) {
      alert("Please fill all fields");
      return;
    }

    const payload = { title: hForm.title, date: hForm.date };

    try {
      await calendarAPI.createHoliday(payload);
      await loadHolidays();
      setModals((m) => ({ ...m, h: false }));
      alert("Holiday created successfully!");
    } catch (err) {
      console.error("Holiday create error:", err);
      if (err.code === 'ERR_NETWORK') {
        alert("Cannot connect to server. Please ensure Django is running.");
      } else {
        alert("Error creating Holiday: " + (err.response?.data?.detail || err.message));
      }
    }
  };
  
  const saveWorkingDays = () => {
    if (!wdForm.days || wdForm.days.length === 0) {
      alert("Select at least one day");
      return;
    }
    const item = { id: Date.now(), days: wdForm.days.slice() };
    setWorkingDays([...workingDays, item]);
    setModals((m) => ({ ...m, wd: false }));
  };
  
  const saveWorkingHours = () => {
    if (!whForm.start_time || !whForm.end_time) {
      alert("Please fill all fields");
      return;
    }
    const item = { id: Date.now(), start_time: whForm.start_time, end_time: whForm.end_time };
    setWorkingHours([...workingHours, item]);
    setModals((m) => ({ ...m, wh: false }));
  };
  
  const saveOvertime = () => {
    if (!otForm.rate_multiplier || Number(otForm.rate_multiplier) <= 0) {
      alert("Enter a valid rate multiplier");
      return;
    }
    const item = { 
      id: Date.now(), 
      enable_overtime: !!otForm.enable_overtime, 
      rate_multiplier: Number(otForm.rate_multiplier) 
    };
    setOvertimeSettings([...overtimeSettings, item]);
    setModals((m) => ({ ...m, ot: false }));
  };
  
  const saveAssessmentYear = async () => {
    if (!ayForm.financial_year) {
      alert("Please select a linked Financial Year");
      return;
    }

    const payload = {
      financial_year: parseInt(ayForm.financial_year),
      status: ayForm.status.toLowerCase(),
      financial_eligibility_years: ayForm.financial_eligibility_years,
      document_compliance_required: ayForm.document_compliance_required,
      credit_assessment_enabled: ayForm.credit_assessment_enabled,
      itr_years_required: ayForm.itr_years_required,
      loan_type_specific: ayForm.loan_type_specific,
      borrower_type_specific: ayForm.borrower_type_specific
    };

    try {
      await calendarAPI.createAssessmentYear(payload);
      await loadAssessmentYears();
      setModals((m) => ({ ...m, ay: false }));
      alert("Assessment Year created successfully!");
    } catch (err) {
      console.error("AY create error:", err);
      
      if (err.code === 'ERR_NETWORK') {
        alert("Cannot connect to server. Please ensure Django is running on http://127.0.0.1:8000");
      } else if (err.response?.data) {
        const errorData = err.response.data;
        let errorMsg = "Error creating Assessment Year:\n";
        
        if (errorData.error) {
          errorMsg += errorData.error;
          if (errorData.detail) {
            errorMsg += "\n" + (typeof errorData.detail === 'object' 
              ? JSON.stringify(errorData.detail, null, 2) 
              : errorData.detail);
          }
        } else {
          errorMsg += JSON.stringify(errorData, null, 2);
        }
        
        alert(errorMsg);
      } else {
        alert("Error creating Assessment Year. Please try again.");
      }
    }
  };

  // -------------------- DELETE OPERATIONS --------------------
  const deleteReportingPeriod = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reporting period?")) return;
    
    try {
      await calendarAPI.deleteReportingPeriod(id);
      await loadReportingPeriods();
      alert("Reporting Period deleted successfully!");
    } catch (err) {
      console.error("RP delete error:", err);
      alert("Error deleting Reporting Period: " + (err.response?.data?.detail || err.message));
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    
    try {
      await calendarAPI.deleteHoliday(id);
      await loadHolidays();
      alert("Holiday deleted successfully!");
    } catch (err) {
      console.error("Holiday delete error:", err);
      alert("Error deleting Holiday: " + (err.response?.data?.detail || err.message));
    }
  };
  
  const deleteWorkingDays = (id) => {
    setWorkingDays(workingDays.filter((w) => w.id !== id));
  };
  
  const deleteWorkingHours = (id) => {
    setWorkingHours(workingHours.filter((w) => w.id !== id));
  };
  
  const deleteOvertime = (id) => {
    setOvertimeSettings(overtimeSettings.filter((o) => o.id !== id));
  };

  // -------------------- UI --------------------
  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold mb-2">Connection Error</p>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
            <p className="font-semibold text-blue-900 mb-2">Quick Fix:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Ensure Django server is running: <code className="bg-blue-100 px-1 rounded">python manage.py runserver</code></li>
              <li>Check if it's accessible at: <code className="bg-blue-100 px-1 rounded">http://127.0.0.1:8000</code></li>
              <li>Verify <code className="bg-blue-100 px-1 rounded">finance/urls.py</code> exists</li>
            </ol>
          </div>
          <button 
            onClick={loadAllData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Calendar Management</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* FINANCIAL YEARS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Manage Financial Year
              </h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  const currentYear = new Date().getFullYear();
                  const startDate = `${currentYear}-04-01`;
                  const endDate = calculateEndDate(startDate);
                  
                  setFyForm({ 
                    start: startDate, 
                    end: endDate, 
                    status: "active"
                  });
                  setModals((m) => ({ ...m, fy: true }));
                }}
              >
                Add New
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Active: {fyCounts.Active} • Inactive: {fyCounts.Inactive}
            </div>
            
            <div className="text-xs text-blue-600 mb-2 italic">
              Indian Fiscal Year: 1 April to 31 March
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {financialYears.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No financial years found
                      </td>
                    </tr>
                  ) : (
                    financialYears.map((f) => (
                      <tr key={f.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{f.name}</td>
                        <td>{f.start_date}</td>
                        <td>{f.end_date}</td>
                        <td>
                          <span className={statusBadge(f.status)}>
                            {f.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ASSESSMENT YEARS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Manage Assessment Year
              </h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setAyForm({ 
                    financial_year: null,
                    status: "active",
                    financial_eligibility_years: 3,
                    document_compliance_required: true,
                    credit_assessment_enabled: true,
                    itr_years_required: 3,
                    loan_type_specific: false,
                    borrower_type_specific: false
                  });
                  setModals((m) => ({ ...m, ay: true }));
                }}
              >
                Add New
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              Active: {ayCounts.Active} • Inactive: {ayCounts.Inactive}
            </div>
            
            <div className="text-xs text-blue-600 mb-2 italic">
              Assessment Year follows Financial Year (used for tax assessment)
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Linked FY</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentYears.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No assessment years found
                      </td>
                    </tr>
                  ) : (
                    assessmentYears.map((a) => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{a.name}</td>
                        <td>{a.start_date}</td>
                        <td>{a.end_date}</td>
                        <td>
                          <span className={statusBadge(a.status)}>
                            {a.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {financialYears.find(fy => fy.id === a.financial_year)?.name || "Unknown"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* REPORTING PERIODS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Reporting Period</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setRpForm({ name: "", start: "", end: "" });
                  setModals((m) => ({ ...m, rp: true }));
                }}
              >
                Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportingPeriods.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No reporting periods found
                      </td>
                    </tr>
                  ) : (
                    reportingPeriods.map((r) => (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{r.name}</td>
                        <td>{r.start_date}</td>
                        <td>{r.end_date}</td>
                        <td>
                          <button
                            className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                            onClick={() => deleteReportingPeriod(r.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* HOLIDAYS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Holidays</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setHForm({ title: "", date: "" });
                  setModals((m) => ({ ...m, h: true }));
                }}
              >
                Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Date</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No holidays found
                      </td>
                    </tr>
                  ) : (
                    holidays.map((h) => (
                      <tr key={h.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{h.date}</td>
                        <td className="font-medium">{h.title}</td>
                        <td>
                          <button
                            className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                            onClick={() => deleteHoliday(h.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* WORKING DAYS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Working Days</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setWdForm({ days: [] });
                  setModals((m) => ({ ...m, wd: true }));
                }}
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Pattern</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workingDays.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">
                      No working days configured
                    </td>
                  </tr>
                ) : (
                  workingDays.map((w) => (
                    <tr key={w.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{w.days.join(", ")}</td>
                      <td>
                        <button
                          className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                          onClick={() => deleteWorkingDays(w.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
          
          {/* WORKING HOURS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Working Hours</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setWhForm({ start_time: "", end_time: "" });
                  setModals((m) => ({ ...m, wh: true }));
                }}
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Start Time</th>
                  <th>End Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workingHours.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No working hours configured
                    </td>
                    </tr>
                ) : (
                  workingHours.map((w) => (
                    <tr key={w.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{w.start_time}</td>
                      <td>{w.end_time}</td>
                      <td>
                        <button
                          className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                          onClick={() => deleteWorkingHours(w.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
          
          {/* OVERTIME */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Overtime</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setOtForm({ enable_overtime: false, rate_multiplier: 1.5 });
                  setModals((m) => ({ ...m, ot: true }));
                }}
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Enabled</th>
                  <th>Rate Multiplier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overtimeSettings.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No overtime settings configured
                    </td>
                  </tr>
                ) : (
                  overtimeSettings.map((o) => (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{o.enable_overtime ? "Yes" : "No"}</td>
                      <td>{o.rate_multiplier}</td>
                      <td>
                        <button
                          className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                          onClick={() => deleteOvertime(o.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/* -------------------- MODALS -------------------- */}
      {modals.fy && (
        <FinancialYearModal
          form={fyForm}
          setForm={setFyForm}
          onClose={() => setModals((m) => ({ ...m, fy: false }))}
          onSave={saveFinancialYear}
          financialYears={financialYears}
          generateFYName={generateFYName}
          calculateEndDate={calculateEndDate}
        />
      )}
      {modals.ay && (
        <AssessmentYearModal
          form={ayForm}
          setForm={setAyForm}
          onClose={() => setModals((m) => ({ ...m, ay: false }))}
          onSave={saveAssessmentYear}
          financialYears={financialYears}
          generateAYName={generateAYName}
          calculateAYDates={calculateAYDates}
        />
      )}
      {modals.rp && (
        <FormModal
          title="Add Reporting Period"
          form={rpForm}
          setForm={setRpForm}
          onClose={() => setModals((m) => ({ ...m, rp: false }))}
          onSave={saveReportingPeriod}
          fields={["name", "start", "end"]}
        />
      )}
      {modals.h && (
        <FormModal
          title="Add Holiday"
          form={hForm}
          setForm={setHForm}
          onClose={() => setModals((m) => ({ ...m, h: false }))}
          onSave={saveHoliday}
          fields={["title", "date"]}
        />
      )}
      {modals.wd && (
        <DaysModal
          form={wdForm}
          setForm={setWdForm}
          onClose={() => setModals((m) => ({ ...m, wd: false }))}
          onSave={saveWorkingDays}
        />
      )}
      {modals.wh && (
        <WorkingHoursModal
          form={whForm}
          setForm={setWhForm}
          onClose={() => setModals((m) => ({ ...m, wh: false }))}
          onSave={saveWorkingHours}
        />
      )}
      {modals.ot && (
        <OvertimeModal
          form={otForm}
          setForm={setOtForm}
          onClose={() => setModals((m) => ({ ...m, ot: false }))}
          onSave={saveOvertime}
        />
      )}
    </>
  );
}

/* -------------------- MODAL COMPONENTS -------------------- */
function FormModal({ title, form, setForm, onClose, onSave, fields }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        {fields.includes("name") && (
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("title") && (
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("date") && (
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Date</span>
            <input
              type="date"
              value={form.date || ""}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("start") && (
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Start Date</span>
            <input
              type="date"
              value={form.start || ""}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("end") && (
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">End Date</span>
            <input
              type="date"
              value={form.end || ""}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FinancialYearModal({ form, setForm, onClose, onSave, financialYears, generateFYName, calculateEndDate }) {
  const hasActiveFY = financialYears.some(fy => fy.status === "active");
  
  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    const endDate = calculateEndDate(startDate);
    
    setForm({ 
      ...form, 
      start: startDate, 
      end: endDate
    });
  };
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl z-[10000] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Financial Year</h3>
        
        <div className="text-xs text-blue-600 mb-3 italic">
          Financial Year follows Indian fiscal system (April 1 to March 31)
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Start Date</span>
            <input
              type="date"
              value={form.start || ""}
              onChange={handleStartDateChange}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
            <div className="text-xs text-gray-500 mt-1">Must be April 1st</div>
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">End Date</span>
            <input
              type="date"
              value={form.end || ""}
              readOnly
              className="mt-1 w-full h-10 border rounded-lg px-3 bg-gray-50"
            />
            <div className="text-xs text-gray-500 mt-1">Auto-calculated (March 31st)</div>
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              value={form.status || "active"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
              disabled={form.status === "active" && hasActiveFY}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {hasActiveFY && form.status !== "active" && (
              <div className="text-xs text-orange-500 mt-1">Note: There is already an active Financial Year</div>
            )}
            {hasActiveFY && form.status === "active" && (
              <div className="text-xs text-red-500 mt-1">Only one Financial Year can be Active at a time</div>
            )}
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Name Preview</span>
            <input
              type="text"
              value={generateFYName(form.start) || "Will be auto-generated"}
              readOnly
              className="mt-1 w-full h-10 border rounded-lg px-3 bg-gray-50"
            />
            <div className="text-xs text-gray-500 mt-1">Auto-generated from start date</div>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentYearModal({ form, setForm, onClose, onSave, financialYears, generateAYName, calculateAYDates }) {
  const handleLinkedFYChange = (e) => {
    const linkedFyId = e.target.value;
    const ayDates = calculateAYDates(linkedFyId);
    
    setForm({ 
      ...form, 
      financial_year: linkedFyId
    });
  };
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-5xl p-6 shadow-xl z-[10000] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Assessment Year</h3>
        
        <div className="text-xs text-blue-600 mb-3 italic">
          Assessment Year follows Financial Year (used for tax assessment and will be auto-generated)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Linked Financial Year *</span>
            <select
              value={form.financial_year || ""}
              onChange={handleLinkedFYChange}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            >
              <option value="">Select Financial Year</option>
              {financialYears
                .filter(fy => fy.status === "active")
                .map((fy) => (
                  <option key={fy.id} value={fy.id}>
                    {fy.name}
                  </option>
                ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">Must link to an active FY</div>
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Name Preview</span>
            <input
              type="text"
              value={generateAYName(form.financial_year) || "Select FY first"}
              readOnly
              className="mt-1 w-full h-10 border rounded-lg px-3 bg-gray-50"
            />
            <div className="text-xs text-gray-500 mt-1">Auto-generated from linked FY</div>
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              value={form.status || "active"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Configuration Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Financial Eligibility Years</span>
              <input
                type="number"
                min="1"
                max="10"
                value={form.financial_eligibility_years || 3}
                onChange={(e) => setForm({ ...form, financial_eligibility_years: parseInt(e.target.value) })}
                className="mt-1 w-full h-10 border rounded-lg px-3"
              />
              <div className="text-xs text-gray-500 mt-1">Years required for income verification</div>
            </label>

            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">ITR Years Required</span>
              <input
                type="number"
                min="1"
                max="10"
                value={form.itr_years_required || 3}
                onChange={(e) => setForm({ ...form, itr_years_required: parseInt(e.target.value) })}
                className="mt-1 w-full h-10 border rounded-lg px-3"
              />
              <div className="text-xs text-gray-500 mt-1">Years of ITR required for verification</div>
            </label>

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={!!form.document_compliance_required}
                onChange={(e) => setForm({ ...form, document_compliance_required: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Document Compliance Required</span>
            </label>

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={!!form.credit_assessment_enabled}
                onChange={(e) => setForm({ ...form, credit_assessment_enabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Credit Assessment Enabled</span>
            </label>

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={!!form.loan_type_specific}
                onChange={(e) => setForm({ ...form, loan_type_specific: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Loan Type Specific</span>
            </label>

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={!!form.borrower_type_specific}
                onChange={(e) => setForm({ ...form, borrower_type_specific: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Borrower Type Specific</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DaysModal({ form, setForm, onClose, onSave }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const toggle = (d) => {
    const has = form.days.includes(d);
    const next = has ? form.days.filter((x) => x !== d) : [...form.days, d];
    setForm({ ...form, days: next });
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]">
        <h3 className="text-lg font-semibold mb-4">Add Working Days</h3>
        <div className="grid grid-cols-3 gap-3">
          {days.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.days.includes(d)}
                onChange={() => toggle(d)}
              />
              <span>{d}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkingHoursModal({ form, setForm, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]">
        <h3 className="text-lg font-semibold mb-4">Add Working Hours</h3>
        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Start Time</span>
          <input
            type="time"
            value={form.start_time || ""}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="mt-1 w-full h-10 border rounded-lg px-3"
          />
        </label>
        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">End Time</span>
          <input
            type="time"
            value={form.end_time || ""}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="mt-1 w-full h-10 border rounded-lg px-3"
          />
        </label>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function OvertimeModal({ form, setForm, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]">
        <h3 className="text-lg font-semibold mb-4">Add Overtime</h3>
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={!!form.enable_overtime}
            onChange={(e) => setForm({ ...form, enable_overtime: e.target.checked })}
          />
          <span>Enable Overtime</span>
        </label>
        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Rate Multiplier</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.rate_multiplier}
            onChange={(e) => setForm({ ...form, rate_multiplier: e.target.value })}
            className="mt-1 w-full h-10 border rounded-lg px-3"
          />
        </label>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}