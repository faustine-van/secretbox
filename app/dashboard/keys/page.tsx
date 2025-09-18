"use client";

import React from 'react';
import { Key, Plus, Search } from 'lucide-react';

const KeysPage: React.FC = () => {
  // This is a placeholder. In the future, you would fetch and display a list of all keys.
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            All Secrets
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage all your secrets from one place.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search all secrets..."
              className="w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm font-medium inline-flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Secret</span>
          </button>
        </div>
      </div>
      
      {/* Placeholder for the list of keys */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Key management coming soon
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            This is where you'll be able to see and manage all your secrets across all collections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeysPage;
