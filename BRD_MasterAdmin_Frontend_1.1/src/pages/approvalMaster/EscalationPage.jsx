import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../components/Controls/SharedUIHelpers";

import { escalationMasterService } from "../../services/approvalMasterService";
import { userService } from "../../services/userService";

export function EscalationPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    escalation_level: "",
    escalation_time: "",
    escalation_manager: "", // store UUID
    escalation_to: "",      // store UUID
    status: "ACTIVE",
  });

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      const options = data.map((u) => ({
        label: u.full_name || u.email,
        value: u.id, // UUID for backend
      }));
      setUsers(options);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      escalation_level: Number(form.escalation_level),
      escalation_time: form.escalation_time, // ISO string from datetime-local
      escalation_manager: form.escalation_manager, // UUID
      escalation_to: form.escalation_to,           // UUID
      status: form.status.toUpperCase(),
    };

    console.log("Escalation Payload:", payload);

    try {
      await escalationMasterService.createEscalation(payload);
      navigate(-1);
    } catch (err) {
      console.error("Escalation create error:", err);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title="Escalation Master"
        subtitle="Manage delayed approval escalation rules"
        onBack={() => navigate(-1)}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-4xl space-y-8"
      >
        <h3 className="text-gray-900 font-semibold">Escalation Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Escalation Level *"
            value={form.escalation_level}
            onChange={handleChange("escalation_level")}
            placeholder="Select level"
            options={[
              { label: "Level 1", value: "1" },
              { label: "Level 2", value: "2" },
              { label: "Level 3", value: "3" },
              { label: "Level 4", value: "4" },
            ]}
          />

          <InputField
            label="Escalation Time *"
            type="datetime-local"
            value={form.escalation_time}
            onChange={handleChange("escalation_time")}
          />

          <SelectField
            label="Escalation Manager *"
            value={form.escalation_manager}
            onChange={handleChange("escalation_manager")}
            placeholder="Select manager"
            options={users}
          />

          <SelectField
            label="Escalation To *"
            value={form.escalation_to}
            onChange={handleChange("escalation_to")}
            placeholder="Select user"
            options={users}
          />

          <SelectField
            label="Status *"
            value={form.status}
            onChange={handleChange("status")}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />
        </div>

        <div className="pt-6 flex justify-end">
          <Button
            type="submit"
            label="Save Escalation Rule"
            icon={<FiSave />}
            variant="primary"
          />
        </div>
      </form>
    </MainLayout>
  );
}

export default EscalationPage;
