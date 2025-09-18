
'use client';

import { useState, useEffect } from 'react';
import { Key, Collection } from '@/types/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<{ keys: Key[]; collections: Collection[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?query=${query}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        setResults(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!results) return null;

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-lg font-bold">Keys</h3>
        {results.keys.map((key) => (
          <div key={key.id}>{key.name}</div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-bold">Collections</h3>
        {results.collections.map((collection) => (
          <div key={collection.id}>{collection.name}</div>
        ))}
      </div>
    </div>
  );
}
