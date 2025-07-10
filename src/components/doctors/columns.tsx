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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useUpdateDoctor } from "@/features/doctors/hooks/use-update-doctor";
import { toastAPI } from "@/lib/ToastAPI";

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
        // const id = Number(row.id) + 1;
        // let idString = String(id);
        // while (idString.length < 4) {
        //   idString = "0" + idString;
        // }
        return <div className="capitalize">{row.original.$id}</div>;
      },
      size: 160,
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const doctorRow = row.original;
        const isEditing = editingRowId === doctorRow.$id;
        const [name, setName] = React.useState(doctorRow.name);
        const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();

        const handleSave = () => {
          if (name === doctorRow.name) {
            setEditingRowId(null);
            return;
          }
          if (name.trim().length < 4) {
            toastAPI.error("Name needs to be at least 4 characters long");
            return;
          }
          if (name.trim().length > 32) {
            toastAPI.error("Name needs to be at most 32 characters long");
            return;
          }
          updateDoctor(
            { id: doctorRow.$id, data: { name: name.trim() } },
            {
              onSuccess: () => {
                setEditingRowId(null);
                // toastAPI.success("Doctor updated successfully"); // Already handled by the hook
              },
              onError: (error) => {
                 // This will be handled by the hook's onError if defined,
                 // but can be specifically handled here if needed.
                toastAPI.error(error.message || "Failed to update doctor");
              }
            }
          );
        };

        const handleCancel = () => {
          setName(doctorRow.name);
          setEditingRowId(null);
        };

        const handleEdit = () => {
          setEditingRowId(doctorRow.$id);
        }

        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                disabled={isUpdating || name === doctorRow.name}
                className="h-8 w-8"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                disabled={isUpdating}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        }

        const now = new Date();
        const createdAt = new Date(row.original.$createdAt);
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const isRecent = createdAt >= fiveMinutesAgo;
        const doctorNameDisplay: string = shortenString(row.original.name, 20);

        return (
          <div className="capitalize flex items-center gap-2 text-ellipsis truncate group">
            <span title={row.original.name}>{doctorNameDisplay}</span>
            {isRecent && (
              <Badge className="ml-1" variant="info">
                New
              </Badge>
            )}
            {permissions.checkPermission("doctors", "update") && (
               <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                </Button>
            )}
          </div>
        );
      },
      size: 280, // Increased size to accommodate buttons
    },
    {
      accessorKey: "totalCases",
      header: "Cases",
      cell: ({ row }) => {
        const cases = parseInt(row.getValue("totalCases"));

        const formatted = formatNumbers(cases);

        return (
          <Badge variant={"info"} className="text-center">
            {formatted}
          </Badge>
        );
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
              )}
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
