"use server"
import { createAdminClient } from "@/lib/appwrite/appwrite";
import { DATABASE_ID, PAYMENTS_COLLECTION_ID } from "@/lib/constants";
import { Payment } from "@/types";
import { ID } from "node-appwrite";
import { UpdateDoctorDue } from "./actions";

export const createPayment = async (data: any): Promise<Payment> => {
  const {databases} = await createAdminClient();
  const payment = await databases.createDocument<Payment>(
    DATABASE_ID,
    PAYMENTS_COLLECTION_ID,
    ID.unique(),
    {
      amount: data.amount,
      doctorId: data.doctorId,
      date: data.date,
    }
  )
  await UpdateDoctorDue(payment.doctorId, -payment.amount);
  return payment;
};