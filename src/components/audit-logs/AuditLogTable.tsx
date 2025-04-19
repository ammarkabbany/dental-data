// components/audit-log/AuditLogTable.tsx

'use client';

import { useState } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { AuditLogEntry } from '@/types';
import { DataTablePagination } from '../data-table-pagination';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { SearchInput } from '../search-input';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { getAuditLogsColumns } from './AuditLogColumns';

export function AuditLogTable({ data = [] }: { data?: AuditLogEntry[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );

  const columns = getAuditLogsColumns();
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    autoResetPageIndex: false,
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-2 py-4">
        <SearchInput
          className=""
          placeholder="Search logs..."
          value={table.getState().globalFilter || ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
          }}
        />
      </div>
      <div className="space-y-4">
        <ScrollArea
          id="table-scroll-area"
          className="h-[590px] overflow-auto"
          type="scroll"
        >
          <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
            <TableHeader className="sticky top-0 bg-accent !rounded-full">
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
              {table.getRowModel().rows?.length ? (
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
                    colSpan={table.getVisibleFlatColumns().length}
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
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
