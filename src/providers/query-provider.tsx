"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { useState } from "react";
import { useEffect } from "react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { compress, decompress } from "lz-string";
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session to avoid hydration issues
  
  // const persister = createIDBPersister('query-idb');
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // refetchOnMount: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  // Persist the query client to local storage
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const localStoragePersister = createSyncStoragePersister({
  //     storage: window.localStorage,
  //     serialize: (data) => compress(JSON.stringify(data)),
  //     deserialize: (data) => JSON.parse(decompress(data)),
  //   })
  //   const persist = async () => {
  //     persistQueryClient({
  //       queryClient,
  //       persister: localStoragePersister,
  //       dehydrateOptions: {
  //         shouldDehydrateQuery: (query) => {
  //           // Don't persist queries with "auth" or "current" in the key
  //           const queryKey = query.queryKey[0];
  //           return typeof queryKey === 'string' && 
  //                 !queryKey.includes('auth') && 
  //                 !queryKey.includes('current') &&
  //                 !queryKey.includes('team')
  //         },
  //       },
  //     });
  //   };
  //   persist();
  // }, [queryClient]);

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
