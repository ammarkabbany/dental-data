import { Material } from "@/types";
import { create } from "zustand";

export interface IMaterialsStore {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  getMaterialById(id: Material['$id']): Material | undefined;
}

export const useMaterialsStore = create<IMaterialsStore>((set, get) => ({
  materials: [],

  setMaterials: (materials) => {
    set({ materials });
  },

  getMaterialById: (id: Material['$id']) => {
    return get().materials.find((material) => material.$id === id);
  },
}))