import { useCasesTableStore, selectQueryFilters, selectQuerySort, selectPaginationState } from './cases-table-store';
import { act } from '@testing-library/react'; // For Zustand, often need `act` for updates

// Mock localStorage for persistence testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCasesTableStore', () => {
  beforeEach(() => {
    // Reset store and localStorage before each test
    act(() => {
      useCasesTableStore.getState().resetTableState(); // Reset to initial state
    });
    localStorageMock.clear();
    // Initialize localStorage with the store's initial state to simulate persistence
    // This step is important if your store initializes from localStorage immediately
    localStorageMock.setItem('cases-table-storage', JSON.stringify({
      state: useCasesTableStore.getState(),
      version: 0 // Default version for zustand persist middleware
    }));
  });

  it('should have correct initial state', () => {
    const { pagination, sorting, columnFilters, globalFilter, columnVisibility, rowsPerPage } = useCasesTableStore.getState();
    expect(pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(sorting).toEqual([]);
    expect(columnFilters).toEqual({});
    expect(globalFilter).toBe("");
    expect(columnVisibility).toEqual({});
    expect(rowsPerPage).toBe(10);
  });

  it('should update pagination', () => {
    const newPagination = { pageIndex: 1, pageSize: 20 };
    act(() => {
      useCasesTableStore.getState().setPagination(newPagination);
    });
    expect(useCasesTableStore.getState().pagination).toEqual(newPagination);
  });

  it('should update sorting', () => {
    const newSorting = [{ id: 'patient', desc: true }];
    act(() => {
      useCasesTableStore.getState().setSorting(newSorting);
    });
    expect(useCasesTableStore.getState().sorting).toEqual(newSorting);
  });

  it('should set specific column filter and update search in columnFilters via globalFilter', () => {
     act(() => {
       useCasesTableStore.getState().setSpecificColumnFilter('doctorId', 'doc123');
       useCasesTableStore.getState().setGlobalFilter('testSearch');
     });
     const state = useCasesTableStore.getState();
     expect(state.columnFilters.doctorId).toBe('doc123');
     expect(state.globalFilter).toBe('testSearch');
     expect(state.columnFilters.search).toBe('testSearch'); // Check if global also updates search in columnFilters
   });

   it('should remove a specific column filter', () => {
     act(() => {
       useCasesTableStore.getState().setSpecificColumnFilter('doctorId', 'doc123');
       useCasesTableStore.getState().removeSpecificColumnFilter('doctorId');
     });
     expect(useCasesTableStore.getState().columnFilters.doctorId).toBeUndefined();
   });

  it('should reset filters', () => {
     act(() => {
       useCasesTableStore.getState().setSpecificColumnFilter('doctorId', 'doc123');
       useCasesTableStore.getState().setGlobalFilter('test');
       // Also set pagination to something other than initial to test reset
       useCasesTableStore.getState().setPagination({ pageIndex: 2, pageSize: 10 });
       useCasesTableStore.getState().resetFilters();
     });
     const { columnFilters, globalFilter, pagination } = useCasesTableStore.getState();
     expect(columnFilters).toEqual({}); // Specific filters reset
     expect(globalFilter).toBe("");    // Global filter reset
     expect(pagination.pageIndex).toBe(0); // Check if pagination resets to first page
     expect(pagination.pageSize).toBe(10); // Page size should remain
  });

  it('should reset table state', () => {
     act(() => {
         useCasesTableStore.getState().setPagination({ pageIndex: 5, pageSize: 50});
         useCasesTableStore.getState().setGlobalFilter('some filter');
         useCasesTableStore.getState().setSorting([{ id: 'patient', desc: true }]);
         useCasesTableStore.getState().setColumnVisibility({ patient: false });
         useCasesTableStore.getState().resetTableState();
     });
     const finalState = useCasesTableStore.getState();
     expect(finalState.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
     expect(finalState.globalFilter).toBe("");
     expect(finalState.sorting).toEqual([]);
     expect(finalState.columnVisibility).toEqual({});
     expect(finalState.rowsPerPage).toBe(10);
     expect(finalState.columnFilters).toEqual({});
  });

  // Test selectors
  it('selectQueryFilters should format filters correctly', () => {
    act(() => {
      useCasesTableStore.getState().setSpecificColumnFilter('patient', 'John');
      useCasesTableStore.getState().setGlobalFilter('Doe'); // This also sets columnFilters.search
    });
    const filters = selectQueryFilters(useCasesTableStore.getState());
    // globalFilter sets columnFilters.search, so it should be included
    expect(filters).toEqual(expect.objectContaining({ patient: 'John', search: 'Doe' }));
  });

  it('selectQueryFilters should prioritize globalFilter for search if both globalFilter and columnFilters.search exist', () => {
    act(() => {
      // Simulate a scenario where columnFilters.search might have an old value
      useCasesTableStore.getState().setColumnFilters({ search: 'OldSearchValue', patient: 'Jane' });
      useCasesTableStore.getState().setGlobalFilter('NewSearchValue'); // This will override columnFilters.search
    });
    const filters = selectQueryFilters(useCasesTableStore.getState());
    expect(filters.search).toBe('NewSearchValue');
    expect(filters.patient).toBe('Jane');
  });

  it('selectQuerySort should format sorting correctly', () => {
     act(() => {
         useCasesTableStore.getState().setSorting([{id: 'date', desc: true}]);
     });
     const sort = selectQuerySort(useCasesTableStore.getState());
     expect(sort).toEqual({ sortColumn: 'date', sortDirection: 'DESC'});

     act(() => {
         useCasesTableStore.getState().setSorting([{id: 'patient', desc: false}]);
     });
     const ascSort = selectQuerySort(useCasesTableStore.getState());
     expect(ascSort).toEqual({ sortColumn: 'patient', sortDirection: 'ASC'});

     act(() => {
         useCasesTableStore.getState().setSorting([]);
     });
     const noSort = selectQuerySort(useCasesTableStore.getState());
     expect(noSort).toBeUndefined();
  });

  it('selectPaginationState should return pagination', () => {
    const pagination = { pageIndex: 3, pageSize: 15 };
    act(() => {
      useCasesTableStore.getState().setPagination(pagination);
    });
    const selectedPagination = selectPaginationState(useCasesTableStore.getState());
    expect(selectedPagination).toEqual(pagination);
  });

  // Test persistence (basic check)
  it('should persist state to localStorage', () => {
     act(() => {
       useCasesTableStore.getState().setGlobalFilter('persistedSearch');
     });
     const persistedData = JSON.parse(localStorageMock.getItem('cases-table-storage') || '{}');
     // Check a specific part of the state that was changed
     expect(persistedData.state.globalFilter).toBe('persistedSearch');
     // Also check that pagination (part of initial state) is there
     expect(persistedData.state.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
  });
});
