import api from "./axiosInstance";

export const generateReport = async (reportType, startDate, endDate) => {
    try {
        const response = await api.post("/reports/generate/", {
            report_type: reportType,
            start_date: startDate,
            end_date: endDate,
        });
        return response.data;
    } catch (error) {
        console.error("Error generating report:", error);
        throw error;
    }
};

export const getReportHistory = async () => {
    try {
        const response = await api.get("/reports/history/");
        return response.data;
    } catch (error) {
        console.error("Error loading report history:", error);
        throw error;
    }
};
