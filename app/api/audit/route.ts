
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: audit_logs, error, count } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ audit_logs, count });
}
