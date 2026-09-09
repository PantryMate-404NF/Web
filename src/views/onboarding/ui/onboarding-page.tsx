import { Suspense } from 'react';

import { OnboardingFlow } from '@/features/onboarding/ui/onboarding-flow';

export function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingFlow />
    </Suspense>
  );
}
