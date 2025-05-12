import { Users, Database, MessageSquare, Clock, BarChart3, FileDown } from "lucide-react";

export const AUTH_COOKIE = 'dd_session_jwt'

export const NEXT_URL = process.env.NEXT_PUBLIC_NEXT_URL as string;
export const API_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string
export const TEAMS_COLLECTION_ID = process.env.NEXT_PUBLIC_TEAMS_COLLECTION_ID as string
export const TEAM_MEMBERS_COLLECTION_ID = process.env.NEXT_PUBLIC_TEAM_MEMBERS_COLLECTION_ID as string
export const DOCTORS_COLLECTION_ID = process.env.NEXT_PUBLIC_DOCTORS_COLLECTION_ID as string
export const PAYMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_PAYMENTS_COLLECTION_ID as string
export const CASES_COLLECTION_ID = process.env.NEXT_PUBLIC_CASES_COLLECTION_ID as string
export const MATERIALS_COLLECTION_ID = process.env.NEXT_PUBLIC_MATERIALS_COLLECTION_ID as string
export const TEMPLATES_COLLECTION_ID = process.env.NEXT_PUBLIC_TEMPLATES_COLLECTION_ID as string
export const PLANS_COLLECTION_ID = process.env.NEXT_PUBLIC_PLANS_COLLECTION_ID as string
export const AUDIT_LOGS_COLLECTION_ID = process.env.NEXT_PUBLIC_AUDIT_LOGS_COLLECTION_ID as string
export const ANALYTICS_COLLECTION_ID = process.env.NEXT_PUBLIC_ANALYTICS_COLLECTION_ID as string

export const INSTAPAY_ORDERS_COLLECTION_ID = process.env.INSTAPAY_ORDERS_COLLECTION_ID as string

export const AVATARS_BUCKET_ID = process.env.NEXT_PUBLIC_AVATARS_BUCKET_ID as string
export const TRANSACTIONS_BUCKET_ID = process.env.TRANSACTIONS_BUCKET_ID as string
export const ANALYTICS_FUNCTION_ID = process.env.NEXT_ANALYTICS_FUNCTION_ID as string


export const Plans = [
  {
    name: "Free",
    desc: 'Test out the platform.',
    price: 0,
    features: [
      { text: "14 days free trial", icon: Clock },
      { text: "100 cases", icon: Database },
      { text: "1 team member", icon: Users },
      { text: "Basic support", icon: MessageSquare },
    ],
    popular: false,
  },
  {
    name: "Starter",
    desc: "Great for small to medium labs.",
    price: 750,
    features: [
      { text: "Up to 200 cases per month", icon: Database },
      { text: "Up to 3 team members", icon: Users },
      { text: "Priority support", icon: MessageSquare },
      { text: "Simple Audit Logs", icon: Clock },
    ],
    popular: true,
  },
  {
    name: "Pro",
    desc: "Perfect for growing labs.",
    price: 1500,
    features: [
      { text: "Up to 500 cases per month", icon: Database },
      { text: "Up to 5 team members", icon: Users },
      { text: "Premium support", icon: MessageSquare },
      { text: "Advanced Audit Logs", icon: Clock },
      { text: "Bulk data export", icon: FileDown },
      { text: "Advanced analytics", icon: BarChart3 },
    ],
    popular: false,
  },
];
