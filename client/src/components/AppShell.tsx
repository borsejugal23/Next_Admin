"use client";
import Navbar from "@/components/Navbar";
import RouteGuard from "@/components/RouteGuard";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <RouteGuard>
      <div className="flex min-h-screen flex-col max-w-360 mx-auto">
      <Navbar
        isOpen={isSidebarOpen}
        onSideMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="relative flex flex-1 overflow-hidden">
        {/* {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-14 z-20 bg-black/40 md:hidden"
          />
        )} */}
        <Sidebar isOpen={isSidebarOpen} />
        <main className="@container min-w-0 flex-1 overflow-auto bg-[#fefbf8]">
          {children}
        </main>
      </div>
    </div>
    </RouteGuard>
  );
}
