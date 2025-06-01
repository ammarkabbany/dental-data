import { create } from 'zustand';
import { account } from '@/lib/appwrite/client'; // Changed from appwrite to client

// Define the shape of the onboarding data to be persisted
interface PersistedOnboardingState {
  isOnboardingComplete: boolean;
  checklistItems: {
    addedFirstDoctor: boolean;
    addedFirstMaterial: boolean;
    createdFirstCase: boolean;
  };
  dismissedCoachmarks: {
    dashboardCaseManagement: boolean;
    dashboardDoctors: boolean;
    dashboardMaterials: boolean;
  };
  isGettingStartedSidebarHidden: boolean;
}

interface OnboardingState extends PersistedOnboardingState {
  completeChecklistItem: (item: keyof OnboardingState['checklistItems']) => void;
  dismissCoachmarkGroup: (group: keyof OnboardingState['dismissedCoachmarks']) => void;
  hideGettingStartedSidebar: () => void;
  showGettingStartedSidebar: () => void;
  completeOnboarding: () => void;
  setOnboardingState: (state: Partial<PersistedOnboardingState>) => void; // Use PersistedOnboardingState
  hydrateOnboardingState: () => Promise<void>;
}

const updatePrefsSafely = async (prefsData: { onboarding: PersistedOnboardingState }) => {
  try {
    await account.updatePrefs(prefsData);
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
  dismissedCoachmarks: {
    dashboardCaseManagement: false,
    dashboardDoctors: false,
    dashboardMaterials: false,
  },
  isGettingStartedSidebarHidden: false,

  // Actions
  completeChecklistItem: (item) => {
    set((state) => {
      const newState = {
        ...state.checklistItems,
        [item]: true,
      };
      const persistedState = {
        ...get(), // get current full state
        checklistItems: newState,
      };
      // remove action functions before persisting
      const { completeChecklistItem, dismissCoachmarkGroup, hideGettingStartedSidebar, showGettingStartedSidebar, completeOnboarding, setOnboardingState, hydrateOnboardingState, ...restOfState } = persistedState;
      updatePrefsSafely({ onboarding: restOfState });
      return { checklistItems: newState };
    });
  },

  dismissCoachmarkGroup: (group) => {
    set((state) => {
      const newState = {
        ...state.dismissedCoachmarks,
        [group]: true,
      };
      const persistedState = {
        ...get(),
        dismissedCoachmarks: newState,
      };
      const { completeChecklistItem, dismissCoachmarkGroup, hideGettingStartedSidebar, showGettingStartedSidebar, completeOnboarding, setOnboardingState, hydrateOnboardingState, ...restOfState } = persistedState;
      updatePrefsSafely({ onboarding: restOfState });
      return { dismissedCoachmarks: newState };
    });
  },

  hideGettingStartedSidebar: () => {
    set(() => {
      const persistedState = {
        ...get(),
        isGettingStartedSidebarHidden: true,
      };
      const { completeChecklistItem, dismissCoachmarkGroup, hideGettingStartedSidebar, showGettingStartedSidebar, completeOnboarding, setOnboardingState, hydrateOnboardingState, ...restOfState } = persistedState;
      updatePrefsSafely({ onboarding: restOfState });
      return { isGettingStartedSidebarHidden: true };
    });
  },

  showGettingStartedSidebar: () => {
    set(() => {
      const persistedState = {
        ...get(),
        isGettingStartedSidebarHidden: false,
      };
      const { completeChecklistItem, dismissCoachmarkGroup, hideGettingStartedSidebar, showGettingStartedSidebar, completeOnboarding, setOnboardingState, hydrateOnboardingState, ...restOfState } = persistedState;
      updatePrefsSafely({ onboarding: restOfState });
      return { isGettingStartedSidebarHidden: false };
    });
  },

  completeOnboarding: () => {
    set(() => {
      const persistedState = {
        ...get(),
        isOnboardingComplete: true,
      };
      const { completeChecklistItem, dismissCoachmarkGroup, hideGettingStartedSidebar, showGettingStartedSidebar, completeOnboarding, setOnboardingState, hydrateOnboardingState, ...restOfState } = persistedState;
      updatePrefsSafely({ onboarding: restOfState });
      return { isOnboardingComplete: true };
    });
  },

  setOnboardingState: (state) => {
    set(state); // This action is for internal use by hydrate, no need to call updatePrefs again
  },

  hydrateOnboardingState: async () => {
    try {
      const user = await account.get();
      if (user.prefs && user.prefs.onboarding) {
        // Ensure that the loaded state conforms to PersistedOnboardingState
        const persistedState = user.prefs.onboarding as PersistedOnboardingState;
        set((currentState) => ({
          ...currentState,
          isOnboardingComplete: persistedState.isOnboardingComplete,
          checklistItems: persistedState.checklistItems,
          dismissedCoachmarks: persistedState.dismissedCoachmarks,
          isGettingStartedSidebarHidden: persistedState.isGettingStartedSidebarHidden,
        }));
      }
    } catch (error) {
      console.error("Failed to hydrate onboarding state from Appwrite:", error);
    }
  },
}));
