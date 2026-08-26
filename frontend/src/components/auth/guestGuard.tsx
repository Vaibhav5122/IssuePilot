"use client";

import { getToken } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();

    if (token) {
      router.replace("/workspaces");
    } else {
      setIsGuest(true);
    }
  }, [router]);
  if (isGuest === null) {
    return null;
  }
  return <>{children}</>;
}
