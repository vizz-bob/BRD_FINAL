import React from "react";

const DashboardLinks = () => {
  return (
    <div className="flex h-screen mt-18">
      {/* Sidebar (sticky while scrolling) */}
      <div className="w-64 bg-[#034271] text-white p-6 space-y-4 sticky top-0 self-start h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">All Dashboards</h2>

        <nav className="space-y-3">
          <a
            href="https://tenant-admin-brd.vercel.app/"
            target="_blank"
            className="block hover:bg-white hover:text-[#034271] p-2 rounded"
          >
            Tenant Admin
          </a>

          <a
            href="https://valuation-dashbaord.vercel.app/login
Valuation Dashboard
 "
            target="_blank"
            className="block hover:bg-white hover:text-[#034271] p-2 rounded"
          >
            Vaulation Team
          </a>

          <a
            href="https://finanace-dsahboard.vercel.app/"
            target="_blank"
            className="block hover:bg-white hover:text-[#034271] p-2 rounded"
          >
            Finance Team
          </a>
          <a
            href="https://fraud-nine.vercel.app/login"
            target="_blank"
            className="block hover:bg-white hover:text-[#034271] p-2 rounded"
          >
            Fruad Team
          </a>
          <a
            href="https://brd-operation-verification-dashboar.vercel.app"
            target="_blank"
            className="block hover:bg-white hover:text-[#034271] p-2 rounded"
          >
            Operation & Verification
          </a>
          <a
            href="https://sales-crm-kappa-six.vercel.app/signin"
            target="_blank"
            rel="noreferrer noopener"
            className="block hover:bg-white hover:text-[#034271] p-2 rounded"
          >
            Sales & CRM
          </a>
        </nav>
      </div>

      {/* Right content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold">Welcome!</h1>
        <p className="mt-2 text-gray-600">
          Choose any dashboard from the sidebar.
        </p>
      </div>
    </div>
  );
};

export default DashboardLinks;
