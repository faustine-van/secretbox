"use client";

import React, { useState, useMemo } from 'react';
import { 
  FolderKanban,
  Filter,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Search,
  Plus
} from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { CollectionCard } from './CollectionCard';

export function CollectionManager() {
  const { collections, isLoading, error } = useCollections();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const sortedAndFilteredCollections = useMemo(() => {
    if (!collections) return [];
    
    const filtered = collections.filter(collection =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [collections, searchQuery, sortOrder]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(sortedAndFilteredCollections.length / itemsPerPage);
  const paginatedCollections = sortedAndFilteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date-desc', label: 'Newest' },
    { value: 'date-asc', label: 'Oldest' },
  ];

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-red-200 dark:border-red-800 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="text-red-600 dark:text-red-400">Failed to load collections</p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (collections && collections.length === 0 && !searchQuery) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            <FolderKanban className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No collections yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Get started by creating your first collection. Collections help you organize your secrets.
            </p>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm inline-flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Your First Collection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Collections
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Organize your secrets into logical groups.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Sort collections"
            >
              <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Sort by: {sortOptions.find(o => o.value === sortOrder)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOrder(option.value);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      sortOrder === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm font-medium inline-flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      {paginatedCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No collections found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              No collections match "{searchQuery}". Try adjusting your search terms.
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredCollections.length)} of {sortedAndFilteredCollections.length} collections
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}