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

  // const doctorIds = cases.documents.map(c => c.doctorId);

  // if (cases.documents.length > 0 && doctorIds) {
  //   const doctors = await databases.listDocuments<Doctor>(
  //     DATABASE_ID,
  //     DOCTORS_COLLECTION_ID,
  //     [Query.equal("$id", doctorIds), Query.limit(5), Query.select(["$id", "name"])]
  //   )

  //   cases.documents.forEach(c => {
  //     const doctor = doctors.documents.find(d => d.$id === c.doctorId);
  //     if (doctor) {
  //       c.doctor = doctor;
  //     }
  // })}

  const doctorsCount = await databases.listDocuments<Doctor>(
    DATABASE_ID,
    DOCTORS_COLLECTION_ID,
    [Query.limit(1), Query.select(["$id"])]
  );

  const materialsCount = await databases.listDocuments(
    DATABASE_ID,
    MATERIALS_COLLECTION_ID,
    [Query.limit(1), Query.select(["$id"])]
  );

  return {
    casesCount: cases.total,
    recentCases: cases.documents,
    doctorsCount: doctorsCount.total,
    materialsCount: materialsCount.total,
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
