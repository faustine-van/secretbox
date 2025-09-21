
import { useState, useEffect, useCallback } from 'react';
import { Collection } from '@/types/supabase';
import { useToast } from './use-toast';

export function useCollection(collectionId: string) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCollection = useCallback(async () => {
    if (!collectionId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/collections/${collectionId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch collection');
      }
      const data = await response.json();
      setCollection(data);
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error fetching collection',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, toast]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { collection, isLoading, error, fetchCollection };
}
