import { useEffect } from "react";
import { tenantAPI } from "../services/api";

export default function Testing() {
  useEffect(() => {
    tenantAPI.getAll()
      .then(res => console.log("✔️ Tenants:", res.data))
      .catch(err => console.log("❌ Error:", err));
  }, []);

  return <h1>Testing...</h1>;
}
