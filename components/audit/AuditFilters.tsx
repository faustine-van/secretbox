
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AuditFilters() {
  return (
    <div className="flex space-x-4">
      <Input type="date" placeholder="Start Date" />
      <Input type="date" placeholder="End Date" />
      <Button>Apply</Button>
    </div>
  );
}
