import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends ComponentProps<'div'> {
  animated?: boolean;
}

export function getSkeletonClassName(animated = false) {
  return animated ? 'skeleton skeleton--animated' : 'skeleton';
}

/**
 * Shared loading placeholder. The gradient and its direction come directly
 * from the approved Figma skeleton node; it is intentionally static.
 */
export function Skeleton({ animated = false, className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(getSkeletonClassName(animated), className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
