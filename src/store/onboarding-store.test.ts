import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOnboardingStore, OnboardingState, PersistedOnboardingState } from './onboarding-store'; // Import interfaces
import { account as appwriteAccount } from '@/lib/appwrite/client';

// Mock the Appwrite client
vi.mock('@/lib/appwrite/client', () => ({
  account: {
    updatePrefs: vi.fn().mockResolvedValue({}),
    get: vi.fn().mockResolvedValue({ prefs: {} }),
  },
}));

// Helper to get initial data state for reset, matching PersistedOnboardingState
const getDefaultPersistedState = (): PersistedOnboardingState => ({
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
});

// Helper to extract persisted state shape from full state
const extractPersistedState = (state: OnboardingState): PersistedOnboardingState => {
  const {
    isOnboardingComplete,
    checklistItems,
    skippedChecklistItems, // Added
    dismissedCoachmarks,
    isGettingStartedSidebarHidden,
  } = state;
  return {
    isOnboardingComplete,
    checklistItems,
    skippedChecklistItems, // Added
    dismissedCoachmarks,
    isGettingStartedSidebarHidden,
  };
};


describe('useOnboardingStore', () => {
  beforeEach(() => {
    // Reset the store to its initial data state before each test
    // This preserves actions but resets data properties.
    useOnboardingStore.setState({
        ...useOnboardingStore.getState(), // Keep existing functions from initial create()
        ...getDefaultPersistedState() // Overwrite data properties with defaults
    }, true);

    // Clear mock history
    vi.clearAllMocks();
  });

  afterEach(() => {
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
    expect(state.skippedChecklistItems).toEqual({ // Added check
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
    it('completeChecklistItem should update checklist, reset skipped, and call updatePrefs', async () => {
      // First, skip the item
      useOnboardingStore.getState().skipChecklistItem('addedFirstDoctor');
      vi.clearAllMocks(); // Clear mocks from skip action

      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      expect(initialPersistedState.skippedChecklistItems.addedFirstDoctor).toBe(true); // Pre-condition

      const { completeChecklistItem } = useOnboardingStore.getState();
      completeChecklistItem('addedFirstDoctor');

      const state = useOnboardingStore.getState();
      expect(state.checklistItems.addedFirstDoctor).toBe(true);
      expect(state.skippedChecklistItems.addedFirstDoctor).toBe(false); // Should be reset

      const expectedPrefsPayload = {
        onboarding: {
          ...initialPersistedState,
          checklistItems: { ...initialPersistedState.checklistItems, addedFirstDoctor: true },
          skippedChecklistItems: { ...initialPersistedState.skippedChecklistItems, addedFirstDoctor: false },
        },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('skipChecklistItem should update skippedChecklistItems and call updatePrefs', async () => {
      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { skipChecklistItem } = useOnboardingStore.getState();

      skipChecklistItem('addedFirstMaterial');

      const state = useOnboardingStore.getState();
      expect(state.skippedChecklistItems.addedFirstMaterial).toBe(true);
      expect(state.checklistItems.addedFirstMaterial).toBe(false); // Should not complete it

      const expectedPrefsPayload = {
        onboarding: {
          ...initialPersistedState,
          skippedChecklistItems: { ...initialPersistedState.skippedChecklistItems, addedFirstMaterial: true },
        },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('skipChecklistItem should not update if item is already completed', () => {
      useOnboardingStore.getState().completeChecklistItem('createdFirstCase');
      vi.clearAllMocks();

      const { skipChecklistItem } = useOnboardingStore.getState();
      skipChecklistItem('createdFirstCase');

      const state = useOnboardingStore.getState();
      expect(state.skippedChecklistItems.createdFirstCase).toBe(false); // Still false, because it was completed
      expect(appwriteAccount.updatePrefs).not.toHaveBeenCalled();
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

      const expectedPrefsPayload = {
        onboarding: { ...initialPersistedState, isGettingStartedSidebarHidden: true },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('showGettingStartedSidebar should update state and call updatePrefs', async () => {
      useOnboardingStore.getState().hideGettingStartedSidebar();
      vi.clearAllMocks();

      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { showGettingStartedSidebar } = useOnboardingStore.getState();

      showGettingStartedSidebar();

      const expectedPrefsPayload = {
         onboarding: { ...initialPersistedState, isGettingStartedSidebarHidden: false },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('completeOnboarding should update state and call updatePrefs', async () => {
      const initialPersistedState = extractPersistedState(useOnboardingStore.getState());
      const { completeOnboarding } = useOnboardingStore.getState();

      completeOnboarding();

      const expectedPrefsPayload = {
        onboarding: { ...initialPersistedState, isOnboardingComplete: true },
      };
      expect(appwriteAccount.updatePrefs).toHaveBeenCalledWith(expectedPrefsPayload);
    });

    it('setOnboardingState should update the store with partial state without calling updatePrefs', () => {
      const { setOnboardingState } = useOnboardingStore.getState();
      const partialState: Partial<PersistedOnboardingState> = { // Type explicitly
        isOnboardingComplete: true,
        checklistItems: {
          addedFirstDoctor: true,
          addedFirstMaterial: false,
          createdFirstCase: true,
        },
        skippedChecklistItems: { // Added
          addedFirstDoctor: false,
          addedFirstMaterial: true,
          createdFirstCase: false,
        }
      };

      setOnboardingState(partialState);

      const state = useOnboardingStore.getState();
      expect(state.isOnboardingComplete).toBe(true);
      expect(state.checklistItems.addedFirstDoctor).toBe(true);
      expect(state.skippedChecklistItems.addedFirstMaterial).toBe(true);
      expect(state.dismissedCoachmarks.dashboardCaseManagement).toBe(false);
      expect(appwriteAccount.updatePrefs).not.toHaveBeenCalled();
    });
  });

  describe('Hydration', () => {
    it('hydrateOnboardingState should call account.get and update state if prefs.onboarding exists, including skipped items', async () => {
      const persistedData: PersistedOnboardingState = {
        isOnboardingComplete: true,
        checklistItems: { addedFirstDoctor: true, addedFirstMaterial: true, createdFirstCase: false },
        skippedChecklistItems: { addedFirstDoctor: false, addedFirstMaterial: false, createdFirstCase: true }, // Added
        dismissedCoachmarks: { dashboardCaseManagement: true, dashboardDoctors: false, dashboardMaterials: false },
        isGettingStartedSidebarHidden: true,
      };
      (appwriteAccount.get as vi.Mock).mockResolvedValueOnce({ prefs: { onboarding: persistedData } });

      await useOnboardingStore.getState().hydrateOnboardingState();

      expect(appwriteAccount.get).toHaveBeenCalledTimes(1);

      const state = useOnboardingStore.getState();
      expect(state.isOnboardingComplete).toBe(persistedData.isOnboardingComplete);
      expect(state.checklistItems).toEqual(persistedData.checklistItems);
      expect(state.skippedChecklistItems).toEqual(persistedData.skippedChecklistItems); // Added check
      expect(state.dismissedCoachmarks).toEqual(persistedData.dismissedCoachmarks);
      expect(state.isGettingStartedSidebarHidden).toBe(persistedData.isGettingStartedSidebarHidden);
    });

    it('hydrateOnboardingState should initialize skippedChecklistItems if not in prefs', async () => {
      const persistedDataOldFormat = { // Missing skippedChecklistItems
        isOnboardingComplete: true,
        checklistItems: { addedFirstDoctor: true, addedFirstMaterial: true, createdFirstCase: false },
        dismissedCoachmarks: { dashboardCaseManagement: true, dashboardDoctors: false, dashboardMaterials: false },
        isGettingStartedSidebarHidden: true,
      };
      (appwriteAccount.get as vi.Mock).mockResolvedValueOnce({ prefs: { onboarding: persistedDataOldFormat } });

      await useOnboardingStore.getState().hydrateOnboardingState();

      const state = useOnboardingStore.getState();
      expect(state.skippedChecklistItems).toEqual({ // Should be initialized to defaults
        addedFirstDoctor: false,
        addedFirstMaterial: false,
        createdFirstCase: false,
      });
      expect(state.isOnboardingComplete).toBe(true); // Other data should still load
    });

    it('hydrateOnboardingState should not update state if prefs.onboarding does not exist', async () => {
      (appwriteAccount.get as vi.Mock).mockResolvedValueOnce({ prefs: {} });
      const initialDataState = extractPersistedState(useOnboardingStore.getState());
      await useOnboardingStore.getState().hydrateOnboardingState();
      const finalDataState = extractPersistedState(useOnboardingStore.getState());
      expect(finalDataState).toEqual(initialDataState);
    });

     it('hydrateOnboardingState should handle errors during account.get gracefully', async () => {
      (appwriteAccount.get as vi.Mock).mockRejectedValueOnce(new Error("Appwrite error"));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const initialDataState = extractPersistedState(useOnboardingStore.getState());
      await useOnboardingStore.getState().hydrateOnboardingState();
      const finalDataState = extractPersistedState(useOnboardingStore.getState());
      expect(finalDataState).toEqual(initialDataState);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to hydrate onboarding state from Appwrite:", expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
