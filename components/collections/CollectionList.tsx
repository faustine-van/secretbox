import React from 'react';
import { Collection } from '@/types/supabase';
import { motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CollectionListProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onSelectCollection: (collection: Collection) => void;
  onDeleteCollection: (collectionId: string) => void;
  isLoading: boolean;
}

export const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  selectedCollection,
  onSelectCollection,
  onDeleteCollection,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {collections.length > 0 ? (
        collections.map((collection) => (
          <motion.div
            key={collection.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectCollection(collection)}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              selectedCollection?.id === collection.id
                ? 'bg-blue-100 dark:bg-blue-900/50'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <GripVertical className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{collection.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCollection(collection.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))
      ) : (
        <div className="text-center p-8 text-slate-500 dark:text-slate-400">
          <p>No collections yet.</p>
          <p className="text-sm">Click the '+' to create one.</p>
        </div>
      )}
    </div>
  );
};
