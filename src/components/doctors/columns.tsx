import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/types";
import { formatCurrency, formatNumbers } from "@/lib/format-utils";
import { Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { PermissionCheckType } from "@/hooks/use-permissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CreditCard } from "lucide-react";
import { PaymentDialog } from "./payment-dialog";
import { Models } from "appwrite";

export const getColumns = (
  permissions: PermissionCheckType,
  prefs: Models.Preferences
): ColumnDef<Doctor>[] => [
    // {
    //   id: 'expander',
    //   size: 30,
    //   header: () => null,
    //   cell: ({ row }) => {
    //     return row.getCanExpand() ? (
    //       <Button
    //         variant="ghost"
    //         size="icon"
    //         onClick={(e) => {
    //           e.stopPropagation(); // Prevent row click event
    //           row.toggleExpanded();
    //         }}
    //       >
    //         {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    //       </Button>
    //     ) : null;
    //   },
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
    },
    {
      accessorKey: "totalCases",
      header: "Cases",
      cell: ({ row }) => {
        const cases = parseInt(row.getValue("totalCases"));

        const formatted = formatNumbers(cases);

        return (
          <Badge variant={"default"} className="text-center">
            {formatted}
          </Badge>
        );
      },
      size: 75,
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
                </>
              )}
              {/* {permissions.checkPermission("doctors", "update") && (
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    className="rounded-full"
                    variant={"secondary"}
                    onClick={(e) => {
                      e.stopPropagation();
                      row.toggleExpanded();
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Edit</TooltipContent>
                </Tooltip>
              )} */}
            </div>
          </TooltipProvider>
        );
      },
      size: 75,
      enableSorting: false,
      enableHiding: false,
    },
  ];
