import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  EllipsisIcon,
  Filter,
  Loader,
  Search,
  XCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDistance } from "date-fns";
import { formatDuration } from "@/lib/format-utils";
import { Models } from "node-appwrite";
import { API_ENDPOINT, APPWRITE_PROJECT } from "@/lib/constants";

const ExecutionLogs = ({
  logs = [],
  statusFilter,
  setStatusFilter,
}: {
  logs: (Models.Execution & { functionName: string })[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}) => {
  const getFunctionLink = (functionId: string) => {
    return `https://cloud.appwrite.io/console/project-fra-${APPWRITE_PROJECT}/functions/function-${functionId}/executions`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "processing":
        return <Loader className="w-4 h-4 text-muted-foreground" />;
      default:
        return <EllipsisIcon className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="rounded-sm">Completed</Badge>;
      case "failed":
        return (
          <Badge variant="destructive" className="rounded-sm">
            Failed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className="rounded-sm">
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-sm">
            Waiting
          </Badge>
        );
    }
  };

  const getStatusCodeBadge = (code: number) => {
    switch (code) {
      case 500:
        return (
          <Badge variant="destructive" className="rounded-sm">
            {code}
          </Badge>
        );
      case 404:
        return (
          <Badge variant="destructive" className="rounded-sm">
            {code}
          </Badge>
        );
      case 401:
        return (
          <Badge variant="destructive" className="rounded-sm">
            {code}
          </Badge>
        );
      case 403:
        return (
          <Badge variant="destructive" className="rounded-sm">
            {code}
          </Badge>
        );
      case 0:
        return (
          <Badge variant="secondary" className="rounded-sm">
            {code}
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="rounded-sm">
            {code}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center space-x-4 mb-4">
          <Select defaultValue="all" onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {logs
          .sort(
            (a, b) =>
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime()
          )
          .map((log) => (
            <Card
              key={log.$id}
              className="backdrop-blur-sm bg-sidebar transition-all duration-200"
            >
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">{log.$id}</h4>
                        <div className="hidden sm:block">
                          {getStatusBadge(log.status)}
                        </div>
                      </div>
                      <a
                        href={getFunctionLink(log.functionId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground mt-1 underline underline-offset-4 hover:text-muted-foreground/75 transition"
                      >
                        Function: {log.functionName}
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistance(log.$createdAt, Date.now(), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-5 gap-4 mt-3 pt-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Path</p>
                    <p className="text-sm font-normal underline underline-offset-4">
                      {log.requestPath}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Trigger</p>
                    <p className="text-sm font-normal capitalize">
                      {log.trigger}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Request ID</p>
                    <p className="text-sm font-normal capitalize">
                      {log.requestMethod}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Status code</p>
                    <p className="text-sm font-normal capitalize">
                      {getStatusCodeBadge(log.responseStatusCode)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-normal">
                      {formatDuration(log.duration)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export { ExecutionLogs };
