import React from 'react';
import { Collection } from '@/types/supabase';
import { FolderKanban, Key, MoreVertical } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-4 hover:shadow-lg hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {collection.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
              {collection.description || 'No description'}
            </p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4" />
          {/* This is a placeholder, you'll need to fetch the actual key count */}
          <span>0 Keys</span>
        </div>
        <span>Last updated {formatDate(collection.updated_at)}</span>
      </div>
    </div>
  );
};