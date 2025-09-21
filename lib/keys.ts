
import { CreateKeySchema, UpdateKeySchema } from '@/lib/validations';
import { Key } from '@/types/supabase';
import { z } from 'zod';

export function validateKeyData(data: unknown): z.infer<typeof CreateKeySchema> | null {
  const result = CreateKeySchema.safeParse(data);
  return result.success ? result.data : null;
}

export function formatKeyType(type: Key['key_type']): string {
  if (!type) return '';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function generateKeyId(): string {
  return `key_${Math.random().toString(36).substr(2, 9)}`;
}

export function sortKeys(keys: Key[], sortBy: keyof Key = 'created_at'): Key[] {
  return [...keys].sort((a, b) => {
    if (!a || !b) return 0;
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });
}
