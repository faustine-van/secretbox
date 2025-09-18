
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCollectionSchema } from '@/lib/validations';
import { CollectionFormData } from '@/types/supabase';
import { z } from 'zod';

export function useCollectionForm(defaultValues?: CollectionFormData) {
  const form = useForm<z.infer<typeof CreateCollectionSchema>>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      color: '',
      icon: '',
    },
  });

  return form;
}
