'use client';

import { Key } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyReveal } from './KeyReveal';
import { KeyForm } from './KeyForm';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useState } from 'react';
import * as z from 'zod';
import { CreateKeySchema } from '@/lib/validations';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Copy, 
  Calendar, 
  Tag,
  Folder,
  Shield,
  Clock,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface KeyCardProps {
  keyData: Key;
  onUpdate: (keyId: string, values: z.infer<typeof CreateKeySchema>) => void;
  onDelete: (keyId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  
}

export function KeyCard({ keyData, onUpdate, onDelete, isUpdating, isDeleting }: KeyCardProps) {
  const [showReveal, setShowReveal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = (values: z.infer<typeof CreateKeySchema>) => {
    onUpdate(keyData.id, values);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(keyData.id);
    setIsDeleteModalOpen(false);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(keyData.id);
    // You might want to show a toast here
  };

  const getKeyTypeColor = (type: string | null) => {
      const colors = {
      'api_key': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'secret': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      'token': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'credential': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'default': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
    };
    if (!type) return colors.default;
  
    return colors[type as keyof typeof colors] || colors.default;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-900/90">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {keyData.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className={`${getKeyTypeColor(keyData.key_type)} border-0 font-medium`}>
                <Tag className="w-3 h-3 mr-1" />
                {keyData.key_type}
              </Badge>
              {keyData.collection_id && (
                <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <Folder className="w-3 h-3 mr-1" />
                  Collection
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
              <DropdownMenuItem onClick={handleCopyId}>
                <Copy className="w-4 h-4 mr-2" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Key
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowReveal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Reveal Value
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-600 focus:text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Key
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Last accessed</p>
                <p className="text-slate-600 dark:text-slate-400">{formatDate(keyData.last_accessed_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Status</p>
                <p className="text-green-600 dark:text-green-400">Encrypted</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReveal(true)}
              className="flex-1 sm:flex-initial bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
            >
              <Eye className="w-4 h-4 mr-2" />
              Reveal
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              disabled={isUpdating}
              className="flex-1 sm:flex-initial"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
              className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-800"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Modals */}
        <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <ModalContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <ModalHeader>
              <ModalTitle className="flex items-center text-xl">
                <Edit3 className="w-5 h-5 mr-2" />
                Edit Key
              </ModalTitle>
            </ModalHeader>
            <KeyForm 
              onSubmit={handleUpdate} 
              onCancel={() => setIsEditModalOpen(false)} 
              isSubmitting={isUpdating}
              initialData={{
                name: keyData.name,
                value: '', // Don't populate the value for security
                collectionId: keyData.collection_id || '',
                key_type: keyData.key_type || 'api_key',
                description: keyData.description || '',
                expiresAt: keyData.expires_at ? new Date(keyData.expires_at) : undefined,
              }}
            />
          </ModalContent>
        </Modal>

        {showReveal && (
          <KeyReveal 
            keyId={keyData.id} 
            onClose={() => setShowReveal(false)} 
          />
        )}

        <ConfirmationDialog
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Key"
          description={`Are you sure you want to delete "${keyData.name}"? This action cannot be undone and will permanently remove the key from your account.`}
          isConfirming={isDeleting}
          confirmText="Delete Key"
          cancelText="Cancel"
        />
      </CardContent>
    </Card>
  );
}