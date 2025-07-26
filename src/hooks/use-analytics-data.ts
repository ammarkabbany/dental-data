import { TriggerAnalyticsFunction } from "@/app/(dashboard)/dashboard/analytics/actions";
import { databases } from "@/lib/appwrite/client";
import {
  ANALYTICS_COLLECTION_ID,
  DATABASE_ID,
} from "@/lib/constants";
import { useTeam } from "@/providers/team-provider";
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

async function getAnalyticsData({ teamId }: { teamId: string }) {
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
  if (!analytics) {
    // run the appwrite function to create the analytics entry
    const res = await TriggerAnalyticsFunction(teamId);
    if (res === "failed") {
      throw new Error("Failed to fetch analytics");
    }
    if (res === "completed") {
      // refetch the analytics data
      const analyticsData = await databases.listDocuments(
        DATABASE_ID,
        ANALYTICS_COLLECTION_ID,
        [
          Query.equal("period", periods.thisMonth.label),
          Query.orderDesc("$createdAt"),
        ]
      );
      return {
        ...analyticsData.documents[0],
        data: JSON.parse(analyticsData.documents[0].data),
        casesChartData: JSON.parse(analyticsData.documents[0].casesChartData),
      } as AnalyticsEntry;
    }
  }
  return {
    ...analytics,
    data: JSON.parse(analytics.data),
    casesChartData: JSON.parse(analytics.casesChartData),
  } as AnalyticsEntry;
}

export function useAnalyiticsData() {
  const { currentTeam } = useTeam();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => {
      if (!currentTeam) {
        throw new Error("No team found");
      }
      if (currentTeam.planId === "free") {
        return null;
      }
      return getAnalyticsData({ teamId: currentTeam.$id });
    },
    retry: 1
  });
}

export function usePrefetchAnalyticsData() {
  const queryClient = useQueryClient();
  const { currentTeam } = useTeam();

  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["analytics"],
      queryFn: () => {
        if (!currentTeam) {
          throw new Error("No team found");
        }
        if (currentTeam.planId === "free") {
          return null;
        }
        return getAnalyticsData({ teamId: currentTeam.$id });
      }
    });
  };
}
