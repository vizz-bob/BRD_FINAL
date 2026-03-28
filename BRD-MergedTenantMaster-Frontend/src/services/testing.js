import { useEffect } from "react";
import { tenantAPI } from "../services/api";

export default function Testing() {
  useEffect(() => {
    tenantAPI.getAll()
      .then((res) => console.log("✔️ Backend Connected:", res.data))
      .catch((err) => console.log("❌ Backend Error:", err));
  }, []);

  return <h1>Testing Backend Connection...</h1>;
}
