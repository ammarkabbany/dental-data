import { getUserInfo } from "@/features/auth/actions";
import { databases } from "@/lib/appwrite/client";
import {
  CASES_COLLECTION_ID,
  DATABASE_ID,
  DOCTORS_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
} from "@/lib/constants";
import { Case, Doctor } from "@/types";
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

async function getDashboardData() {
  const now = new Date();
  const periods = {
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now),
      label: format(now, "MMMM yyyy"),
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
  // const cookie = await getSessionCookie();
  // databases.client.setSession(cookie!)
  // const thisMonthCases = await databases.listDocuments(
  //   DATABASE_ID,
  //   CASES_COLLECTION_ID,
  //   [
  //     Query.greaterThanEqual("date", periods.thisMonth.start.toISOString()),
  //     Query.lessThanEqual("date", periods.thisMonth.end.toISOString()),
  //     Query.limit(1),
  //     Query.select(["$id"]),
  //   ]
  // );

  // const lastMonthCases = await databases.listDocuments(
  //   DATABASE_ID,
  //   CASES_COLLECTION_ID,
  //   [
  //     Query.greaterThanEqual("date", periods.lastMonth.start.toISOString()),
  //     Query.lessThanEqual("date", periods.lastMonth.end.toISOString()),
  //     Query.limit(1),
  //     Query.select(["$id"]),
  //   ]
  // );
  // const monthDifference = ((thisMonthCases.total - lastMonthCases.total) / thisMonthCases.total) * 100;

  const [cases, doctors, materials] = await Promise.all([
    databases.listDocuments<Case>(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      [
        Query.limit(1),
        Query.select([
          "$id",
        ]),
      ]
    ),

    databases.listDocuments<Doctor>(
      DATABASE_ID,
      DOCTORS_COLLECTION_ID,
      [Query.limit(1), Query.select(["$id"])]
    ),

    databases.listDocuments(
      DATABASE_ID,
      MATERIALS_COLLECTION_ID,
      [Query.limit(1), Query.select(["$id"])]
    )
  ])

  return {
    casesCount: cases.total,
    doctorsCount: doctors.total,
    materialsCount: materials.total,
  };
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });
}

export function usePrefetchDashboardData() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["dashboard"],
      queryFn: getDashboardData,
    });
  };
}

export function useRecentCases() {
  return useQuery({
    queryKey: ["recent_cases"],
    queryFn: async () => {
      const cases = await databases.listDocuments<Case>(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        [
          Query.limit(5),
          Query.orderDesc("$createdAt"),
          Query.select([
            "$id",
            "patient",
            "doctorId",
            "due",
            "invoice",
            "teamId",
            "userId",
          ]),
        ]
      );

      const userIds = [...new Set(cases.documents.map((row) => row.userId))];

      const userInfos = await Promise.all(
        userIds.map((userId) => getUserInfo(userId))
      );
      const userInfoMap = userInfos.reduce(
        (acc, info, index) => {
          acc[userIds[index]] = info;
          return acc;
        },
        {} as Record<string, (typeof userInfos)[number]>
      );

      cases.documents = cases.documents.map((caseItem) => ({
        ...caseItem,
        user: userInfoMap[caseItem.userId] || null,
      }));

      return {
        ...cases,
      };
    }
  })
}
