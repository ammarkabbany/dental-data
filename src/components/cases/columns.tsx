import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Calendar, User2, Palette, FileText, EditIcon } from "lucide-react"; // Added EditIcon
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Case, Tooth, ToothCollection } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
// Removed EditCaseModal import
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CubeIcon } from "@radix-ui/react-icons";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import { HugeiconsIcon } from "@hugeicons/react";
import { DentalToothIcon, Doctor02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation"; // Added useRouter

export const getColumns = (): ColumnDef<Case>[] => [
  {
    id: "select",
    size: 30,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="size-4 hover:bg-secondary/20"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] size-4 hover:bg-secondary/20"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    sortingFn: "datetime", // Use built-in datetime sorting
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === undefined) {
        return true; // No filtering if no filter value is set
      }
      const rowDate = new Date(row.getValue(columnId));
      const { from: startDate, to: endDate } = filterValue;

      if (!startDate || !endDate) {
        return true; // No filtering if date range is not set
      }

      return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "-ml-3 h-8 data-[state=open]:bg-accent text-base",
          column.getIsSorted() && "text-primary hover:text-primary/75"
        )}
        onClick={() => column.toggleSorting()}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="flex items-center">
          <span className="text-muted-foreground">
            {date.toLocaleDateString("en-GB")}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "doctor",
    accessorFn: (row) => {
      const id = row.doctorId;
      const doctor = useDoctorsStore.getState().getDoctorById(id);
      const doctorName = doctor?.name || "Unknown"
      return doctorName.length > 20 ? doctorName.substring(0, 20) + "..." : doctorName;
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "-ml-3 h-8 data-[state=open]:bg-accent text-base",
          column.getIsSorted() && "text-primary hover:text-primary/75"
        )}
        onClick={() => column.toggleSorting()}
      >
        Doctor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const now = new Date();
      const createdAt = new Date(row.original.$createdAt);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const isRecent = createdAt >= fiveMinutesAgo;
      const doctor: string = row.getValue('doctor')
      
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{doctor}</span>
          {isRecent && (
            <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
              New
            </Badge>
          )}
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: "$createdAt",
    size: 0,
    enableHiding: false,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      // <BookUser className="size-4.5" />
      const patient: string = row.getValue("patient") || "";
      const patientName = patient.length > 20 ? patient.substring(0, 20) + "..." : patient
      return <div className="capitalize flex items-center gap-2">{patientName}</div>;
    },
    size: 200,
  },
  {
    accessorKey: "data",
    header: () => {
      return <div className="ml-[60px] inline-flex items-center gap-2">
        Data
      </div>
    },
    cell: ({ row }) => {
      const caseData: ToothCollection = JSON.parse(row.getValue("data")) || undefined;
      const loadTeethData = (array: Tooth[] | undefined) => {
        if (!array) return [];
        if (array.length === 0) return [];
        const teethData = array.map((tooth) => {
          const th = tooth.label;
          if (th < 20) return th - 10;
          if (th < 30 && th > 20) return th - 20;
          if (th < 40 && th > 30) return th - 30;
          if (th < 50 && th > 40) return th - 40;
        });
        return teethData.sort((a, b) => {
          if (a === undefined || b === undefined) {
            return 0; // Handle undefined values by treating them as equal, or use custom logic
          }
          return a - b; // Normal sorting for defined values
        });
      };
      const lowerLeft = loadTeethData(caseData.lower?.left).reverse();
      const lowerRight = loadTeethData(caseData.lower?.right);
      const upperRight = loadTeethData(caseData.upper?.right);
      const upperLeft = loadTeethData(caseData.upper?.left).reverse();
      return (
        <div className="space-y-1 capitalize tracking-widest">
          {/* Spread Upper and seperate them */}
          <div className="flex h-5 sm:h-3 items-center space-x-2">
            <div className="w-20 text-end">{...upperLeft}</div>
            <Separator className="bg-muted-foreground" orientation="vertical" />
            <div className="w-20 text-start">{...upperRight}</div>
          </div>
          <div className="flex h-5 sm:h-3 items-center space-x-2">
            <div className="w-20 text-end">{...lowerLeft}</div>
            <Separator className="bg-muted-foreground" orientation="vertical" />
            <div className="w-20 text-start">{...lowerRight}</div>
          </div>
        </div>
      );
    },
    size: 200,
  },

  {
    accessorKey: "material",
    accessorFn: (row) => {
      const id = row.materialId;
      const material = useMaterialsStore.getState().getMaterialById(id);
      const materialName = material?.name || "Unknown"
      return materialName.length > 20 ? materialName.substring(0, 20) + "..." : materialName;
    },
    header: () => (
      <div className="flex items-center gap-2">
        <span>Material</span>
      </div>
    ),
    cell: ({ row }) => {
      const material: string = row.getValue('material');
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{material}</span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "shade",
    header: () => (
      <div className="flex items-center gap-2">
        <span>Shade</span>
      </div>
    ),
    cell: ({ row }) => (
      <Badge 
        variant="secondary" 
        className="bg-secondary/10 hover:bg-secondary/20"
      >
        {row.getValue("shade")}
      </Badge>
    ),
    size: 90,
  },
  {
    accessorKey: "note",
    header: () => (
      <div className="flex items-center gap-2">
        <span>Note</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("note") || "N/A"}
      </span>
    ),
    size: 150
  },
  {
    accessorKey: "actions",
    header: () => <span className="text-start">Actions</span>,
    cell: ({ row }) => {
      const _case: Case = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter(); // Added router instance
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-secondary/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => router.push(`/dashboard/cases/${_case.$id}/edit`)}
              className="cursor-pointer"
            >
              <EditIcon size={16} className="mr-2 opacity-60" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            {/* Add other actions like Delete, View Details etc. here if needed, following the pattern */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 70,
    enableSorting: false,
    enableHiding: false,
  },
];