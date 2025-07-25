import { ColumnDef } from "@tanstack/react-table";
import { CaseInvoice } from "@/types";
import { useDoctorsStore } from "@/store/doctors-store";
import { formatCurrency, formatDates, shortenString } from "@/lib/format-utils";
import { Button } from "@/components/ui/button";
import { Models } from "appwrite";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const getColumns = (handleViewInvoice: (invoice: CaseInvoice) => void, prefs: Models.Preferences): ColumnDef<CaseInvoice>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      const shortName = shortenString(name, 25);
      return (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              {shortName}
            </TooltipTrigger>
            <TooltipContent side="top" className="mb-1 pointer-events-auto bg-background text-foreground border-border dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-700">
              {name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 200
  },
  {
    accessorKey: "doctor",
    accessorFn: (row) => {
      const id = row.doctorId;
      const doctor = useDoctorsStore.getState().getDoctorById(id);
      const doctorName = doctor?.name || "N/A"
      return doctorName;
    },
    cell: ({ row }) => {
      const doctor: string = row.getValue("doctor") || "";
      const doctorName = shortenString(doctor, 20);
      return (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              {doctor}
            </TooltipTrigger>
            <TooltipContent side="top" className="mb-1 pointer-events-auto bg-background text-foreground border-border dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-700">
              {doctorName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    header: "Doctor",
    size: 200
  },
  {
    accessorKey: "cases",
    header: "Cases",
    accessorFn: (row) => {
      const cases = row.cases;
      return cases.length || 0;
    }
  },
  {
    accessorKey: "finalAmount",
    header: "Final Total",
    accessorFn: (row) => {
      const amount = row.finalAmount;
      return formatCurrency(amount, prefs.currency);
    }
  },
  {
    accessorKey: "$createdAt",
    header: "Date Created",
    accessorFn: (row) => {
      const date = new Date(row.$createdAt);
      return formatDates(date)
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => handleViewInvoice(row.original)}
        >
          View
        </Button>
      );
    },
  },
];