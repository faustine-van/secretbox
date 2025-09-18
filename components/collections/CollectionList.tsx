
'use client';

import { useCollections } from '@/hooks/useCollections';
import { CollectionCard } from './CollectionCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function CollectionList() {
  const { collections, loading, error } = useCollections();

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Collections</h1>
          <Button>Add Collection</Button>
        </div>
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
