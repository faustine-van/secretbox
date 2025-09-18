
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ApplicationSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold">Application Settings</h2>
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold">Default View</h3>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select default view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
