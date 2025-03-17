import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, BookUser, Calendar, MoreHorizontal, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Case, Tooth, ToothCollection } from "@/types";
import { DoctorIcon } from "../icons/doctor";
import { CubeIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EditCaseModal } from "./edit-case-modal";
import { useModalStore } from "@/store/modal-store";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";

export const getColumns = (): ColumnDef<Case>[] => [
  {
    id: "select",
    size: 40, // Reduce the width to 40px
    minSize: 40, // Prevent it from expanding
    maxSize: 40, // Ensure it doesn't grow beyond this
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="size-[18px] !p-0 !m-0 block transition-all duration-200"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="size-[18px] !p-0 !m-0 block transition-all duration-200"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    // sortable date
    header: ({ table }) => (
      <button
        className={`${table.getColumn("date")?.getIsSorted() && "text-blue-500"} flex items-center gap-1`}
        onClick={() => table.getColumn("date")?.toggleSorting()}
      >
        <span>Date</span>
        <ArrowUpDown className="size-4" />
      </button>
    ),
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
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));

      return <div className="flex items-center gap-2"><Calendar className="size-4" /> {date.toLocaleDateString("en-GB")}</div>;
    },
  },
  {
    accessorKey: "doctor",
    header: "Client",
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
      const doctor = useDoctorsStore.getState().getDoctorById(row.doctorId);
      const doctorName = doctor?.name || "Unknown"
      return doctorName.length > 20 ? doctorName.substring(0, 20) + "..." : doctorName;
    },
    cell: ({ row }) => {
      const now = new Date();
      const createdAt = new Date(row.original.$createdAt);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const isRecent = createdAt >= fiveMinutesAgo;
      const doctor: string = row.getValue('doctor')
      return <div className="capitalize flex items-center gap-2">
        <DoctorIcon h={5} w={5} className="dark:fill-white dark:stroke-white" />
        {doctor}
        {isRecent && <Badge className="ml-1" variant="info">New</Badge>}
      </div>;
    },
    
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
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const patient: string = row.getValue("patient") || "";
      const patientName = patient.length > 20 ? patient.substring(0, 20) + "..." : patient
      return <div className="capitalize flex items-center gap-2"><BookUser className="size-4.5" />{patientName}</div>;
    },
  },
  {
    accessorKey: "teethData",
    header: () => {
      return <p className="ml-[65px] capitalize text-sm">Data</p>;
    },
    cell: ({ row }) => {
      const caseData: ToothCollection = JSON.parse(row.getValue("teethData")) || undefined;
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
  },
  {
    accessorKey: "material",
    accessorFn: (row) => {
      const material = useMaterialsStore.getState().getMaterialById(row.materialId);
      const materialName = material?.name || "Unknown"
      return materialName.length > 20 ? materialName.substring(0, 20) + "..." : materialName;
    },
    header: "Material",
    cell: ({ row }) => {
      const material: string = row.getValue('material');
      return <div className="capitalize flex items-center gap-2"><CubeIcon className="size-4" />{material}</div>;
    },
  },
  {
    accessorKey: "shade",
    header: "Shade",
    cell: ({ row }) => <div className="flex items-center gap-2"><Palette className="size-4" /><Badge variant={"secondary"}>{row.getValue("shade")}</Badge></div>,
  },
  // {
  //   accessorKey: "due",
  //   header: "Due",
  //   cell: ({ row }) => {
  //     const due = parseInt(row.getValue("due"));

  //     // Format the amount as a dollar amount
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "EGP",
  //     }).format(due);

  //     return <div>{formatted}</div>;
  //   },
  // },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (
      <div>{row.getValue("note") ? row.getValue("note") : "N/A"}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-start">Actions</div>,
    cell: ({ row }) => {
      const _case: Case = row.original;
      return(
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 border-none ring-0">
              <MoreHorizontal className="inline-block text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>
              {/* <Link href={`/dashboard/cases/edit/${row.original.$id}`}> */}
              {/* <Button variant={"ghost"} className="w-full justify-start">Edit</Button> */}
              <DropdownMenuItem asChild>
                <EditCaseModal selectedCase={_case} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
    },
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
