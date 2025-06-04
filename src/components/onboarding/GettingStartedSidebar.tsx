'use client';

import { useOnboardingStore } from '@/store/onboarding-store';
import { useModalStore, Modals } from '@/store/modal-store';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

const GettingStartedSidebar = () => {
  const {
    isOnboardingComplete,
    isGettingStartedSidebarHidden,
    checklistItems,
    hideGettingStartedSidebar,
  } = useOnboardingStore();

  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  if (isOnboardingComplete || isGettingStartedSidebarHidden) {
    return null;
  }

  const sidebarItems = [
    {
      id: 'addedFirstDoctor',
      title: 'Add Your First Doctor',
      description: 'Create a profile for a doctor in your network.',
      isComplete: checklistItems.addedFirstDoctor,
      actionText: 'Add Doctor',
      action: () => openModal(Modals.CREATE_DOCTOR_MODAL),
    },
    {
      id: 'addedFirstMaterial',
      title: 'Add Your First Material',
      description: 'Input the details of a lab material you use.',
      isComplete: checklistItems.addedFirstMaterial,
      actionText: 'Add Material',
      action: () => openModal(Modals.CREATE_MATERIAL_MODAL),
    },
    {
      id: 'createdFirstCase',
      title: 'Create Your First Case',
      description: 'Start managing a new dental case.',
      isComplete: checklistItems.createdFirstCase,
      actionText: 'Create Case',
      action: () => router.push('/dashboard/cases/new'),
    },
  ];

  return (
    <div className="p-4 mt-6 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Getting Started</h3>
        <Button variant="ghost" size="sm" onClick={hideGettingStartedSidebar} aria-label="Hide getting started panel">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ul className="space-y-3">
        {sidebarItems.map((item) => (
          <li key={item.id} className="p-3 border rounded-md bg-background/50">
            <div className="flex items-start mb-1">
              {item.isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                {!item.isComplete && (
                   <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                )}
              </div>
            </div>
            {!item.isComplete && (
              <Button onClick={item.action} size="xs" variant="outline" className="w-full mt-1">
                {item.actionText}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GettingStartedSidebar;
