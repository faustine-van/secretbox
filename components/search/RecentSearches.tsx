
'use client';

import { useState, useEffect } from 'react';

export function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const searches = localStorage.getItem('recentSearches');
    if (searches) {
      setRecentSearches(JSON.parse(searches));
    }
  }, []);

  const addSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <div>
      <h3 className="text-lg font-bold">Recent Searches</h3>
      <ul>
        {recentSearches.map((search) => (
          <li key={search}>{search}</li>
        ))}
      </ul>
    </div>
  );
}
