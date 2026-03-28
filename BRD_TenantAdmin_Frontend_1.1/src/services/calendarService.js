import axiosInstance from "../utils/axiosInstance";

/*
  =====================================================
  CALENDAR & CONFIGURATION APIs
  =====================================================
  Base paths mapped from Django router
*/

const FINANCIAL_YEARS = "financial-years/";
const ASSESSMENT_YEARS = "assessment-years/";
const REPORTING_PERIODS = "reporting-periods/";
const HOLIDAYS = "holidays/";
const WORKING_DAYS = "working-days/";
const WORKING_HOURS = "working-hours/";
const OVERTIME = "overtime/";

/*
  =====================================================
  1. Financial Year
  =====================================================
*/
export const financialYearAPI = {
  getAll: () => axiosInstance.get(FINANCIAL_YEARS),
  getById: (id) => axiosInstance.get(`${FINANCIAL_YEARS}${id}/`),
  create: (payload) => axiosInstance.post(FINANCIAL_YEARS, payload),
  update: (id, payload) =>
    axiosInstance.put(`${FINANCIAL_YEARS}${id}/`, payload),
  partialUpdate: (id, payload) =>
    axiosInstance.patch(`${FINANCIAL_YEARS}${id}/`, payload),
  delete: (id) => axiosInstance.delete(`${FINANCIAL_YEARS}${id}/`),
};

/*
  =====================================================
  2. Assessment Year
  =====================================================
*/
export const assessmentYearAPI = {
  getAll: () => axiosInstance.get(ASSESSMENT_YEARS),
  getById: (id) => axiosInstance.get(`${ASSESSMENT_YEARS}${id}/`),
  create: (payload) => axiosInstance.post(ASSESSMENT_YEARS, payload),
  update: (id, payload) =>
    axiosInstance.put(`${ASSESSMENT_YEARS}${id}/`, payload),
  partialUpdate: (id, payload) =>
    axiosInstance.patch(`${ASSESSMENT_YEARS}${id}/`, payload),
  delete: (id) => axiosInstance.delete(`${ASSESSMENT_YEARS}${id}/`),
};

/*
  =====================================================
  3. Reporting Period
  =====================================================
*/
export const reportingPeriodAPI = {
  getAll: () => axiosInstance.get(REPORTING_PERIODS),
  getById: (id) => axiosInstance.get(`${REPORTING_PERIODS}${id}/`),
  create: (payload) => axiosInstance.post(REPORTING_PERIODS, payload),
  update: (id, payload) =>
    axiosInstance.put(`${REPORTING_PERIODS}${id}/`, payload),
  partialUpdate: (id, payload) =>
    axiosInstance.patch(`${REPORTING_PERIODS}${id}/`, payload),
  delete: (id) => axiosInstance.delete(`${REPORTING_PERIODS}${id}/`),
};

/*
  =====================================================
  4. Holidays
  =====================================================
*/
export const holidayAPI = {
  getAll: () => axiosInstance.get(HOLIDAYS),
  getById: (id) => axiosInstance.get(`${HOLIDAYS}${id}/`),
  create: (payload) => axiosInstance.post(HOLIDAYS, payload),
  update: (id, payload) =>
    axiosInstance.put(`${HOLIDAYS}${id}/`, payload),
  partialUpdate: (id, payload) =>
    axiosInstance.patch(`${HOLIDAYS}${id}/`, payload),
  delete: (id) => axiosInstance.delete(`${HOLIDAYS}${id}/`),
};

/*
  =====================================================
  5. Working Days
  =====================================================
*/
export const workingDayAPI = {
  getAll: () => axiosInstance.get(WORKING_DAYS),
  update: (id, payload) =>
    axiosInstance.patch(`${WORKING_DAYS}${id}/`, payload),
};

/*
  =====================================================
  6. Working Hours
  =====================================================
*/
export const workingHourAPI = {
  getAll: () => axiosInstance.get(WORKING_HOURS),
  getById: (id) => axiosInstance.get(`${WORKING_HOURS}${id}/`),
  create: (payload) => axiosInstance.post(WORKING_HOURS, payload),
  update: (id, payload) =>
    axiosInstance.put(`${WORKING_HOURS}${id}/`, payload),
  delete: (id) => axiosInstance.delete(`${WORKING_HOURS}${id}/`),
};

/*
  =====================================================
  7. Overtime
  =====================================================
*/
export const overtimeAPI = {
  getAll: () => axiosInstance.get(OVERTIME),
  update: (id, payload) =>
    axiosInstance.patch(`${OVERTIME}${id}/`, payload),
};

const BASE = "finance/";

export const calendarAPI = {
  // Financial Years
  getFinancialYears: () =>
    axiosInstance.get(`${BASE}financial-years/`),

  createFinancialYear: (data) =>
    axiosInstance.post(`${BASE}financial-years/`, data),

  // Assessment Years
  getAssessmentYears: () =>
    axiosInstance.get(`${BASE}assessment-years/`),

  createAssessmentYear: (data) =>
    axiosInstance.post(`${BASE}assessment-years/`, data),

  // Reporting Periods
  getReportingPeriods: () =>
    axiosInstance.get(`${BASE}reporting-periods/`),

  createReportingPeriod: (data) =>
    axiosInstance.post(`${BASE}reporting-periods/`, data),

  deleteReportingPeriod: (id) =>
    axiosInstance.delete(`${BASE}reporting-periods/${id}/`),

  // Holidays
  getHolidays: () =>
    axiosInstance.get(`${BASE}holidays/`),

  createHoliday: (data) =>
    axiosInstance.post(`${BASE}holidays/`, data),

  deleteHoliday: (id) =>
    axiosInstance.delete(`${BASE}holidays/${id}/`),
};