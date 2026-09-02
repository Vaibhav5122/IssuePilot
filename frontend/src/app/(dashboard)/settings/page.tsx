"use client";

import { useUser, useLogout } from "@/lib/hooks/useAuth";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Layers, Sun, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { data: user } = useUser();
  const logout = useLogout();
  const { activeWorkspace, activeMemberRole } = useActiveWorkspace();

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Settings & Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal profile, theme preferences, and active workspace details.
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl border border-primary/20">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{user?.name || "User Profile"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/20">
            <User className="text-primary" size={20} />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-semibold text-foreground">{user?.name || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/20">
            <Mail className="text-primary" size={20} />
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="text-sm font-semibold text-foreground">{user?.email || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Sun size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Theme Preference</h3>
              <p className="text-xs text-muted-foreground">Switch between light mode, dark mode, or system default.</p>
            </div>
          </div>

          <ThemeToggle align="end" />
        </div>
      </div>

      {/* Active Workspace Info */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Active Workspace Context</h3>
            <p className="text-xs text-muted-foreground">Information about your current selected workspace.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Workspace Name</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{activeWorkspace?.name || "None Selected"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your Role</p>
            <p className="text-sm font-bold text-foreground mt-0.5 capitalize">{activeMemberRole || "Member"}</p>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-4">
        <Button
          onClick={logout}
          variant="outline"
          className="rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10 font-semibold gap-2"
        >
          <LogOut size={16} /> Sign Out of Account
        </Button>
      </div>
    </div>
  );
}
