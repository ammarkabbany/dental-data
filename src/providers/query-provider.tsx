"use client";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "@/lib/indexedDBPersister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnMount: 'always',
    },
  },
});

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  
  const persister = createIDBPersister('query-idb');
  

  // Set up persistence on the client side only
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     // const persister = createSyncStoragePersister({
  //     //   storage: window.localStorage,
  //     // })
      
  //     persistQueryClient({
  //       queryClient,
  //       persister,
  //       maxAge: 10,
  //       buster: "v1", // Cache version
  //     });
  //   }
  // }, [queryClient]);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister, maxAge: 1000 * 60 * 60 * 24, buster: "v1"}}>
    {/* <QueryClientProvider client={queryClient} > */}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    {/* </QueryClientProvider> */}
    </PersistQueryClientProvider>
  );
}
