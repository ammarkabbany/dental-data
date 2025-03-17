"use server"
import { Query } from 'node-appwrite';
import { CASES_COLLECTION_ID, DATABASE_ID, DOCTORS_COLLECTION_ID } from './constants';
import { createAdminClient } from './appwrite/appwrite';
import { Case, Doctor } from '@/types';

export async function getDashboardData(teamId: string | undefined) {
  if (!teamId) {
    throw new Error('Team ID is required');
  }
  try {
    // In a real app, you might have a specific API endpoint for this
    // or make multiple queries in parallel

    // For now, we'll simulate the data
    const {databases} = await createAdminClient();

    // Fetch cases
    const cases = await databases.listDocuments<Case>(
      DATABASE_ID,
      CASES_COLLECTION_ID,
      [
        // Query.equal('teamId', teamId),
        Query.select(['date']),
        Query.limit(99999)
      ]
    );

    // Fetch doctors
    const doctors = await databases.listDocuments<Doctor>(
      DATABASE_ID,
      DOCTORS_COLLECTION_ID,
      [Query.equal('teamId', teamId)]
    );

    // Calculate stats
    const totalCases = cases.documents.length;
    const activeDoctors = doctors.documents.length;
    const dueRevenue = cases.documents.reduce((sum, c) => sum + (c.dueAmount || 0), 0);

    // Calculculate stats due today
    const today = new Date().toISOString().split('T')[0];
    const casesDueToday = cases.documents.filter(c => 
      c.dueDate && c.dueDate.startsWith(today)
    ).length;

    // Recent cases
    const recentCases = cases.documents
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(caseItem => {
        // Find the doctor name
        const doctor = doctors.documents.find(d => d.$id === caseItem.doctorId);

        return {
          $id: caseItem.$id,
          patientName: caseItem.patientName,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          dueDate: caseItem.dueDate,
          invoiceStatus: caseItem.invoiceStatus,
          dueAmount: caseItem.dueAmount
        };
      });

      function getWeekNumber(d: Date): number {
        const oneJan = new Date(d.getFullYear(), 0, 1);
        const numberOfDays = Math.floor(
          (d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
        );
        return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
      }

      const groupedData = {
        week: {} as { [key: string]: number },
        month: {} as { [key: string]: number },
        year: {} as { [key: string]: number },
      };

      cases.documents?.forEach((doc) => {
        const date = new Date(doc.date);
      
        // **Group by Week (e.g., "Week 6, 2024")**
        const weekNumber = getWeekNumber(date); // Function to calculate the week number
        const weekKey = `Week ${weekNumber}, ${date.getFullYear()}`;
        groupedData.week[weekKey] = (groupedData.week[weekKey] || 0) + 1;
      
        // **Group by Month (e.g., "February 2024")**
        const monthKey = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        groupedData.month[monthKey] = (groupedData.month[monthKey] || 0) + 1;
      
        // **Group by Year (e.g., "2024")**
        const yearKey = date.getFullYear().toString();
        groupedData.year[yearKey] = (groupedData.year[yearKey] || 0) + 1;
      });

    return {
      stats: {
        totalCases,
        activeDoctors,
        dueRevenue,
        casesDueToday,
        casesChange: 12, // Mock value - percent change from previous period
        doctorsChange: 5, // Mock value
        revenueChange: -3 // Mock value
      },
      recentCases,
      analytics: {
        groupedData
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// src/lib/dashboard-service.ts
// import { faker } from '@faker-js/faker';

// // Mock data types
// interface Case {
//   $id: string;
//   patientName: string;
//   doctorName: string;
//   dueDate: string;
//   invoiceStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
//   dueAmount: number;
// }

// interface Stat {
//   title: string;
//   value: number | string;
//   trend: number;
// }

// interface AnalyticsData {
//   name: string;
//   value: number;
// }

// interface DashboardData {
//   stats: Stat[];
//   recentCases: Case[];
//   analytics: {
//     monthlyCases: AnalyticsData[];
//     materialUsage: AnalyticsData[];
//   };
// }

// // Generate mock cases
// function generateMockCases(count: number): Case[] {
//   return Array.from({ length: count }, () => ({
//     $id: faker.string.uuid(),
//     patientName: faker.person.fullName(),
//     doctorName: faker.person.fullName(),
//     dueDate: faker.date.future().toISOString(),
//     invoiceStatus: faker.helpers.arrayElement(['PAID', 'UNPAID', 'PARTIAL']),
//     dueAmount: faker.number.float({ min: 100, max: 1000 }),
//   }));
// }

// // Generate mock stats
// function generateMockStats(): Stat[] {
//   return [
//     {
//       title: 'Total Cases',
//       value: faker.number.int({ min: 50, max: 200 }),
//       trend: faker.number.float({ min: -10, max: 10 }),
//     },
//     {
//       title: 'Active Doctors',
//       value: faker.number.int({ min: 5, max: 20 }),
//       trend: faker.number.float({ min: -5, max: 5 }),
//     },
//     {
//       title: 'Due Revenue',
//       value: `$${faker.number.float({ min: 1000, max: 10000 }).toFixed(2)}`,
//       trend: faker.number.float({ min: -15, max: 15 }),
//     },
//     {
//       title: 'Cases Due Today',
//       value: faker.number.int({ min: 1, max: 10 }),
//       trend: 0,
//     },
//   ];
// }

// // Generate mock analytics data
// function generateMockAnalytics(): {
//   monthlyCases: AnalyticsData[];
//   materialUsage: AnalyticsData[];
// } {
//   const monthlyCases = Array.from({ length: 6 }, (_, i) => ({
//     name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
//     value: faker.number.int({ min: 10, max: 100 }),
//   }));

//   const materialUsage = Array.from({ length: 5 }, () => ({
//     name: faker.commerce.productMaterial(),
//     value: faker.number.int({ min: 1, max: 50 }),
//   }));

//   return { monthlyCases, materialUsage };
// }

// // Main function to generate mock dashboard data
// export async function getDashboardData(): Promise<DashboardData> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         stats: generateMockStats(),
//         recentCases: generateMockCases(5),
//         analytics: generateMockAnalytics(),
//       });
//     }, 500); // Simulate a 500ms delay
//   });
// }


