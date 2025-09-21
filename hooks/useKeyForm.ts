
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateKeySchema, UpdateKeySchema } from '@/lib/validations';
import { KeyFormData } from '@/types/supabase';
import { z } from 'zod';

export function useKeyForm(defaultValues?: KeyFormData) {
  const form = useForm<KeyFormData>({
    resolver: zodResolver(CreateKeySchema),
    defaultValues: defaultValues || {
      name: '',
      value: '',
      collection_id: '',
      type: 'secret',
    },
  });

  return form;
}
