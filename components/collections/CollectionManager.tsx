'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useKeys } from '@/hooks/useKeys';
import { CollectionCard } from './CollectionCard';
import { CollectionForm } from './CollectionForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
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
  CheckCircle2,
  Users,
  Zap,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react';

type SortOption = 'name' | 'created' | 'updated' | 'keys' | 'size';
type ViewMode = 'grid' | 'list';

interface CollectionWithStats extends Collection {
  keyCount: number;
  recentKeys: Key[];
  lastActivity: Date | null;
  totalSize: number;
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

  // Hooks
  const { collections, isLoading, error, createCollection, updateCollection, deleteCollection, refreshCollections } =
    useCollections();
  const { keys } = useKeys();
  const { toast } = useToast();

  // Enhanced collections with statistics
  const collectionsWithStats: CollectionWithStats[] = useMemo(() => {
    return collections.map((collection) => {
      const collectionKeys = keys.filter((key) => key.collection_id === collection.id);
      const recentKeys = collectionKeys
        .sort(
          (a, b) =>
            new Date(b.updated_at || b.created_at).getTime() -
            new Date(a.updated_at || a.created_at).getTime(),
        )
        .slice(0, 3);

      return {
        ...collection,
        keyCount: collectionKeys.length,
        recentKeys,
        lastActivity:
          collectionKeys.length > 0
            ? new Date(
                Math.max(
                  ...collectionKeys.map((k) =>
                    new Date(k.updated_at || k.created_at).getTime(),
                  ),
                ),
              )
            : null,
        totalSize: collectionKeys.reduce((acc, key) => acc + (key.encrypted_value?.length || 0), 0),
      };
    });
  }, [collections, keys]);

  // Filtered + sorted
  const processedCollections = useMemo(() => {
    let filtered = collectionsWithStats.filter((collection) => {
      if (
        searchQuery &&
        !collection.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (!showArchived && collection.is_archived) return false;
      return true;
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
    async (values: any) => {
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
    async (values: any) => {
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
      const updatedData: Partial<CollectionFormData> = {
        is_archived: !collection.is_archived,
      };
      await updateCollection(collection.id, updatedData);
      toast({
        title: collection.is_archived ? 'Collection restored' : 'Collection archived',
        description: `"${collection.name}" has been ${collection.is_archived ? 'restored' : 'archived'}.`,
        duration: 3000,
      });
    } catch {
      toast({
        title: 'Operation failed',
        description: 'Failed to update collection status.',
        variant: 'destructive',
      });
    }
  },
  [updateCollection, toast],
);


  // Stats
  const stats = useMemo(() => {
    const active = collectionsWithStats.filter((c) => !c.is_archived);
    const archived = collectionsWithStats.filter((c) => c.is_archived);
    const totalKeys = collectionsWithStats.reduce((acc, c) => acc + c.keyCount, 0);
    const avgKeysPerCollection = active.length > 0 ? Math.round(totalKeys / active.length) : 0;

    return { total: collectionsWithStats.length, active: active.length, archived: archived.length, totalKeys, avgKeysPerCollection };
  }, [collectionsWithStats]);

  // Loading
  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner />
          <p className="text-slate-600 dark:text-slate-400">Loading collections...</p>
        </CardContent>
      </Card>
    );
  }

  // Error
  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load collections</p>
            <p className="text-red-700 dark:text-red-300 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <Button onClick={refreshCollections} variant="outline" className="border-red-200 dark:border-red-800">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Collections</h2>
          <p className="text-slate-600 dark:text-slate-400">Organize your secrets into logical groups for better management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> New Collection
          </Button>
          <Button variant="outline" onClick={refreshCollections} disabled={isLoading} size="sm">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowArchived(!showArchived)}>
                <Archive className="w-4 h-4 mr-2" /> {showArchived ? 'Hide Archived' : 'Show Archived'}
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Export</DropdownMenuItem>
              <DropdownMenuItem><Upload className="w-4 h-4 mr-2" /> Import</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4 flex justify-between"><span>Total</span><span>{stats.total}</span></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between text-green-600"><span>Active</span><span>{stats.active}</span></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between text-orange-600"><span>Archived</span><span>{stats.archived}</span></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between text-blue-600"><span>Total Keys</span><span>{stats.totalKeys}</span></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between text-purple-600"><span>Avg Keys</span><span>{stats.avgKeysPerCollection}</span></CardContent></Card>
      </div>

      {/* SEARCH + SORT */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="pl-10" />
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="lg:col-span-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Button variant="outline" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} className="w-full">
              {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
          <div className="lg:col-span-2 flex border rounded-lg">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="flex-1"><Grid3X3 /></Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="flex-1"><List /></Button>
          </div>
        </CardContent>
      </Card>

      {/* COLLECTIONS */}
      {processedCollections.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-slate-500">No collections found</CardContent></Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {processedCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onDuplicate={handleDuplicateCollection}
              onArchive={handleArchiveToggle}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <ModalContent>
          <ModalHeader><ModalTitle>Create New Collection</ModalTitle></ModalHeader>
          <ModalDescription>Create a new collection to organize your secrets.</ModalDescription>
          <CollectionForm
            onSubmit={handleCreateCollection}
            onCancel={() => { setIsCreateModalOpen(false); setEditingCollection(null); }}
            isSubmitting={isSubmitting}
            initialData={editingCollection}
            formError={formError}
          />
        </ModalContent>
      </Modal>

      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          <ModalHeader><ModalTitle>Edit Collection</ModalTitle></ModalHeader>
          <ModalDescription>Update collection details and settings.</ModalDescription>
          <CollectionForm
            onSubmit={handleUpdateCollection}
            onCancel={() => { setIsEditModalOpen(false); setEditingCollection(null); }}
            isSubmitting={isSubmitting}
            initialData={editingCollection}
            formError={formError}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}
