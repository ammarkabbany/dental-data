import { type ColumnDef } from "@tanstack/react-table";
import { AuditLogEntry } from "@/types";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const getAuditLogsColumns = (): ColumnDef<AuditLogEntry>[] => [
  {
    accessorKey: "user",
    accessorFn: (row) => row.user?.name,
    header: "User",
    cell: ({ row }) => {
      const userName = row.original.user?.name || "N/A";
      const userAvatar = row.original.user?.avatar;
      return (
        <div className="flex items-center gap-x-2">
          <UserAvatar
            className="ring-2 ring-offset-2 ring-offset-background ring-secondary"
            name={userName}
            image={userAvatar}
          />
          <div className="capitalize">{userName}</div>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "resourceId",
    header: "Resource ID",
    cell: ({ row }) => {
      const resourceId = row.getValue("resourceId") as string;
      return <div className="">{resourceId}</div>;
    },
    size: 180,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return (
        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
          action === "CREATE" ? "bg-green-500/10 text-green-500 ring-1 ring-green-500/20" : 
          action === "UPDATE" ? "bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20" : 
          action === "DELETE" ? "bg-red-500/10 text-red-500 ring-1 ring-red-500/20" : 
          "bg-gray-500/10 text-gray-500 ring-1 ring-gray-500/20"
        )}>
          {action}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => {
      const resource = row.getValue("resource") as string;
      return <div className="capitalize">{resource}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const createdAt = row.getValue("timestamp") as number;
      return <div>{new Date(createdAt).toLocaleString()}</div>;
    },
    size: 200,
  },
];
