import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  type ColumnFiltersState,
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Case, CaseInvoice } from "@/types";
import { getColumns } from "./columns";
import { DataTablePagination } from "../data-table-pagination";
import { SearchInput } from "../search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useModalStore } from "@/store/modal-store";
import { CasesExportDialog } from "../cases/cases-export-dialog";
import PrintComponent from "../cases/PrintComponent";
import { useCaseInvoices } from "@/features/case-invoices/hooks/use-case-invoices";
import useTeamStore from "@/store/team-store";

export function CaseInvoicesDataTable() {
  const { openModal } = useModalStore();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [searchValue, setSearchValue] = React.useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [exportOptions, setExportOptions] = React.useState<{
    [key: string]: any;
  }>({
    showClient: true,
    showShade: true,
    deductAmount: 0,
  });
  const [selectedCases, setSelectedCases] = React.useState<Case[]>([]);

  const { currentAppwriteTeam: appwriteTeam } = useTeamStore();

  const handleViewInvoice = (invoice: CaseInvoice) => {
    setExportOptions({
      ...exportOptions,
      deductAmount: invoice.deducted,
    });
    setSelectedCases(invoice.cases);
    openModal("cases-export");
  };

  const { data: caseInvoices, isLoading } = useCaseInvoices(
    pagination.pageIndex,
    pagination.pageSize
  );

  const columns = getColumns(handleViewInvoice, appwriteTeam?.prefs || {});

  const table = useReactTable({
    data: caseInvoices?.documents || [],
    columns,
    pageCount: caseInvoices
      ? Math.ceil(caseInvoices.total / pagination.pageSize)
      : -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    autoResetPageIndex: false,
  });

  return (
    <>
      <CasesExportDialog
        exportOptions={exportOptions}
        setExportOptions={setExportOptions}
      />
      <PrintComponent selectedCases={selectedCases} options={exportOptions} />
      <div className="w-full">
        {/* <div className="flex items-center justify-between space-x-2 py-4">
          <SearchInput
            className=""
            placeholder="Search case invoices..."
            type="text"
            value={(table.getColumn("name")?.getFilterValue() as string) || ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
          />
        </div> */}
        <div className="space-y-4">
          <ScrollArea
            id="table-scroll-area"
            className="max-h-[590px] overflow-auto"
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
                          className="relative h-9 text-base select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
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
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {table
                        .getVisibleFlatColumns()
                        .map((column, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
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
          <DataTablePagination
            table={table}
            isLoading={isLoading}
            selectionEnabled={false}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>
    </>
  );
}
