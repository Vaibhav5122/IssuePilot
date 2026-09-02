"use client";

import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side: IssuePilot Showcase Visual */}
      <div className="relative hidden bg-slate-950 lg:flex flex-col justify-between p-10 overflow-hidden border-r border-border">
        {/* Subtle decorative gradient glow */}
        <div className="absolute inset-0 bg-radial-[at_top_left] from-primary/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Top Logo & Title */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="IssuePilot Logo"
            className="h-10 w-10 rounded-xl object-contain shadow-md"
          />
          <span className="text-xl font-bold tracking-tight text-white">
            IssuePilot
          </span>
        </div>

        {/* Center: Showcase Image */}
        <div className="relative z-10 flex items-center justify-center my-auto py-6">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-md w-full aspect-3/4 group">
            <img
              src="/signin-showcase.jpg"
              alt="IssuePilot Dashboard Showcase"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 space-y-1 text-slate-300">
          <p className="text-sm font-medium leading-relaxed">
            "Streamline your sprints, organize project backlogs, and ship faster with your team."
          </p>
          <p className="text-xs text-slate-400 font-semibold">
            IssuePilot • Modern Project Management & Issue Tracking
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex flex-col justify-between p-6 sm:p-10 bg-background">
        <div className="flex justify-center sm:justify-start">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
            <img
              src="/logo.png"
              alt="IssuePilot"
              className="h-8 w-8 rounded-lg object-contain shadow-xs"
            />
            <span>IssuePilot</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} IssuePilot. All rights reserved.
        </div>
      </div>
    </div>
  );
}
