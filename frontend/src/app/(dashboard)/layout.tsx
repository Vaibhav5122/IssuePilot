"use client";
import { AuthGuard } from "@/components/auth/authGuard";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AuthGuard>
      <div>
        <div className="flex min-h-screen w-full bg-[#f9fafb]">
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
          )}

          <Sidebar isOpen={sidebarOpen} />

          <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
            <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Menu size={22} />
              </button>
              <span className="font-semibold text-gray-800">IssuePilot</span>
              <div className="w-8" />
            </header>

            <Sidebar />
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
