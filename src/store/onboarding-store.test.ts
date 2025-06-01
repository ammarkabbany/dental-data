import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOnboardingStore } from './onboarding-store';
import { account as appwriteAccount } from '@/lib/appwrite/client';

// Mock the Appwrite client
vi.mock('@/lib/appwrite/client', () => ({
  account: {
    updatePrefs: vi.fn().mockResolvedValue({}),
    get: vi.fn().mockResolvedValue({ prefs: {} }),
  },
}));

// Helper to get initial state, Zustand recommends this for testing outside components
const getInitialState = () => useOnboardingStore.getState();

// Helper to extract persisted state shape from full state
const extractPersistedState = (state: ReturnType<typeof getInitialState>) => {
  const {
    isOnboardingComplete,
    checklistItems,
    dismissedCoachmarks,
    isGettingStartedSidebarHidden,
  } = state;
  return {
    isOnboardingComplete,
    checklistItems,
    dismissedCoachmarks,
    isGettingStartedSidebarHidden,
  };
};


describe('useOnboardingStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    // useOnboardingStore.setState(getInitialState(), true); // This might be too aggressive if getInitialState() creates new instances of functions
    // A safer reset for Zustand if functions are stable or if state has no functions:
    const initialState = useOnboardingStore.getState();
    const defaultState = {
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
    };
    // Apply only the data properties to reset
    useOnboardingStore.setState({
        ...initialState, // keep existing functions
        ...defaultState // overwrite data properties
    }, true);


    // Clear mock history
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Ensure mocks are reset if any test modifies their behavior beyond clearAllMocks
    vi.resetAllMocks();
  });

  it('should initialize with the correct default values', () => {
    const state = useOnboardingStore.getState();
    expect(state.isOnboardingComplete).toBe(false);
    expect(state.checklistItems).toEqual({
      addedFirstDoctor: false,
      addedFirstMaterial: false,
      createdFirstCase: false,
    });
    expect(state.dismissedCoachmarks).toEqual({
      dashboardCaseManagement: false,
      dashboardDoctors: false,
      dashboardMaterials: false,
    });
    expect(state.isGettingStartedSidebarHidden).toBe(false);
  });

  describe('Actions', () => {
    it('completeChecklistItem should update checklist and call updatePrefs', async () => {
      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { completeChecklistItem } = useOnboardingStore.getState();

      completeChecklistItem('addedFirstDoctor');

      const state = useOnboardingStore.getState();
      expect(state.checklistItems.addedFirstDoctor).toBe(true);

      const expectedPrefsPayload = {
        onboarding: {
          ...initialPersistedState,
          checklistItems: { ...initialPersistedState.checklistItems, addedFirstDoctor: true },
        },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('calling completeChecklistItem for all items then completeOnboarding updates isOnboardingComplete and calls updatePrefs for each', () => {
      const { completeChecklistItem, completeOnboarding } = useOnboardingStore.getState();

      completeChecklistItem('addedFirstDoctor');
      completeChecklistItem('addedFirstMaterial');
      completeChecklistItem('createdFirstCase');
      completeOnboarding();

      const state = useOnboardingStore.getState();
      expect(state.isOnboardingComplete).toBe(true);
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledTimes(4);
    });

    it('dismissCoachmarkGroup should update dismissedCoachmarks and call updatePrefs', async () => {
      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { dismissCoachmarkGroup } = useOnboardingStore.getState();

      dismissCoachmarkGroup('dashboardDoctors');

      const state = useOnboardingStore.getState();
      expect(state.dismissedCoachmarks.dashboardDoctors).toBe(true);

      const expectedPrefsPayload = {
        onboarding: {
          ...initialPersistedState,
          dismissedCoachmarks: { ...initialPersistedState.dismissedCoachmarks, dashboardDoctors: true },
        },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('hideGettingStartedSidebar should update state and call updatePrefs', async () => {
      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { hideGettingStartedSidebar } = useOnboardingStore.getState();

      hideGettingStartedSidebar();

      const state = useOnboardingStore.getState();
      expect(state.isGettingStartedSidebarHidden).toBe(true);

      const expectedPrefsPayload = {
        onboarding: { ...initialPersistedState, isGettingStartedSidebarHidden: true },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('showGettingStartedSidebar should update state and call updatePrefs', async () => {
      useOnboardingStore.getState().hideGettingStartedSidebar(); // Setup: hide first
      vi.clearAllMocks(); // Clear mocks from setup action

      const initialPersistedState = extractPersistedState(useOnboardingStore.getState()); // isGettingStartedSidebarHidden is true
      const { showGettingStartedSidebar } = useOnboardingStore.getState();

      showGettingStartedSidebar();

      const state = useOnboardingStore.getState();
      expect(state.isGettingStartedSidebarHidden).toBe(false);

      const expectedPrefsPayload = {
         onboarding: { ...initialPersistedState, isGettingStartedSidebarHidden: false },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('completeOnboarding should update state and call updatePrefs', async () => {
      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { completeOnboarding } = useOnboardingStore.getState();

      completeOnboarding();

      const state = useOnboardingStore.getState();
      expect(state.isOnboardingComplete).toBe(true);

      const expectedPrefsPayload = {
        onboarding: { ...initialPersistedState, isOnboardingComplete: true },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('setOnboardingState should update the store with partial state without calling updatePrefs', () => {
      const { setOnboardingState } = useOnboardingStore.getState();
      const partialState = {
        isOnboardingComplete: true,
        checklistItems: {
          addedFirstDoctor: true,
          addedFirstMaterial: false, // This one is false
          createdFirstCase: true,
        },
        // Not including dismissedCoachmarks or isGettingStartedSidebarHidden
      };

      setOnboardingState(partialState as any); // Cast as any because it's a partial of PersistedOnboardingState

      const state = useOnboardingStore.getState();
      expect(state.isOnboardingComplete).toBe(true);
      expect(state.checklistItems.addedFirstDoctor).toBe(true);
      expect(state.checklistItems.addedFirstMaterial).toBe(false);
      expect(state.checklistItems.createdFirstCase).toBe(true);
      // Ensure other parts of state are not affected if not included in partial state
      expect(state.dismissedCoachmarks.dashboardCaseManagement).toBe(false);
      expect(state.isGettingStartedSidebarHidden).toBe(false);
      expect(appwriteAccount.updatePrefs).not.toHaveBeenCalled();
    });
  });

  describe('Hydration', () => {
    it('hydrateOnboardingState should call account.get and update state if prefs.onboarding exists', async () => {
      const persistedData = { // This is PersistedOnboardingState
        isOnboardingComplete: true,
        checklistItems: { addedFirstDoctor: true, addedFirstMaterial: true, createdFirstCase: false },
        dismissedCoachmarks: { dashboardCaseManagement: true, dashboardDoctors: false, dashboardMaterials: false },
        isGettingStartedSidebarHidden: true,
      };
      (appwriteAccount.get as vi.Mock).mockResolvedValueOnce({ prefs: { onboarding: persistedData } });

      await useOnboardingStore.getState().hydrateOnboardingState();

      expect(appwriteAccount.get).toHaveBeenCalledTimes(1);

      const state = useOnboardingStore.getState();
      expect(state.isOnboardingComplete).toBe(persistedData.isOnboardingComplete);
      expect(state.checklistItems).toEqual(persistedData.checklistItems);
      expect(state.dismissedCoachmarks).toEqual(persistedData.dismissedCoachmarks);
      expect(state.isGettingStartedSidebarHidden).toBe(persistedData.isGettingStartedSidebarHidden);
    });

    it('hydrateOnboardingState should not update state if prefs.onboarding does not exist', async () => {
      (appwriteAccount.get as vi.Mock).mockResolvedValueOnce({ prefs: {} }); // No onboarding key

      // Capture initial data properties
      const initialDataState = extractPersistedState(useOnboardingStore.getState());

      await useOnboardingStore.getState().hydrateOnboardingState();

      expect(appwriteAccount.get).toHaveBeenCalledTimes(1);
      const finalDataState = extractPersistedState(useOnboardingStore.getState());

      expect(finalDataState).toEqual(initialDataState);
    });

     it('hydrateOnboardingState should handle errors during account.get gracefully', async () => {
      (appwriteAccount.get as vi.Mock).mockRejectedValueOnce(new Error("Appwrite error"));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const initialDataState = extractPersistedState(useOnboardingStore.getState());

      await useOnboardingStore.getState().hydrateOnboardingState();

      expect(appwriteAccount.get).toHaveBeenCalledTimes(1);
      const finalDataState = extractPersistedState(useOnboardingStore.getState());

      expect(finalDataState).toEqual(initialDataState); // State should remain unchanged
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to hydrate onboarding state from Appwrite:", expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});
