
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const action = searchParams.get('action');

  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }
  if (action) {
    query = query.eq('action', action);
  }

  const { data: audit_logs, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ audit_logs, count });
}
