import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Case, Tooth, ToothCollection } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

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
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        // className="size-[18px] !p-0 !m-0 block transition-all duration-200 border-accent-foreground/25"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        // className="size-[18px] !p-0 !m-0 block transition-all duration-200 border-accent-foreground/25"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    accessorFn: (row) => {
      const user = row.user;
      const userName = user?.name || "N/A";
      return userName.length > 20
       ? userName.substring(0, 20) + "..."
        : userName;
    },
    header: "User",
    cell: ({ row }) => {
      const userName = row.getValue("user") as string;
      const userAvatar = row.original.user?.avatar;
      return (
        <div className="flex items-center gap-x-2">
          <UserAvatar image={userAvatar || "?"} name={userName || ""} />
          <div className="capitalize">{userName}</div>
        </div>
      );
    },
    size: 200,
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
      // <Calendar className="size-4" />
      return (
        <div className="flex items-center gap-2">
          {date.toLocaleDateString("en-GB")}
        </div>
      );
    },
    size: 120,
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
      const doctor = row.doctor;
      const doctorName = doctor?.name || "Unknown";
      return doctorName.length > 20
        ? doctorName.substring(0, 20) + "..."
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
    filterFn: (row, _, filterValue) => {
      const doctor: string = row.getValue("doctor");
      return filterValue
        ? doctor.toLowerCase() === filterValue.toLowerCase()
        : true;
    }, // Apply the filter function here
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      // <BookUser className="size-4.5" />
      const patient: string = row.getValue("patient") || "";
      const patientName =
        patient.length > 20 ? patient.substring(0, 20) + "..." : patient;
      return (
        <div className="capitalize flex items-center gap-2">{patientName}</div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "data",
    header: () => {
      return <p className="ml-[65px] capitalize text-sm">Data</p>;
    },
    cell: ({ row }) => {
      const caseData: ToothCollection =
        JSON.parse(row.getValue("data")) || undefined;
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
      const material = row.material;
      const materialName = material?.name || "Unknown";
      return materialName.length > 20
        ? materialName.substring(0, 20) + "..."
        : materialName;
    },
    header: "Material",
    cell: ({ row }) => {
      // <CubeIcon className="size-4" />
      const material: string = row.getValue("material");
      return (
        <div className="capitalize flex items-center gap-2">{material}</div>
      );
    },
    size: 130,
    maxSize: 150,
  },
  {
    accessorKey: "due",
    header: "Due",
    cell: ({ row }) => {
      const due = parseInt(row.getValue("due"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(due);

      return <div>{formatted}</div>;
    },
  },
  // {
  //   accessorKey: "actions",
  //   header: () => <div className="text-start">Actions</div>,
  //   cell: ({ row }) => {
  //     const _case: Case = row.original;
  //     return(
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //           <div className="flex">
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="shadow-none text-muted-foreground/60"
  //             aria-label="Edit item"
  //           >
  //             <MoreHorizontal className="size-5" size={20} aria-hidden="true" />
  //           </Button>
  //         </div>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent>
  //             <DropdownMenuLabel>
  //               Actions
  //             </DropdownMenuLabel>
  //             {/* <Link href={`/dashboard/cases/edit/${row.original.$id}`}> */}
  //             {/* <Button variant={"ghost"} className="w-full justify-start">Edit</Button> */}
  //             <DropdownMenuItem asChild>
  //               <EditCaseModal selectedCase={_case} />
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       )
  //   },
  //   size: 70,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "invoice",
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const invoice: Case["invoice"] = row.getValue("invoice");
      const statusVariant = !invoice ? "destructive" : "success";
      return (
        <Badge variant={statusVariant}>{invoice ? "PAID" : "UNPAID"}</Badge>
      );
    },
  },
];
