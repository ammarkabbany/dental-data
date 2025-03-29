import { del, get, set } from 'idb-keyval';
import { nanoid } from 'nanoid';

// Types for our persistence system
export interface PendingOperation {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body: any;
  timestamp: number;
  retryCount: number;
}

export interface PersistedData<T> {
  data: T[];
  lastSynced: number;
}

// Keys for IndexedDB storage
const PENDING_OPERATIONS_KEY = 'pendingOperations';
const NETWORK_STATUS_KEY = 'networkStatus';

export class PersistenceService {
  private isOnline: boolean = navigator.onLine;
  private pendingOperations: PendingOperation[] = [];
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize and load pending operations
    this.init();
    
    // Set up event listeners for online/offline status
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private async init() {
    try {
      // Load pending operations from IndexedDB
      const operations = await get<PendingOperation[]>(PENDING_OPERATIONS_KEY);
      if (operations) {
        this.pendingOperations = operations;
      }
      
      // Start sync interval if online
      if (this.isOnline) {
        this.startSyncInterval();
      }
    } catch (error) {
      console.error('Error initializing persistence service:', error);
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.startSyncInterval();
    this.syncPendingOperations();
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.stopSyncInterval();
  };

  private startSyncInterval() {
    if (!this.syncInterval) {
      this.syncInterval = setInterval(() => {
        this.syncPendingOperations();
      }, 30000); // Try to sync every 30 seconds
    }
  }

  private stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Store data in IndexedDB
  async storeData<T>(key: string, data: T[]): Promise<void> {
    try {
      const persistedData: PersistedData<T> = {
        data,
        lastSynced: Date.now()
      };
      await set(key, persistedData);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
    }
  }

  // Retrieve data from IndexedDB
  async getData<T>(key: string): Promise<T[] | null> {
    try {
      const persistedData = await get<PersistedData<T>>(key);
      return persistedData?.data || null;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  // Queue an operation to be performed when online
  async queueOperation(
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body: any
  ): Promise<string> {
    const operation: PendingOperation = {
      id: nanoid(),
      endpoint,
      method,
      body,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.pendingOperations.push(operation);
    await this.savePendingOperations();
    
    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingOperations();
    }

    return operation.id;
  }

  // Save pending operations to IndexedDB
  private async savePendingOperations() {
    try {
      await set(PENDING_OPERATIONS_KEY, this.pendingOperations);
    } catch (error) {
      console.error('Error saving pending operations:', error);
    }
  }

  // Sync all pending operations with the server
  private async syncPendingOperations() {
    if (!this.isOnline || this.pendingOperations.length === 0) {
      return;
    }

    const operations = [...this.pendingOperations];
    
    for (const operation of operations) {
      try {
        const response = await fetch(operation.endpoint, {
          method: operation.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(operation.body)
        });

        if (response.ok) {
          // Operation succeeded, remove from pending list
          this.pendingOperations = this.pendingOperations.filter(
            op => op.id !== operation.id
          );
        } else {
          // Operation failed, increment retry count
          const failedOp = this.pendingOperations.find(op => op.id === operation.id);
          if (failedOp) {
            failedOp.retryCount += 1;
            
            // If we've tried too many times, remove the operation
            if (failedOp.retryCount > 5) {
              this.pendingOperations = this.pendingOperations.filter(
                op => op.id !== operation.id
              );
              console.error(`Operation ${operation.id} failed too many times and was removed`);
            }
          }
        }
      } catch (error) {
        console.error(`Error syncing operation ${operation.id}:`, error);
        // Don't increment retry count for network errors
      }
    }

    // Save updated pending operations
    await this.savePendingOperations();
  }

  // Check if we're online
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  // Clean up event listeners
  destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.stopSyncInterval();
  }
}

// Create a singleton instance
export const persistenceService = new PersistenceService();