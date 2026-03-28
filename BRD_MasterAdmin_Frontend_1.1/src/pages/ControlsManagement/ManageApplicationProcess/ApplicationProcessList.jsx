import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";

import {
  PageHeader,
  FormCard,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

export default function ApplicationProcessList() {
  const navigate = useNavigate();

  const items = [
    {
      title: "Action Types",
      desc: "Configure submit, approve, reject, review actions",
      path: "/controls/application-process/action-type",
    },
    {
      title: "Processing Mode",
      desc: "Manual, auto, or hybrid processing rules",
      path: "/controls/application-process/processing-mode",
    },
    {
      title: "Update Application",
      desc: "Control application mode & re-application rules",
      path: "/controls/application-process/update-application",
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Application Process Management"
        subtitle="Control how loan applications are processed"
        showAction={false}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <FormCard
            key={item.title}
            className="flex items-start justify-between"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.desc}
              </p>
            </div>

            <Button
              variant="outline"
              icon={<FiEdit3 />}
              onClick={() => navigate(item.path)}
            />
          </FormCard>
        ))}
      </div>
    </MainLayout>
  );
}
