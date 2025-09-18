
'use client';

import { useKeySearch } from '@/hooks/useKeySearch';
import { KeyCard } from './KeyCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function KeyList() {
  const { keys, loading, error, count, query, setQuery, searchKeys } = useKeySearch();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Keys</h1>
        <Button>Add Key</Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search keys..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4">
        {keys.map((key) => (
          <KeyCard key={key.id} keyData={key} />
        ))}
      </div>
      {/* Pagination controls */}
    </div>
  );
}
