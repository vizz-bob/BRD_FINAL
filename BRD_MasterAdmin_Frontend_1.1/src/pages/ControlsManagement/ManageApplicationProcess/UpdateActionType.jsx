import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { PageHeader, CheckboxGroup, Button } from "../../../components/Controls/SharedUIHelpers";
import { useNavigate } from "react-router-dom";

export default function UpdateActionType() {
  const navigate = useNavigate();

  const [actions, setActions] = useState({
    submit: true,
    approve: true,
    reject: true,
    review: false,
  });

  const toggle = (key) =>
    setActions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    console.log("Action Types:", actions);
    navigate(-1);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Update Action Types"
        subtitle="Enable or disable application actions"
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl space-y-4">
        {Object.keys(actions).map((key) => (
          <CheckboxGroup
            key={key}
            label={key.toUpperCase()}
            checked={actions[key]}
            onChange={() => toggle(key)}
          />
        ))}

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
