import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/types";
import { formatCurrency, formatNumbers, shortenString } from "@/lib/format-utils";
import { Edit, ChevronDown, ChevronRight, CreditCard, DollarSign, AlertTriangle, Save, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { PermissionCheckType } from "@/hooks/use-permissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { PaymentDialog } from "./payment-dialog";
import { Models } from "appwrite";
// import { cn } from "@/lib/utils"; // No longer needed here
// import { Input } from "@/components/ui/input"; // No longer needed here
// import { useUpdateDoctor } from "@/features/doctors/hooks/use-update-doctor"; // No longer needed here
// import { toastAPI } from "@/lib/ToastAPI"; // No longer needed here
import { EditableDoctorNameCell } from "./EditableDoctorNameCell";
import { cn } from "@/lib/utils";

export const getColumns = (
  permissions: PermissionCheckType,
  prefs: Models.Preferences,
  editingRowId: string | null,
  setEditingRowId: (id: string | null) => void,
): ColumnDef<Doctor>[] => [
    {
      accessorKey: "$id",
      header: "ID",
      cell: ({ row }) => {
        const id = Number(row.original.$sequence);
        let idString = String(id);
        while (idString.length < 4) {
          idString = "0" + idString;
        }
        return <div className="capitalize">DOC-{idString}</div>;
      },
      size: 160,
    },
    {
      accessorKey: "doctor",
      accessorFn: (row) => row.name,
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <EditableDoctorNameCell
            doctor={doctor}
            isEditing={editingRowId === doctor.$id}
            setEditingRowId={setEditingRowId}
            permissions={permissions}
          />
        );
      },
      size: 280, // Keep increased size for the component
    },
    {
      accessorKey: "totalCases",
      header: "Cases",
      cell: ({ row }) => {
        const cases = parseInt(row.getValue("totalCases"));

        const formatted = formatNumbers(cases);

        return <p className="font-bold text-sm text-foreground">{formatted}</p>
          // <Badge variant={"info"} className="text-center">
          // </Badge>
        
      },
      size: 75,
    },
    {
      accessorKey: "due",
      header: "Due",
      cell: ({ row }) => {
        // You would get this from your data source
        const dueAmount = row.original.due || 0;
        const formatted = formatCurrency(dueAmount, prefs.currency, 0);
        
        return (
          <div className="">
            <Badge 
              variant={dueAmount > 0 ? "default" : "outline"}
              className={cn(
                dueAmount === 0 && "bg-gray-50 text-gray-500 border-gray-200"
              , "rounded-sm")}
            >
              {formatted}
            </Badge>
          </div>
        );
      },
      size: 100,
    },
    // {
    //   accessorKey: "actions",
    //   header: () => <div className="text-center">Actions</div>,
    //   cell: ({ row }) => {
    //     return (
    //       <TooltipProvider disableHoverableContent>
    //         <div className="flex items-center gap-2 justify-center">
    //           {permissions.checkPermission("financials", "has") && (
    //             <>
    //               <Tooltip delayDuration={100}>
    //                 <PaymentDialog doctor={row.original}>
    //                   <TooltipTrigger asChild>
    //                     <Button
    //                       size={"icon"}
    //                       className="rounded-full"
    //                       variant={"secondary"}
    //                     >
    //                       <CreditCard className="h-4 w-4" />
    //                     </Button>
    //                   </TooltipTrigger>
    //                 </PaymentDialog>
    //                 <TooltipContent side="top">Add Payment</TooltipContent>
    //               </Tooltip>
    //             </>
    //           )}
    //           {permissions.checkPermission("doctors", "update") && (
    //             <Tooltip delayDuration={100}>
    //               <TooltipTrigger asChild>
    //               <Button
    //                 size={"icon"}
    //                 className="rounded-full"
    //                 variant={"secondary"}
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   // row.toggleExpanded();
    //                 }}
    //               >
    //                 <Edit className="h-4 w-4" />
    //               </Button>
    //               </TooltipTrigger>
    //               <TooltipContent side="top">Edit</TooltipContent>
    //             </Tooltip>
    //           )}
    //         </div>
    //       </TooltipProvider>
    //     );
    //   },
    //   size: 75,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
  ];
