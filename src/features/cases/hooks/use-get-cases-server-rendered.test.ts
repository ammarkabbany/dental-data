import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetCasesServerRendered, CaseServerFilters, CaseSort } from './use-get-cases-server-rendered';
import { databases } from '@/lib/appwrite/client'; // To mock
import useTeamStore from '@/store/team-store'; // To mock
import { DATABASE_ID, CASES_COLLECTION_ID } from '@/lib/constants'; // Import actual constants
import { Query } from 'appwrite'; // For verifying query construction if needed

// Mock Appwrite databases
jest.mock('@/lib/appwrite/client', () => ({
  databases: {
    listDocuments: jest.fn(),
  },
}));

// Mock team store
jest.mock('@/store/team-store');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
        staleTime: Infinity, // Prevent immediate refetch during tests
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetCasesServerRendered', () => {
  const mockDatabasesListDocuments = databases.listDocuments as jest.Mock;
  const mockUseTeamStore = useTeamStore as jest.MockedFunction<typeof useTeamStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for team store
    mockUseTeamStore.mockReturnValue({ activeTeam: { $id: 'test-team-id' } } as any);
  });

  it('should return empty documents and total 0 and not call listDocuments if teamId is not available', async () => {
    mockUseTeamStore.mockReturnValue({ activeTeam: null } as any);
    const { result } = renderHook(() => useGetCasesServerRendered(0, 10, {}, undefined), { wrapper: createWrapper() });

    // Query is disabled, so it won't be fetching, thus isSuccess won't be true immediately
    // Instead, check the data directly or status if needed
    expect(result.current.data).toEqual({ documents: [], total: 0 }); // As per current hook logic for no teamId
    expect(mockDatabasesListDocuments).not.toHaveBeenCalled();
  });

  it('should call listDocuments with correct default parameters', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const { result } = renderHook(() => useGetCasesServerRendered(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      expect.arrayContaining([
        Query.equal("teamId", 'test-team-id'),
        Query.limit(10),
        Query.offset(0),
        Query.orderDesc("$createdAt"),
      ])
    );
  });

  it('should apply filters correctly', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const filters: CaseServerFilters = { patient: 'John', doctorId: 'doc1', search: 'urgent' };
    const { result } = renderHook(() => useGetCasesServerRendered(0, 10, filters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      expect.arrayContaining([
        Query.equal("teamId", 'test-team-id'),
        Query.search("patient", 'John'),
        Query.equal("doctorId", 'doc1'),
        Query.search("patient", 'urgent'), // Global search (filters.search) searches 'patient' by default in hook
      ])
    );
  });

  it('should apply sorting correctly (DESC)', async () => {
     mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
     const sort: CaseSort = { sortColumn: 'patient', sortDirection: 'DESC' };
     const { result } = renderHook(() => useGetCasesServerRendered(0, 10, {}, sort), { wrapper: createWrapper() });

     await waitFor(() => expect(result.current.isSuccess).toBe(true));

     expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
         DATABASE_ID,
         CASES_COLLECTION_ID,
         expect.arrayContaining([
            Query.equal("teamId", 'test-team-id'),
            Query.orderDesc('patient'),
         ])
     );
  });

  it('should apply sorting correctly (ASC)', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const sort: CaseSort = { sortColumn: 'date', sortDirection: 'ASC' };
    const { result } = renderHook(() => useGetCasesServerRendered(0, 10, {}, sort), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        expect.arrayContaining([
           Query.equal("teamId", 'test-team-id'),
           Query.orderAsc('date'),
        ])
    );
 });

 it('should handle API error', async () => {
    const errorMessage = 'Failed to fetch';
    mockDatabasesListDocuments.mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useGetCasesServerRendered(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(errorMessage);
  });

  it('should use correct pagination parameters', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const pageIndex = 2;
    const pageSize = 5;
    const { result } = renderHook(() => useGetCasesServerRendered(pageIndex, pageSize), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      expect.arrayContaining([
        Query.equal("teamId", 'test-team-id'),
        Query.limit(pageSize),
        Query.offset(pageIndex * pageSize),
      ])
    );
  });

  it('should correctly filter by invoiceStatus true', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const filters: CaseServerFilters = { invoiceStatus: true };
    const { result } = renderHook(() => useGetCasesServerRendered(0, 10, filters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      expect.arrayContaining([
        Query.equal("teamId", 'test-team-id'),
        Query.equal("invoice", true),
      ])
    );
  });

  it('should correctly filter by invoiceStatus false', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const filters: CaseServerFilters = { invoiceStatus: false };
    const { result } = renderHook(() => useGetCasesServerRendered(0, 10, filters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      expect.arrayContaining([
        Query.equal("teamId", 'test-team-id'),
        Query.equal("invoice", false),
      ])
    );
  });

  it('should correctly filter by date range', async () => {
    mockDatabasesListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });
    const filters: CaseServerFilters = { dateFrom: '2023-01-01', dateTo: '2023-01-31' };
    const { result } = renderHook(() => useGetCasesServerRendered(0, 10, filters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDatabasesListDocuments).toHaveBeenCalledWith(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      expect.arrayContaining([
        Query.equal("teamId", 'test-team-id'),
        Query.greaterThanEqual("date", '2023-01-01'),
        Query.lessThanEqual("date", '2023-01-31'),
      ])
    );
  });

});
