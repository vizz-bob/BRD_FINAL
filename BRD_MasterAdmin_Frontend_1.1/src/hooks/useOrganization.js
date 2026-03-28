import { useEffect, useState } from "react";

export default function useOrganizations(serviceCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await serviceCall();
        setData(res);
      } catch (e) {
        console.error("Error in service:", e);
      } finally {
        setLoading(false);
      }
    }

    if (typeof serviceCall === "function") {
      fetchData();
    } else {
      console.error("❌ serviceCall is not a function:", serviceCall);
      setLoading(false);
    }
  }, []);

  return { data, loading };
}
