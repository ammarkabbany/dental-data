import { Case } from "@/types";
import { create } from "zustand";



interface ICaseUtilsStore {
  selectedCase: Case | null;
  setSelectedCase: (Case: Case | null) => void;
}

export const useCaseUtilsStore = create<ICaseUtilsStore>((set, get) => ({
  selectedCase: null,

  setSelectedCase: (Case) => {
    set({ selectedCase: Case });
  },
}))