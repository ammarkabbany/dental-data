import { Card, CardContent, CardFooter } from "./ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: number;
  trendLabel?: string;
}

export default function AnalyticsStatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel = "vs. last month",
}: StatsCardProps) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <Card className="flex h-[150px] shadow-inner dark:shadow-white/15 shadow-neutral-400/75">
      <CardContent className="w-full flex flex-row justify-start gap-4">
        <div className="p-4 rounded-full flex items-center text-white from-[#667eea] to-[#764ba2] bg-gradient-to-r shadow-lg dark:shadow-white/15 shadow-neutral-400/75">
          {icon}
        </div>
        <div className="flex flex-col">
          <p>{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isNeutral && (
          <>
            {isPositive ? (
              <HugeiconsIcon icon={TradeUpIcon} className="text-green-400" />
            ) : (
              <HugeiconsIcon icon={TradeDownIcon} className="text-red-600" />
            )}
            <span
              className={`text-sm font-medium ml-1 ${
                isPositive ? "text-green-400" : "text-red-600"
              }`}
            >
              {Math.abs(trend)}%
            </span>
          </>
        )}
        <span className="text-sm text-gray-500 ml-1">{trendLabel}</span>
      </CardFooter>
    </Card>
  );
}
