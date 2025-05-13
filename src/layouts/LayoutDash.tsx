"use client";

// components/Layout.js
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import MenuDrawer from "../components/MenuDrawer";
import LoadLogOut from "../components/LoadLogOut";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadLogOut, setloadLogOut] = React.useState(false);

  return (
    <div className="w-screen flex h-screen bg-gray-100">
      <div className="w-[100%] flex flex-row">
        <div
          className={`bg-gray-800 text-white py-4 flex flex-col gap-12 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-72" : "w-16"
            } max-md:block overflow-hidden`}
        >
          {/* Sidebar content */}
          <div className='w-full flex justify-end'>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white float-end mr-4"
            >
              <MenuIcon size={25} strokeWidth={1.5} />
            </button>
          </div>

          <MenuDrawer open={isSidebarOpen} setloadLogOut={setloadLogOut} />
        </div>
        <ScrollArea className="w-full bg-white/80">
          <div className="w-full flex-grow p-4 flex flex-col gap-12">
            <HeaderAdmin />
            {children}
          </div>
        </ScrollArea>
      </div>
      
      {loadLogOut && 
        <LoadLogOut />
      }
    </div>
  );
};

export default Layout;
