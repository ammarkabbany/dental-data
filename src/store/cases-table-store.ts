import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ColumnFiltersState, PaginationState, SortingState, VisibilityState } from '@tanstack/react-table';
import { CaseServerFilters, CaseSort } from '@/features/cases/hooks/use-get-cases-server-rendered'; // Adjust path if needed

// Define the shape of the store's state
interface CasesTableState {
  pagination: PaginationState;
  sorting: SortingState; // Represented as Tanstack Table's SortingState
  columnFilters: CaseServerFilters; // Using our defined CaseServerFilters for more specific filter structure
  globalFilter: string; // For a general search term, maps to CaseServerFilters.search
  columnVisibility: VisibilityState;
  rowsPerPage: number; // Explicitly storing rowsPerPage, though it's part of pagination
}

// Define the actions available on the store
interface CasesTableActions {
  setPagination: (pagination: PaginationState) => void;
  setSorting: (sorting: SortingState) => void;
  setColumnFilters: (filters: CaseServerFilters) => void; // Action to set all filters
  setSpecificColumnFilter: <K extends keyof CaseServerFilters>(filterId: K, value: CaseServerFilters[K]) => void; // Action to set a single filter field
  removeSpecificColumnFilter: (filterId: keyof CaseServerFilters) => void;
  setGlobalFilter: (searchTerm: string) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setRowsPerPage: (rows: number) => void;
  resetFilters: () => void; // Action to reset all filters to initial state
  resetTableState: () => void; // Action to reset all table states to initial
}

// Define the initial state
const initialPagination: PaginationState = { pageIndex: 0, pageSize: 10 };
const initialSorting: SortingState = []; // Default: no sorting
const initialColumnFilters: CaseServerFilters = {}; // Default: no filters
const initialGlobalFilter: string = "";
const initialColumnVisibility: VisibilityState = {}; // Default: all columns visible
const initialRowsPerPage: number = 10;

const initialState: CasesTableState = {
  pagination: initialPagination,
  sorting: initialSorting,
  columnFilters: initialColumnFilters,
  globalFilter: initialGlobalFilter,
  columnVisibility: initialColumnVisibility,
  rowsPerPage: initialRowsPerPage,
};

// Create the store with persistence
export const useCasesTableStore = create<CasesTableState & CasesTableActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPagination: (pagination) => set({ pagination }),
      setSorting: (sorting) => set({ sorting }),
      setColumnFilters: (filters) => set({ columnFilters: filters }),
      setSpecificColumnFilter: (filterId, value) => {
        const currentFilters = get().columnFilters;
        set({ columnFilters: { ...currentFilters, [filterId]: value } });
      },
      removeSpecificColumnFilter: (filterId) => {
        // It's important to correctly type this if using exactOptionalPropertyTypes or similar strict flags
        const currentFilters = get().columnFilters;
        const { [filterId as keyof CaseServerFilters]: _, ...remainingFilters } = currentFilters;
        set({ columnFilters: remainingFilters as CaseServerFilters });
      },
      setGlobalFilter: (searchTerm) => {
        set({ globalFilter: searchTerm });
        // Also update the 'search' field within columnFilters for the hook
        const currentFilters = get().columnFilters;
        set({ columnFilters: { ...currentFilters, search: searchTerm } });
      },
      setColumnVisibility: (visibility) => set({ columnVisibility: visibility }),
      setRowsPerPage: (rows) => {
        set((state) => ({
          rowsPerPage: rows,
          pagination: { ...state.pagination, pageSize: rows, pageIndex: 0 }, // Reset to page 0 when page size changes
        }));
      },
      resetFilters: () => {
        set({
          columnFilters: initialColumnFilters,
          globalFilter: initialGlobalFilter,
          pagination: { ...get().pagination, pageIndex: 0 }, // Reset to first page
        });
      },
      resetTableState: () => {
        set({
          ...initialState,
          pagination: { pageIndex: 0, pageSize: initialRowsPerPage },
        });
      },
    }),
    {
      name: 'cases-table-storage',
      storage: createJSONStorage(() => localStorage),
      // Optionally, only persist parts of the store to avoid issues with non-serializable data
      // or to reduce storage size. For this store, all state seems serializable.
      // partialize: (state) => ({
      //   pagination: state.pagination,
      //   sorting: state.sorting,
      //   columnFilters: state.columnFilters,
      //   globalFilter: state.globalFilter,
      //   columnVisibility: state.columnVisibility,
      //   rowsPerPage: state.rowsPerPage
      // }),
    }
  )
);

// Selector to get all filters ready for the useGetCasesServerRendered hook
export const selectQueryFilters = (state: CasesTableState): CaseServerFilters => {
  // Combines specific column filters with the global search term
  // Ensure that if globalFilter is an empty string, it doesn't override a potential 'search' in columnFilters
  // or, more likely, that 'search' in columnFilters is primarily driven by globalFilter.
  const filters = { ...state.columnFilters };
  if (state.globalFilter) {
    filters.search = state.globalFilter;
  } else {
    // If globalFilter is empty, ensure 'search' is not present or is also empty in columnFilters
    // This depends on how you want to treat an empty globalFilter vs an existing columnFilters.search
    // For simplicity, if globalFilter is empty, we might want to remove 'search' from filters
    // or ensure it's also considered empty if that's the desired logic.
    // delete filters.search; // Or filters.search = undefined;
    // The current logic in setGlobalFilter already updates columnFilters.search, so this might be redundant
    // if globalFilter is the single source of truth for 'search'.
  }
  return filters;
};

export const selectQuerySort = (state: CasesTableState): CaseSort | undefined => {
  if (state.sorting.length > 0) {
    return {
      sortColumn: state.sorting[0].id,
      sortDirection: state.sorting[0].desc ? 'DESC' : 'ASC',
    };
  }
  return undefined;
};

export const selectPaginationState = (state: CasesTableState): PaginationState => {
  return state.pagination;
};
