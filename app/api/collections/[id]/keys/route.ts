
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: keys, error } = await supabase
    .from('keys')
    .select('*')
    .eq('collection_id', params.id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(keys);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { keyIds }: { keyIds: string[] } = await request.json();

  const { error } = await supabase
    .from('keys')
    .update({ collection_id: params.id })
    .in('id', keyIds)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Keys moved successfully' });
}
