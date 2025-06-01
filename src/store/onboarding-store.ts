import { create } from 'zustand';
import { account } from '@/lib/appwrite/client';

// Define the shape of the checklist items (used for completed and skipped)
interface ChecklistStatus {
  addedFirstDoctor: boolean;
  addedFirstMaterial: boolean;
  createdFirstCase: boolean;
}

// Define the shape of the onboarding data to be persisted
export interface PersistedOnboardingState { // Exporting for potential use in tests or other specific scenarios
  isOnboardingComplete: boolean;
  checklistItems: ChecklistStatus;
  skippedChecklistItems: ChecklistStatus; // Added
  dismissedCoachmarks: {
    dashboardCaseManagement: boolean;
    dashboardDoctors: boolean;
    dashboardMaterials: boolean;
  };
  isGettingStartedSidebarHidden: boolean;
}

// Define the full state including actions
export interface OnboardingState extends PersistedOnboardingState {
  completeChecklistItem: (item: keyof ChecklistStatus) => void;
  skipChecklistItem: (item: keyof ChecklistStatus) => void; // Added
  dismissCoachmarkGroup: (group: keyof OnboardingState['dismissedCoachmarks']) => void;
  hideGettingStartedSidebar: () => void;
  showGettingStartedSidebar: () => void;
  completeOnboarding: () => void;
  setOnboardingState: (state: Partial<PersistedOnboardingState>) => void;
  hydrateOnboardingState: () => Promise<void>;
}

// Helper to get only the persisted state properties from the full state
const getPersistedState = (fullState: OnboardingState): PersistedOnboardingState => {
  const {
    isOnboardingComplete,
    checklistItems,
    skippedChecklistItems,
    dismissedCoachmarks,
    isGettingStartedSidebarHidden,
  } = fullState;
  return {
    isOnboardingComplete,
    checklistItems,
    skippedChecklistItems,
    dismissedCoachmarks,
    isGettingStartedSidebarHidden,
  };
};


const updatePrefsSafely = async (prefsData: { onboarding: PersistedOnboardingState }) => {
  try {
    const userPrefs = await account.getPrefs();
    await account.updatePrefs({
      ...userPrefs,
      ...prefsData
    });
  } catch (error) {
    console.error("Failed to update Appwrite user prefs:", error);
  }
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // Default state
  isOnboardingComplete: false,
  checklistItems: {
    addedFirstDoctor: false,
    addedFirstMaterial: false,
    createdFirstCase: false,
  },
  skippedChecklistItems: { // Added
    addedFirstDoctor: false,
    addedFirstMaterial: false,
    createdFirstCase: false,
  },
  dismissedCoachmarks: {
    dashboardCaseManagement: false,
    dashboardDoctors: false,
    dashboardMaterials: false,
  },
  isGettingStartedSidebarHidden: false,

  // Actions
  completeChecklistItem: (item) => {
    set((state) => {
      const newChecklistItems = { ...state.checklistItems, [item]: true };
      // If an item is completed, it cannot be skipped
      const newSkippedChecklistItems = { ...state.skippedChecklistItems, [item]: false };
      const newFullState = { ...get(), checklistItems: newChecklistItems, skippedChecklistItems: newSkippedChecklistItems };
      updatePrefsSafely({ onboarding: getPersistedState(newFullState) });
      return { checklistItems: newChecklistItems, skippedChecklistItems: newSkippedChecklistItems };
    });
  },

  skipChecklistItem: (item) => { // Added action
    set((state) => {
      // Cannot skip if already completed
      if (state.checklistItems[item]) {
        return {}; // No change
      }
      const newSkippedChecklistItems = { ...state.skippedChecklistItems, [item]: true };
      const newFullState = { ...get(), skippedChecklistItems: newSkippedChecklistItems };
      updatePrefsSafely({ onboarding: getPersistedState(newFullState) });
      return { skippedChecklistItems: newSkippedChecklistItems };
    });
  },

  dismissCoachmarkGroup: (group) => {
    set((state) => {
      const newDismissedCoachmarks = { ...state.dismissedCoachmarks, [group]: true };
      const newFullState = { ...get(), dismissedCoachmarks: newDismissedCoachmarks };
      updatePrefsSafely({ onboarding: getPersistedState(newFullState) });
      return { dismissedCoachmarks: newDismissedCoachmarks };
    });
  },

  hideGettingStartedSidebar: () => {
    set(() => {
      const newFullState = { ...get(), isGettingStartedSidebarHidden: true };
      updatePrefsSafely({ onboarding: getPersistedState(newFullState) });
      return { isGettingStartedSidebarHidden: true };
    });
  },

  showGettingStartedSidebar: () => {
    set(() => {
      const newFullState = { ...get(), isGettingStartedSidebarHidden: false };
      updatePrefsSafely({ onboarding: getPersistedState(newFullState) });
      return { isGettingStartedSidebarHidden: false };
    });
  },

  completeOnboarding: () => {
    set(() => {
      const newFullState = { ...get(), isOnboardingComplete: true };
      updatePrefsSafely({ onboarding: getPersistedState(newFullState) });
      return { isOnboardingComplete: true };
    });
  },

  setOnboardingState: (state) => { // Used by hydrate
    set(state);
  },

  hydrateOnboardingState: async () => {
    try {
      const user = await account.get();
      if (user.prefs && user.prefs.onboarding) {
        const persistedState = user.prefs.onboarding as Partial<PersistedOnboardingState>; // Allow partial for forward compatibility

        // Ensure all keys have defaults if not present in persistedState
        const currentDefaults = getPersistedState(useOnboardingStore.getState()); // Get current defaults for all keys

        set({
          isOnboardingComplete: persistedState.isOnboardingComplete ?? currentDefaults.isOnboardingComplete,
          checklistItems: { ...currentDefaults.checklistItems, ...persistedState.checklistItems },
          skippedChecklistItems: { ...currentDefaults.skippedChecklistItems, ...persistedState.skippedChecklistItems },
          dismissedCoachmarks: { ...currentDefaults.dismissedCoachmarks, ...persistedState.dismissedCoachmarks },
          isGettingStartedSidebarHidden: persistedState.isGettingStartedSidebarHidden ?? currentDefaults.isGettingStartedSidebarHidden,
        });
      }
    } catch (error) {
      console.error("Failed to hydrate onboarding state from Appwrite:", error);
    }
  },
}));
