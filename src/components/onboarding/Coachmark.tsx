'use client';

import { useOnboardingStore } from '@/store/onboarding-store';
// Define the specific keys for coachmarkId directly
// This avoids needing to export OnboardingState from the store if not desired for other reasons.
type CoachmarkId = 'dashboardCaseManagement' | 'dashboardDoctors' | 'dashboardMaterials';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import React from 'react';

interface CoachmarkProps {
  coachmarkId: CoachmarkId;
  title: string;
  description: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Coachmark: React.FC<CoachmarkProps> = ({
  coachmarkId,
  title,
  description,
  children,
  position = 'bottom',
}) => {
  const { isOnboardingComplete, dismissedCoachmarks, dismissCoachmarkGroup } = useOnboardingStore();

  if (isOnboardingComplete || dismissedCoachmarks[coachmarkId]) {
    return <>{children}</>;
  }

  const handleDismiss = () => {
    dismissCoachmarkGroup(coachmarkId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={position}
        className="w-64 sm:w-80 z-50" // Added z-index for visibility
        onInteractOutside={(e) => e.preventDefault()} // Keep open until explicitly closed
      >
        <div className="p-4">
          <h4 className="font-semibold text-lg mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Button onClick={handleDismiss} className="w-full" size="sm">
            Got it
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Coachmark;
