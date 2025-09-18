
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { KeySearchSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const { query, collectionId, type, sortBy, page = 1 } = KeySearchSchema.parse({
    query: searchParams.get('query'),
    collectionId: searchParams.get('collectionId'),
    type: searchParams.get('type'),
    sortBy: searchParams.get('sortBy'),
    page: searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1,
  });

  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from('keys')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id);

  if (query) {
    queryBuilder = queryBuilder.textSearch('name', query, { type: 'websearch' });
  }

  if (collectionId) {
    queryBuilder = queryBuilder.eq('collection_id', collectionId);
  }

  if (type) {
    queryBuilder = queryBuilder.eq('key_type', type);
  }

  if (sortBy) {
    queryBuilder = queryBuilder.order(sortBy, { ascending: true });
  }

  const { data: keys, error, count } = await queryBuilder.range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ keys, count });
}
