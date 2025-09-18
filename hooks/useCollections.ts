
import { useState, useEffect, useCallback } from 'react';
import { Collection } from '@/types/supabase';
import { useToast } from './use-toast';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error fetching collections',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, isLoading, error, fetchCollections };
}
