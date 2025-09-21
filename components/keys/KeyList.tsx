'use client';

import { useKeySearch } from '@/hooks/useKeySearch';
import { KeyCard } from './KeyCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { 
  Key, 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { KeyForm } from './KeyForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function KeyList({ collectionId }: { collectionId?: string }) {
  const { keys, loading, error, count, query, setQuery, searchKeys } = useKeySearch(collectionId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'accessed'>('name');
  const [filterByType, setFilterByType] = useState<string>('all');
  const [filterByCollection, setFilterByCollection] = useState<string>('all');
  
  const { collections } = useCollections();
  const { toast } = useToast();

  const handleAddKey = () => {
    setIsModalOpen(true);
    setFormError(null);
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({ 
          title: 'Key created successfully', 
          description: `"${values.name}" has been securely stored.`,
          duration: 5000 
        });
        searchKeys();
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Failed to create key';
        if (typeof errorMessage === 'object' && errorMessage !== null) {
          const { formErrors, fieldErrors } = errorMessage as { formErrors: string[], fieldErrors: Record<string, string[]> };
          const allErrors: string[] = [];
          if (formErrors && formErrors.length > 0) {
            allErrors.push(...formErrors);
          }
          if (fieldErrors) {
            Object.values(fieldErrors).forEach(errors => allErrors.push(...errors));
          }
          errorMessage = allErrors.join(', ') || 'Validation failed.';
        }
        setFormError(errorMessage);
        toast({ 
          title: 'Failed to create key', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setFormError(errorMessage);
      toast({ 
        title: 'Connection error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateKey = async (keyId: string, values: any) => {
  try {
    const response = await fetch(`/api/keys/${keyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      toast({ 
        title: 'Key updated successfully', 
        description: `"${values.name}" has been updated.`,
        duration: 5000 
      });
      searchKeys(); // Refresh the list
    } else {
      const errorData = await response.json();
      toast({ 
        title: 'Failed to update key', 
        description: errorData.error || 'Unknown error occurred', 
        variant: 'destructive' 
      });
    }
  } catch (error) {
    toast({ 
      title: 'Connection error', 
      description: 'Failed to update key. Please try again.', 
      variant: 'destructive' 
    });
  }
};

const handleDeleteKey = async (keyId: string) => {
  try {
    const response = await fetch(`/api/keys/${keyId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast({ 
        title: 'Key deleted successfully', 
        description: 'The key has been permanently removed.',
        duration: 5000 
      });
      searchKeys(); // Refresh the list
    } else {
      const errorData = await response.json();
      toast({ 
        title: 'Failed to delete key', 
        description: errorData.error || 'Unknown error occurred', 
        variant: 'destructive' 
    });
    }
  } catch (error) {
    toast({ 
      title: 'Connection error', 
      description: 'Failed to delete key. Please try again.', 
      variant: 'destructive' 
    });
  }
};

  const handleRefresh = () => {
    searchKeys();
    toast({ title: 'Refreshed', description: 'Key list has been updated.' });
  };


  // Filter and sort keys
  const filteredAndSortedKeys = keys
    .filter(key => {
      if (filterByType !== 'all' && key.key_type !== filterByType) return false;
      if (filterByCollection !== 'all') {
        if (filterByCollection === 'uncategorized' && key.collection_id) return false;
        if (filterByCollection !== 'uncategorized' && key.collection_id !== filterByCollection) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'accessed':
          const aAccess = a.last_accessed_at ? new Date(a.last_accessed_at).getTime() : 0;
          const bAccess = b.last_accessed_at ? new Date(b.last_accessed_at).getTime() : 0;
          return bAccess - aAccess;
        default:
          return 0;
      }
    });

  const keyTypes = [...new Set(keys.map(key => key.key_type))];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Your Keys
          </h2>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>{count} total keys</span>
            {filteredAndSortedKeys.length !== count && (
              <Badge variant="secondary">
                {filteredAndSortedKeys.length} filtered
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button 
            onClick={handleAddKey}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Key
          </Button>
          
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export Keys
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Import Keys
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Search Keys
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, type, or collection..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Filter by Type
              </label>
              <Select value={filterByType} onValueChange={setFilterByType}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {keyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Collection Filter */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Filter by Collection
              </label>
              <Select value={filterByCollection} onValueChange={setFilterByCollection}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="All collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  <SelectItem value="uncategorized">Standalone Keys</SelectItem>
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Sort by
              </label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'created' | 'accessed') => setSortBy(value)}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="accessed">Last Accessed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                View
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex-1"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading your keys...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">⚠️ Error loading keys</div>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <Button variant="outline" onClick={handleRefresh} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedKeys.length === 0 && (
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                <Key className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {keys.length === 0 ? 'No keys yet' : 'No matching keys'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {keys.length === 0 
                    ? 'Get started by creating your first API key or secret. Keys can be organized in collections or kept standalone.'
                    : 'No keys match your current search and filter criteria. Try adjusting your filters or search terms.'
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddKey}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Key
                </Button>
                {keys.length > 0 && (
                  <Button variant="outline" onClick={() => {
                    setQuery('');
                    setFilterByType('all');
                    setFilterByCollection('all');
                  }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keys Grid/List */}
      {!loading && !error && filteredAndSortedKeys.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {filteredAndSortedKeys.map((key) => (
            <KeyCard 
              key={key.id} 
              keyData={key}
              onUpdate={handleUpdateKey}
              onDelete={handleDeleteKey}
              isUpdating={false}
              isDeleting={false}
            />
          ))}
        </div>
      )}

      {/* Create Key Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent
          className="
           max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm
          "
        >
          <ModalHeader>
            <ModalTitle className="flex items-center text-xl text-blue-600 dark:text-blue-400">
              <Key className="w-6 h-6 mr-2" />
              Create New Key
            </ModalTitle>
            <ModalDescription>
              Add a new secret key to your secure vault. Keys can be organized in collections or kept as standalone items.
            </ModalDescription>
          </ModalHeader>
          <KeyForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
            collections={collections}
            formError={formError}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}