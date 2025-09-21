'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useKeySearch } from '@/hooks/useKeySearch'; // Changed from useKeys to useKeySearch
import { CollectionCard } from './CollectionCard';
import { CollectionForm } from './CollectionForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Collection, CollectionFormData, Key } from '@/types/supabase';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  RefreshCw,
  Settings,
  Download,
  Upload,
  MoreHorizontal,
  Archive,
  AlertTriangle,
  FolderKanban,
  Users,
  Zap,
  SortAsc,
  SortDesc,
  X,
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  Layers
} from 'lucide-react';

type SortOption = 'name' | 'created' | 'updated' | 'keys' | 'size';
type ViewMode = 'grid' | 'list';

interface CollectionWithStats extends Collection {
  keyCount: number;
  recentKeys: Key[];
  lastActivity: Date | null;
  totalSize: number;
  activeKeys: number;
  expiringKeys: number;
  expiredKeys: number;
}

export function CollectionManager() {
  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Hooks - Using useKeySearch to get all keys
  const { collections, isLoading, error, createCollection, updateCollection, deleteCollection, refreshCollections } = useCollections();
  const { keys, loading: keysLoading, searchKeys } = useKeySearch(); // Get all keys
  const { toast } = useToast();

  // Fetch all keys when component mounts
  useEffect(() => {
    searchKeys();
  }, [searchKeys]);

  // Enhanced collections with real statistics
  const collectionsWithStats: CollectionWithStats[] = useMemo(() => {
    return collections.map((collection) => {
      const collectionKeys = keys.filter((key) => key.collection_id === collection.id);
      
      // Calculate expiry statistics
      const now = new Date();
      const activeKeys = collectionKeys.filter(key => {
        if (!key.expires_at) return true;
        const expiryDate = new Date(key.expires_at);
        return expiryDate > now;
      });
      
      const expiringKeys = collectionKeys.filter(key => {
        if (!key.expires_at) return false;
        const expiryDate = new Date(key.expires_at);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
      });
      
      const expiredKeys = collectionKeys.filter(key => {
        if (!key.expires_at) return false;
        const expiryDate = new Date(key.expires_at);
        return expiryDate <= now;
      });

      // Get recent keys based on last accessed or creation date
      const recentKeys = collectionKeys
        .sort((a, b) => {
          const aDate = new Date(a.last_accessed_at || a.updated_at || a.created_at);
          const bDate = new Date(b.last_accessed_at || b.updated_at || b.created_at);
          return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 3);

      // Calculate last activity
      const lastActivity = collectionKeys.length > 0
        ? new Date(Math.max(
            ...collectionKeys.map(k => 
              new Date(k.last_accessed_at || k.updated_at || k.created_at).getTime()
            )
          ))
        : null;

      return {
        ...collection,
        keyCount: collectionKeys.length,
        recentKeys,
        lastActivity,
        totalSize: collectionKeys.reduce((acc, key) => acc + (key.encrypted_value?.length || 0), 0),
        activeKeys: activeKeys.length,
        expiringKeys: expiringKeys.length,
        expiredKeys: expiredKeys.length,
      };
    });
  }, [collections, keys]);

  // Filtered and sorted collections
  const processedCollections = useMemo(() => {
    let filtered = collectionsWithStats.filter((collection) => {
      const matchesSearch = !searchQuery || 
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArchived = showArchived || !collection.is_archived;
      
      return matchesSearch && matchesArchived;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'updated':
          aValue = new Date(a.updated_at || a.created_at).getTime();
          bValue = new Date(b.updated_at || b.created_at).getTime();
          break;
        case 'keys':
          aValue = a.keyCount;
          bValue = b.keyCount;
          break;
        case 'size':
          aValue = a.totalSize;
          bValue = b.totalSize;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [collectionsWithStats, searchQuery, showArchived, sortBy, sortDirection]);

  // Handlers
  const handleCreateCollection = useCallback(
    async (values: CollectionFormData) => {
      setIsSubmitting(true);
      setFormError(null);
      try {
        await createCollection(values);
        setIsCreateModalOpen(false);
        toast({
          title: 'Collection created',
          description: `"${values.name}" has been created successfully.`,
          duration: 5000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create collection';
        setFormError(errorMessage);
        toast({ title: 'Failed to create collection', description: errorMessage, variant: 'destructive' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [createCollection, toast],
  );

  const handleEditCollection = useCallback((collection: Collection) => {
    setEditingCollection(collection);
    setIsEditModalOpen(true);
    setFormError(null);
  }, []);

  const handleUpdateCollection = useCallback(
    async (values: CollectionFormData) => {
      if (!editingCollection) return;
      setIsSubmitting(true);
      setFormError(null);
      try {
        await updateCollection(editingCollection.id, values);
        setIsEditModalOpen(false);
        setEditingCollection(null);
        toast({
          title: 'Collection updated',
          description: `"${values.name}" has been updated successfully.`,
          duration: 5000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update collection';
        setFormError(errorMessage);
        toast({ title: 'Failed to update collection', description: errorMessage, variant: 'destructive' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingCollection, updateCollection, toast],
  );

  const handleDeleteCollection = useCallback(
    async (collectionId: string) => {
      try {
        await deleteCollection(collectionId);
        toast({
          title: 'Collection deleted',
          description: 'The collection has been permanently deleted.',
          duration: 5000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete collection';
        toast({ title: 'Failed to delete collection', description: errorMessage, variant: 'destructive' });
      }
    },
    [deleteCollection, toast],
  );

  const handleDuplicateCollection = useCallback((collection: Collection) => {
    setEditingCollection({
      ...collection,
      id: '',
      name: `${collection.name} (Copy)`,
      created_at: '',
      updated_at: null,
    });
    setIsCreateModalOpen(true);
  }, []);

  const handleArchiveToggle = useCallback(
    async (collection: Collection) => {
      try {
        await updateCollection(collection.id, {
          is_archived: !collection.is_archived,
        });
        toast({
          title: collection.is_archived ? 'Collection restored' : 'Collection archived',
          description: `"${collection.name}" has been ${collection.is_archived ? 'restored' : 'archived'}.`,
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Operation failed',
          description: 'Failed to update collection status.',
          variant: 'destructive',
        });
      }
    },
    [updateCollection, toast],
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      refreshCollections(),
      searchKeys()
    ]);
  }, [refreshCollections, searchKeys]);

  // Enhanced statistics
  const stats = useMemo(() => {
    const active = collectionsWithStats.filter((c) => !c.is_archived);
    const archived = collectionsWithStats.filter((c) => c.is_archived);
    const totalKeys = collectionsWithStats.reduce((acc, c) => acc + c.keyCount, 0);
    const totalActiveKeys = collectionsWithStats.reduce((acc, c) => acc + c.activeKeys, 0);
    const totalExpiringKeys = collectionsWithStats.reduce((acc, c) => acc + c.expiringKeys, 0);
    const totalExpiredKeys = collectionsWithStats.reduce((acc, c) => acc + c.expiredKeys, 0);
    const avgKeysPerCollection = active.length > 0 ? Math.round(totalKeys / active.length) : 0;
    const totalSize = collectionsWithStats.reduce((acc, c) => acc + c.totalSize, 0);

    return { 
      total: collectionsWithStats.length, 
      active: active.length, 
      archived: archived.length, 
      totalKeys,
      totalActiveKeys,
      totalExpiringKeys,
      totalExpiredKeys,
      avgKeysPerCollection,
      totalSize
    };
  }, [collectionsWithStats]);

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Loading state
  const isLoadingData = isLoading || keysLoading;

  if (isLoadingData && collections.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner />
          <p className="text-slate-600 dark:text-slate-400">Loading collections and keys...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load collections</p>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="border-red-200 dark:border-red-800">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Collections</h2>
          <p className="text-slate-600 dark:text-slate-400">Organize your secrets into logical groups for better management</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" /> New Collection
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoadingData} size="sm">
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowArchived(!showArchived)}>
                <Archive className="w-4 h-4 mr-2" /> 
                {showArchived ? 'Hide Archived' : 'Show Archived'}
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" /> Export Collections
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" /> Import Collections
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <FolderKanban className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Keys</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalKeys}</p>
              </div>
              <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Expiring</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.totalExpiringKeys}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border-teal-200 dark:border-teal-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Avg Keys</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{stats.avgKeysPerCollection}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Size</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{formatSize(stats.totalSize)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 relative">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Search Collections
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search collections..." 
                className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Sort by
              </label>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="keys">Key Count</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Order
              </label>
              <Button 
                variant="outline" 
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} 
                className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              >
                {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="lg:col-span-3 flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block w-full">
                View Mode
              </label>
            </div>
            
            <div className="lg:col-span-2">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 p-1">
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

          {/* Active filters display */}
          {(searchQuery || showArchived) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {showArchived && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Show archived
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setShowArchived(false)} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collections Display */}
      {processedCollections.length === 0 ? (
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                <FolderKanban className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {collections.length === 0 ? 'No collections yet' : 'No matching collections'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {collections.length === 0 
                    ? 'Get started by creating your first collection to organize your secrets.'
                    : 'No collections match your current search criteria.'
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {collections.length === 0 ? 'Create Your First Collection' : 'Create New Collection'}
                </Button>
                {collections.length > 0 && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Results summary */}
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              Showing {processedCollections.length} of {collections.length} collections
              {sortBy !== 'name' && (
                <span className="ml-2">
                  • sorted by {sortBy} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
                </span>
              )}
            </span>
            {isLoadingData && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-slate-300 dark:border-slate-600 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-xs">Updating...</span>
              </div>
            )}
          </div>

          {/* Collections grid/list */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }>
            {processedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                keyCount={collection.keyCount}
                onEdit={handleEditCollection}
                onDelete={handleDeleteCollection}
                onDuplicate={handleDuplicateCollection}
                onArchive={handleArchiveToggle}
              />
            ))}
          </div>

          {/* Performance indicator for large lists */}
          {processedCollections.length > 20 && (
            <div className="flex items-center justify-center pt-6">
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                <Zap className="w-3 h-3" />
                <span>Displaying {processedCollections.length} collections with real-time statistics</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Collection Modal */}
      <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <ModalContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
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
            onCancel={() => { 
              setIsCreateModalOpen(false); 
              setEditingCollection(null); 
              setFormError(null);
            }}
            isSubmitting={isSubmitting}
            initialData={editingCollection}
            formError={formError}
          />
        </ModalContent>
      </Modal>

      {/* Edit Collection Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <ModalHeader>
            <ModalTitle className="flex items-center text-xl">
              <Settings className="w-6 h-6 mr-2" />
              Edit Collection
            </ModalTitle>
            <ModalDescription>
              Update collection details, appearance, and organization settings.
            </ModalDescription>
          </ModalHeader>
          <CollectionForm
            onSubmit={handleUpdateCollection}
            onCancel={() => { 
              setIsEditModalOpen(false); 
              setEditingCollection(null); 
              setFormError(null);
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