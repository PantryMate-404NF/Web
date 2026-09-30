'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { MockProvider } from '@/mocks/mock-provider';
import { AuthSessionProvider } from '@/features/auth/ui/auth-session-provider';
import { useCartStore } from '@/entities/cart/model/cart-store';

function CartStoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } }),
  );

  return (
    <MockProvider>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>
          <CartStoreHydration />
          {children}
        </AuthSessionProvider>
      </QueryClientProvider>
    </MockProvider>
  );
}
