
"use client";

import { CollectionManager } from '@/components/collections/CollectionManager';
import '@/app/globals.css';

export default function CollectionsManagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-8">
      <CollectionManager />
    </div>
  );
}
