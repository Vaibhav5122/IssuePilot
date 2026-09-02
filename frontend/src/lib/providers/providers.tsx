"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { WorkspaceProvider } from "@/lib/context/WorkspaceContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // Data considered fresh for 2 minutes
            gcTime: 1000 * 60 * 30, // Unused query data cached in memory for 30 minutes
            refetchOnWindowFocus: true, // Automatically sync on tab return
            refetchOnReconnect: true, // Automatically sync on network reconnection
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <WorkspaceProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </WorkspaceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

