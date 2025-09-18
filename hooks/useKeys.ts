
import { useState, useEffect } from 'react';
import { Key } from '@/types/supabase';

export function useKeys(collectionId?: string) {
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchKeys = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const url = collectionId ? `/api/collections/${collectionId}/keys?page=${page}` : `/api/keys?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch keys');
      }
      const { keys, count } = await response.json();
      setKeys(keys);
      setCount(count);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [collectionId]);

  return { keys, loading, error, count, fetchKeys };
}
