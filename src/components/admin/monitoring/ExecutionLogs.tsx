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
}: {
  logs: (Models.Execution & { functionName: string })[];
}) => {
  const getFunctionLink = (functionId: string) => {
    return `https://cloud.appwrite.io/console/project-fra-${APPWRITE_PROJECT}/functions/function-${functionId}/executions`;
  };
  // const logs = [
  //   {
  //     $id: 'log-001',
  //     $createdAt: '2025-07-10T22:02:30.000+00:00',
  //     functionId: '686e8b26003633f21c41',
  //     trigger: "http",
  //     status: 'failed',
  //     requestPath: "/update",
  //     responseStatusCode: 500,
  //     method: "PATCH",
  //     duration: 0.15146398544312,
  //   },
  //   {
  //     $id: 'log-002',
  //     $createdAt: '2025-07-10T05:34:56.291+00:00',
  //     functionId: '686e8b26003633f21c41',
  //     trigger: "http",
  //     status: 'completed',
  //     requestPath: "/",
  //     responseStatusCode: 200,
  //     method: "GET",
  //     duration: 0.43666005134583,
  //   },
  //   {
  //     $id: 'log-002',
  //     $createdAt: '2025-07-09T20:36:55.514+00:00',
  //     functionId: '686e8b26003633f21c41',
  //     trigger: "event",
  //     status: 'processing',
  //     responseStatusCode: 0,
  //     requestPath: "/all",
  //     method: "POST",
  //     duration: 2.7086098194122,
  //   },
  //   {
  //     $id: 'log-002',
  //     $createdAt: '2025-07-09T20:34:56.291+00:00',
  //     functionId: '686e8b26003633f21c41',
  //     trigger: "http",
  //     status: 'waiting',
  //     requestPath: "/",
  //     responseStatusCode: 0,
  //     method: "GET",
  //     duration: 0.20617008209229,
  //   },
  // ];

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
      {/* Filters */}
      {/* <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search logs..."
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Function" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Functions</SelectItem>
            <SelectItem value="user-authentication">user-authentication</SelectItem>
            <SelectItem value="email-notifications">email-notifications</SelectItem>
            <SelectItem value="image-processor">image-processor</SelectItem>
            <SelectItem value="payment-webhook">payment-webhook</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Logs List */}
      <div className="space-y-3">
        {logs
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
