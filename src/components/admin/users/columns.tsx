import { type ColumnDef } from "@tanstack/react-table";
import { Team } from "@/types";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";

interface ColumnDefinition {
  $id: string;
  name: string;
  email: string;
  avatar: string | null;
  team: Team | null;
  role: string | null;
}

export const getColumns = (): ColumnDef<ColumnDefinition>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const userName = row.getValue("name") as string;
      const userAvatar = row.original.avatar;
      return (
        <div className="flex items-center gap-x-2">
          <UserAvatar name={userName} image={userAvatar || undefined} />
          <div className="capitalize">{userName}</div>
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="">{email}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "team",
    accessorFn: (originalRow) => {
      const team = originalRow.team as Team | null;
      return team?.name || "N/A"; 
    },
    header: "Team",
    cell: ({ row }) => {
      const team = row.getValue("team") as string;
      return <div className="capitalize">{team}</div>;
    },
    size: 100,  
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null;
      return <div className="capitalize">
        <Badge variant={
          role ? "info" : "secondary"
        }>{role || "N/A"}</Badge>
      </div>;
    },
    size: 40,
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
