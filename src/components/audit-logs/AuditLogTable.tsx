'use client';

import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { AuditLogEntry } from '@/types';
import { DataTablePagination } from '../data-table-pagination';
import { ColumnFiltersState, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { SearchInput } from '../search-input';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { getAuditLogsColumns } from './AuditLogColumns';
import { LogFilters, useGetLogs, usePrefetchLogs } from '@/features/logs/hooks/use-get-logs';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '../ui/skeleton';

export function AuditLogTable() {
  // State for pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  // State for sorting and filtering
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  
  // Convert column filters to the format expected by our hook
  const buildFilters = (): LogFilters => {
    const filters: LogFilters = {};
    
    // Add search filter
    if (debouncedSearchValue) {
      filters.search = debouncedSearchValue;
    }
    
    // Add column-specific filters
    columnFilters.forEach(filter => {
      if (filter.id === 'action' && typeof filter.value === 'string') {
        filters.action = filter.value;
      }
      if (filter.id === 'resource' && typeof filter.value === 'string') {
        filters.resource = filter.value;
      }
      if (filter.id === 'userId' && typeof filter.value === 'string') {
        filters.userId = filter.value;
      }
    });
    
    return filters;
  };
  
  const filters = buildFilters();
  
  // Fetch data using the hook
  const { 
    data, 
    isLoading, 
    isError 
  } = useGetLogs(pagination.pageIndex, pagination.pageSize, filters);
  
  const prefetchLogs = usePrefetchLogs();
  
  // Prefetch adjacent pages for smoother navigation
  useEffect(() => {
    // Prefetch next page if not on last page
    if (data && pagination.pageIndex < Math.ceil(data.total / pagination.pageSize) - 1) {
      prefetchLogs(pagination.pageIndex + 1, pagination.pageSize, filters);
    }
    
    // Prefetch previous page if not on first page
    if (pagination.pageIndex > 0) {
      prefetchLogs(pagination.pageIndex - 1, pagination.pageSize, filters);
    }
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  const columns = getAuditLogsColumns();
  
  const table = useReactTable({
    data: data?.documents || [],
    columns,
    pageCount: data ? Math.ceil(data.total / pagination.pageSize) : -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Enable manual pagination
    manualFiltering: true, // Enable manual filtering
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    autoResetPageIndex: false,
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-2 py-4">
        <SearchInput
          className=""
          placeholder="Search logs..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          onClear={() => setSearchValue('')}
        />
      </div>
      <div className="space-y-4">
        <ScrollArea
          id="table-scroll-area"
          className="h-[590px] overflow-auto"
          type="scroll"
        >
          <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
            <TableHeader className="sticky z-30 top-0 bg-accent !rounded-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <tbody aria-hidden="true" className="table-row h-1"></tbody>
            <TableBody className="">
              {isLoading ? (
                // Show skeleton loader while loading
                Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: columns.length }).map((_, j) => (
                      <TableCell key={`skeleton-cell-${i}-${j}`}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-36 text-center text-lg text-red-500"
                  >
                    Error loading logs. Please try again.
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
                        key={cell.id}
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-36 text-center text-lg"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <p className="text-sm text-muted-foreground text-center">
          Logs are retained for 7 days.
        </p>
        <DataTablePagination table={table} isLoading={isLoading} selectionEnabled={false} />
      </div>
    </div>
  );
}
