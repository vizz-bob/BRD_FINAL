import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  SelectField,
  MultiSelectField,
  Button,
} from "../../components/Controls/SharedUIHelpers";

import { approvalAssignmentService } from "../../services/approvalMasterService";
import { organizationService } from "../../services/organizationService";
import { userService } from "../../services/userService";

export function ManageApprovalPage({ isEdit = false, editId = null }) {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [tenants, setTenants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [form, setForm] = useState({
    tenant_id: "",
    approver_type: "",
    user_id: "",
    group_users: [],
    status: "Active",
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    fetchTenants();
    fetchUsers();
  }, []);

  const fetchTenants = async () => {
    const data = await organizationService.getOrganizations();
    const tenantOptions = data.map((t) => ({
      label: t.business_name || t.code || t.id,
      value: t.id,
    }));
    setTenants(tenantOptions);
  };

  const fetchUsers = async () => {
    const data = await userService.getUsers();
    setAllUsers(data);
    console.log(data)
  };

  /* ================= FILTER USERS BY TENANT ================= */

  const users = allUsers.map((u) => ({
  label: u.email,
  value: u.id,
}));


  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tenant_id") {
      setForm({
        tenant_id: value,
        approver_type: "",
        user_id: "",
        group_users: [],
        status: "Active",
      });
      return;
    }

    if (name === "approver_type") {
      setForm((prev) => ({
        ...prev,
        approver_type: value,
        user_id: "",
        group_users: [],
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tenant_id: form.tenant_id,
      approver_type: form.approver_type.toUpperCase(),
      user_id:
        form.approver_type === "Individual" ? form.user_id : null,
      group_users:
        form.approver_type === "Group" ? form.group_users : null,
      status: form.status.toUpperCase(),
    };

    try {
      if (isEdit && editId) {
        await approvalAssignmentService.updateAssignment(editId, payload);
      } else {
        await approvalAssignmentService.createAssignment(payload);
      }
      navigate(-1);
    } catch (error) {
      console.error("Manage Approval Error:", error);
    }
  };

  /* ================= UI ================= */

  return (
    <MainLayout>
      <SubPageHeader
        title={isEdit ? "Edit Approval Assignment" : "Manage Approval"}
        subtitle="Tenant → Approver Type → User / Group"
        onBack={() => navigate(-1)}
      />

      <div className="max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ================= ASSIGNMENT DETAILS ================= */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              Assignment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TENANT */}
              <SelectField
                label="Tenant *"
                value={form.tenant_id}
                onChange={(e) =>
                  handleChange({
                    target: { name: "tenant_id", value: e.target.value },
                  })
                }
                options={tenants}
                placeholder="Select tenant"
              />

              {/* APPROVER TYPE */}
              <SelectField
                label="Approver Type *"
                value={form.approver_type}
                onChange={(e) =>
                  handleChange({
                    target: { name: "approver_type", value: e.target.value },
                  })
                }
                options={[
                  { label: "Individual", value: "Individual" },
                  { label: "Group", value: "Group" },
                ]}
                placeholder="Select type"
              />

              {/* INDIVIDUAL USER */}
              {form.approver_type === "Individual" && (
                <SelectField
                  label="Select User *"
                  value={form.user_id}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "user_id", value: e.target.value },
                    })
                  }
                  options={users}
                  placeholder="Select user"
                />
              )}

              {/* GROUP USERS */}
              {form.approver_type === "Group" && (
                <div className="md:col-span-2">
                  <MultiSelectField
                    label="Select Group Members *"
                    values={form.group_users}
                    options={users}
                    onChange={(vals) =>
                      setForm((prev) => ({
                        ...prev,
                        group_users: vals,
                      }))
                    }
                  />
                </div>
              )}

              {/* STATUS */}
              <SelectField
                label="Status *"
                value={form.status}
                onChange={(e) =>
                  handleChange({
                    target: { name: "status", value: e.target.value },
                  })
                }
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </div>
          </div>

          {/* ================= ACTION ================= */}
          <Button
            type="submit"
            fullWidth
            icon={<FiSave />}
            label={isEdit ? "Update Assignment" : "Save Assignment"}
            disabled={!form.tenant_id || !form.approver_type}
          />
        </form>
      </div>
    </MainLayout>
  );
}

export default ManageApprovalPage;
