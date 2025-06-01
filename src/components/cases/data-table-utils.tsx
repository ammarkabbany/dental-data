import { Columns } from "lucide-react"; // Removed Search import as SearchInput is used
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
// import { Input } from "../ui/input"; // Not directly used, SearchInput handles it
import { CasesFiltersPopover } from "./cases-filter-popover";
import { DatePicker, type DateRange } from "../date-picker"; // Ensure DateRange is exported or defined
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
import { useCasesTableStore, selectQueryFilters } from '@/store/cases-table-store';

interface CasesDataTableUtilsProps {
  table: Table<Case>;
  isLoading?: boolean; // Added isLoading prop
}

export default function CasesDataTableUtils({ table, isLoading }: CasesDataTableUtilsProps) {
  const [exportOptions, setExportOptions] = React.useState<{
    [key: string]: boolean;
  }>({
    showClient: true,
    showShade: true,
  });

  // Zustand store integration
  const storeGlobalFilter = useCasesTableStore(state => state.globalFilter);
  const setStoreGlobalFilter = useCasesTableStore(state => state.setGlobalFilter);

  const storeColumnVisibility = useCasesTableStore(state => state.columnVisibility);
  // setStoreColumnVisibility is called via table.getColumn(id).toggleVisibility() which triggers onColumnVisibilityChange in data-table.tsx

  const storeColumnFilters = useCasesTableStore(selectQueryFilters);
  const setStoreSpecificColumnFilter = useCasesTableStore(state => state.setSpecificColumnFilter);
  const removeStoreSpecificColumnFilter = useCasesTableStore(state => state.removeSpecificColumnFilter);

  const storeSorting = useCasesTableStore(state => state.sorting);
  const setStoreSorting = useCasesTableStore(state => state.setSorting);

  const resetStoreFilters = useCasesTableStore(state => state.resetFilters);


  const { pageIndex, pageSize } = table.getState().pagination;
  // totalFilteredRows is not available with manualFiltering, use total from server
  const totalRows = useCasesTableStore(state => state.pagination.totalRows); // Assuming totalRows is added to store if needed here
                                                                            // Or, better, get it from casesData.total in parent component if needed for display

  const itemsSeenSoFar = Math.min(
    (pageIndex + 1) * pageSize,
    totalRows || 0 // Use totalRows from store or server if available
  );

  const { userRole } = useTeamStore();
  const { doctors } = useDoctorsStore();

  const selectedCases = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date object
    .slice(0, 100);

  const activeFilterCount = Object.entries(storeColumnFilters).filter(
    ([key, value]) => value !== undefined && value !== '' && !(key === 'search' && !value)
  ).length;

  const canExport = usePermission(userRole).checkPermission("export", "has");
  const canDelete = usePermission(userRole).checkPermission("cases", "delete");

  return (
    <>
      <FloatingDock
        selectedCases={selectedCases}
        onClearSelection={() => {
          table.resetRowSelection(true); // Pass true to reset dependent states like lastRowSelected
        }}
      />
      <PrintComponent selectedCases={selectedCases} options={exportOptions} />
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search patients..."
            value={storeGlobalFilter}
            onChange={(event) => setStoreGlobalFilter(event.target.value)}
            onClear={() => setStoreGlobalFilter("")}
            className="w-[300px]"
            disabled={isLoading}
          />
          <Button
            onClick={() => table.toggleAllRowsSelected()}
            variant="outline"
            disabled={isLoading}
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
                disabled={isLoading}
              >
                <Columns className="h-4 w-4" />
                <span>Columns</span>
                <Badge
                  variant="default"
                  className="ml-1 text-secondary-foreground"
                >
                  {table.getVisibleFlatColumns().filter(c => c.getCanHide()).length}
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
                    onCheckedChange={(value) => // This correctly calls onColumnVisibilityChange in data-table.tsx
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <CasesFiltersPopover
            indicator={activeFilterCount}
            clearFilters={resetStoreFilters}
            disabled={isLoading}
          >
            <div className="space-y-4">
              <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <DatePicker
                    date={{ from: storeColumnFilters.dateFrom ? new Date(storeColumnFilters.dateFrom) : undefined, to: storeColumnFilters.dateTo ? new Date(storeColumnFilters.dateTo) : undefined }}
                    setDate={(newValue: DateRange | undefined) => {
                      if (newValue?.from) setStoreSpecificColumnFilter('dateFrom', newValue.from.toISOString().split('T')[0]);
                      else removeStoreSpecificColumnFilter('dateFrom');
                      if (newValue?.to) setStoreSpecificColumnFilter('dateTo', newValue.to.toISOString().split('T')[0]);
                      else removeStoreSpecificColumnFilter('dateTo');
                    }}
                    mode="range"
                    className="h-9"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Sort by</Label>
                  <Select
                    onValueChange={(value) => {
                      const isDesc = storeSorting[0]?.id === value ? !storeSorting[0]?.desc : false;
                      if (value === "clear") {
                         setStoreSorting([]); // Clear sorting
                      } else {
                         setStoreSorting([{ id: value, desc: isDesc }]);
                      }
                    }}
                    value={storeSorting[0]?.id || "date"} // Default to 'date' or the current sort column
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <Label className="p-2 text-sm font-medium">Sort by</Label>
                      <SelectItem value="date" className="mt-1">Date</SelectItem>
                      <SelectItem value="$createdAt">Created Date</SelectItem>
                      <SelectItem value="patient">Patient Name</SelectItem>
                      <SelectItem value="due">Amount Due</SelectItem>
                       <SelectItem value="clear" className="text-destructive">Clear Sort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Doctor</Label>
                <CustomComboBox
                  label="doctor"
                  // value={storeColumnFilters.doctorId || ""} // Ensure CustomComboBox handles empty string or null correctly
                  value={doctors?.find(doc => doc.$id === storeColumnFilters.doctorId)?.name || ""}
                  action={(newValue) => { // newValue here is expected to be the doctor's name from ComboBox
                    const selectedDoctor = doctors?.find(doc => doc.name === newValue);
                    if (selectedDoctor) {
                       if (storeColumnFilters.doctorId === selectedDoctor.$id) {
                        removeStoreSpecificColumnFilter('doctorId');
                      } else {
                        setStoreSpecificColumnFilter('doctorId', selectedDoctor.$id);
                      }
                    } else if (!newValue) { // Handle clear selection if ComboBox passes empty/null
                        removeStoreSpecificColumnFilter('doctorId');
                    }
                  }}
                  variant="secondary"
                  className="h-9"
                  values={doctors?.map(doc => ({ name: doc.name, $id: doc.$id })) || []} // Pass items with id and name
                  // previewValue={doctors?.find(doc => doc.$id === storeColumnFilters.doctorId)?.name || "Select Doctor"}
                />
              </div>
               {/* TODO: Add Material Filter similar to Doctor */}
            </div>
          </CasesFiltersPopover>
        </div>

        {canDelete && selectedCases.length > 0 && (
          <DeleteCaseModal
            cases={selectedCases}
            onDelete={() => {
              table.resetRowSelection(true);
            }}
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          {canExport && (
            <CasesExportDialog
              exportOptions={exportOptions}
              setExportOptions={setExportOptions}
              disabled={isLoading}
            />
          )}
        </div>
        {!isLoading && (
          <p className="ml-auto text-muted-foreground">
            Showing {itemsSeenSoFar} of {totalRows || table.getRowCount()} cases
          </p>
        )}
      </div>
    </>
  );
}
