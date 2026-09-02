"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Settings = () => {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/settings");

  return (
    <Link
      href="/settings"
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <SettingsIcon size={18} className={isActive ? "text-primary-foreground" : ""} />
      <span>Settings</span>
    </Link>
  );
};

export default Settings;
