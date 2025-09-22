// In hooks/useProtectedRoute.ts

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/profile', '/settings', '/vault'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If the client-side user state becomes null, redirect to the login page.
    if (!loading && !user && isProtectedRoute) {
      router.push('/login');
    }

    // If the user is authenticated and is on an auth page, redirect to the dashboard.
    if (!loading && user && (pathname === '/login' || pathname === '/register')) {
      router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);
};