
import { CreateCollectionSchema } from '@/lib/validations';
import { Collection } from '@/types/supabase';
import { z } from 'zod';

export function validateCollectionData(data: unknown): z.infer<typeof CreateCollectionSchema> | null {
  const result = CreateCollectionSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function generateCollectionColor(): string {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function sortCollections(collections: Collection[], sortBy: keyof Collection = 'created_at'): Collection[] {
  return [...collections].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  });
}

export async function moveKeyToCollection(keyId: string, collectionId: string): Promise<void> {
  // This would be implemented in the API route
}

export async function getCollectionStats(collectionId: string): Promise<any> {
  // This would be implemented in the API route
}
