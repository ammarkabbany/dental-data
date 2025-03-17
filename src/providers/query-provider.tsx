"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { useState, useEffect } from "react";
import { createIDBPersister } from "@/lib/indexedDBPersister";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnMount: 'always'
      },
    },
  }));
  
  // Set up persistence on the client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persister = createIDBPersister();
      
      persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: "v1", // Cache version
      });
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
