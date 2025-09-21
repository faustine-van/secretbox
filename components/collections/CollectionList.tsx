'use client';

import { useCollections } from '@/hooks/useCollections';
import { CollectionCard } from './CollectionCard';
import { CollectionForm } from './CollectionForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalTrigger } from '@/components/ui/modal';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  AlertTriangle, 
  RefreshCw,
  Loader2,
  Settings
} from 'lucide-react';
import { Collection } from '@/types/supabase';

export function CollectionList() {
  const { collections, isLoading, error, createCollection, updateCollection, deleteCollection, refreshCollections } = useCollections();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleCreateCollection = async (values: any) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await createCollection(values);
      setIsCreateModalOpen(false);
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
    setIsEditModalOpen(true);
    setFormError(null);
  };

  const handleUpdateCollection = async (values: any) => {
    if (!editingCollection) return;
    
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (!editingCollection?.id) return;
    await updateCollection(editingCollection.id, values);
      setIsEditModalOpen(false);
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
    setIsCreateModalOpen(true);
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
              <p className="text-red-700 dark:text-red-300 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
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

  if (!collections || collections.length === 0) {
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
              onClick={() => setIsCreateModalOpen(true)}
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
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Collections</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {collections.length} collection{collections.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
            
            <Button variant="outline" onClick={refreshCollections} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
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

        {/* Create Collection Modal */}
        <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
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
              onCancel={() => {
                setIsCreateModalOpen(false);
                setEditingCollection(null);
              }}
              isSubmitting={isSubmitting}
              initialData={editingCollection}
              formError={formError}
            />
          </ModalContent>
        </Modal>

        {/* Edit Collection Modal */}
        <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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
                setIsEditModalOpen(false);
                setEditingCollection(null);
              }}
              isSubmitting={isSubmitting}
              initialData={editingCollection}
              formError={formError}
            />
          </ModalContent>
        </Modal>
      </div>
    </DndProvider>
  );
}