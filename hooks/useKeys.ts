
import { useState, useEffect, useCallback } from 'react';
import { Key } from '@/types/supabase';
import { useToast } from './use-toast';

type KeyCreate = {
  name: string;
  value: string;
  collection_id: string;
  key_type: string;
  expires_at?: string;
  description?: string;
};

export function useKeys(collectionId?: string) {
  const [keys, setKeys] = useState<Key[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  const fetchKeys = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = collectionId 
        ? `/api/collections/${collectionId}/keys?page=${page}` 
        : `/api/keys?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch keys');
      }
      const { keys, count } = await response.json();
      setKeys(keys);
      setCount(count);
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error fetching keys',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, toast]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async (newKeyData: KeyCreate) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKeyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create key');
      }

      const newKey = await response.json();
      setKeys((prevKeys) => [...prevKeys, newKey]);
      setCount((prevCount) => prevCount + 1);

      toast({
        title: 'Key Created',
        description: `Successfully created "${newKey.name}".`,
      });
      return newKey;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error creating key',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateKey = async (keyId: string, updatedData: Partial<KeyCreate>) => {
    const originalKeys = [...keys];
    const updatedKeys = keys.map((k) => 
      k.id === keyId ? { ...k, ...updatedData } : k
    );
    setKeys(updatedKeys);

    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update key');
      }

      const updatedKey = await response.json();
      setKeys((prevKeys) => prevKeys.map(k => k.id === keyId ? updatedKey : k));

      toast({
        title: 'Key Updated',
        description: `Successfully updated "${updatedKey.name}".`,
      });
      return updatedKey;
    } catch (err: any) {
      setKeys(originalKeys); // Revert optimistic update on error
      setError(err);
      toast({
        title: 'Error updating key',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteKey = async (keyId: string) => {
    const originalKeys = [...keys];
    const updatedKeys = keys.filter((k) => k.id !== keyId);
    setKeys(updatedKeys);
    setCount(prevCount => prevCount - 1);

    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete key');
      }

      toast({
        title: 'Key Deleted',
        description: 'The key has been permanently deleted.',
      });
    } catch (err: any) {
      setKeys(originalKeys); // Revert optimistic update on error
      setCount(prevCount => prevCount + 1);
      setError(err);
      toast({
        title: 'Error deleting key',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return { keys, isLoading, error, count, fetchKeys, createKey, updateKey, deleteKey };
}
