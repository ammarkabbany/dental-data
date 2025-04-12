import { client } from "@/lib/appwrite/client";
import { DATABASE_ID, MATERIALS_COLLECTION_ID } from "@/lib/constants";
import { Material } from "@/types";
import { create } from "zustand";

export interface IMaterialsStore {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  getMaterialById(id: Material["$id"]): Material | undefined;
}

export const useMaterialsStore = create<IMaterialsStore>((set, get) => {
  const subscribeToRealtime = () => {
    if (typeof window === "undefined") {
      return; // Exit if not in a browser environment
    }
    return client.subscribe(
      `databases.${DATABASE_ID}.collections.${MATERIALS_COLLECTION_ID}.documents`,
      (data) => {
        if (
          data.events.includes("databases.*.collections.*.documents.*.update")
        ) {
          const updatedMaterial = data.payload as Material;
          set((state) => {
            if (!state.materials) {
              return state;
            }

            const index = state.materials.findIndex(
              (d) => d.$id === updatedMaterial.$id
            );

            if (index === -1) {
              return state;
            }

            const newMaterials = [...state.materials];
            newMaterials[index] = updatedMaterial;

            return { materials: newMaterials };
          });
        }

        if (
          data.events.includes("databases.*.collections.*.documents.*.create")
        ) {
          const response = data.payload as Material;
          set((state) => ({ materials: [...state.materials, response] }));
        }
      }
    );
  };

  // Only subscribe when in a browser environment
  if (typeof window !== "undefined") {
    subscribeToRealtime(); // Call it when store initializes
  }

  return {
    materials: [],

    setMaterials: (materials) => {
      set({ materials });
    },

    getMaterialById: (id: Material["$id"]) => {
      return get().materials.find((material) => material.$id === id);
    },
  };
});
