
import { useState, useEffect } from 'react';
import { Key } from '@/types/supabase';
import { useDebounce } from '@/hooks/useDebounce';

export function useKeySearch(collectionId?: string) {
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const searchKeys = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/keys/search?query=${debouncedQuery}&page=${page}`;
      if (collectionId) {
        url += `&collectionId=${collectionId}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search keys');
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
    searchKeys();
  }, [debouncedQuery]);

  return { keys, loading, error, count, query, setQuery, searchKeys };
}
