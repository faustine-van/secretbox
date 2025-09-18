
'use client';

import { useCollectionForm } from '@/hooks/useCollectionForm';
import { CollectionFormData } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function CollectionForm({ defaultValues, onSubmit }: { defaultValues?: CollectionFormData, onSubmit: (values: CollectionFormData) => Promise<void> }) {
  const form = useCollectionForm(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: CollectionFormData) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="A collection of my personal keys" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add color picker and icon selector here */}
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
