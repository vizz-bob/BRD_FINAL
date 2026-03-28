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
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* HEADER - full width on mobile, offset on lg */}
        <div className="lg:pl-72 fixed top-0 left-0 right-0 z-30">
          <Header setMobileSidebarOpen={setMobileSidebarOpen} />
        </div>

        {/* BODY */}
        <div className="flex flex-1 pt-16">
          {/* SIDEBAR */}
          <Sidebar
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />

          {/* MAIN CONTENT */}
          <main className="flex-1 min-h-screen lg:pl-72 w-full overflow-x-hidden">
            <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-full">
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