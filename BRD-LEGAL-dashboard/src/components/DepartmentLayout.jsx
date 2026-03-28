import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { MessageProvider } from "../context/MessageContext";
import GlobalMessageDisplay from "./GlobalMessageDisplay";

const DepartmentLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <MessageProvider>
      <div className="flex flex-col min-h-screen">
        {/* HEADER */}
        <div className="lg:pl-72">
          <Header setMobileSidebarOpen={setMobileSidebarOpen} />
        </div>

        {/* BODY */}
        <div className="flex">
          {/* SIDEBAR */}
          <Sidebar
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />

          {/* MAIN CONTENT */}
          <main className="flex-1 bg-gray-50 min-h-screen lg:pl-72 pt-16">
            {/* p-3 on mobile, p-6 on desktop — no container mx-auto which can add extra spacing */}
            <div className="p-3 sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <GlobalMessageDisplay />
    </MessageProvider>
  );
};

export default DepartmentLayout;