import { useState, useEffect } from 'react';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFunc();
        setData(result);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunc]);

  return { data, loading, error };
};

export default useApi;

export const fetchComplianceData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Compliance Issues',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Audits Completed',
            data: [5, 8, 6, 4, 7, 5],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      });
    }, 1000);
  });
};

export const fetchReports = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'REP-001', title: 'Monthly Compliance Summary - October 2025', date: '2025-11-01', type: 'Summary' },
        { id: 'REP-002', title: 'Q3 Audit Findings Report', date: '2025-10-15', type: 'Audit' },
        { id: 'REP-003', title: 'Data Privacy Compliance Report', date: '2025-10-10', type: 'Data Privacy' },
        { id: 'REP-004', title: 'Monthly Compliance Summary - September 2025', date: '2025-10-01', type: 'Summary' },
      ]);
    }, 1000);
  });
};