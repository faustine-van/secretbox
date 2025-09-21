"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { CreateCollectionSchema } from '@/lib/validations';
import { 
  Loader2, 
  FolderKanban, 
  Palette, 
  Tag,
  Lock,
  Settings,
  Users,
  Server,
  Globe,
  Database,
  Cloud,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Enhanced schema with more fields
const EnhancedCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#10b981'),
  icon: z.enum(['folder', 'lock', 'server', 'globe', 'database', 'cloud', 'shield', 'users', 'settings']).default('folder'),
  category: z.enum(['production', 'staging', 'development', 'testing', 'personal', 'shared']).optional(),
  tags: z.string().optional(),
});

interface CollectionFormProps {
  onSubmit: (values: z.infer<typeof EnhancedCollectionSchema>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: Partial<z.infer<typeof EnhancedCollectionSchema>>;
  formError?: string | null;
}

const COLLECTION_ICONS = [
  { value: 'folder', label: 'Folder', icon: FolderKanban, description: 'General purpose collection' },
  { value: 'lock', label: 'Lock', icon: Lock, description: 'High security secrets' },
  { value: 'server', label: 'Server', icon: Server, description: 'Server and infrastructure keys' },
  { value: 'globe', label: 'Globe', icon: Globe, description: 'External services and APIs' },
  { value: 'database', label: 'Database', icon: Database, description: 'Database credentials' },
  { value: 'cloud', label: 'Cloud', icon: Cloud, description: 'Cloud service keys' },
  { value: 'shield', label: 'Shield', icon: Shield, description: 'Security certificates' },
  { value: 'users', label: 'Users', icon: Users, description: 'Team shared secrets' },
  { value: 'settings', label: 'Settings', icon: Settings, description: 'Configuration keys' },
];

const COLLECTION_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#6b7280', // Gray
];

const COLLECTION_CATEGORIES = [
  { value: 'production', label: 'Production', description: 'Live environment secrets', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'staging', label: 'Staging', description: 'Pre-production environment', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'development', label: 'Development', description: 'Development environment', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'testing', label: 'Testing', description: 'Test environment secrets', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'personal', label: 'Personal', description: 'Personal use secrets', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'shared', label: 'Shared', description: 'Team shared secrets', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
];

export function CollectionForm({ onSubmit, onCancel, isSubmitting, initialData, formError }: CollectionFormProps) {
  const form = useForm<z.infer<typeof CreateCollectionSchema>>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  return (
    <div className="space-y-6">
      {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <FolderKanban className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Collection Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Production API Keys, Development Secrets" 
                        {...field}
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" 
                      />
                    </FormControl>
                    <FormDescription>Choose a clear, descriptive name for this collection</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this collection and what secrets it will contain..."
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 min-h-[80px] resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Help team members understand what this collection is for</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FolderKanban className="w-4 h-4 mr-2" />
                  {initialData ? 'Update Collection' : 'Create Collection'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}