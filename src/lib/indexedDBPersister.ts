// utils/indexedDBPersister.ts
import { Persister } from '@tanstack/react-query-persist-client';
import { del, get, set } from 'idb-keyval';

export function createIDBPersister(idbValidKey: IDBValidKey = 'tanstack-query') {
  return {
    persistClient: async (client: string) => {
      await del(idbValidKey);
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<string>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as unknown as Persister;
}
