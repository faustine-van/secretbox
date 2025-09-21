
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface AuditFiltersProps {
  onApplyFilters: (filters: { startDate?: string, endDate?: string, action?: string }) => void;
}

export function AuditFilters({ onApplyFilters }: AuditFiltersProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [action, setAction] = useState('');

  const handleApply = () => {
    onApplyFilters({ startDate, endDate, action: action === 'all' ? undefined : action });
  };

  return (
    <div className="flex space-x-4">
      <Input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <Select onValueChange={setAction} value={action}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          <SelectItem value="create_key">Create Key</SelectItem>
          <SelectItem value="reveal_key">Reveal Key</SelectItem>
          <SelectItem value="update_key">Update Key</SelectItem>
          <SelectItem value="delete_key">Delete Key</SelectItem>
          <SelectItem value="create_collection">Create Collection</SelectItem>
          <SelectItem value="update_collection">Update Collection</SelectItem>
          <SelectItem value="delete_collection">Delete Collection</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
}
