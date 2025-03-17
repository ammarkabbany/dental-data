import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function AnalyticsAreaChart({
  data,
  label,
}: {
  data: any;
  label: string;
}) {
  const [timeFrame, setTimeFrame] = useState("week");

  const formatChartData = (data: any) => {
    return Object.entries(data)
      .map(([key, value]) => ({
        date: key,
        cases: value,
      }))
      .reverse();
  };

  const chartData = formatChartData(data[timeFrame] || {});

  const chartConfig = {
    [label]: {
      label: <p className="capitalize">{label}</p>,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="">
      <Card className="transition-all h-[450px] bg-card border-border shadow-sm flex flex-col justify-between">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Cases over time
            </CardTitle>
            <p className="text-sm text-[#71717a]">
              Showing {timeFrame}ly case trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeFrame === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFrame("week")}
            >
              Week
            </Button>
            <Button
              variant={timeFrame === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFrame("month")}
            >
              Month
            </Button>
            <Button
              variant={timeFrame === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFrame("year")}
            >
              Year
            </Button>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Download Data</DropdownMenuItem>
                <DropdownMenuItem>Share Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickFormatter={(value) => {
                        if (timeFrame === "week") return value.split(",")[0];
                        if (timeFrame === "month") return value.split(" ")[0];
                        return value;
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                    <Area
                      type="monotone"
                      dataKey="cases"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorCases)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for the selected time frame.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
