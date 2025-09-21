
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
    <div className="flex space-x-4 ">
      <Input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-[180px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200" />
      <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-[180px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200" />
      <Select onValueChange={setAction} value={action}>
        <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20">
          <SelectValue placeholder="Filter by action" />
        </SelectTrigger >
        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 z-[9999] shadow-lg" 
>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="all">All Actions</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="create_key">Create Key</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="reveal_key">Reveal Key</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="update_key">Update Key</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="delete_key">Delete Key</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="create_collection">Create Collection</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="update_collection">Update Collection</SelectItem>
          <SelectItem className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" value="delete_collection">Delete Collection</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleApply} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">Apply</Button>
    </div>
  );
}
