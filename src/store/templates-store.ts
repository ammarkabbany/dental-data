import { client } from "@/lib/appwrite/client";
import { DATABASE_ID } from "@/lib/constants";
import { Template } from "@/types";
import { create } from "zustand";

interface ITemplatesStore {
  templates: Template[];
  totalTemplates: number;
  setTemplates: (templates: Template[]) => void;
  getTemplateById: (id: Template["$id"]) => Template | undefined;
 
  recentTemplates: string[];
  addRecentTemplate: (id: Template['$id']) => void;
  favoriteTemplates: string[]; // temp
  toggleFavorite: (template: Template) => void; // Add/remove template to favorites
  currentTemplate: Template | undefined;
  applyTemplate: (template: Template | undefined) => void;
}

export const useTemplatesStore = create<ITemplatesStore>((set, get) => {
  const subscribeToRealtime = () => {
    return client.subscribe(`databases.${DATABASE_ID}.collections.case_templates.documents`, (data) => {

      if (data.events.includes("databases.*.collections.*.documents.*.update")) {
        const response = data.payload as Template
        set((state) => {
          if (!state.templates) {
            return state;
          }
  
          const index = state.templates.findIndex((d) => d.$id === response.$id);
  
          if (index === -1) {
            return state;
          }
  
          const newList = [...state.templates];
          newList[index] = response;
  
          return { templates: newList };
        })
      }

      if (data.events.includes("databases.*.collections.*.documents.*.create")) {
        const response = data.payload as Template
        set((state) => ({ templates: [...state.templates, response]}));
      }

      if (data.events.includes("databases.*.collections.*.documents.*.delete")) {
        const response = data.payload as Template
        const templateId = response.$id;
        const templates = get().templates;
        set((state) => ({
          templates: state.templates.filter((t) => t.$id !== templateId),
        }))
        // check if its in favorite and recent
        const filteredRecents = get().recentTemplates.filter(t => {
          return t!== templateId;
        })
        const filteredFavorites = get().favoriteTemplates.filter(t => {
          return t!== templateId;
        })
        localStorage.setItem("recentTemplates", JSON.stringify(filteredRecents));
        localStorage.setItem("favoriteTemplates", JSON.stringify(filteredFavorites));
        set({recentTemplates: filteredRecents})
        set({favoriteTemplates: filteredFavorites})
        // set((state) => {
        //   const favoriteTemplates = get().favoriteTemplates;
        //   const isFavorite = favoriteTemplates.includes(templateId)
        //   if (isFavorite) {
        //     const template = templates.find(t => t.$id === templateId);
        //     if (!template) return state
        //     state.toggleFavorite(template);
        //   }
        //   const filteredFavorites = favoriteTemplates.filter(t => {
        //     return t!== templateId;
        //   })
        //   return {favoriteTemplates: filteredFavorites}
        // })
      }
    });
  };
  
  // Only subscribe when in a browser environment
  if (typeof window !== 'undefined') {
    subscribeToRealtime(); // Call it when store initializes
  }

  const storedRecents =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("recentTemplates") || "[]")
      : [];

  const storedFavorites =
    typeof window!== "undefined"
    ? JSON.parse(localStorage.getItem("favoriteTemplates") || "[]")
    : [];

  return {
    templates: [],
    recentTemplates: storedRecents, // Load stored recents
    favoriteTemplates: storedFavorites,
    toggleFavorite: (template: Template) => {
      const favoriteTemplates = get().favoriteTemplates;
      const isFavorite = favoriteTemplates.includes(template.$id);
      if (isFavorite) {
        set((state) => {
          const updatedFavorites = favoriteTemplates.filter(
            (t) => t!== template.$id
          );
          localStorage.setItem("favoriteTemplates", JSON.stringify(updatedFavorites));
          return { favoriteTemplates: updatedFavorites };
        });
      } else {
        set((state) => {
          const updatedFavorites = [...favoriteTemplates, template.$id];
          localStorage.setItem("favoriteTemplates", JSON.stringify(updatedFavorites));
          return { favoriteTemplates: updatedFavorites };
        });
      }
    },
    currentTemplate: undefined,
    applyTemplate: (template) => {
      set({ currentTemplate: template });
    },
    addRecentTemplate: (id) =>
      set((state) => {
        // Remove duplicates & limit to 5
        const updatedRecents = [
          id,
          ...state.recentTemplates.filter((t) => t !== id),
        ].slice(0, 5);

        // Save to localStorage
        localStorage.setItem("recentTemplates", JSON.stringify(updatedRecents));

        return { recentTemplates: updatedRecents };
      }),
    totalTemplates: 0,
    setTemplates: (templates) => {
      set({ templates, totalTemplates: templates.length });
    },
    getTemplateById: (id: Template["$id"]) => {
      return get().templates.find((template) => template.$id === id);
    },
  };
});
