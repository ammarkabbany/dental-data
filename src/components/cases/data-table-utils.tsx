import { Search, Columns } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type Table } from "@tanstack/react-table";
import { type Case } from "@/types";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { CasesFiltersPopover } from "./cases-filter-popover";
import { DatePicker } from "../date-picker";
import PrintComponent from "./PrintComponent";
import { CustomComboBox } from "../custom-combobox";
import { CasesExportDialog } from "./cases-export-dialog";
import { DeleteCaseModal } from "./delete-case-modal";
import { Badge } from "../ui/badge";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { useDoctorsStore } from "@/store/doctors-store";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FloatingDock } from "./floating-dock";
import { SearchInput } from "../search-input";

export default function CasesDataTableUtils({ table }: { table: Table<Case> }) {
  const [exportOptions, setExportOptions] = React.useState<{
    [key: string]: boolean;
  }>({
    showClient: true,
    showShade: true,
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  const totalFilteredRows = table.getFilteredRowModel().rows.length;

  const itemsSeenSoFar = Math.min(
    (pageIndex + 1) * pageSize,
    totalFilteredRows
  );

  const { userRole } = useTeamStore();
  const { doctors } = useDoctorsStore();

  const currentDoctorFilterValue = table
    .getColumn("doctor")
    ?.getFilterValue() as string;
  const currentDateFilterValue = table
    .getColumn("date")
    ?.getFilterValue() as string;

  const selectedCases = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
    .sort((a, b) => a.date.localeCompare(b.date))

  const filtersCount = Object.values(table.getAllColumns()).filter((column) =>
    column.getIsFiltered()
  ).length;

  const clearFilters = () => table.resetColumnFilters();
  const canExport = usePermission(userRole).checkPermission("export", "has");
  const canDelete = usePermission(userRole).checkPermission("cases", "delete");

  return (
    <>
      <FloatingDock
        selectedCases={selectedCases}
        onClearSelection={() => {
          table.resetRowSelection();
        }}
      />
      <PrintComponent selectedCases={selectedCases} options={exportOptions} />
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search patients..."
            value={
              (table.getColumn("patient")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("patient")?.setFilterValue(event.target.value)
            }
            onClear={() => table.getColumn("patient")?.setFilterValue("")}
            className="w-[300px]"
          />
          <Button
            onClick={() => table.toggleAllRowsSelected()}
            variant="outline"
            className={cn(
              "transition-all duration-200",
              table.getIsAllRowsSelected() &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Select All
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 transition-all duration-200"
              >
                <Columns className="h-4 w-4" />
                <span>Columns</span>
                <Badge
                  variant="default"
                  className="ml-1 text-secondary-foreground"
                >
                  {table.getVisibleFlatColumns().length - 2}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <CasesFiltersPopover
            indicator={filtersCount}
            clearFilters={clearFilters}
          >
            <div className="space-y-4">
              <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <DatePicker
                    date={currentDateFilterValue}
                    setDate={(newValue: any) => {
                      if (newValue === currentDateFilterValue) {
                        table.getColumn("date")?.setFilterValue(null);
                        return;
                      }
                      table.getColumn("date")?.setFilterValue(newValue);
                    }}
                    mode="range"
                    className="h-9"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Sort by</Label>
                  <Select
                    onValueChange={(value) => {
                      if (value === "date") {
                        table.getColumn("date")?.toggleSorting(true);
                      }
                      if (value === "$createdAt") {
                        table.getColumn("$createdAt")?.toggleSorting(true);
                      }
                    }}
                    defaultValue="date"
                    value={
                      table.getColumn("date")?.getIsSorted()
                        ? "date"
                        : table.getColumn("$createdAt")?.getIsSorted()
                          ? "$createdAt"
                          : "date"
                    }
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <Label className="p-2 text-sm font-medium">Sort by</Label>
                      <SelectItem value="date" className="mt-1">
                        Date
                      </SelectItem>
                      <SelectItem value="$createdAt">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Doctor</Label>
                <CustomComboBox
                  label="doctor"
                  value={currentDoctorFilterValue}
                  action={(newValue) => {
                    if (newValue === currentDoctorFilterValue) {
                      table.getColumn("doctor")?.setFilterValue(null);
                      return;
                    }
                    table.getColumn("doctor")?.setFilterValue(newValue);
                  }}
                  variant="secondary"
                  className="h-9"
                  values={doctors || []}
                />
              </div>
            </div>
          </CasesFiltersPopover>
          {/* <Button
            onClick={() => table.getColumn("$createdAt")?.toggleSorting()}
            variant="outline"
            className={cn(
              "transition-all duration-200",
              table.getIsAllRowsSelected() &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <SortAsc />
            Show New
          </Button> */}
        </div>

        {canDelete && selectedCases.length > 0 && (
          <DeleteCaseModal
            cases={selectedCases.splice(0, 100)}
            onDelete={() => {
              table.resetRowSelection();
            }}
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          {canExport && (
            <CasesExportDialog
              exportOptions={exportOptions}
              setExportOptions={setExportOptions}
            />
          )}
        </div>
        <p className="ml-auto text-muted-foreground">
          Showing {itemsSeenSoFar} of {table.getRowCount()} cases
        </p>
      </div>
    </>
  );
}
