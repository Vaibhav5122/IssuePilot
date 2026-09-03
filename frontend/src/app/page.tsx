"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth/token";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  FolderKanban,
  Kanban,
  Users,
  Settings,
  ShieldCheck,
  Zap,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());

    // Ping backend to wake up from Render cold sleep
    const wakeUpBackend = async () => {
      try {
        const rawUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000/api/v1";

        const serverUrl = rawUrl.replace(/\/api\/v1\/?$/, "");

        // Request /health with mode: 'no-cors' so browser won't log CORS errors
        // and Render's routing proxy immediately triggers container spin-up.
        await fetch(`${serverUrl}/health`, {
          method: "GET",
          mode: "no-cors",
        });
      } catch {
        // Silently ignore errors during background warmup
      }
    };

    wakeUpBackend();
  }, []);

  const routeLinks = [
    {
      title: "Overview Dashboard",
      path: "/overview",
      icon: LayoutDashboard,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      description:
        "High-level metrics, active projects, open vs completed issue counters.",
      badge: "Protected",
    },
    {
      title: "Workspace Management",
      path: "/workspaces",
      icon: Layers,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      description:
        "Create, view, and switch workspaces with role-based member permissions.",
      badge: "Protected",
    },
    {
      title: "Project Management",
      path: "/projects",
      icon: FolderKanban,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      description:
        "Organize tasks into projects, track progress, key identifiers, and descriptions.",
      badge: "Protected",
    },
    {
      title: "Kanban & Issue Tracker",
      path: "/issues",
      icon: Kanban,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      description:
        "Full-featured issue board with status columns, priority filters, and search.",
      badge: "Protected",
    },
    {
      title: "Team & Member Access",
      path: "/members",
      icon: Users,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      description:
        "Invite workspace members, assign Admin/Member roles, and align permissions.",
      badge: "Protected",
    },
    {
      title: "User Settings",
      path: "/settings",
      icon: Settings,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      description:
        "Manage personal profile details, dark mode preferences, and workspace config.",
      badge: "Protected",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Layers size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              IssuePilot
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#routes"
              className="hover:text-foreground transition-colors"
            >
              Page Directory
            </a>
            <a
              href="#architecture"
              className="hover:text-foreground transition-colors"
            >
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/overview">
                <Button className="rounded-xl font-medium flex items-center gap-2">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-xl font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-xl font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border/30">
          <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent -z-10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
              <Sparkles size={14} />
              <span>
                IssuePilot 2.0 • Modern Agile Issue & Project Management
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.15]">
              Pilot your teams, projects, and issues with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                absolute clarity
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              An end-to-end workspace management tool built for modern teams.
              Organize workspaces, assign granular roles, manage projects,
              drag-and-drop Kanban issues, and track audit history in real-time.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
              <Link
                href={isAuthenticated ? "/overview" : "/register"}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl px-8 font-semibold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? "Open Dashboard" : "Get Started for Free"}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="#routes" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl px-8 font-semibold text-base border-border"
                >
                  Explore App Pages
                </Button>
              </a>
            </div>

            {/* Dashboard Mockup Banner */}
            <div className="mt-14 w-full max-w-4xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">
                    issuepilot.app/issues
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted">
                    Workspace: IssuePilot Corp
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
                {[
                  { title: "TODO", count: 4, color: "border-l-blue-500" },
                  {
                    title: "IN PROGRESS",
                    count: 6,
                    color: "border-l-purple-500",
                  },
                  { title: "IN REVIEW", count: 2, color: "border-l-amber-500" },
                  { title: "DONE", count: 12, color: "border-l-emerald-500" },
                ].map((col) => (
                  <div
                    key={col.title}
                    className={`rounded-xl border border-border bg-background p-3 ${col.color} border-l-4`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-muted-foreground mb-2">
                      <span>{col.title}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-muted">
                        {col.count}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-lg border border-border bg-card shadow-xs text-xs space-y-1">
                        <div className="font-semibold text-foreground">
                          Fix Table Alignment in Members UI
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
                            HIGH
                          </span>
                          <span>IP-104</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Page Directory / Links Section */}
        <section
          id="routes"
          className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Complete Application Page Directory
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore all routes and views engineered into IssuePilot, powered
              by REST API endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routeLinks.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.path}
                  className="group relative rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:shadow-md hover:border-primary/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${route.color}`}>
                        <Icon size={24} />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                        {route.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {route.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {route.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      {route.path}
                    </span>
                    <Link href={route.path}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs font-semibold group-hover:translate-x-1 transition-transform"
                      >
                        Navigate <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Core Features */}
        <section
          id="features"
          className="py-16 md:py-24 border-t border-border/40 bg-muted/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                Built for High-Velocity Software Teams
              </h2>
              <p className="mt-3 text-muted-foreground">
                Everything you need to plan, track, and ship high quality
                software.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Multi-Tenant & RBAC
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Isolate work across multiple workspaces. Grant Admin or Member
                  permissions to keep your data secure.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Kanban & Filtering
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Seamlessly organize tasks into TODO, IN PROGRESS, IN REVIEW,
                  and DONE. Filter by priority, assignee, or keyword.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Activity & Comments
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Track full audit histories of status and priority updates
                  alongside threaded discussions for every issue.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
              IP
            </div>
            <span className="font-semibold text-foreground">IssuePilot</span>
            <span>
              © {new Date().getFullYear()} IssuePilot. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Register
            </Link>
            <Link href="/overview" className="hover:text-foreground">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
