import { ColumnDef } from "@tanstack/react-table";
import { CaseInvoice } from "@/types";
import { useDoctorsStore } from "@/store/doctors-store";
import { formatCurrency, formatDates } from "@/lib/format-utils";
import { Button } from "@/components/ui/button";
import { Models } from "appwrite";

export const getColumns = (handleViewInvoice: (invoice: CaseInvoice) => void, prefs: Models.Preferences): ColumnDef<CaseInvoice>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return name.length > 25 ? name.substring(0, 25) + "..." : name;
    },
    size: 200
  },
  {
    accessorKey: "doctor",
    accessorFn: (row) => {
      const id = row.doctorId;
      const doctor = useDoctorsStore.getState().getDoctorById(id);
      const doctorName = doctor?.name || "N/A"
      return doctorName.length > 20 ? doctorName.substring(0, 20) + "..." : doctorName;
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
      return formatCurrency(amount, prefs.curreny);
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