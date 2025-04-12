"use client";

import * as React from "react";
import {
  type ColumnFiltersState,
  Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
// import { useCasesStore } from "@/store/Cases";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import CasesDataTableUtils from "@/components/dashboard/cases/data-table-utils";
import { Doctor } from "@/types";
import { DataTablePagination } from "../data-table-pagination";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { usePermission } from "@/hooks/use-permissions";

interface DataTableProps {
  data: Doctor[];
}

import { SearchInput } from "../search-input";
import useTeamStore from "@/store/team-store";

export function DoctorsDataTable({ data = [] }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const {userRole, currentAppwriteTeam: appwriteTeam} = useTeamStore();

  const permissions = usePermission(userRole);
  // Add these states

  const columns = getColumns(permissions, appwriteTeam?.prefs || {});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      due: permissions.canViewDue(),
      actions: permissions.checkPermission('doctors', 'update')
    });
  const [rowSelection, setRowSelection] = React.useState({});

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
      // columnOrder: [
      //   "select",
      //   "doctor",
      //   "date",
      //   "patient",
      //   "teethData",
      //   "material",
      //   "shade",
      //   "note",
      //   "invoice",
      //   "actions",
      // ],
    },
    autoResetPageIndex: false,
  });

  // const [lastRowSelected, setLastRowSelected] =
  //   React.useState<Row<Doctor> | null>(null);

  // const handleRowSelection = (e: MouseEvent, row: Row<Doctor>) => {
  //   const rows = table.getRowModel().rows;

  //   if (
  //     e.target instanceof HTMLElement &&
  //     e.target.closest('[role="menuitem"]')
  //   ) {
  //     return;
  //   }

  //   if (e.shiftKey && lastRowSelected) {
  //     e.preventDefault();

  //     const startIndex = Math.min(
  //       rows.findIndex((r) => r.id === lastRowSelected.id),
  //       rows.findIndex((r) => r.id === row.id)
  //     );
  //     const endIndex = Math.max(
  //       rows.findIndex((r) => r.id === lastRowSelected.id),
  //       rows.findIndex((r) => r.id === row.id)
  //     );

  //     const isRangeSelected = rows
  //       .slice(startIndex, endIndex)
  //       .every((r) => r.getIsSelected());

  //     rows.slice(startIndex, endIndex + 1).forEach((r) => {
  //       r.toggleSelected(!isRangeSelected);
  //     });
  //   } else {
  //     row.toggleSelected();
  //   }

  //   setLastRowSelected(row);
  // };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-2 py-4">
        <SearchInput
          className=""
          placeholder="Search doctors..."
          value={table.getState().globalFilter || ""}
          onChange={(event) => {table.setGlobalFilter(event.target.value)}}
          onClear={() => {table.setGlobalFilter(undefined)}}
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
        {/* <Separator /> */}
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(parseInt(value))}
            >
              <SelectTrigger className="h-[36px] space-x-1">
                <SelectValue>
                  {table.getState().pagination.pageSize}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((value, i) => (
                  <SelectItem key={i} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div> */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-2 py-4">
        <Input
          className=""
          placeholder="Search"
          variant={"filled"}
          value={table.getState().globalFilter || ""}
          onChange={(event) => {table.setGlobalFilter(event.target.value)}}
        >
          <Input.Group>
            <Input.LeftIcon>
              <Search className="text-muted-foreground" />
            </Input.LeftIcon>
          </Input.Group>
        </Input>
      </div>
      <div className="space-y-4">
        <ScrollArea 
          id="table-scroll-area"
          className="h-[460px] overflow-auto"
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
        {/* <Separator /> */}
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(parseInt(value))}
            >
              <SelectTrigger className="h-[36px] space-x-1">
                <SelectValue>
                  {table.getState().pagination.pageSize}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((value, i) => (
                  <SelectItem key={i} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div> */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
