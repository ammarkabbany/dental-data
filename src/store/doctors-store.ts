import { client } from "@/lib/appwrite/client";
import { DATABASE_ID, DOCTORS_COLLECTION_ID } from "@/lib/constants";
import { Doctor } from "@/types";
import { create } from "zustand";

export interface IDoctorsStore {
  doctors: Doctor[];
  totalDoctors: number;
  setDoctors: (doctors: Doctor[]) => void;
  getDoctorById(id: Doctor["$id"]): Doctor | undefined;
}

export const useDoctorsStore = create<IDoctorsStore>((set, get) => {
  const subscribeToRealtime = () => {
    if (typeof window === 'undefined') {
      return; // Exit if not in a browser environment
    }
    return client.subscribe(`databases.${DATABASE_ID}.collections.${DOCTORS_COLLECTION_ID}.documents`, (data) => {

      if (data.events.includes("databases.*.collections.*.documents.*.update")) {
        const updatedDoctor = data.payload as Doctor
        set((state) => {
          if (!state.doctors) {
            return state;
          }
  
          const index = state.doctors.findIndex((d) => d.$id === updatedDoctor.$id);
  
          if (index === -1) {
            return state;
          }
  
          const newDoctors = [...state.doctors];
          newDoctors[index] = updatedDoctor;
  
          return { doctors: newDoctors };
        })
      }

      if (data.events.includes("databases.*.collections.*.documents.*.create")) {
        const response = data.payload as Doctor
        set((state) => ({ doctors: [...state.doctors, response], totalDoctors: state.totalDoctors + 1 }));
      }
    });
  };
  
  // Only subscribe when in a browser environment
  if (typeof window !== 'undefined') {
    subscribeToRealtime(); // Call it when store initializes
  }

  return {
    doctors: [],
    totalDoctors: 0,
    setDoctors: (doctors) => {
      set({ doctors, totalDoctors: doctors.length });
    },

    getDoctorById: (id: Doctor["$id"]) => {
      return get().doctors.find((doctor) => doctor.$id === id);
    },
  };
});
