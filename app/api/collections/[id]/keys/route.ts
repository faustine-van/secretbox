import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: keys, error } = await supabase
    .from('keys')
    .select('*')
    .eq('collection_id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(keys);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { keyIds }: { keyIds: string[] } = await request.json();

  const { error } = await supabase
    .from('keys')
    .update({ collection_id: params.id })
    .in('id', keyIds)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Keys moved successfully' });
}