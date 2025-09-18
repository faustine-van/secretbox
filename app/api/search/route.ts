
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  const { data: keys, error: keysError } = await supabase
    .from('keys')
    .select('*')
    .eq('user_id', session.user.id)
    .textSearch('name', query, { type: 'websearch' });

  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', session.user.id)
    .textSearch('name', query, { type: 'websearch' });

  if (keysError || collectionsError) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }

  return NextResponse.json({ keys, collections });
}
