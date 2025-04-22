// lib/audit-log/mockAuditLogger.ts

import { AuditLogAction } from '@/types/index';

type MockAuditEntry = {
  teamId: string;
  userId: string;
  action: AuditLogAction;
  resource: string;
  resourceId: string;
  timestamp: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  metadata?: Record<string, any>;
};

export const mockAuditLogs: MockAuditEntry[] = [];

/**
 * Mock implementation of the audit log function — used during development without Appwrite.
 */
export async function logAuditEventMock(params: Omit<MockAuditEntry, 'timestamp'>) {
  const entry: MockAuditEntry = {
    ...params,
    timestamp: new Date().toISOString(),
  };

  mockAuditLogs.push(entry);
  console.info('[MockAuditLog]', entry);
}
