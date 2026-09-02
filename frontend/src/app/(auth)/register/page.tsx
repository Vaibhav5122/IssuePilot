"use client";

import { SignupForm } from "@/components/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2.5 self-center font-bold text-lg text-foreground">
          <img
            src="/logo.png"
            alt="IssuePilot"
            className="h-8 w-8 rounded-lg object-contain shadow-xs"
          />
          <span>IssuePilot</span>
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
