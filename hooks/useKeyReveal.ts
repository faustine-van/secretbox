
import { useState } from 'react';

export function useKeyReveal(keyId: string) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revealKey = async (masterPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/keys/${keyId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ masterPassword }),
        });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.message || 'Failed to reveal key');
      }
      const { value } = await response.json();
      setRevealedValue(value);

      setTimeout(() => {
        setRevealedValue(null);
      }, 30000); // Auto-hide after 30 seconds
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { revealedValue, loading, error, revealKey };
}
