
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchResults } from './SearchResults';
import { useDebounce } from '@/hooks/useDebounce';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  return (
    <div>
      <Input
        placeholder="Search everything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {debouncedQuery && <SearchResults query={debouncedQuery} />}
    </div>
  );
}
