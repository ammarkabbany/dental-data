'use client';

import { useOnboardingStore } from '@/store/onboarding-store';
import { useModalStore } from '@/store/modal-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle, Circle, MinusCircle, XIcon } from 'lucide-react'; // Added MinusCircle, XIcon
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modals } from '@/store/modal-store';

// Define a type for checklist item keys for clarity
type OnboardingStore = ReturnType<typeof useOnboardingStore.getState>;
type ChecklistItemKey = keyof OnboardingStore['checklistItems'];

const WelcomeChecklist = () => {
  const {
    isOnboardingComplete,
    checklistItems,
    skippedChecklistItems, // Added
    // completeChecklistItem, // No longer needed directly, actions trigger store updates
    skipChecklistItem, // Added
    completeOnboarding
  } = useOnboardingStore();

  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  const isChecklistDone = Object.keys(checklistItems).every(
    (key) => checklistItems[key as ChecklistItemKey] || skippedChecklistItems[key as ChecklistItemKey]
  );

  useEffect(() => {
    if (isChecklistDone && !isOnboardingComplete) {
      completeOnboarding();
    }
  }, [isChecklistDone, isOnboardingComplete, completeOnboarding]);

  if (isOnboardingComplete) {
    return null;
  }

  if (isChecklistDone) { // Handles the case where all items are done (completed or skipped) but isOnboardingComplete effect hasn't fired
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome Aboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-green-500">Onboarding Complete! You&apos;re all set.</p>
        </CardContent>
      </Card>
    );
  }

  const checklistData: Array<{
    key: ChecklistItemKey;
    title: string;
    actionText: string;
    action: () => void;
  }> = [
    {
      key: 'addedFirstDoctor',
      title: 'Add your first doctor',
      actionText: 'Add Doctor',
      action: () => openModal(Modals.CREATE_DOCTOR_MODAL),
    },
    {
      key: 'addedFirstMaterial',
      title: 'Add your first material',
      actionText: 'Add Material',
      action: () => openModal(Modals.CREATE_MATERIAL_MODAL),
    },
    {
      key: 'createdFirstCase',
      title: 'Create your first case',
      actionText: 'Create Case',
      action: () => router.push('/dashboard/cases/new'),
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Getting Started Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {checklistData.map((item) => {
            const isCompleted = checklistItems[item.key];
            const isSkipped = skippedChecklistItems[item.key];
            const canPerformAction = !isCompleted && !isSkipped;

            return (
              <li key={item.key} className="flex items-center justify-between p-3 border rounded-md bg-background/30">
                <div className="flex items-center">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  ) : isSkipped ? (
                    <MinusCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" /> // Skipped icon
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  )}
                  <span className={`${(isCompleted || isSkipped) ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {canPerformAction && (
                    <Button onClick={item.action} size="sm" variant="outline">
                      {item.actionText}
                    </Button>
                  )}
                  {canPerformAction && (
                     <Button
                        onClick={() => skipChecklistItem(item.key)}
                        size="sm"
                        variant="ghost"
                        className="p-2 h-auto" // Make it smaller for an icon-like button
                        aria-label={`Skip ${item.title}`}
                      >
                        <XIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WelcomeChecklist;
