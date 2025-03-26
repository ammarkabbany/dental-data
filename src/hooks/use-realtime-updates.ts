"use client"
import { useEffect } from 'react';
import { client } from '@/lib/appwrite/client';
import { RealtimeResponseEvent } from 'appwrite';
import { DATABASE_ID } from '@/lib/constants';
import { useAuth } from '@/providers/auth-provider';

type Callback = (payload: RealtimeResponseEvent<any>) => void;

export function useRealtimeUpdates(collectionId: string, callback: Callback) {
  const {isAuthenticated} = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const unsubscribe =
      client.subscribe(
        `databases.${DATABASE_ID}.collections.${collectionId}.documents`,
        callback
      )

    return () => {
      unsubscribe();
    };
  }, [collectionId, callback, isAuthenticated]);
}