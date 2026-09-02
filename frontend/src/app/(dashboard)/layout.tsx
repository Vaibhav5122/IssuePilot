"use client";

import { AuthGuard } from "@/components/auth/authGuard";
import Sidebar from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { Menu, Layers } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeWorkspace } = useActiveWorkspace();

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        <Sidebar isOpen={sidebarOpen} />

        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          {/* Top Header Bar */}
          <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 backdrop-blur-xs px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                  <Layers size={16} />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  {activeWorkspace?.name || "IssuePilot"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
