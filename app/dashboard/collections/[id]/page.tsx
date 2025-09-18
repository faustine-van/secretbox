'use client';

import { useKeys } from '@/hooks/useKeys';
import { KeyCard } from '@/components/keys/KeyCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CollectionDetailPage() {
  const params = useParams();
  const { id } = params;
  const { keys, loading, error, fetchKeys } = useKeys();

  useEffect(() => {
    if (id) {
      // I need to modify useKeys to accept a collectionId
      // fetchKeys(1, id as string);
    }
  }, [id]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Collection</h1>
        <Button>Add Key</Button>
      </div>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4">
        {keys.map((key) => (
          <KeyCard key={key.id} keyData={key} />
        ))}
      </div>
    </div>
  );
}