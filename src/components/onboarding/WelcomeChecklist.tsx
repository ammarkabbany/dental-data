'use client';

import { useOnboardingStore } from '@/store/onboarding-store';
import { useModalStore } from '@/store/modal-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react'; // Assuming lucide-react is installed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modals } from '@/store/modal-store'; // Corrected import path for Modals

const WelcomeChecklist = () => {
  const {
    isOnboardingComplete,
    checklistItems,
    completeChecklistItem,
    completeOnboarding
  } = useOnboardingStore();

  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  const allItemsComplete = Object.values(checklistItems).every(Boolean);

  useEffect(() => {
    if (allItemsComplete && !isOnboardingComplete) {
      completeOnboarding();
    }
  }, [allItemsComplete, isOnboardingComplete, completeOnboarding]);

  if (isOnboardingComplete) {
    return null;
  }

  // If all items are complete, but onboarding isn't marked complete yet (effect will handle it)
  // Optionally, show a message here or let the component hide.
  if (allItemsComplete) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome Aboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-green-500">Onboarding Complete! You're all set.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Getting Started Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {/* Add your first doctor */}
          <li className="flex items-center justify-between">
            <div className="flex items-center">
              {checklistItems.addedFirstDoctor ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span>Add your first doctor</span>
            </div>
            {!checklistItems.addedFirstDoctor && (
              <Button onClick={() => openModal(Modals.CREATE_DOCTOR_MODAL)} size="sm">
                Add Doctor
              </Button>
            )}
          </li>

          {/* Add your first material */}
          <li className="flex items-center justify-between">
            <div className="flex items-center">
              {checklistItems.addedFirstMaterial ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span>Add your first material</span>
            </div>
            {!checklistItems.addedFirstMaterial && (
              <Button onClick={() => openModal(Modals.CREATE_MATERIAL_MODAL)} size="sm">
                Add Material
              </Button>
            )}
          </li>

          {/* Create your first case */}
          <li className="flex items-center justify-between">
            <div className="flex items-center">
              {checklistItems.createdFirstCase ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span>Create your first case</span>
            </div>
            {!checklistItems.createdFirstCase && (
              <Button onClick={() => router.push('/dashboard/cases/new')} size="sm">
                Create Case
              </Button>
            )}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default WelcomeChecklist;
