"use client";

import * as React from "react";
import {
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumns } from "./columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Case } from "@/types";
import { DataTablePagination } from "../data-table-pagination";
import CasesDataTableUtils from "./data-table-utils";
import { useGetCasesServerRendered } from "@/features/cases/hooks/use-get-cases-server-rendered";
import { useCasesTableStore, selectQueryFilters, selectQuerySort, selectPaginationState } from "@/store/cases-table-store";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Interface for DataTableProps - data prop is removed
interface DataTableProps {
  // data: Case[]; // Removed data prop
}

export function CasesDataTable({}: DataTableProps) { // Removed data prop from arguments
  // Zustand store integration
  const pagination = useCasesTableStore(selectPaginationState);
  const sorting = useCasesTableStore(state => state.sorting);
  const queryFilters = useCasesTableStore(selectQueryFilters);
  const querySort = useCasesTableStore(selectQuerySort);
  const globalFilter = useCasesTableStore(state => state.globalFilter); // For display or direct manipulation if any
  const columnVisibility = useCasesTableStore(state => state.columnVisibility);
  const rowSelection = useCasesTableStore(state => state.rowSelection); // Assuming rowSelection is added to store

  const setStorePagination = useCasesTableStore(state => state.setPagination);
  const setStoreSorting = useCasesTableStore(state => state.setSorting);
  const setStoreColumnVisibility = useCasesTableStore(state => state.setColumnVisibility);
  const setStoreRowSelection = useCasesTableStore(state => state.setRowSelection); // Assuming setRowSelection is added

  // Fetch data using the server-side hook
  const {
    data: casesData,
    isLoading,
    isError,
  } = useGetCasesServerRendered(
    pagination.pageIndex,
    pagination.pageSize,
    queryFilters,
    querySort
  );

  const tableData = React.useMemo(() => casesData?.documents || [], [casesData]);
  const pageCount = React.useMemo(() => {
    if (isLoading || !casesData?.total) return -1; // Keep previous page count during loading or if total is 0
    return Math.ceil(casesData.total / pagination.pageSize);
  }, [casesData?.total, pagination.pageSize, isLoading]);

  const columns = React.useMemo(() => getColumns(), []); // Memoize columns

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
      sorting,
      // columnFilters: undefined, // Not directly using TanStack's columnFilters state for API calls
      globalFilter, // Still can be used for local UI if needed, or tied to queryFilters.search
      columnVisibility,
      rowSelection,
    },
    onPaginationChange: setStorePagination,
    onSortingChange: setStoreSorting,
    onColumnVisibilityChange: setStoreColumnVisibility,
    onRowSelectionChange: setStoreRowSelection, // Use store action
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true, // All filtering is server-side
    autoResetPageIndex: false, // Important for server-side pagination
    // enableRowSelection: true, // Enable if row selection is used
  });

  const [lastRowSelected, setLastRowSelected] =
    React.useState<Row<Case> | null>(null);

  const handleRowSelection = (e: MouseEvent, row: Row<Case>) => {
    // This local shift-click logic might need adjustment if row selection is fully managed by Zustand
    // For now, assuming it enhances local interaction before potentially syncing to Zustand if needed globally
    const rows = table.getSortedRowModel().rows; // Or getCoreRowModel() if sorting is server-side only

    if (
      e.target instanceof HTMLElement &&
      e.target.closest('[role="menuitem"]') // Prevent selection when clicking dropdown menu items
    ) {
      return;
    }

    if (e.shiftKey && lastRowSelected) {
      e.preventDefault();
      const newSelection = { ...rowSelection };
      const startIndex = Math.min(lastRowSelected.index, row.index);
      const endIndex = Math.max(lastRowSelected.index, row.index);

      const isRangeSelected = rows
        .slice(startIndex, endIndex + 1)
        .every((r) => newSelection[r.id]);

      for (let i = startIndex; i <= endIndex; i++) {
        if (isRangeSelected) {
          delete newSelection[rows[i].id];
        } else {
          newSelection[rows[i].id] = true;
        }
      }
      setStoreRowSelection(newSelection);
    } else {
      const newSelection = { ...rowSelection };
      if (newSelection[row.id]) {
        delete newSelection[row.id];
      } else {
        newSelection[row.id] = true;
      }
      setStoreRowSelection(newSelection);
    }
    setLastRowSelected(row);
  };

  // Default column visibility (can be moved to Zustand initial state if preferred)
   React.useEffect(() => {
    setStoreColumnVisibility({
      note: false,
      invoiceStatus: false, // Assuming 'invoiceStatus' is the key for invoice status column
      $createdAt: false,
      // Ensure other columns you want visible by default are not here or set to true
    });
  }, [setStoreColumnVisibility]);


  return (
    <div className="w-full">
      <CasesDataTableUtils table={table} isLoading={isLoading} /> {/* Pass isLoading */}
      <div className="space-y-4">
        <ScrollArea 
          id="table-scroll-area" 
          className="h-[660px] overflow-auto" // Adjust height as needed
          type="hover"
        >
          <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
            <TableHeader className="sticky z-30 top-0 bg-accent !rounded-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="relative h-9 text-base select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <tbody aria-hidden="true" className="table-row h-1"></tbody>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((column) => (
                      <TableCell key={column.id || (typeof column.accessorKey === 'string' ? column.accessorKey : i)} style={{ width: `${(column as any).size}px` }}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-36 text-center text-lg text-destructive">
                    Error fetching data. Please try again.
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="[&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="whitespace-nowrap text-gray-600 dark:text-gray-300"
                        onMouseDown={(e) =>
                           // Allow selection only if not clicking on an action item within the cell
                           !(e.target instanceof HTMLElement && e.target.closest('[role="menuitem"], button, a')) &&
                           !cell.column.getIsLastColumn() && // Assuming last column is actions
                           handleRowSelection(e.nativeEvent, row)
                        }
                        key={cell.id}
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-36 text-center text-lg">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DataTablePagination table={table} isLoading={isLoading}/> {/* Pass isLoading */}
      </div>
    </div>
  );
}
