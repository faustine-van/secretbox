'use client';

import React, { useState, useEffect } from 'react';
import { useKeys } from '@/hooks/useKeys';
import { KeyCard } from '@/components/keys/KeyCard';
import { KeyForm } from '@/components/keys/KeyForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { useParams, useRouter } from 'next/navigation';
import { CreateKeySchema } from '@/lib/validations';
import * as z from 'zod';
import { 
  Plus, 
  ArrowLeft, 
  Key, 
  FolderKanban, 
  Calendar,
  Users,
  Shield,
  Settings,
  MoreHorizontal,
  Search,
  Filter,
  Grid3X3,
  List,
  RefreshCw
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  
  const { keys, isLoading, error, createKey, updateKey, deleteKey, fetchKeys } = useKeys(collectionId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'accessed'>('name');
  const [filterByType, setFilterByType] = useState<string>('all');

  // Mock collection data - replace with actual collection hook
  const collection = {
    id: collectionId,
    name: 'Production API Keys',
    description: 'Critical API keys for production environment',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    color: '#10b981',
    icon: 'server'
  };

  const handleCreateKey = async (values: z.infer<typeof CreateKeySchema>) => {
    setIsSubmitting(true);
    const newKey = await createKey(values);
    if (newKey) {
      setIsModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleUpdateKey = async (keyId: string, values: z.infer<typeof CreateKeySchema>) => {
    setIsUpdating(true);
    await updateKey(keyId, values);
    setIsUpdating(false);
  };

  const handleDeleteKey = async (keyId: string) => {
    setIsDeleting(true);
    await deleteKey(keyId);
    setIsDeleting(false);
  };

  const filteredKeys = keys
    .filter(key => {
      const matchesSearch = key.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterByType === 'all' || key.key_type === filterByType;
      return matchesSearch && matchesType;
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-emerald-950/30 dark:to-teal-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {collection.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {collection.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Key className="w-4 h-4" />
                  <span>{keys.length} keys</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Encrypted
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Key
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Collection Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="w-4 h-4 mr-2" />
                    Manage Access
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    Delete Collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-0 shadow-lg mb-6">
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
                    placeholder="Search keys in this collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="lg:col-span-3">
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

              {/* Sort Options */}
              <div className="lg:col-span-3">
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
        {isLoading && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-3 text-slate-600 dark:text-slate-400">Loading collection keys...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 dark:text-red-400 mb-2">⚠️ Error loading keys</div>
              <p className="text-red-700 dark:text-red-300 mb-4">{error.message}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => fetchKeys()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredKeys.length === 0 && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <Key className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {keys.length === 0 ? 'No keys in this collection yet' : 'No matching keys'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    {keys.length === 0 
                      ? 'Get started by adding your first key to this collection.'
                      : 'No keys match your current search and filter criteria.'
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Key
                  </Button>
                  {keys.length > 0 && (
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setFilterByType('all');
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
        {!isLoading && !error && filteredKeys.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {filteredKeys.map((key) => (
              <KeyCard 
                key={key.id} 
                keyData={key} 
                onUpdate={handleUpdateKey} 
                onDelete={handleDeleteKey}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}

        {/* Create Key Modal */}
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <ModalHeader>
              <ModalTitle className="flex items-center text-xl">
                <Key className="w-6 h-6 mr-2" />
                Add Key to {collection.name}
              </ModalTitle>
              <ModalDescription>
                Add a new secret key to this collection. The key will be encrypted and stored securely.
              </ModalDescription>
            </ModalHeader>
            <KeyForm
              onSubmit={handleCreateKey}
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={isSubmitting}
              collections={[]} // Pass empty since we're in a specific collection
              formError={null}
            />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}