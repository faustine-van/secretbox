
import { useSession } from './useSession';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useProtectedRoute() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  return session;
}
