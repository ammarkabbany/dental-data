import { type ColumnDef } from "@tanstack/react-table";
import { AuditLogEntry, Team } from "@/types";
import { UserAvatar } from "@/components/user-avatar";

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
          <UserAvatar name={userName} image={userAvatar} />
          <div className="capitalize">{userName}</div>
        </div>
      );
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
    size: 150,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return <div className="capitalize">{action}</div>;
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
    accessorKey: "resourceId",
    header: "Resource ID",
    cell: ({ row }) => {
      const resourceId = row.getValue("resourceId") as string;
      return <div className="">{resourceId}</div>;
    },
    size: 100,
  },
];
