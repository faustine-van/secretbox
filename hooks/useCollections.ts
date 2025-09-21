
import { useState, useEffect, useCallback } from 'react';
import { Collection } from '@/types/supabase';
import { useToast } from './use-toast';

type CollectionCreate = {
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
};

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const refreshCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch collections');
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
    refreshCollections();
  }, [refreshCollections]);

  const createCollection = async (newCollectionData: CollectionCreate) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collection');
      }

      const newCollection = await response.json();
      setCollections((prevCollections) => [...prevCollections, newCollection]);
      
      toast({
        title: 'Collection Created',
        description: `Successfully created "${newCollection.name}".`,
      });
      return newCollection;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error creating collection',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateCollection = async (collectionId: string, updatedData: Partial<CollectionCreate>) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update collection');
      }

      const updatedCollection = await response.json();
      setCollections((prevCollections) =>
        prevCollections.map((c) => (c.id === collectionId ? updatedCollection : c))
      );

      toast({
        title: 'Collection Updated',
        description: `Successfully updated "${updatedCollection.name}".`,
      });
      return updatedCollection;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error updating collection',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete collection');
      }

      setCollections((prevCollections) => prevCollections.filter((c) => c.id !== collectionId));

      toast({
        title: 'Collection Deleted',
        description: 'The collection has been successfully deleted.',
      });
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error deleting collection',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return { collections, isLoading, error, refreshCollections, createCollection, updateCollection, deleteCollection };
}
