import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* PAGE CONTENT */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">

        {/* HEADER */}
        <Header onMenu={() => setOpen(true)} />

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-auto p-4 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
