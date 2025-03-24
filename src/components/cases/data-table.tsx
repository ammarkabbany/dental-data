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
import { Case } from "@/types";
import { DataTablePagination } from "../data-table-pagination";
import CasesDataTableUtils from "./data-table-utils";

interface DataTableProps {
  data: Case[];
}

export function CasesDataTable({ data = [] }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      note: false,
      invoice: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  // const {data: doctors} = useGetDoctors();
  // const {data: materials} = useGetMaterials();

  // const getMaterialById = (id: string) => {
  //   return materials?.find((material) => material.$id === id);
  // };
  // const getDoctorById = (id: string) => {
  //   return doctors?.find((doctor) => doctor.$id === id);
  // };

  const columns = getColumns();

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
        pageSize: 20,
      },
      columnOrder: [
        "select",
        "doctor",
        "date",
        "patient",
        "teethData",
        "material",
        "shade",
        "note",
        "invoice",
        "actions",
      ],
    },
    autoResetPageIndex: false,
  });

  const [lastRowSelected, setLastRowSelected] =
    React.useState<Row<Case> | null>(null);

  const handleRowSelection = (e: MouseEvent, row: Row<Case>) => {
    const rows = table.getRowModel().rows;

    if (
      e.target instanceof HTMLElement &&
      e.target.closest('[role="menuitem"]')
    ) {
      return;
    }

    if (e.shiftKey && lastRowSelected) {
      e.preventDefault();

      const startIndex = Math.min(
        rows.findIndex((r) => r.id === lastRowSelected.id),
        rows.findIndex((r) => r.id === row.id)
      );
      const endIndex = Math.max(
        rows.findIndex((r) => r.id === lastRowSelected.id),
        rows.findIndex((r) => r.id === row.id)
      );

      const isRangeSelected = rows
        .slice(startIndex, endIndex)
        .every((r) => r.getIsSelected());

      rows.slice(startIndex, endIndex + 1).forEach((r) => {
        r.toggleSelected(!isRangeSelected);
      });
    } else {
      row.toggleSelected();
    }

    setLastRowSelected(row);
  };

  return (
    <div className="w-full">
      <CasesDataTableUtils table={table} />
      <div className="space-y-4">
        <ScrollArea 
          id="table-scroll-area" 
          className="h-[660px] overflow-auto"
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
                        onMouseDown={(e) =>
                          !cell.column.getIsLastColumn() &&
                          handleRowSelection(e.nativeEvent, row)
                        }
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
