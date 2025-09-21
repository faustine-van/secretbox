"use client";

import React, { useState, useMemo } from 'react';
import { 
  FolderKanban,
  Filter,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Search,
  Plus,
  Grid3X3,
  List,
  RefreshCw,
  SortAsc,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { CollectionCard } from './CollectionCard';
import { CollectionForm } from './CollectionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function CollectionManager() {
  const { collections, isLoading, error, createCollection, updateCollection, deleteCollection, refreshCollections } = useCollections();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { toast } = useToast();

  const sortedAndFilteredCollections = useMemo(() => {
    if (!collections) return [];
    
    const filtered = collections.filter(collection => {
      return collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collection.description?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'keys-desc':
          // This would need key counts from your API
          return 0; // Placeholder
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [collections, searchQuery, sortOrder]);

  const itemsPerPage = viewMode === 'grid' ? 9 : 8;
  const totalPages = Math.ceil(sortedAndFilteredCollections.length / itemsPerPage);
  const paginatedCollections = sortedAndFilteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date-desc', label: 'Recently Created' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'keys-desc', label: 'Most Keys' },
  ];

  const handleCreateCollection = async (values: any) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await createCollection(values);
      setShowCreateModal(false);
      toast({
        title: 'Collection created',
        description: `"${values.name}" has been created successfully.`,
        duration: 5000
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create collection';
      setFormError(errorMessage);
      toast({
        title: 'Failed to create collection',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCollection = (collection: any) => {
    setEditingCollection(collection);
    setShowEditModal(true);
    setFormError(null);
  };

  const handleUpdateCollection = async (values: any) => {
    if (!editingCollection) return;
    
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (!editingCollection?.id) return;
    await updateCollection(editingCollection.id, values);
      setShowEditModal(false);
      setEditingCollection(null);
      toast({
        title: 'Collection updated',
        description: `"${values.name}" has been updated successfully.`,
        duration: 5000
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update collection';
      setFormError(errorMessage);
      toast({
        title: 'Failed to update collection',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      await deleteCollection(collectionId);
      toast({
        title: 'Collection deleted',
        description: 'The collection has been permanently deleted.',
        duration: 5000
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete collection';
      toast({
        title: 'Failed to delete collection',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleDuplicateCollection = (collection: any) => {
    setEditingCollection({ ...collection, name: `${collection.name} (Copy)` });
    setShowCreateModal(true);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-slate-600 dark:text-slate-400">Loading collections...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load collections</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error.message}</p>
            </div>
            <Button onClick={refreshCollections} variant="outline" className="border-red-200 dark:border-red-800">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (collections && collections.length === 0 && !searchQuery) {
    return (
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
              <FolderKanban className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                No collections yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Get started by creating your first collection. Collections help you organize your secrets into logical groups for better management.
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Collection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Your Collections
          </h2>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>{collections?.length || 0} total collections</span>
            {sortedAndFilteredCollections.length !== (collections?.length || 0) && (
              <Badge variant="secondary">
                {sortedAndFilteredCollections.length} filtered
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
          
          <Button variant="outline" onClick={refreshCollections} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export Collections
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Import Collections
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
                Search Collections
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="lg:col-span-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Sort by
              </label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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

            {/* Clear Filters */}
            <div className="lg:col-span-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSortOrder('name-asc');
                }}
                className="w-full"
                disabled={!searchQuery && sortOrder === 'name-asc'}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collections Grid/List */}
      {paginatedCollections.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {paginatedCollections.map((collection) => (
            <CollectionCard 
              key={collection.id} 
              collection={collection}
              keyCount={0} // You'll need to fetch this from your API
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onDuplicate={handleDuplicateCollection}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No collections found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  No collections match your current search and filter criteria. Try adjusting your filters.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setSortOrder('name-asc');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredCollections.length)} of {sortedAndFilteredCollections.length} collections
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal}>
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <ModalHeader>
            <ModalTitle className="flex items-center text-xl">
              <FolderKanban className="w-6 h-6 mr-2" />
              Create New Collection
            </ModalTitle>
            <ModalDescription>
              Create a new collection to organize your secrets. Choose an icon, color, and category to help identify it.
            </ModalDescription>
          </ModalHeader>
          <CollectionForm
            onSubmit={handleCreateCollection}
            onCancel={() => setShowCreateModal(false)}
            isSubmitting={isSubmitting}
            initialData={editingCollection}
            formError={formError}
          />
        </ModalContent>
      </Modal>

      {/* Edit Collection Modal */}
      <Modal open={showEditModal} onOpenChange={setShowEditModal}>
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <ModalHeader>
            <ModalTitle className="flex items-center text-xl">
              <Settings className="w-6 h-6 mr-2" />
              Edit Collection
            </ModalTitle>
            <ModalDescription>
              Update the collection details, appearance, and organization settings.
            </ModalDescription>
          </ModalHeader>
          <CollectionForm
            onSubmit={handleUpdateCollection}
            onCancel={() => {
              setShowEditModal(false);
              setEditingCollection(null);
            }}
            isSubmitting={isSubmitting}
            initialData={editingCollection}
            formError={formError}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}