import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { Collection } from '@/types/supabase';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

type CollectionFormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  onSubmit: (values: CollectionFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<Collection> | null;
  formError?: string | null;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  formError,
}) => {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: CollectionFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form} className="border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
  <div className="border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-lg">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6  ">
        {formError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter collection name" className="bg-white dark:bg-slate-800" />
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
                <Textarea
                  {...field}
                  placeholder="Optional description..."
                  className="resize-none bg-white dark:bg-slate-800"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="g-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Collection' : 'Create Collection'}
          </Button>
        </div>
      </form>
      </div>
    </Form>
  );
};
