import { type ColumnDef } from "@tanstack/react-table";
import { Team } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDates } from "@/lib/format-utils";
import { formatDistanceToNow } from "date-fns";

export const getColumns = (): ColumnDef<Team>[] => [
  {
    accessorKey: "name",
    header: "Team",
    cell: ({ row }) => {
      const teamName = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-x-2">
          <div className="capitalize">{teamName}</div>
        </div>
      );
    },
    size: 80,
  },
  // {
  //   accessorKey: "email",
  //   header: "Email",
  //   cell: ({ row }) => {
  //     const email = row.getValue("email") as string;
  //     return <div className="">{email}</div>;
  //   },
  //   size: 100,
  // },
  {
    accessorKey: "$createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("$createdAt"));
      return <div className="capitalize">{formatDates(createdAt)}</div>;
    },
    size: 60,
  },
  {
    accessorKey: "planId",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("planId") as string;
      return <div className="capitalize">{plan}</div>;
    },
    size: 40,  
  },
  {
    accessorKey: "casesUsed",
    header: "Cases Used",
    cell: ({ row }) => {
      const cases = row.getValue("casesUsed") as number;
      return <div className="capitalize">
        <Badge variant={"secondary"}>{cases}</Badge>
      </div>;
    },
    size: 40,
  },
  {
    accessorKey: "maxCases",
    header: "Max Cases",
    cell: ({ row }) => {
      const cases = row.getValue("maxCases") as number;
      return <div className="capitalize">
        <Badge variant={"secondary"}>{cases}</Badge>
      </div>;
    },
    size: 40,
  },
  {
    accessorKey: "planExpiresAt",
    header: "Expires In",
    cell: ({ row }) => {
      const expiresAt = row.getValue("planExpiresAt") ? formatDistanceToNow(row.getValue("planExpiresAt")) : "N/A";
      return <div className="capitalize">{expiresAt}</div>;
    },
    size: 60,
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
  //               {/* <Tooltip delayDuration={100}>
  //                 <TooltipTrigger asChild>
  //                   <Button
  //                     size={"icon"}
  //                     className="rounded-full"
  //                     variant={"secondary"}
  //                   >
  //                     <EyeIcon />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent side="top">View Doctor</TooltipContent>
  //               </Tooltip> */}
  //             </>
  //           )}
  //           <Tooltip delayDuration={100}>
  //             <TooltipTrigger asChild>
  //               <Button
  //                 size={"icon"}
  //                 className="rounded-full"
  //                 variant={"secondary"}
  //               >
  //                 <Edit />
  //               </Button>
  //             </TooltipTrigger>
  //             <TooltipContent side="top">Edit Doctor</TooltipContent>
  //           </Tooltip>
  //         </div>
  //       </TooltipProvider>
  //     );
  //   },
  //   size: 50,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
];
