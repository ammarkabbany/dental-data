import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/types";
import { formatCurrency, formatNumbers } from "@/lib/format-utils";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { PermissionCheckType } from "@/hooks/use-permissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CreditCard } from "lucide-react"; // Add this import
import { PaymentDialog } from "./payment-dialog";
import { Models } from "appwrite";

export const getColumns = (
  permissions: PermissionCheckType,
  prefs: Models.Preferences
): ColumnDef<Doctor>[] => [
  // {
  //   id: "select",
  //   size: 30,
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       // className="size-[18px] !p-0 !m-0 block transition-all duration-200 border-accent-foreground/25"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       // className="size-[18px] !p-0 !m-0 block transition-all duration-200 border-accent-foreground/25"
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "date",
  //   // sortable date
  //   header: ({ table }) => (
  //     <button
  //       className={`${table.getColumn("date")?.getIsSorted() && "text-blue-500"} flex items-center gap-1`}
  //       onClick={() => table.getColumn("date")?.toggleSorting()}
  //     >
  //       <span>Date</span>
  //       <ArrowUpDown className="size-4" />
  //     </button>
  //   ),
  //   sortingFn: "datetime", // Use built-in datetime sorting
  //   filterFn: (row, columnId, filterValue) => {
  //     if (filterValue === undefined) {
  //       return true; // No filtering if no filter value is set
  //     }
  //     const rowDate = new Date(row.getValue(columnId));
  //     const { from: startDate, to: endDate } = filterValue;

  //     if (!startDate || !endDate) {
  //       return true; // No filtering if date range is not set
  //     }

  //     return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
  //   },
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("date"));
  //     // <Calendar className="size-4" />
  //     return <div className="flex items-center gap-2">{date.toLocaleDateString("en-GB")}</div>;
  //   },
  //   size: 120,
  // },
  {
    accessorKey: "$id",
    header: "ID",
    cell: ({ row }) => {
      const id = Number(row.id) + 1;
      let idString = String(id);
      while (idString.length < 4) {
        idString = "0" + idString;
      }
      return <div className="capitalize">DR-{idString}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "doctor",
    header: "Doctor",
    // header: ({ table }) => {
    //   const currentValue = table.getColumn("doctor")?.getFilterValue() as string;
    //   return (
    //     <CustomComboBox
    //       label="doctor"
    //       variant={"outline"}
    //       initValue={currentValue}
    //       id="cases-table-doctors-c-combobox"
    //       action={(newValue) => {
    //         if (newValue === currentValue) {
    //           table.getColumn("doctor")?.setFilterValue(null);
    //           return;
    //         }
    //         table.getColumn("doctor")?.setFilterValue(newValue);
    //       }}
    //       values={useDoctorsStore.getState().doctors}
    //     />
    //   );
    // },
    accessorFn: (row) => {
      const doctor = row;
      const doctorName = doctor?.name || "Unknown";
      return doctorName.length > 25
        ? doctorName.substring(0, 25) + "..."
        : doctorName;
    },
    cell: ({ row }) => {
      const now = new Date();
      const createdAt = new Date(row.original.$createdAt);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const isRecent = createdAt >= fiveMinutesAgo;
      const doctor: string = row.getValue("doctor");
      return (
        <div className="capitalize flex items-center gap-2">
          {/* <DoctorIcon h={5} w={5} className="dark:fill-white dark:stroke-white" /> */}
          {doctor}
          {isRecent && (
            <Badge className="ml-1" variant="info">
              New
            </Badge>
          )}
        </div>
      );
    },
    size: 180,

    // filterFn: (row, _, filterValue) => {
    //   const {data: doctor, isLoading} = useGetDoctorById(row.original.doctorId)
    //   if (isLoading) return true;
    //   return filterValue
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    //     ? doctor?.name.toLowerCase().includes(filterValue.toLowerCase()) ? true : false
    //     : true;
    // }, // Apply the filter function here
  },
  {
    accessorKey: "totalCases",
    header: "Cases",
    cell: ({ row }) => {
      const cases = parseInt(row.getValue("totalCases"));

      // Format the amount as a dollar amount
      const formatted = formatNumbers(cases);

      return (
        <Badge variant={"default"} className="text-center">
          {formatted}
        </Badge>
      );
    },
    size: 50,
  },
  {
    accessorKey: "due",
    header: "Due",
    cell: ({ row }) => {
      const cases = parseInt(row.getValue("due"));

      // Format the amount as a dollar amount
      const formatted = formatCurrency(cases, prefs.currency, 0);

      return <div>{formatted}</div>;
    },
    size: 50,
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <TooltipProvider disableHoverableContent>
          <div className="flex items-center gap-2 justify-center">
            {permissions.checkPermission("financials", "has") && (
              <>
                <Tooltip delayDuration={100}>
                  <PaymentDialog doctor={row.original}>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        className="rounded-full"
                        variant={"secondary"}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  </PaymentDialog>
                  <TooltipContent side="top">Add Payment</TooltipContent>
                </Tooltip>
                {/* <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      className="rounded-full"
                      variant={"secondary"}
                    >
                      <EyeIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">View Doctor</TooltipContent>
                </Tooltip> */}
              </>
            )}
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  className="rounded-full"
                  variant={"secondary"}
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Edit Doctor</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
    size: 50,
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "invoiceStatus",
  //   id: "invoice",
  //   header: "Invoice",
  //   cell: ({ row }) => {
  //     const invoiceStatus: Case['invoiceStatus'] = row.getValue("invoice");
  //     const statusVariant = invoiceStatus === "UNPAID"? "destructive" : "success";
  //     return <Badge variant={statusVariant}>{invoiceStatus}</Badge>;
  //   },
  // },
];
