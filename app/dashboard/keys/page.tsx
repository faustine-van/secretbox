"use client";

import React from 'react';
import { KeyList } from '@/components/keys/KeyList';
import { useKeys } from '@/hooks/useKeys';

const KeysPage: React.FC = () => {
  const { keys, isLoading, deleteKey } = useKeys();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <KeyList />
      </div>
    </div>
  );
};

export default KeysPage;