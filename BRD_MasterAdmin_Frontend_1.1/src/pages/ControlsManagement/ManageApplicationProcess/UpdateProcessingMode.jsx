import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  PageHeader,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function UpdateProcessingMode() {
  const navigate = useNavigate();
  const service = controlsManagementService.application_process;

  const [recordId, setRecordId] = useState(null);
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH EXISTING CONFIG ================= */
  useEffect(() => {
    const fetchConfig = async () => {
      const data = await service.list();

      if (Array.isArray(data) && data.length > 0) {
        setRecordId(data[0].id);
        setMode(data[0].processing_mode || "");
      }

      setLoading(false);
    };

    fetchConfig();
  }, [service]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!recordId) return;

    await service.partialUpdate(recordId, {
      processing_mode: mode,
    });

    navigate(-1);
  };

  if (loading) return null;

  return (
    <MainLayout>
      <PageHeader
        title="Processing Mode"
        subtitle="Select how applications are processed"
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl space-y-6">
        <SelectField
          label="Processing Mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          options={[
            { label: "Manual", value: "Manual" },
            { label: "Auto", value: "Auto" },
            { label: "Hybrid", value: "Hybrid" },
          ]}
        />

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
