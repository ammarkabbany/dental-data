"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDoctorsStore } from "@/store/doctors-store";

export function DoctorsPieChart() {
  const { doctors } = useDoctorsStore();

  // Sort doctors by cases in descending order
  const sortedDoctors = [...doctors].sort(
    (a, b) => b.totalCases - a.totalCases,
  );

  // Show top 5 doctors, group the rest as "Others"
  const topDoctors = sortedDoctors.slice(0, 5);
  const otherCases = sortedDoctors
    .slice(5)
    .reduce((sum, doctor) => sum + doctor.totalCases, 0);

  // Format data for the pie chart
  const formattedData = topDoctors.map((doctor, index) => ({
    name: doctor.name,
    cases: doctor.totalCases,
    fill: `var(--chart-${(index % 5) + 1})`, // Cycle through colors
  }));

  if (otherCases > 0) {
    formattedData.push({
      name: "Others",
      cases: otherCases,
      fill: "var(--chart-6)",
    });
  }

  const totalCases = formattedData.reduce((acc, curr) => acc + curr.cases, 0);

  return (
    <Card className="flex h-[450px] w-full flex-col border-border bg-card shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-foreground">Top Doctors by Cases</CardTitle>
        <CardDescription className="text-muted-foreground">
          Highlighting the busiest doctors
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {doctors.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            No doctors available.
          </div>
        ) : totalCases === 0 ? (
          <div className="flex items-center justify-center h-full">
            No cases available.
          </div>
        ) : (
          <ChartContainer
            config={{ doctors: { label: "doctors" } }}
            className="mx-auto aspect-square h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedData}
                dataKey="cases"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCases.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Cases
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing the top 5 doctors + others
        </div>
      </CardFooter>
    </Card>
  );
}