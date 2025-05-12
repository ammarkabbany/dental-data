import { databases } from "@/lib/appwrite/client";
import {
  ANALYTICS_COLLECTION_ID,
  DATABASE_ID,
} from "@/lib/constants";
import { AnalyticsEntry } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Query } from "appwrite";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";

async function getAnalyticsData() {
  const now = new Date();
  const periods = {
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now),
      label: format(now, "yyyy-MM"),
    },
    lastMonth: {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
      label: format(subMonths(now, 1), "MMMM yyyy"),
    },
    threeMonths: {
      start: startOfMonth(subMonths(now, 3)),
      end: now,
      label: "Last 3 Months",
    },
    sixMonths: {
      start: startOfMonth(subMonths(now, 6)),
      end: now,
      label: "Last 6 Months",
    },
    thisYear: {
      start: startOfYear(now),
      end: now,
      label: format(now, "yyyy"),
    },
    lastYear: {
      start: startOfYear(subYears(now, 1)),
      end: endOfYear(subYears(now, 1)),
      label: format(subYears(now, 1), "yyyy"),
    },
  };

  const analyticsData = await databases.listDocuments(
    DATABASE_ID,
    ANALYTICS_COLLECTION_ID,
    [
      Query.equal("period", periods.thisMonth.label),
      Query.orderDesc("$createdAt"),
    ]
  )
  const analytics = analyticsData.documents[0];
  return {
    ...analytics,
    data: JSON.parse(analytics.data),
    casesChartData: JSON.parse(analytics.casesChartData),
  } as AnalyticsEntry;
}

export function useAnalyiticsData() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
    retry: 1
  });
}

export function usePrefetchAnalyticsData() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["analytics"],
      queryFn: getAnalyticsData,
    });
  };
}
