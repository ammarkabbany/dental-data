import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type Table } from "@tanstack/react-table";
import { Doctor, Material, type Case } from "@/types";
// import { DatePicker } from "../date-picker";
import * as React from "react";
// import { CustomComboBox } from "../custom-combobox";
// import { CasesFiltersPopover } from "./cases-filter-popover";
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
import { useTeam } from "@/providers/team-provider";
import { useDoctorsStore } from "@/store/doctors-store";

export default function CasesDataTableUtils({
  table,
}: {
  table: Table<Case>;
}) {
  const [exportOptions, setExportOptions] = React.useState<{
    [key: string]: boolean;
  }>({
    showClient: true,
    showShade: true,
  });
  const {userRole} = useTeam();
  const {doctors} = useDoctorsStore();
  const currentDoctorFilterValue = table
    .getColumn("doctor")
    ?.getFilterValue() as string;
  const currentDateFilterValue = table
    .getColumn("date")
    ?.getFilterValue() as string;
  // fucks up the date sorting
  const selectedCases = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
    .sort((a, b) => a.date.localeCompare(b.date));

  const clearFilters = () => {
    table.resetColumnFilters();
  };

  const filtersCount = Object.values(table.getAllColumns()).filter((column) => column.getIsFiltered()).length;

  return (
    <>
      <PrintComponent
        selectedCases={selectedCases}
        options={exportOptions}
      />
      <div className="flex flex-wrap items-center gap-2 py-4">
        <div className="flex gap-2">
          <Button
            onClick={() => table.toggleAllRowsSelected()}
            variant="outline"
            className={`${table.getIsAllRowsSelected() && "bg-secondary"} transition`}
          >
            Select All
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 transition">
                Columns <Badge>{table.getVisibleFlatColumns().length-2}</Badge> <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
        </div>

        {/*  */}
        <CasesFiltersPopover indicator={filtersCount} clearFilters={clearFilters}>
          <div className="grid gap-2">
            <Label>Patient</Label>
            <Input
              type="search"
              variant="default"
              placeholder="Search"
              name="patient-search-input"
              value={
                (table.getColumn("patient")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("patient")?.setFilterValue(event.target.value)
              }
              className="flex-1"
            >
              <Input.Group>
                <Input.LeftIcon>
                  <Search className="text-muted-foreground" />
                </Input.LeftIcon>
              </Input.Group>
            </Input>
          </div>
          <div className="grid gap-2">
            <Label>Date</Label>
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
              className="flex-1"
            />
          </div>
          <div className="grid gap-2">
            <Label>Doctor</Label>
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
              className="flex-1"
              values={doctors}
            />
          </div>
        </CasesFiltersPopover>
        <div className="ml-auto flex flex-wrap gap-2">
          {usePermission(userRole).checkPermission('cases', 'delete') &&
            table.getSelectedRowModel().rows.length > 0 &&
            <DeleteCaseModal cases={selectedCases} component={<Button variant={"destructive"}>
              Delete Selected ({Math.min(table.getSelectedRowModel().rows.length, 100)})
            </Button>} />
          }

          {usePermission(userRole).checkPermission('export', 'has') &&
          <CasesExportDialog
            exportOptions={exportOptions}
            setExportOptions={setExportOptions}
          />}
        </div>
      </div>
    </>
  );
}
