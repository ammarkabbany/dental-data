"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient, PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect, useState } from "react";
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { createIDBPersister } from "@/lib/indexedDBPersister";
import { compress, decompress } from "lz-string";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session to avoid hydration issues
  
  const persister = createIDBPersister('query-idb');
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });

  // Persist the query client to local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      serialize: (data) => compress(JSON.stringify(data)),
      deserialize: (data) => JSON.parse(decompress(data)),
    })
    const persist = async () => {
      persistQueryClient({
        queryClient,
        persister: localStoragePersister
      });
    };
    persist();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
    {/* <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: "v1", // Cache version
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Don't persist queries with "auth" or "current" in the key
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && 
                  !queryKey.includes('auth') && 
                  !queryKey.includes('current');
          },
        },
      }}
    > */}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    {/* </PersistQueryClientProvider> */}
    </QueryClientProvider>
  );
}
