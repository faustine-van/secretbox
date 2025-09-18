
'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SearchFilters() {
  return (
    <div className="flex space-x-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="key">Key</SelectItem>
          <SelectItem value="collection">Collection</SelectItem>
        </SelectContent>
      </Select>
      <Button>Apply</Button>
    </div>
  );
}
