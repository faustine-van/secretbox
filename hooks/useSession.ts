
import { useAuth } from './useAuth';

export function useSession() {
  const { session } = useAuth();
  return session;
}
