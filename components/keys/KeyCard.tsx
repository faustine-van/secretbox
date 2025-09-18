
'use client';

import { Key } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useKeyReveal } from '@/hooks/useKeyReveal';
import { KeyReveal } from './KeyReveal';
import { useState } from 'react';

interface KeyCardProps {
  keyData: Key;
}

export function KeyCard({ keyData }: KeyCardProps) {
  const [showReveal, setShowReveal] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{keyData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{keyData.key_type}</p>
            <p className="text-sm text-muted-foreground">Last accessed: {keyData.last_accessed_at ? new Date(keyData.last_accessed_at).toLocaleDateString() : 'Never'}</p>
          </div>
          <div>
            <Button variant="outline" size="sm" onClick={() => setShowReveal(true)}>Reveal</Button>
          </div>
        </div>
        {showReveal && <KeyReveal keyId={keyData.id} onClose={() => setShowReveal(false)} />}
      </CardContent>
    </Card>
  );
}
