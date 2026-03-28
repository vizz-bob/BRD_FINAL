export const useApiWithFallback = async (apiCall, mockData) => {
  try {
    const res = await apiCall();
    return res.data;
  } catch (err) {
    console.warn("Backend offline. Using mock data.");
    return mockData;
  }
};
