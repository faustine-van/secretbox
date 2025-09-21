"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCollections } from '@/hooks/useCollections';
import { CollectionList } from '@/components/collections/CollectionList';
import { KeyList } from '@/components/keys/KeyList';
import { Button } from '@/components/ui/button';
import { PlusCircle, FolderKanban } from 'lucide-react';
import { CollectionForm } from '@/components/collections/CollectionForm';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { Collection } from '@/types/supabase';

export default function CollectionsPage() {
  const { collections, isLoading: collectionsLoading, createCollection, deleteCollection } = useCollections();
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);

  const handleCreateCollection = async (data: { name: string, description?: string }) => {
    await createCollection(data);
    setIsCollectionFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-4">
      <div className="flex justify-end mb-4">
        <Link href="/dashboard/collections/manage">
          <Button variant="outline" className="mr-2">
            <FolderKanban className="h-5 w-5 mr-2" />
            Manage Collections
          </Button>
        </Link>
        <Button onClick={() => setIsCollectionFormOpen(true)} className="text-slate-600 dark:text-slate-300">
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Collection
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-4rem)]">
        {/* Collections Column */}
        <div className="lg:col-span-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Collections</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CollectionList
              collections={collections}
              selectedCollection={selectedCollection}
              onSelectCollection={setSelectedCollection}
              onDeleteCollection={deleteCollection}
              isLoading={collectionsLoading}
            />
          </div>
        </div>

        {/* Keys Column */}
        <div className="lg:col-span-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg flex flex-col p-4">
          <KeyList collectionId={selectedCollection?.id} />
        </div>
      </div>

      {/* Modals */}
      <Modal open={isCollectionFormOpen} onOpenChange={setIsCollectionFormOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create Collection</ModalTitle>
          </ModalHeader>
          <CollectionForm onSubmit={handleCreateCollection} />
        </ModalContent>
      </Modal>
    </div>
  );
}
